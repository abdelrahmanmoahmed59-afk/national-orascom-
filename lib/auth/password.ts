import "server-only"

import crypto from "crypto"

const SCRYPT_KEYLEN = 64

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16)
  const key = crypto.scryptSync(password, salt, SCRYPT_KEYLEN)
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`
}

export function verifyPassword(password: string, stored: string) {
  const [algorithm, saltB64, keyB64] = stored.split("$")
  if (algorithm !== "scrypt" || !saltB64 || !keyB64) return false

  const salt = Buffer.from(saltB64, "base64")
  const key = Buffer.from(keyB64, "base64")
  const derived = crypto.scryptSync(password, salt, key.length)
  return crypto.timingSafeEqual(key, derived)
}

