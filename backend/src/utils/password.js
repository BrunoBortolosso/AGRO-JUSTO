import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SALT_BYTES = 16;
const KEY_BYTES = 64;

async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = await scryptAsync(password, salt, KEY_BYTES, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 32 * 1024 * 1024
  });

  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("hex"),
    Buffer.from(derivedKey).toString("hex")
  ].join(":");
}

async function verifyPassword(password, encodedHash) {
  try {
    const [algorithm, n, r, p, saltHex, hashHex] = String(encodedHash).split(":");
    if (algorithm !== "scrypt" || !n || !r || !p || !saltHex || !hashHex) return false;

    const salt = Buffer.from(saltHex, "hex");
    const expectedHash = Buffer.from(hashHex, "hex");
    if (salt.length !== SALT_BYTES || expectedHash.length !== KEY_BYTES) return false;

    const derivedKey = await scryptAsync(password, salt, expectedHash.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 32 * 1024 * 1024
    });
    const actualHash = Buffer.from(derivedKey);
    return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}

export { hashPassword, verifyPassword };