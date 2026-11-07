"use client"

import { Progress } from "@yyc3/ui-enterprise/progress"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

export function CloudSyncStatus() {
  // 在实际应用中，您需要从服务器获取这些数据
  const cloudServices = [
    {
      name: "阿里云",
      status: "synced",
      lastSync: "今天 10:30",
      progress: 100,
    },
    {
      name: "百度云",
      status: "syncing",
      lastSync: "今天 09:45",
      progress: 78,
    },
    {
      name: "腾讯云",
      status: "error",
      lastSync: "昨天 22:15",
      progress: 0,
    },
  ]

  return (
    <div className="space-y-4">
      {cloudServices.map((service) => (
        <div key={service.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{service.name}</span>
            <StatusBadge status={service.status} />
          </div>

          {service.status === "syncing" && <Progress value={service.progress} className="h-1.5" />}

          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1.5" />
            最后同步：{service.lastSync}
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "synced") {
    return (
      <span className="flex items-center text-xs font-medium text-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        已同步
      </span>
    )
  }

  if (status === "syncing") {
    return (
      <span className="flex items-center text-xs font-medium text-amber-500">
        <svg className="h-3 w-3 mr-1 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        同步中
      </span>
    )
  }

  return (
    <span className="flex items-center text-xs font-medium text-red-500">
      <AlertCircle className="h-3 w-3 mr-1" />
      错误
    </span>
  )
}
