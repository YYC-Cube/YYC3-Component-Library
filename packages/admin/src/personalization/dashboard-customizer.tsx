"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Switch } from "@yyc3/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Slider } from "@yyc3/ui/slider"
import {
  Save,
  X,
  Plus,
  Trash2,
  Layout,
  Palette,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
} from "lucide-react"
import { cn } from "@yyc3/lib/utils"

// 可用的小部件类型
const availableWidgets = [
  { id: "sales-chart", name: "销售趋势图", type: "chart", icon: LineChart },
  { id: "revenue-stats", name: "收入统计", type: "stats", icon: DollarSign },
  { id: "orders-chart", name: "订单数量图", type: "chart", icon: BarChart3 },
  { id: "category-distribution", name: "类别分布", type: "chart", icon: PieChart },
  { id: "customer-stats", name: "客户统计", type: "stats", icon: Users },
  { id: "recent-activities", name: "近期活动", type: "list", icon: Activity },
  { id: "order-stats", name: "订单统计", type: "stats", icon: ShoppingCart },
  { id: "calendar-events", name: "日历事件", type: "calendar", icon: Calendar },
]

// 布局选项
const layoutOptions = [
  { id: "1-column", name: "单列布局", columns: 1 },
  { id: "2-columns", name: "双列布局", columns: 2 },
  { id: "3-columns", name: "三列布局", columns: 3 },
  { id: "2-1-columns", name: "左侧宽布局", columns: "2-1" },
  { id: "1-2-columns", name: "右侧宽布局", columns: "1-2" },
]

export function DashboardCustomizer({ onSave, onCancel, initialLayout = null }) {
  const [activeTab, setActiveTab] = useState("widgets")
  const [layout, setLayout] = useState(
    initialLayout || {
      name: "我的仪表盘",
      layoutType: "2-columns",
      widgets: [
        { id: "sales-chart", position: 0, visible: true, size: "large" },
        { id: "revenue-stats", position: 1, visible: true, size: "medium" },
        { id: "orders-chart", position: 2, visible: true, size: "medium" },
        { id: "category-distribution", position: 3, visible: true, size: "medium" },
      ],
    },
  )

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(layout.widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }))

    setLayout({
      ...layout,
      widgets: updatedItems,
    })
  }

  const toggleWidgetVisibility = (widgetId) => {
    setLayout({
      ...layout,
      widgets: layout.widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget,
      ),
    })
  }

  const removeWidget = (widgetId) => {
    setLayout({
      ...layout,
      widgets: layout.widgets.filter((widget) => widget.id !== widgetId),
    })
  }

  const addWidget = (widgetId) => {
    // Check if widget already exists
    if (layout.widgets.some((w) => w.id === widgetId)) return

    const newWidget = {
      id: widgetId,
      position: layout.widgets.length,
      visible: true,
      size: "medium",
    }

    setLayout({
      ...layout,
      widgets: [...layout.widgets, newWidget],
    })
  }

  const updateWidgetSize = (widgetId, size) => {
    setLayout({
      ...layout,
      widgets: layout.widgets.map((widget) => (widget.id === widgetId ? { ...widget, size } : widget)),
    })
  }

  const handleSave = () => {
    onSave && onSave(layout)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>自定义仪表盘</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </div>
        <CardDescription>自定义您的仪表盘布局、小部件和显示选项</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">
              <div className="flex items-center">
                <Layout className="mr-2 h-4 w-4" />
                <span>小部件</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="layout">
              <div className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                <span>布局</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>设置</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">可用小部件</h3>
                <div className="border rounded-md p-4 space-y-2 h-[400px] overflow-y-auto">
                  {availableWidgets.map((widget) => {
                    const isAdded = layout.widgets.some((w) => w.id === widget.id)
                    return (
                      <div key={widget.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                        <div className="flex items-center">
                          <widget.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>{widget.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => addWidget(widget.id)}
                          disabled={isAdded}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">当前小部件</h3>
                <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="widgets">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {layout.widgets.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">尚未添加小部件</div>
                          ) : (
                            layout.widgets
                              .sort((a, b) => a.position - b.position)
                              .map((widget, index) => {
                                const widgetInfo = availableWidgets.find((w) => w.id === widget.id)
                                return (
                                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded-md border",
                                          widget.visible ? "bg-background" : "bg-muted",
                                        )}
                                      >
                                        <div className="flex items-center">
                                          <div {...provided.dragHandleProps} className="mr-2 text-muted-foreground">
                                            <GripVertical className="h-4 w-4" />
                                          </div>
                                          {widgetInfo?.icon && (
                                            <widgetInfo.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                                          )}
                                          <span>{widgetInfo?.name || widget.id}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Select
                                            value={widget.size}
                                            onValueChange={(value) => updateWidgetSize(widget.id, value)}
                                          >
                                            <SelectTrigger className="h-7 w-[90px]">
                                              <SelectValue placeholder="尺寸" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="small">小</SelectItem>
                                              <SelectItem value="medium">中</SelectItem>
                                              <SelectItem value="large">大</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => toggleWidgetVisibility(widget.id)}
                                          >
                                            {widget.visible ? (
                                              <Eye className="h-4 w-4" />
                                            ) : (
                                              <EyeOff className="h-4 w-4" />
                                            )}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive"
                                            onClick={() => removeWidget(widget.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="dashboard-name">仪表盘名称</Label>
                <Input
                  id="dashboard-name"
                  value={layout.name}
                  onChange={(e) => setLayout({ ...layout, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>布局类型</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {layoutOptions.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "border rounded-md p-4 cursor-pointer hover:border-primary transition-colors",
                        layout.layoutType === option.id && "border-primary bg-primary/5",
                      )}
                      onClick={() => setLayout({ ...layout, layoutType: option.id })}
                    >
                      <div className="text-sm font-medium mb-2">{option.name}</div>
                      <div className="h-16 flex gap-2">
                        {option.columns === 1 && <div className="flex-1 bg-muted rounded-md" />}
                        {option.columns === 2 && (
                          <>
                            <div className="flex-1 bg-muted rounded-md" />
                            <div className="flex-1 bg-muted rounded-md" />
                          </>
                        )}
                        {option.columns === 3 && (
                          <>
                            <div className="flex-1 bg-muted rounded-md" />
                            <div className="flex-1 bg-muted rounded-md" />
                            <div className="flex-1 bg-muted rounded-md" />
                          </>
                        )}
                        {option.columns === "2-1" && (
                          <>
                            <div className="flex-[2] bg-muted rounded-md" />
                            <div className="flex-1 bg-muted rounded-md" />
                          </>
                        )}
                        {option.columns === "1-2" && (
                          <>
                            <div className="flex-1 bg-muted rounded-md" />
                            <div className="flex-[2] bg-muted rounded-md" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-refresh">自动刷新</Label>
                  <p className="text-sm text-muted-foreground">定期自动刷新仪表盘数据</p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={layout.autoRefresh}
                  onCheckedChange={(checked) => setLayout({ ...layout, autoRefresh: checked })}
                />
              </div>

              {layout.autoRefresh && (
                <div>
                  <Label>刷新间隔 (分钟)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[layout.refreshInterval || 5]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setLayout({ ...layout, refreshInterval: value[0] })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{layout.refreshInterval || 5}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-theme">深色主题</Label>
                  <p className="text-sm text-muted-foreground">使用深色主题显示仪表盘</p>
                </div>
                <Switch
                  id="dark-theme"
                  checked={layout.darkTheme}
                  onCheckedChange={(checked) => setLayout({ ...layout, darkTheme: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-view">紧凑视图</Label>
                  <p className="text-sm text-muted-foreground">减少间距以显示更多内容</p>
                </div>
                <Switch
                  id="compact-view"
                  checked={layout.compactView}
                  onCheckedChange={(checked) => setLayout({ ...layout, compactView: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>保存仪表盘</Button>
      </CardFooter>
    </Card>
  )
}
