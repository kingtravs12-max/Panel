import crypto from "crypto"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateRandomString(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateLicenseKey(prefix = ""): string {
  const randomPart = generateRandomString(8)
  return prefix ? `${prefix}-${randomPart}` : `KEY-${randomPart}`
}
