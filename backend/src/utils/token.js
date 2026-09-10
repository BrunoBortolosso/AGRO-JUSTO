import { createHash, randomBytes } from "node:crypto";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function createSessionToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashSessionToken(token),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS)
  };
}

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export { createSessionToken, hashSessionToken };