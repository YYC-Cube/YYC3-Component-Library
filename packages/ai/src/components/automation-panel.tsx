import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Code, FileText, MessageSquare, Repeat, Settings, Zap } from "lucide-react"

export default function AutomationPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              智能工作流
            </CardTitle>
            <CardDescription>自定义任务模板，实现复杂任务自动化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  内容发布
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  评论回复
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                定时任务
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">创建工作流</Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              RPA流程
            </CardTitle>
            <CardDescription>自动处理重复性操作，提升工作效率</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <ShoppingBagIcon className="mr-2 h-4 w-4" />
                  商品管理
                </Button>
                <Button variant="outline" className="justify-start">
                  <DatabaseIcon className="mr-2 h-4 w-4" />
                  数据录入
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                报表生成
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">创建RPA</Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              自动化设置
            </CardTitle>
            <CardDescription>配置自动化规则和触发条件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <BellIcon className="mr-2 h-4 w-4" />
                  通知设置
                </Button>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  计划任务
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <Repeat className="mr-2 h-4 w-4" />
                触发条件
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">管理设置</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="card-hover glass-card">
        <CardHeader>
          <CardTitle>工作流编排</CardTitle>
          <CardDescription>创建自定义工作流，实现业务流程自动化</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">工作流类型</label>
                <Select defaultValue="content">
                  <SelectTrigger>
                    <SelectValue placeholder="选择工作流类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">内容发布流程</SelectItem>
                    <SelectItem value="data">数据分析流程</SelectItem>
                    <SelectItem value="customer">客户互动流程</SelectItem>
                    <SelectItem value="product">商品管理流程</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">触发方式</label>
                <Select defaultValue="schedule">
                  <SelectTrigger>
                    <SelectValue placeholder="选择触发方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">定时触发</SelectItem>
                    <SelectItem value="event">事件触发</SelectItem>
                    <SelectItem value="manual">手动触发</SelectItem>
                    <SelectItem value="api">API触发</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">工作流步骤</h3>
              <div className="space-y-3">
                <div className="flex items-center p-2 border rounded-md bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    1
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">内容生成</p>
                    <p className="text-xs text-gray-500">使用AI生成内容</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    编辑
                  </Button>
                </div>
                <div className="flex items-center p-2 border rounded-md bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    2
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">内容审核</p>
                    <p className="text-xs text-gray-500">自动检查内容质量</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    编辑
                  </Button>
                </div>
                <div className="flex items-center p-2 border rounded-md bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    3
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">内容发布</p>
                    <p className="text-xs text-gray-500">发布到指定平台</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    编辑
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  添加步骤
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>保存工作流</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

function FileSpreadsheetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2" />
      <path d="M8 17h2" />
      <path d="M14 13h2" />
      <path d="M14 17h2" />
    </svg>
  )
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
