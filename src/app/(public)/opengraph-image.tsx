import { ImageResponse } from "next/og";

import { SITE } from "@/content/site";

export const alt = `${SITE.name}: ${SITE.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The default social card for every public page without its own image: true
 * black, the wordmark and the site promise. Flat on purpose - depth comes
 * from the hairline frame, not from fills.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#000",
        padding: "28px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid #262626",
          borderRadius: "16px",
          padding: "56px",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, letterSpacing: "-0.02em" }}>
          <span style={{ fontWeight: 700, color: "#ededed" }}>code</span>
          <span style={{ fontWeight: 400, color: "#8f8f8f" }}>issue</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ededed",
            }}
          >
            Build the product that keeps work moving.
          </div>
          <div
            style={{ display: "flex", fontSize: 28, color: "#8f8f8f", marginTop: 20 }}
          >
            Custom software from a written brief, visible from first note to delivery.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
