"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui/dialog"
import { Plus, Trash2, Star, Clock, Filter, Share2, MoreHorizontal, Edit, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui/dropdown-menu"
import { cn } from "@yyc3/lib/utils"

// 示例保存的筛选条件
const exampleSavedFilters = [
  {
    id: "filter-1",
    name: "本月高价值订单",
    description: "订单金额大于1000元的本月订单",
    createdAt: "2025-03-10",
    favorite: true,
    filters: {
      dateRange: { start: "2025-03-01", end: "2025-03-31" },
      minAmount: 1000,
      status: "all",
    },
  },
  {
    id: "filter-2",
    name: "未处理订单",
    description: "所有状态为未处理的订单",
    createdAt: "2025-03-05",
    favorite: false,
    filters: {
      status: "pending",
    },
  },
  {
    id: "filter-3",
    name: "上周销售报表",
    description: "上周所有销售数据",
    createdAt: "2025-03-08",
    favorite: true,
    filters: {
      dateRange: { start: "2025-03-01", end: "2025-03-07" },
      groupBy: "daily",
    },
  },
]

export function SavedFiltersManager({ onApply, onClose }) {
  const [savedFilters, setSavedFilters] = useState(exampleSavedFilters)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFilter, setNewFilter] = useState({
    name: "",
    description: "",
  })

  const filteredFilters = activeTab === "favorites" ? savedFilters.filter((filter) => filter.favorite) : savedFilters

  const toggleFavorite = (filterId) => {
    setSavedFilters(
      savedFilters.map((filter) => (filter.id === filterId ? { ...filter, favorite: !filter.favorite } : filter)),
    )
  }

  const deleteFilter = (filterId) => {
    setSavedFilters(savedFilters.filter((filter) => filter.id !== filterId))
  }

  const handleCreateFilter = () => {
    if (!newFilter.name) return

    const newFilterObj = {
      id: `filter-${Date.now()}`,
      name: newFilter.name,
      description: newFilter.description,
      createdAt: new Date().toISOString().split("T")[0],
      favorite: false,
      filters: {
        // 这里应该是当前应用的筛选条件
        dateRange: { start: "2025-03-01", end: "2025-03-31" },
      },
    }

    setSavedFilters([...savedFilters, newFilterObj])
    setNewFilter({ name: "", description: "" })
    setIsCreateDialogOpen(false)
  }

  const applyFilter = (filter) => {
    onApply && onApply(filter.filters)
    onClose && onClose()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>已保存的筛选条件</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                保存当前筛选
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>保存筛选条件</DialogTitle>
                <DialogDescription>保存当前筛选条件以便将来使用</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-name">名称</Label>
                  <Input
                    id="filter-name"
                    placeholder="输入筛选条件名称"
                    value={newFilter.name}
                    onChange={(e) => setNewFilter({ ...newFilter, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-description">描述 (可选)</Label>
                  <Input
                    id="filter-description"
                    placeholder="输入筛选条件描述"
                    value={newFilter.description}
                    onChange={(e) => setNewFilter({ ...newFilter, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateFilter}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>管理您保存的筛选条件和视图</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>全部</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                <span>收藏</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="pt-4">
            {filteredFilters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {activeTab === "favorites" ? "没有收藏的筛选条件" : "没有保存的筛选条件"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 text-muted-foreground", filter.favorite && "text-yellow-500")}
                          onClick={() => toggleFavorite(filter.id)}
                        >
                          <Star className="h-4 w-4" fill={filter.favorite ? "currentColor" : "none"} />
                        </Button>
                        <div className="ml-2 truncate">
                          <div className="font-medium truncate">{filter.name}</div>
                          {filter.description && (
                            <div className="text-xs text-muted-foreground truncate">{filter.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {filter.createdAt}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => applyFilter(filter)}>
                        应用
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>编辑</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>复制</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            <span>共享</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteFilter(filter.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>删除</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          关闭
        </Button>
      </CardFooter>
    </Card>
  )
}
