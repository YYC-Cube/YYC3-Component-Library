import type React from "react"
import Link from "next/link"
import { LayoutDashboard, Server, HardDrive, Activity, Settings, Cloud, Code } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 bg-card text-card-foreground border-r h-full py-6 flex flex-col">
      <div className="px-6 mb-8">
        <h1 className="text-lg font-bold">YanYu Intelligence</h1>
        <p className="text-sm text-muted-foreground">Cloud³ 平台</p>
      </div>

      <nav className="space-y-1 px-3 flex-1">
        <SidebarItem href="/" icon={<LayoutDashboard size={20} />} label="仪表板" />
        <SidebarItem href="/servers" icon={<Server size={20} />} label="核心服务器" />
        <SidebarItem href="/storage" icon={<HardDrive size={20} />} label="存储管理" />
        <SidebarItem href="/monitoring" icon={<Activity size={20} />} label="系统监控" />
        <SidebarItem href="/development" icon={<Code size={20} />} label="开发环境" />
        <SidebarItem href="/cloud-sync" icon={<Cloud size={20} />} label="云端同步" />
        <SidebarItem href="/settings" icon={<Settings size={20} />} label="系统设置" />
      </nav>

      <div className="px-6 mt-auto">
        <div className="py-4 text-xs text-muted-foreground">
          <p>非商业用途</p>
          <p>个人服务器控制面板</p>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <span className="mr-3 text-muted-foreground">{icon}</span>
      {label}
    </Link>
  )
}
