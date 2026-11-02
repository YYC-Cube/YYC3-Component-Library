"use client"

import { CpuIcon, MemoryStickIcon as Memory, Thermometer } from "lucide-react"
import { Progress } from "@yyc3/ui/progress"

export function ServerStats() {
  // 在实际应用中，您需要从服务器获取这些数据
  const cpuUsage = 42
  const memoryUsage = 56
  const temperature = 38

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">CPU 使用率</span>
          </div>
          <span className="text-sm font-medium">{cpuUsage}%</span>
        </div>
        <Progress value={cpuUsage} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Memory className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">内存使用</span>
          </div>
          <span className="text-sm font-medium">{memoryUsage}%</span>
        </div>
        <Progress value={memoryUsage} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">温度</span>
          </div>
          <span className="text-sm font-medium">{temperature}°C</span>
        </div>
        <Progress value={(temperature / 100) * 80} className="h-2" />
      </div>
    </div>
  )
}
