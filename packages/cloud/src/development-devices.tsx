"use client"

import { Check, AlertTriangle } from "lucide-react"

export function DevelopmentDevices() {
  // 在实际应用中，您需要从服务器获取这些数据
  const devices = [
    { name: "MacBook Pro M4 Max", status: "connected", primary: true },
    { name: "iMac M4", status: "connected" },
    { name: "iMac M1", status: "offline" },
    { name: "MacBook M1 Pro", status: "offline" },
    { name: "USB 外置硬盘", status: "connected" },
  ]

  return (
    <div className="space-y-2">
      {devices.map((device) => (
        <div key={device.name} className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium">
              {device.name}
              {device.primary && (
                <span className="ml-2 text-xs bg-primary/10 text-primary py-0.5 px-1.5 rounded">主设备</span>
              )}
            </p>
          </div>
          <div className="flex items-center">
            {device.status === "connected" ? (
              <span className="flex items-center text-xs text-green-500">
                <Check className="h-3 w-3 mr-1" />
                已连接
              </span>
            ) : (
              <span className="flex items-center text-xs text-amber-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                离线
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
