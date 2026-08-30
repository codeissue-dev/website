import "dotenv/config";

/**
 * Creates the first administrator, or promotes an existing account.
 *
 * Usage:
 *   pnpm admin:create --email you@example.com --name "Your Name"
 *
 * The password is read from the ADMIN_PASSWORD environment variable when set,
 * otherwise the script prompts for it. No credentials are hardcoded anywhere in
 * this repository, and the password is never printed or logged.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { closeDb } from "../src/lib/db/client";
import { NotFoundError } from "../src/lib/errors";
import {
  createUserWithPassword,
  promoteExistingUserToAdmin,
} from "../src/lib/users/mutations";
import { emailSchema, nameSchema, passwordSchema } from "../src/lib/validation/auth";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Minimal `--flag value` reader; unknown flags are reported rather than ignored. */
function parseArgs(argv: string[]): Map<string, string> {
  const known = new Set(["--email", "--name"]);
  const parsed = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === undefined) continue;
    if (!known.has(flag)) {
      throw new Error(`Unknown argument "${flag}". Supported: --email, --name.`);
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`${flag} requires a value.`);
    }
    parsed.set(flag, value);
    index += 1;
  }

  return parsed;
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return await rl.question(question);
  } finally {
    rl.close();
  }
}

async function readPassword(): Promise<string> {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv;

  console.info(
    "ADMIN_PASSWORD is not set. The password you type next will be visible in this terminal.",
  );
  return prompt("Password for the new administrator: ");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const emailInput = args.get("--email") ?? (await prompt("Email: "));
  const email = emailSchema.parse(emailInput);

  try {
    const promoted = await promoteExistingUserToAdmin(email);
    console.info(`${promoted.email} already existed and now has the role ADMIN.`);
    return;
  } catch (error) {
    if (!(error instanceof NotFoundError)) throw error;
  }

  const nameInput = args.get("--name") ?? (await prompt("Full name: "));
  const name = nameSchema.parse(nameInput);
  const password = passwordSchema.parse(await readPassword());

  const created = await createUserWithPassword({
    name,
    email,
    password,
    role: "ADMIN",
  });

  console.info(`Created administrator ${created.email}.`);
}

main()
  .catch((error: unknown) => {
    console.error(`Could not create the administrator: ${errorMessage(error)}`);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
