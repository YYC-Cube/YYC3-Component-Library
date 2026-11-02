"use client"

import { useState } from "react"
import { Shield, AlertTriangle } from "lucide-react"

export default function AntiCheatSystem() {
  const [voiceprintMatch, setVoiceprintMatch] = useState(95)
  const [progressRate, setProgressRate] = useState(15)

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Shield className="w-6 h-6 text-green-400 mr-2" />
        反作弊系统
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">声纹波动检测</h3>
          <div className="flex items-center">
            <div className="w-full bg-blue-900/30 rounded-full h-4 mr-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${voiceprintMatch}%` }}></div>
            </div>
            <span className="text-sm font-medium">{voiceprintMatch}% 匹配</span>
          </div>
          {voiceprintMatch < 80 && (
            <p className="text-yellow-400 text-sm mt-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              声纹匹配度较低，可能需要人工审核
            </p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">进步合理性评估</h3>
          <div className="flex items-center">
            <div className="w-full bg-blue-900/30 rounded-full h-4 mr-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progressRate}%` }}></div>
            </div>
            <span className="text-sm font-medium">{progressRate}% 提升</span>
          </div>
          {progressRate > 30 && (
            <p className="text-yellow-400 text-sm mt-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              24小时内进步超过30%，需要人工复核
            </p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">星力防火墙</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>每日免费星力获取上限：2000（签到+任务+邀请）</li>
            <li>星力交易税：用户间转赠收取20%手续费</li>
            <li>大额充值验证：单笔超500元需人脸识别</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
