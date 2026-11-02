"use client"

import { useState } from "react"
import { Card } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Badge } from "@yyc3/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Switch } from "@yyc3/ui/switch"
import { Label } from "@yyc3/ui/label"
import { Textarea } from "@yyc3/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  ExternalLink,
  Menu,
  Globe,
  Smartphone,
  Monitor,
  ChevronRight,
  Info,
  Package,
  Gift,
  DollarSign,
  Percent,
  Home,
  User,
  Settings,
  Phone,
  HelpCircle,
  ShoppingCart,
  Star,
  Heart,
  Mail,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Search,
  Filter,
  Bell,
  Lock,
  Unlock,
  Shield,
  Key,
  Database,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Zap,
  Flame,
  Droplet,
  SunIcon,
  MoonIcon,
  type LucideIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui/dialog"
import { useRouter } from "next/navigation"
import { WeChatMenuSync } from "./wechat-menu-sync"

// 图标映射对象 - 安全的图标处理方式
const iconMap: Record<string, LucideIcon> = {
  Home,
  User,
  Settings,
  Phone,
  Info,
  Package,
  Gift,
  DollarSign,
  Percent,
  HelpCircle,
  ShoppingCart,
  Star,
  Heart,
  Mail,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Search,
  Filter,
  Bell,
  Lock,
  Unlock,
  Shield,
  Key,
  Database,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Zap,
  Flame,
  Droplet,
  Sun: SunIcon,
  Moon: MoonIcon,
}

// 获取图标组件的安全函数
const getIconComponent = (iconName: string | undefined): LucideIcon | null => {
  if (!iconName) return null
  return iconMap[iconName] || null
}

// 获取所有可用图标名称
const getAvailableIcons = (): string[] => {
  return Object.keys(iconMap)
}

interface MenuItem {
  id: string
  title: string
  url: string
  iconName?: string
  isExternal: boolean
  isActive: boolean
  parentId?: string
  sort: number
  target: "_self" | "_blank"
  description?: string
  children?: MenuItem[]
}

interface MenuConfig {
  id: string
  name: string
  description: string
  platform: "web" | "mobile" | "both"
  isActive: boolean
  menuItems: MenuItem[]
  createdAt: Date
  updatedAt: Date
}

export function ParameterSettings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("menu-config")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [themeColor, setThemeColor] = useState("blue")
  const [darkMode, setDarkMode] = useState(false)
  const [layoutType, setLayoutType] = useState("sidebar")

  // 模拟菜单配置数据
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>([
    {
      id: "1",
      name: "主导航菜单",
      description: "网站主要导航菜单配置",
      platform: "web",
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
      menuItems: [
        {
          id: "1",
          title: "首页",
          url: "/dashboard",
          iconName: "Home",
          isExternal: false,
          isActive: true,
          sort: 1,
          target: "_self",
          description: "系统首页",
        },
        {
          id: "2",
          title: "产品中心",
          url: "/products",
          iconName: "Package",
          isExternal: false,
          isActive: true,
          sort: 2,
          target: "_self",
          description: "产品展示页面",
          children: [
            {
              id: "2-1",
              title: "热门产品",
              url: "/products/hot",
              iconName: "Star",
              isExternal: false,
              isActive: true,
              parentId: "2",
              sort: 1,
              target: "_self",
            },
            {
              id: "2-2",
              title: "新品推荐",
              url: "/products/new",
              iconName: "Gift",
              isExternal: false,
              isActive: true,
              parentId: "2",
              sort: 2,
              target: "_self",
            },
          ],
        },
        {
          id: "3",
          title: "关于我们",
          url: "https://www.jinlan.com/about",
          iconName: "Info",
          isExternal: true,
          isActive: true,
          sort: 3,
          target: "_blank",
          description: "公司介绍页面",
        },
        {
          id: "4",
          title: "联系我们",
          url: "/contact",
          iconName: "Phone",
          isExternal: false,
          isActive: true,
          sort: 4,
          target: "_self",
          description: "联系方式页面",
        },
      ],
    },
    {
      id: "2",
      name: "移动端菜单",
      description: "移动端专用菜单配置",
      platform: "mobile",
      isActive: true,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date(),
      menuItems: [
        {
          id: "m1",
          title: "全网折扣",
          url: "/discounts",
          iconName: "Percent",
          isExternal: false,
          isActive: true,
          sort: 1,
          target: "_self",
        },
        {
          id: "m2",
          title: "折扣中心",
          url: "/discount-center",
          iconName: "Gift",
          isExternal: false,
          isActive: true,
          sort: 2,
          target: "_self",
        },
        {
          id: "m3",
          title: "收益中心",
          url: "/earnings",
          iconName: "DollarSign",
          isExternal: false,
          isActive: true,
          sort: 3,
          target: "_self",
        },
      ],
    },
  ])

  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    title: "",
    url: "",
    iconName: "",
    isExternal: false,
    isActive: true,
    sort: 1,
    target: "_self",
    description: "",
  })

  // 动态菜单渲染组件
  const DynamicMenu = ({ menuItems }: { menuItems: MenuItem[] }) => {
    const handleMenuClick = (item: MenuItem) => {
      if (item.isExternal) {
        window.open(item.url, item.target)
      } else {
        if (item.target === "_blank") {
          window.open(item.url, "_blank")
        } else {
          router.push(item.url)
        }
      }
    }

    const renderIcon = (iconName: string | undefined) => {
      const IconComponent = getIconComponent(iconName)
      return IconComponent ? <IconComponent className="w-4 h-4" /> : <Package className="w-4 h-4" />
    }

    return (
      <div className="space-y-2">
        {menuItems
          .filter((item) => item.isActive)
          .sort((a, b) => a.sort - b.sort)
          .map((item) => (
            <div key={item.id} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 px-3 border-l-4 border-l-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group"
                onClick={() => handleMenuClick(item)}
              >
                <span className="mr-2">{renderIcon(item.iconName)}</span>
                <span className="group-hover:translate-x-1 transition-all duration-300">{item.title}</span>
                {item.isExternal && <ExternalLink className="w-3 h-3 ml-auto" />}
                {item.children && item.children.length > 0 && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Button>
              {item.children && item.children.length > 0 && (
                <div className="ml-6 space-y-1">
                  {item.children
                    .filter((child) => child.isActive)
                    .sort((a, b) => a.sort - b.sort)
                    .map((child) => (
                      <Button
                        key={child.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8 px-3 text-sm border-l-4 border-l-green-500 hover:bg-green-50 hover:shadow-md transition-all duration-300 group"
                        onClick={() => handleMenuClick(child)}
                      >
                        <span className="mr-2">{renderIcon(child.iconName)}</span>
                        <span className="group-hover:translate-x-1 transition-all duration-300">{child.title}</span>
                        {child.isExternal && <ExternalLink className="w-3 h-3 ml-auto" />}
                      </Button>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>
    )
  }

  const handleCreateMenuItem = () => {
    if (!newMenuItem.title || !newMenuItem.url) {
      alert("菜单标题和URL不能为空")
      return
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      title: newMenuItem.title || "",
      url: newMenuItem.url || "",
      iconName: newMenuItem.iconName || "Package",
      isExternal: newMenuItem.isExternal || false,
      isActive: newMenuItem.isActive || true,
      sort: newMenuItem.sort || 1,
      target: newMenuItem.target || "_self",
      description: newMenuItem.description || "",
    }

    // 添加到第一个配置中
    const updatedConfigs = [...menuConfigs]
    updatedConfigs[0].menuItems.push(newItem)
    updatedConfigs[0].updatedAt = new Date()
    setMenuConfigs(updatedConfigs)

    // 重置表单
    setNewMenuItem({
      title: "",
      url: "",
      iconName: "",
      isExternal: false,
      isActive: true,
      sort: 1,
      target: "_self",
      description: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditMenuItem = () => {
    if (!selectedMenu) return

    const updatedConfigs = menuConfigs.map((config) => {
      if (config.id === "1") {
        // 假设只编辑第一个菜单配置
        return {
          ...config,
          menuItems: config.menuItems.map((item) => {
            if (item.id === selectedMenu.id) {
              return selectedMenu
            }
            return item
          }),
          updatedAt: new Date(),
        }
      }
      return config
    })

    setMenuConfigs(updatedConfigs)
    setIsEditDialogOpen(false)
    setSelectedMenu(null)
  }

  const handleDeleteMenuItem = (configId: string, itemId: string) => {
    if (confirm("确定要删除这个菜单项吗？")) {
      const updatedConfigs = menuConfigs.map((config) => {
        if (config.id === configId) {
          return {
            ...config,
            menuItems: config.menuItems.filter((item) => item.id !== itemId),
            updatedAt: new Date(),
          }
        }
        return config
      })
      setMenuConfigs(updatedConfigs)
    }
  }

  const handleUpdateSystemParams = () => {
    alert("系统参数已更新")
  }

  const handleUpdateUISettings = () => {
    alert("界面设置已更新")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">参数设置</h1>
          <p className="text-slate-600 mt-2">配置系统菜单和参数</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="hover:shadow-md transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "退出预览" : "预览模式"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="menu-config">菜单配置</TabsTrigger>
          <TabsTrigger value="wechat-sync">微信同步</TabsTrigger>
          <TabsTrigger value="system-params">系统参数</TabsTrigger>
          <TabsTrigger value="ui-settings">界面设置</TabsTrigger>
          <TabsTrigger value="preview">预览测试</TabsTrigger>
        </TabsList>

        <TabsContent value="menu-config" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">菜单配置管理</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  新建菜单项
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>创建新菜单项</DialogTitle>
                  <DialogDescription>配置菜单项的基本信息和跳转设置</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="menu-title">菜单标题</Label>
                      <Input
                        id="menu-title"
                        placeholder="输入菜单标题"
                        value={newMenuItem.title}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, title: e.target.value })}
                        className="border-l-4 border-l-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="menu-icon">图标选择</Label>
                      <Select
                        value={newMenuItem.iconName}
                        onValueChange={(value) => setNewMenuItem({ ...newMenuItem, iconName: value })}
                      >
                        <SelectTrigger className="border-l-4 border-l-blue-500">
                          <SelectValue placeholder="选择图标" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {getAvailableIcons().map((iconName) => {
                            const IconComponent = getIconComponent(iconName)
                            return (
                              <SelectItem key={iconName} value={iconName}>
                                <div className="flex items-center gap-2">
                                  {IconComponent && <IconComponent className="w-4 h-4" />}
                                  <span>{iconName}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="menu-url">跳转地址</Label>
                    <Input
                      id="menu-url"
                      placeholder="如: /dashboard 或 https://example.com"
                      value={newMenuItem.url}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, url: e.target.value })}
                      className="border-l-4 border-l-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="menu-description">描述信息</Label>
                    <Textarea
                      id="menu-description"
                      placeholder="菜单项的描述信息"
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                      className="border-l-4 border-l-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="menu-target">打开方式</Label>
                      <Select
                        value={newMenuItem.target}
                        onValueChange={(value: "_self" | "_blank") => setNewMenuItem({ ...newMenuItem, target: value })}
                      >
                        <SelectTrigger className="border-l-4 border-l-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_self">当前窗口</SelectItem>
                          <SelectItem value="_blank">新窗口</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="menu-sort">排序</Label>
                      <Input
                        id="menu-sort"
                        type="number"
                        placeholder="排序号"
                        value={newMenuItem.sort}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, sort: Number.parseInt(e.target.value) || 1 })}
                        className="border-l-4 border-l-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-external"
                        checked={newMenuItem.isExternal}
                        onCheckedChange={(checked) => setNewMenuItem({ ...newMenuItem, isExternal: checked })}
                      />
                      <Label htmlFor="is-external">外部链接</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-active"
                        checked={newMenuItem.isActive}
                        onCheckedChange={(checked) => setNewMenuItem({ ...newMenuItem, isActive: checked })}
                      />
                      <Label htmlFor="is-active">启用状态</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleCreateMenuItem} className="hover:shadow-md transition-all duration-300">
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {menuConfigs.map((config) => (
              <Card
                key={config.id}
                className="p-6 border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {config.platform === "web" ? (
                        <Monitor className="w-5 h-5 text-purple-600" />
                      ) : config.platform === "mobile" ? (
                        <Smartphone className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Globe className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{config.name}</h3>
                      <p className="text-sm text-slate-600">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={config.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {config.isActive ? "启用" : "禁用"}
                    </Badge>
                    <Badge variant="outline">
                      {config.platform === "web" ? "网页端" : config.platform === "mobile" ? "移动端" : "全平台"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <Menu className="w-4 h-4" />
                    菜单项列表 ({config.menuItems.length})
                  </h4>
                  <div className="grid gap-2">
                    {config.menuItems.map((item) => {
                      const IconComponent = getIconComponent(item.iconName)
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {IconComponent ? <IconComponent className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium group-hover:translate-x-1 transition-all duration-300">
                                  {item.title}
                                </span>
                                {item.isExternal && <ExternalLink className="w-3 h-3 text-blue-500" />}
                                {!item.isActive && (
                                  <Badge variant="secondary" className="text-xs">
                                    禁用
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{item.url}</p>
                              {item.description && <p className="text-xs text-slate-400 mt-1">{item.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMenu(item)
                                setIsEditDialogOpen(true)
                              }}
                              className="hover:shadow-md transition-all duration-300"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMenuItem(config.id, item.id)}
                              className="text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>创建时间: {config.createdAt.toLocaleString()}</span>
                    <span>更新时间: {config.updatedAt.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wechat-sync" className="space-y-6">
          <WeChatMenuSync />
        </TabsContent>

        <TabsContent value="system-params" className="space-y-6">
          <div className="grid gap-6">
            <Card className="p-6 border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4">系统基础参数</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="site-name">网站名称</Label>
                    <Input id="site-name" defaultValue="锦澜家居管理系统" className="border-l-4 border-l-green-500" />
                  </div>
                  <div>
                    <Label htmlFor="site-url">网站地址</Label>
                    <Input id="site-url" defaultValue="https://jinlan.com" className="border-l-4 border-l-green-500" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="site-description">网站描述</Label>
                  <Textarea
                    id="site-description"
                    defaultValue="专业的家居管理系统，提供全方位的企业管理解决方案"
                    className="border-l-4 border-l-green-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <Label htmlFor="maintenance-mode">维护模式</Label>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4">安全设置</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-timeout">会话超时(分钟)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      defaultValue="30"
                      className="border-l-4 border-l-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-login-attempts">最大登录尝试次数</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      defaultValue="5"
                      className="border-l-4 border-l-orange-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="two-factor-auth" />
                  <Label htmlFor="two-factor-auth">启用双因素认证</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="password-complexity" defaultChecked />
                  <Label htmlFor="password-complexity">强制复杂密码</Label>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleUpdateSystemParams}
              className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ui-settings" className="space-y-6">
          <div className="grid gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4">界面主题设置</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme-color">主题色彩</Label>
                  <Select value={themeColor} onValueChange={setThemeColor}>
                    <SelectTrigger className="border-l-4 border-l-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">蓝色主题</SelectItem>
                      <SelectItem value="green">绿色主题</SelectItem>
                      <SelectItem value="purple">紫色主题</SelectItem>
                      <SelectItem value="red">红色主题</SelectItem>
                      <SelectItem value="orange">橙色主题</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  <Label htmlFor="dark-mode">深色模式</Label>
                </div>
                <div>
                  <Label htmlFor="layout-type">布局类型</Label>
                  <Select value={layoutType} onValueChange={setLayoutType}>
                    <SelectTrigger className="border-l-4 border-l-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sidebar">侧边栏布局</SelectItem>
                      <SelectItem value="topnav">顶部导航布局</SelectItem>
                      <SelectItem value="combined">组合布局</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-indigo-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4">动画与过渡效果</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="enable-animations" defaultChecked />
                  <Label htmlFor="enable-animations">启用动画效果</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="smooth-scroll" defaultChecked />
                  <Label htmlFor="smooth-scroll">平滑滚动</Label>
                </div>
                <div>
                  <Label htmlFor="animation-speed">动画速度</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger className="border-l-4 border-l-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">慢速</SelectItem>
                      <SelectItem value="normal">正常</SelectItem>
                      <SelectItem value="fast">快速</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleUpdateUISettings}
              className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6 border-l-4 border-l-pink-500 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4">菜单预览</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">桌面端预览</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-md">
                  <DynamicMenu menuItems={menuConfigs[0].menuItems} />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">移动端预览</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-md max-w-[320px] mx-auto">
                  <DynamicMenu menuItems={menuConfigs[1].menuItems} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 编辑菜单项对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑菜单项</DialogTitle>
            <DialogDescription>修改菜单项的基本信息和跳转设置</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMenu && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-menu-title">菜单标题</Label>
                    <Input
                      id="edit-menu-title"
                      placeholder="输入菜单标题"
                      value={selectedMenu.title || ""}
                      onChange={(e) => setSelectedMenu({ ...selectedMenu, title: e.target.value })}
                      className="border-l-4 border-l-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-menu-icon">图标选择</Label>
                    <Select
                      value={selectedMenu.iconName}
                      onValueChange={(value) => setSelectedMenu({ ...selectedMenu, iconName: value })}
                    >
                      <SelectTrigger className="border-l-4 border-l-blue-500">
                        <SelectValue placeholder="选择图标" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {getAvailableIcons().map((iconName) => {
                          const IconComponent = getIconComponent(iconName)
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center gap-2">
                                {IconComponent && <IconComponent className="w-4 h-4" />}
                                <span>{iconName}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-menu-url">跳转地址</Label>
                  <Input
                    id="edit-menu-url"
                    placeholder="如: /dashboard 或 https://example.com"
                    value={selectedMenu.url || ""}
                    onChange={(e) => setSelectedMenu({ ...selectedMenu, url: e.target.value })}
                    className="border-l-4 border-l-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-menu-description">描述信息</Label>
                  <Textarea
                    id="edit-menu-description"
                    placeholder="菜单项的描述信息"
                    value={selectedMenu.description || ""}
                    onChange={(e) => setSelectedMenu({ ...selectedMenu, description: e.target.value })}
                    className="border-l-4 border-l-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-menu-target">打开方式</Label>
                    <Select
                      value={selectedMenu.target || "_self"}
                      onValueChange={(value: "_self" | "_blank") => setSelectedMenu({ ...selectedMenu, target: value })}
                    >
                      <SelectTrigger className="border-l-4 border-l-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">当前窗口</SelectItem>
                        <SelectItem value="_blank">新窗口</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-menu-sort">排序</Label>
                    <Input
                      id="edit-menu-sort"
                      type="number"
                      placeholder="排序号"
                      value={selectedMenu.sort || 1}
                      onChange={(e) => setSelectedMenu({ ...selectedMenu, sort: Number.parseInt(e.target.value) || 1 })}
                      className="border-l-4 border-l-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is-external"
                      checked={selectedMenu.isExternal || false}
                      onCheckedChange={(checked) => setSelectedMenu({ ...selectedMenu, isExternal: checked })}
                    />
                    <Label htmlFor="edit-is-external">外部链接</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is-active"
                      checked={selectedMenu.isActive || true}
                      onCheckedChange={(checked) => setSelectedMenu({ ...selectedMenu, isActive: checked })}
                    />
                    <Label htmlFor="edit-is-active">启用状态</Label>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleEditMenuItem} className="hover:shadow-md transition-all duration-300">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
