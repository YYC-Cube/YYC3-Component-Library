"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Gauge,
  Users,
  Target,
  Zap,
  Award,
  Theater,
  Clock,
  Factory,
  BookOpen,
  Flame,
  Shield,
  ChevronDown,
} from "lucide-react"
import { cn } from "@yyc3/lib/utils"
import { Button } from "@yyc3/ui-enterprise/button"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { ThemeProvider } from "@/components/theme-provider"
import { Logo } from "@/components/logo"

interface NavItemProps {
  icon: React.ReactNode
  title: string
  description?: string
  isActive?: boolean
  isOpen?: boolean
  hasSubItems?: boolean
  href: string
  onToggle?: () => void
  children?: React.ReactNode
}

function NavItem({ icon, title, description, isActive, isOpen, hasSubItems, href, onToggle, children }: NavItemProps) {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer",
          isActive
            ? "bg-gradient-to-r from-blue-800 to-blue-900 text-blue-50 border-l-4 border-cyan-400"
            : "hover:bg-blue-900/50 text-blue-100 hover:border-l-4 hover:border-blue-500",
        )}
        onClick={onToggle}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isActive ? "bg-gradient-to-br from-cyan-500 to-blue-600" : "bg-blue-800/50",
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium">{title}</span>
          {description && <span className="text-xs text-blue-300">{description}</span>}
        </div>
        {hasSubItems && (
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "transform rotate-180" : "")} />
        )}
      </div>
      {isOpen && children && <div className="ml-10 pl-2 border-l border-blue-800 mt-1 mb-1 space-y-1">{children}</div>}
    </div>
  )
}

function SubNavItem({ title, href, isActive }: { title: string; href: string; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-3 py-1.5 text-sm transition-all",
        isActive ? "bg-blue-800 text-blue-50" : "text-blue-300 hover:bg-blue-900/50 hover:text-blue-100",
      )}
    >
      {title}
    </Link>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState("全景作战室")
  const [activeSubModule, setActiveSubModule] = useState<string | null>("战情沙盘")
  const [openModules, setOpenModules] = useState<string[]>(["全景作战室"])

  const toggleModule = (title: string) => {
    setOpenModules((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const modules = [
    {
      title: "全景作战室",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "战略决策中枢",
      href: "/command-center",
      subItems: [
        { title: "战情沙盘", href: "/command-center/battlefield" },
        { title: "火力部署台", href: "/command-center/resources" },
        { title: "敌情预警站", href: "/command-center/alerts" },
        { title: "战果陈列室", href: "/command-center/analysis" },
      ],
    },
    {
      title: "星链引擎",
      icon: <Gauge className="h-4 w-4" />,
      description: "组织赋能体系",
      href: "/organization",
      subItems: [
        { title: "引力矩阵", href: "/organization/gravity-matrix" },
        { title: "轨道校准仪", href: "/organization/orbit-calibrator" },
        { title: "星际档案馆", href: "/organization/talent-archive" },
        { title: "能量补给站", href: "/organization/energy-station" },
      ],
    },
    {
      title: "赏金猎人",
      icon: <Target className="h-4 w-4" />,
      description: "目标激励体系",
      href: "/incentives",
      subItems: [
        { title: "悬赏令墙", href: "/incentives/bounty-wall" },
        { title: "赏金熔炉", href: "/incentives/bounty-forge" },
        { title: "装备锻造坊", href: "/incentives/equipment-forge" },
        { title: "猎人酒馆", href: "/incentives/hunters-tavern" },
      ],
    },
    {
      title: "服务剧场",
      icon: <Theater className="h-4 w-4" />,
      description: "客户运营体系",
      href: "/customer-operations",
      subItems: [
        { title: "剧本工坊", href: "/customer-operations/script-workshop" },
        { title: "彩排中心", href: "/customer-operations/rehearsal-center" },
        { title: "观众席监测", href: "/customer-operations/audience-monitoring" },
        { title: "谢幕仪式厅", href: "/customer-operations/farewell-hall" },
      ],
    },
    {
      title: "时光法典",
      icon: <Clock className="h-4 w-4" />,
      description: "流程管控体系",
      href: "/process-control",
      subItems: [
        { title: "时间裂隙", href: "/process-control/time-rift" },
        { title: "记忆琥珀", href: "/process-control/memory-amber" },
        { title: "未来观测站", href: "/process-control/future-observatory" },
        { title: "因果律武器", href: "/process-control/causality-weapons" },
      ],
    },
    {
      title: "造梦工厂",
      icon: <Factory className="h-4 w-4" />,
      description: "创新激励体系",
      href: "/innovation",
      subItems: [
        { title: "灵感反应堆", href: "/innovation/inspiration-reactor" },
        { title: "原型车间", href: "/innovation/prototype-workshop" },
        { title: "梦想交易所", href: "/innovation/dream-exchange" },
        { title: "烟花秀场", href: "/innovation/fireworks-arena" },
      ],
    },
    {
      title: "熵减引擎",
      icon: <Zap className="h-4 w-4" />,
      description: "能耗优化体系",
      href: "/optimization",
      subItems: [
        { title: "暗物质探测器", href: "/optimization/dark-matter-detector" },
        { title: "能量虹吸塔", href: "/optimization/energy-siphon" },
        { title: "麦克斯韦妖", href: "/optimization/maxwell-daemon" },
        { title: "热寂警报器", href: "/optimization/heat-death-alarm" },
      ],
    },
    {
      title: "平行剧场",
      icon: <Users className="h-4 w-4" />,
      description: "多维度服务空间",
      href: "/service-dimensions",
      subItems: [
        { title: "现实帷幕", href: "/service-dimensions/reality-curtain" },
        { title: "镜像舞台", href: "/service-dimensions/mirror-stage" },
        { title: "观测者协议", href: "/service-dimensions/observer-protocol" },
        { title: "量子纠缠室", href: "/service-dimensions/quantum-entanglement" },
      ],
    },
    {
      title: "文明编年史",
      icon: <BookOpen className="h-4 w-4" />,
      description: "组织记忆体系",
      href: "/organizational-memory",
      subItems: [
        { title: "史诗卷轴", href: "/organizational-memory/epic-scrolls" },
        { title: "基因密码库", href: "/organizational-memory/gene-codex" },
        { title: "先知祭坛", href: "/organizational-memory/prophet-altar" },
        { title: "时间胶囊", href: "/organizational-memory/time-capsule" },
      ],
    },
    {
      title: "欲望反应堆",
      icon: <Flame className="h-4 w-4" />,
      description: "消费激发体系",
      href: "/consumer-engagement",
      subItems: [
        { title: "多巴胺矿井", href: "/consumer-engagement/dopamine-mine" },
        { title: "马斯洛阶梯", href: "/consumer-engagement/maslow-stairs" },
        { title: "荷尔蒙实验室", href: "/consumer-engagement/hormone-lab" },
        { title: "心流发生器", href: "/consumer-engagement/flow-generator" },
      ],
    },
    {
      title: "混沌学院",
      icon: <Shield className="h-4 w-4" />,
      description: "反脆弱体系",
      href: "/anti-fragility",
      subItems: [
        { title: "压力熔炉", href: "/anti-fragility/stress-furnace" },
        { title: "变异孵化器", href: "/anti-fragility/mutation-incubator" },
        { title: "黑天鹅观测站", href: "/anti-fragility/black-swan-observatory" },
        { title: "九头蛇协议", href: "/anti-fragility/hydra-protocol" },
      ],
    },
    {
      title: "永恒之枪",
      icon: <Award className="h-4 w-4" />,
      description: "战略决策体系",
      href: "/strategic-decisions",
      subItems: [
        { title: "世界树根系", href: "/strategic-decisions/yggdrasil-roots" },
        { title: "卢恩符文盘", href: "/strategic-decisions/rune-disc" },
        { title: "彩虹桥中枢", href: "/strategic-decisions/bifrost-nexus" },
        { title: "诸神黄昏预案", href: "/strategic-decisions/ragnarok-plan" },
      ],
    },
  ]

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
        <aside className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 bg-gradient-to-b from-blue-950 to-blue-900 border-r border-blue-800/50">
          <div className="flex h-16 items-center border-b border-blue-800 px-4 bg-blue-950/80">
            <Logo className="text-lg" />
          </div>
          <ScrollArea className="flex-1 px-2 py-4">
            <div className="space-y-1">
              {modules.map((module) => (
                <NavItem
                  key={module.title}
                  icon={module.icon}
                  title={module.title}
                  description={module.description}
                  isActive={activeModule === module.title}
                  isOpen={openModules.includes(module.title)}
                  hasSubItems={!!module.subItems && module.subItems.length > 0}
                  href={module.href}
                  onToggle={() => toggleModule(module.title)}
                >
                  {module.subItems &&
                    module.subItems.map((subItem) => (
                      <SubNavItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.href}
                        isActive={activeSubModule === subItem.title}
                      />
                    ))}
                </NavItem>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <div className="flex flex-col flex-1 lg:pl-64">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-blue-800 bg-gradient-to-r from-blue-950 to-blue-900 backdrop-blur-sm px-4">
            <Button variant="outline" size="icon" className="lg:hidden border-blue-700 text-blue-100 hover:bg-blue-800">
              <BarChart3 className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <h1 className="text-lg font-semibold text-white">{activeModule}</h1>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
