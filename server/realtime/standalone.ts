import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Duplex } from "node:stream";

import { WebSocketServer, type RawData, type WebSocket } from "ws";

import { closeDb } from "@/lib/db/client";
import { getServerEnv } from "@/lib/env";
import { describeError, logger } from "@/lib/logger";
import { createRealtimeConnection } from "@/lib/realtime/connection";
import { MAX_SOCKET_PAYLOAD_BYTES } from "@/lib/realtime/events";
import { getRealtimeHub } from "@/lib/realtime/hub";
import { verifyRealtimeTicket } from "@/lib/realtime/ticket";

/**
 * Standalone WebSocket gateway.
 *
 * `next dev` does not handle WebSocket upgrades, and self-hosted deployments
 * need a long-lived process, so the same connection controller is served here
 * over `ws`. On Vercel the App Router endpoint at `/api/realtime` is used
 * instead; both paths share all authorization and protocol logic.
 *
 * Point the browser at this process with:
 *   NEXT_PUBLIC_REALTIME_URL="ws://localhost:8787"
 */
const env = getServerEnv();
const port = env.REALTIME_PORT;

const webSocketServer = new WebSocketServer({
  noServer: true,
  maxPayload: MAX_SOCKET_PAYLOAD_BYTES,
});

const httpServer = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    if (request.method === "GET" && request.url === "/healthz") {
      const body = JSON.stringify({
        status: "ok",
        connections: getRealtimeHub().connectionCount,
      });
      response.writeHead(200, {
        "content-type": "application/json",
        "cache-control": "no-store",
      });
      response.end(body);
      return;
    }

    response.writeHead(404, { "content-type": "text/plain" });
    response.end("not found");
  },
);

function rejectUpgrade(socket: Duplex, status: number, reason: string): void {
  socket.write(`HTTP/1.1 ${String(status)} ${reason}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
}

httpServer.on("upgrade", (request: IncomingMessage, socket: Duplex, head: Buffer) => {
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  if (requestUrl.pathname !== "/" && requestUrl.pathname !== "/api/realtime") {
    rejectUpgrade(socket, 404, "Not Found");
    return;
  }

  // The ticket is the only accepted credential: it is signed, short lived and
  // carries an identity claim that every subscription re-checks in Postgres.
  const actor = verifyRealtimeTicket(requestUrl.searchParams.get("ticket"));
  if (!actor) {
    rejectUpgrade(socket, 401, "Unauthorized");
    return;
  }

  webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
    attachConnection(webSocket, actor);
  });
});

function attachConnection(
  webSocket: WebSocket,
  actor: {
    id: string;
    role: Parameters<typeof createRealtimeConnection>[0]["actor"]["role"];
  },
): void {
  const connection = createRealtimeConnection({
    actor,
    transport: {
      send: (data) => {
        if (webSocket.readyState === webSocket.OPEN) webSocket.send(data);
      },
      close: (code, reason) => {
        webSocket.close(code, reason);
      },
    },
  });

  webSocket.on("message", (data: RawData, isBinary: boolean) => {
    if (isBinary) {
      webSocket.close(4003, "binary frames are not supported");
      return;
    }
    void connection.handleRawFrame(data.toString());
  });

  webSocket.on("close", () => {
    connection.dispose();
  });

  webSocket.on("error", (error: Error) => {
    logger.warn("realtime socket error", describeError(error));
    connection.dispose();
  });

  void connection.start().catch((error: unknown) => {
    logger.error("realtime connection failed to start", describeError(error));
    webSocket.close(1011, "internal error");
    connection.dispose();
  });
}

httpServer.listen(port, () => {
  logger.info("realtime gateway listening", { port });
});

async function shutdown(signal: string): Promise<void> {
  logger.info("realtime gateway shutting down", { signal });
  for (const client of webSocketServer.clients) {
    client.close(1001, "server shutting down");
  }
  await new Promise<void>((resolve) => {
    httpServer.close(() => {
      resolve();
    });
  });
  await closeDb();
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
