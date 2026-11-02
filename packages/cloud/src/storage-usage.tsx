"use client"

import { Progress } from "@yyc3/ui/progress"

export function StorageUsage() {
  // 在实际应用中，您需要从服务器获取这些数据
  const storageData = [
    { name: "磁盘 1 (8TB)", used: 5.2, total: 8 },
    { name: "磁盘 2 (8TB)", used: 6.7, total: 8 },
    { name: "磁盘 3 (8TB)", used: 4.1, total: 8 },
    { name: "磁盘 4 (8TB)", used: 3.5, total: 8 },
    { name: "NVMe 缓存", used: 1.8, total: 4 },
  ]

  return (
    <div className="space-y-3">
      {storageData.map((disk) => (
        <div key={disk.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{disk.name}</span>
            <span className="text-muted-foreground">
              {disk.used}TB / {disk.total}TB
            </span>
          </div>
          <Progress value={(disk.used / disk.total) * 100} className="h-2" />
        </div>
      ))}
    </div>
  )
}
