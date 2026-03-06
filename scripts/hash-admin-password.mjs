import crypto from "crypto"

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "your-password"')
  process.exit(1)
}

const salt = crypto.randomBytes(16)
const key = crypto.scryptSync(password, salt, 64)

const rawHash = `scrypt$${salt.toString("base64")}$${key.toString("base64")}`
const envSafeHash = rawHash.replaceAll("$", "\\$")

console.log(`ADMIN_PASSWORD_HASH="${envSafeHash}"`)
console.log("")
console.log(`# Raw hash (unescaped): ${rawHash}`)
