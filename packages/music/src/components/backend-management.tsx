"use client"

import { useState } from "react"
import { BarChart2, AlertTriangle, Settings } from "lucide-react"

export default function BackendManagement() {
  const [selectedView, setSelectedView] = useState("heatmap")
  const [holidayMode, setHolidayMode] = useState(false)
  const [emergencyMode, setEmergencyMode] = useState(false)

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Settings className="w-6 h-6 text-blue-400 mr-2" />
        后台管理模块
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">时空数据驾驶舱</h3>
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${selectedView === "heatmap" ? "bg-blue-600" : "bg-blue-900/30"}`}
              onClick={() => setSelectedView("heatmap")}
            >
              热力图层
            </button>
            <button
              className={`px-4 py-2 rounded-md ${selectedView === "anomaly" ? "bg-blue-600" : "bg-blue-900/30"}`}
              onClick={() => setSelectedView("anomaly")}
            >
              异常检测
            </button>
          </div>
          <div className="bg-blue-900/30 p-4 rounded-lg h-48 flex items-center justify-center">
            {selectedView === "heatmap" ? (
              <BarChart2 className="w-12 h-12 text-blue-400" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">动态规则引擎</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>节假日模式</span>
              <button
                className={`px-4 py-2 rounded-md ${holidayMode ? "bg-green-600" : "bg-red-600"}`}
                onClick={() => setHolidayMode(!holidayMode)}
              >
                {holidayMode ? "开启" : "关闭"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>紧急事件模式</span>
              <button
                className={`px-4 py-2 rounded-md ${emergencyMode ? "bg-green-600" : "bg-red-600"}`}
                onClick={() => setEmergencyMode(!emergencyMode)}
              >
                {emergencyMode ? "开启" : "关闭"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
