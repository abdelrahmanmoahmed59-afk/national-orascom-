import { ADMIN_SESSION_COOKIE } from "./constants"

type SessionPayload = {
  username: string
  exp: number
  iat: number
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function base64UrlEncode(bytes: Uint8Array) {
  let base64 = ""
  for (let i = 0; i < bytes.length; i++) base64 += String.fromCharCode(bytes[i])
  const b64 = btoa(base64)
  return b64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function base64UrlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const b64 = input.replaceAll("-", "+").replaceAll("_", "/") + pad
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function importHmacKey(secret: string, usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  )
}

export async function createAdminSessionToken({
  username,
  ttlSeconds = 60 * 60 * 24 * 7,
}: {
  username: string
  ttlSeconds?: number
}) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("Missing AUTH_SECRET")

  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = { username, iat: now, exp: now + ttlSeconds }

  const payloadBytes = textEncoder.encode(JSON.stringify(payload))
  const payloadB64 = base64UrlEncode(payloadBytes)

  const key = await importHmacKey(secret, "sign")
  const sig = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payloadB64))
  const sigB64 = base64UrlEncode(new Uint8Array(sig))

  return `${payloadB64}.${sigB64}`
}

export async function verifyAdminSessionToken(token: string) {
  const secret = process.env.AUTH_SECRET
  if (!secret) return null

  const [payloadB64, sigB64] = token.split(".")
  if (!payloadB64 || !sigB64) return null

  const key = await importHmacKey(secret, "verify")
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(sigB64),
    textEncoder.encode(payloadB64),
  )
  if (!isValid) return null

  const payloadJson = textDecoder.decode(base64UrlDecode(payloadB64))
  const payload = JSON.parse(payloadJson) as SessionPayload
  if (!payload.username || typeof payload.exp !== "number") return null

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp <= now) return null

  return { username: payload.username }
}

export function getAdminSessionCookie() {
  return ADMIN_SESSION_COOKIE
}

