"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Lock, Unlock, Key } from "lucide-react"

export default function EncryptedDataExample() {
  const [userId, setUserId] = useState("user123")
  const [sensitiveData, setSensitiveData] = useState(
    JSON.stringify(
      {
        creditCardNumber: "4111-1111-1111-1111",
        expiryDate: "12/25",
        cvv: "123",
      },
      null,
      2,
    ),
  )

  const [encryptedResult, setEncryptedResult] = useState<any>(null)
  const [decryptedResult, setDecryptedResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEncrypt = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/sensitive-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sensitiveData: JSON.parse(sensitiveData),
        }),
      })

      const result = await response.json()
      setEncryptedResult(result)
      setDecryptedResult(null)
    } catch (error) {
      console.error("Error encrypting data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrypt = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/sensitive-data?userId=${userId}`)
      const result = await response.json()
      setDecryptedResult(result)
    } catch (error) {
      console.error("Error decrypting data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold flex items-center">
        <Shield className="w-6 h-6 text-blue-400 mr-2" />
        数据加密示例
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">用户ID</label>
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="输入用户ID" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">敏感数据 (JSON格式)</label>
          <Textarea
            value={sensitiveData}
            onChange={(e) => setSensitiveData(e.target.value)}
            placeholder="输入敏感数据"
            rows={5}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleEncrypt} disabled={isLoading} className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            加密数据
          </Button>

          <Button onClick={handleDecrypt} disabled={isLoading} variant="outline" className="flex items-center">
            <Unlock className="w-4 h-4 mr-2" />
            解密数据
          </Button>
        </div>
      </div>

      {encryptedResult && (
        <div className="bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Key className="w-4 h-4 mr-2" />
            加密结果
          </h3>
          <pre className="text-xs overflow-auto bg-deep-space-blue/50 p-2 rounded">
            {JSON.stringify(encryptedResult, null, 2)}
          </pre>
        </div>
      )}

      {decryptedResult && (
        <div className="bg-green-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Unlock className="w-4 h-4 mr-2" />
            解密结果
          </h3>
          <pre className="text-xs overflow-auto bg-deep-space-blue/50 p-2 rounded">
            {JSON.stringify(decryptedResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-sm text-white/70">
        <p className="font-semibold">安全说明:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>使用AES-256-GCM加密算法，提供机密性和完整性保护</li>
          <li>每次加密使用随机初始化向量(IV)，防止重放攻击</li>
          <li>包含认证标签(Auth Tag)，确保数据完整性和真实性</li>
          <li>密钥存储在环境变量中，不会暴露给客户端</li>
        </ul>
      </div>
    </div>
  )
}
