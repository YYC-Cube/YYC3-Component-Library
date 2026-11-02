import { NextResponse } from "next/server"
import { encrypt, decrypt } from "@/lib/security/encryption"

// 存储敏感数据
export async function POST(request: Request) {
  try {
    const { userId, sensitiveData } = await request.json()

    if (!userId || !sensitiveData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 加密敏感数据
    const { encryptedData, iv, authTag } = encrypt(JSON.stringify(sensitiveData))

    // 在实际应用中，这里会将加密后的数据存储到数据库
    // 这里仅作演示，返回加密后的数据
    return NextResponse.json({
      userId,
      encryptedData,
      iv,
      authTag,
      message: "Sensitive data encrypted and stored successfully",
    })
  } catch (error) {
    console.error("Error storing sensitive data:", error)
    return NextResponse.json({ error: "Failed to store sensitive data" }, { status: 500 })
  }
}

// 获取敏感数据
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    // 在实际应用中，这里会从数据库获取加密的数据
    // 这里仅作演示，使用模拟数据
    const mockEncryptedData = {
      encryptedData: "5b7e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
      iv: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      authTag: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    }

    try {
      // 尝试解密数据
      const decryptedData = decrypt(mockEncryptedData.encryptedData, mockEncryptedData.iv, mockEncryptedData.authTag)

      return NextResponse.json({
        userId,
        sensitiveData: JSON.parse(decryptedData),
        message: "Sensitive data retrieved and decrypted successfully",
      })
    } catch (error) {
      return NextResponse.json(
        { error: "Data integrity check failed. Data may have been tampered with." },
        { status: 403 },
      )
    }
  } catch (error) {
    console.error("Error retrieving sensitive data:", error)
    return NextResponse.json({ error: "Failed to retrieve sensitive data" }, { status: 500 })
  }
}
