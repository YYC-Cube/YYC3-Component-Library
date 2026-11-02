import crypto from "crypto"

// 加密配置
const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16 // 初始化向量长度
const KEY_LENGTH = 32 // 密钥长度 (256 bits)
const AUTH_TAG_LENGTH = 16 // 认证标签长度

// 从环境变量获取加密密钥，或生成一个随机密钥
const getEncryptionKey = (): Buffer => {
  const envKey = process.env.ENCRYPTION_KEY

  if (envKey && Buffer.from(envKey, "hex").length === KEY_LENGTH) {
    return Buffer.from(envKey, "hex")
  }

  // 如果环境变量中没有有效的密钥，生成一个随机密钥
  // 注意：在生产环境中，应该使用一个固定的密钥并妥善保管
  console.warn("No valid encryption key found in environment variables. Using a random key.")
  return crypto.randomBytes(KEY_LENGTH)
}

// 加密数据
export function encrypt(text: string): { encryptedData: string; iv: string; authTag: string } {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // 获取认证标签
  const authTag = cipher.getAuthTag()

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  }
}

// 解密数据
export function decrypt(encryptedData: string, iv: string, authTag: string): string {
  try {
    const key = getEncryptionKey()
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, "hex"))

    // 设置认证标签
    decipher.setAuthTag(Buffer.from(authTag, "hex"))

    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption failed:", error)
    throw new Error("Decryption failed. Data may have been tampered with.")
  }
}

// 生成哈希
export function hash(text: string, salt?: string): string {
  const useSalt = salt || crypto.randomBytes(16).toString("hex")
  const hmac = crypto.createHmac("sha256", useSalt)
  hmac.update(text)
  return `${hmac.digest("hex")}:${useSalt}`
}

// 验证哈希
export function verifyHash(text: string, hashedText: string): boolean {
  const [hash, salt] = hashedText.split(":")
  const hmac = crypto.createHmac("sha256", salt)
  hmac.update(text)
  return hmac.digest("hex") === hash
}

// 生成安全的随机令牌
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}
