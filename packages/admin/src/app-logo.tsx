/**
 * @file 应用logo组件
 * @description 显示应用的logo和标题
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React from "react"
import { Logo } from "lucide-react"

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <Logo className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold">双导管理系统</span>
    </div>
  )
}