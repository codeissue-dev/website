import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Password hashing with Node's built-in scrypt.
 *
 * Chosen deliberately over bcrypt/argon2 bindings: no native module, no
 * postinstall build step, identical behaviour locally and on Vercel's Node.js
 * runtime, and a memory-hard KDF from the standard library.
 *
 * Stored format (single text column, self-describing so parameters can evolve):
 *   scrypt$<cost>$<blockSize>$<parallelization>$<saltBase64>$<hashBase64>
 */
const ALGORITHM = "scrypt";
const COST = 16384; // N
const BLOCK_SIZE = 8; // r
const PARALLELIZATION = 1; // p
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEMORY = 64 * 1024 * 1024;

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 200;

type ScryptParameters = {
  cost: number;
  blockSize: number;
  parallelization: number;
};

function deriveKey(
  password: string,
  salt: Buffer,
  parameters: ScryptParameters,
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      keyLength,
      {
        N: parameters.cost,
        r: parameters.blockSize,
        p: parameters.parallelization,
        maxmem: MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const parameters: ScryptParameters = {
    cost: COST,
    blockSize: BLOCK_SIZE,
    parallelization: PARALLELIZATION,
  };
  const derived = await deriveKey(password, salt, parameters, KEY_LENGTH);

  return [
    ALGORITHM,
    parameters.cost,
    parameters.blockSize,
    parameters.parallelization,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

type ParsedHash = {
  parameters: ScryptParameters;
  salt: Buffer;
  hash: Buffer;
};

function parseStoredHash(stored: string): ParsedHash | null {
  const segments = stored.split("$");
  if (segments.length !== 6) return null;

  const [algorithm, cost, blockSize, parallelization, saltBase64, hashBase64] =
    segments;
  if (algorithm !== ALGORITHM) return null;
  if (
    cost === undefined ||
    blockSize === undefined ||
    parallelization === undefined ||
    saltBase64 === undefined ||
    hashBase64 === undefined
  ) {
    return null;
  }

  const parsedCost = Number.parseInt(cost, 10);
  const parsedBlockSize = Number.parseInt(blockSize, 10);
  const parsedParallelization = Number.parseInt(parallelization, 10);
  if (
    !Number.isSafeInteger(parsedCost) ||
    !Number.isSafeInteger(parsedBlockSize) ||
    !Number.isSafeInteger(parsedParallelization) ||
    parsedCost < 2 ||
    parsedBlockSize < 1 ||
    parsedParallelization < 1
  ) {
    return null;
  }

  const salt = Buffer.from(saltBase64, "base64");
  const hash = Buffer.from(hashBase64, "base64");
  if (salt.length === 0 || hash.length === 0) return null;

  return {
    parameters: {
      cost: parsedCost,
      blockSize: parsedBlockSize,
      parallelization: parsedParallelization,
    },
    salt,
    hash,
  };
}

export async function verifyPassword(
  password: string,
  storedHash: string | null,
): Promise<boolean> {
  if (!storedHash) {
    // Keep the work factor comparable for accounts without a password hash so
    // response timing does not disclose account state.
    await burnEquivalentWork(password);
    return false;
  }

  const parsed = parseStoredHash(storedHash);
  if (!parsed) {
    await burnEquivalentWork(password);
    return false;
  }

  const candidate = await deriveKey(
    password,
    parsed.salt,
    parsed.parameters,
    parsed.hash.length,
  );
  if (candidate.length !== parsed.hash.length) return false;

  return timingSafeEqual(candidate, parsed.hash);
}

/**
 * Performs one scrypt derivation with the current parameters. Called when no
 * user (or no password hash) exists so unknown-email and wrong-password paths
 * cost roughly the same amount of time.
 */
export async function burnEquivalentWork(password: string): Promise<void> {
  await deriveKey(
    password,
    randomBytes(SALT_LENGTH),
    { cost: COST, blockSize: BLOCK_SIZE, parallelization: PARALLELIZATION },
    KEY_LENGTH,
  );
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
