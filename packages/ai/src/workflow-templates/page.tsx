"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Copy, Edit, Plus, Save, Search, Star, StarOff, Trash2, Zap } from "lucide-react"
import PageBackground from "../components/page-background"
import DashboardHeader from "../components/dashboard-header"
import {
  getWorkflowTemplates,
  createWorkflowTemplate,
  updateWorkflowTemplate,
  deleteWorkflowTemplate,
  favoriteWorkflowTemplate,
  unfavoriteWorkflowTemplate,
  createWorkflowFromTemplate,
  workflowTemplateCategories,
} from "../utils/workflow-service"
import { createError, formatErrorMessage } from "../utils/error-service"

export default function WorkflowTemplatesPage() {
  const router = useRouter()

  // 状态
  const [templates, setTemplates] = useState<any[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [error, setError] = useState<any>(null)

  // 编辑器状态
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  // 加载模板
  const loadTemplates = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getWorkflowTemplates()
      setTemplates(data)
      setFilteredTemplates(data)
    } catch (err) {
      const errorDetails = createError("api_error", "加载工作流模板失败", { details: err })
      setError(errorDetails)
      console.error(errorDetails)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadTemplates()
  }, [])

  // 过滤模板
  useEffect(() => {
    let filtered = [...templates]

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 分类过滤
    if (categoryFilter !== "all") {
      filtered = filtered.filter((template) => template.category === categoryFilter)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, categoryFilter])

  // 创建模板
  const handleCreateTemplate = async (template: any) => {
    try {
      await createWorkflowTemplate(template)
      setIsEditorOpen(false)
      loadTemplates()
    } catch (err) {
      const errorDetails = createError("workflow_creation_failed", "创建工作流模板失败", { details: err })
      setError(errorDetails)
      console.error(errorDetails)
    }
  }

  // 更新模板
  const handleUpdateTemplate = async (template: any) => {
    if (!editingTemplate) return

    try {
      await updateWorkflowTemplate(editingTemplate.id, template)
      setIsEditorOpen(false)
      setEditingTemplate(null)
      loadTemplates()
    } catch (err) {
      const errorDetails = createError("workflow_update_failed", "更新工作流模板失败", { details: err })
      setError(errorDetails)
      console.error(errorDetails)
    }
  }

  // 删除模板
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return

    try {
      await deleteWorkflowTemplate(templateToDelete)
      setIsDeleteDialogOpen(false)
      setTemplateToDelete(null)
      loadTemplates()
    } catch (err) {
      const errorDetails = createError("workflow_deletion_failed", "删除工作流模板失败", { details: err })
      setError(errorDetails)
      console.error(errorDetails)
    }
  }

  // 收藏/取消收藏模板
  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await unfavoriteWorkflowTemplate(id)
      } else {
        await favoriteWorkflowTemplate(id)
      }
      loadTemplates()
    } catch (err) {
      const errorDetails = createError("api_error", "更新收藏状态失败", { details: err })
      setError(errorDetails)
      console.error(errorDetails)
    }
  }

  // 使用模板创建工作流
  const handleUseTemplate = async (id: string) => {
    try {
      await createWorkflowFromTemplate(id)
      router.push("/workflow")
    } catch (err) {
      const errorDetails = createError("workflow_creation_failed", "从模板创建工作流失败", { details: err })
      setError(errorDetails)
      console.error(errorDetails)
    }
  }

  return (
    <PageBackground image="/images/bg-wave-purple.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">工作流模板库</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">浏览、创建和管理工作流模板</p>
              </div>
              <Button
                onClick={() => {
                  setEditingTemplate(null)
                  setIsEditorOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                创建模板
              </Button>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{formatErrorMessage(error)}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="搜索模板..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                <Button
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                >
                  全部
                </Button>
                {workflowTemplateCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  所有模板{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredTemplates.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  收藏模板{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredTemplates.filter((t) => t.isFavorite).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="custom">
                  自定义模板{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredTemplates.filter((t) => t.isCustom).length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <TemplateGrid
                  templates={filteredTemplates}
                  isLoading={isLoading}
                  onEdit={(template) => {
                    setEditingTemplate(template)
                    setIsEditorOpen(true)
                  }}
                  onDelete={(id) => {
                    setTemplateToDelete(id)
                    setIsDeleteDialogOpen(true)
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onUseTemplate={handleUseTemplate}
                />
              </TabsContent>

              <TabsContent value="favorites">
                <TemplateGrid
                  templates={filteredTemplates.filter((t) => t.isFavorite)}
                  isLoading={isLoading}
                  onEdit={(template) => {
                    setEditingTemplate(template)
                    setIsEditorOpen(true)
                  }}
                  onDelete={(id) => {
                    setTemplateToDelete(id)
                    setIsDeleteDialogOpen(true)
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onUseTemplate={handleUseTemplate}
                />
              </TabsContent>

              <TabsContent value="custom">
                <TemplateGrid
                  templates={filteredTemplates.filter((t) => t.isCustom)}
                  isLoading={isLoading}
                  onEdit={(template) => {
                    setEditingTemplate(template)
                    setIsEditorOpen(true)
                  }}
                  onDelete={(id) => {
                    setTemplateToDelete(id)
                    setIsDeleteDialogOpen(true)
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onUseTemplate={handleUseTemplate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* 模板编辑器对话框 */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "编辑模板" : "创建模板"}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? "修改工作流模板的信息和配置" : "创建新的工作流模板以便重复使用"}
            </DialogDescription>
          </DialogHeader>

          <TemplateEditor
            template={editingTemplate}
            onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
            onCancel={() => {
              setIsEditorOpen(false)
              setEditingTemplate(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除此模板吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageBackground>
  )
}

// 模板网格组件
interface TemplateGridProps {
  templates: any[]
  isLoading: boolean
  onEdit: (template: any) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
  onUseTemplate: (id: string) => void
}

function TemplateGrid({ templates, isLoading, onEdit, onDelete, onToggleFavorite, onUseTemplate }: TemplateGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-lg">
        <p className="text-gray-500 mb-4">暂无模板</p>
        <Button variant="outline">创建模板</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="relative">
          <CardHeader className="pb-2">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(template.id, template.isFavorite)}>
                {template.isFavorite ? (
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ) : (
                  <StarOff className="h-5 w-5" />
                )}
              </Button>
            </div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{getCategoryName(template.category)}</Badge>
              <Badge variant="outline">{getStepCount(template.steps)}</Badge>
              <Badge variant="outline">{getTriggerTypeName(template.trigger.type)}</Badge>
              {template.isCustom && <Badge>自定义</Badge>}
            </div>
            <p className="text-sm text-gray-500 line-clamp-3">{template.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              {template.isCustom && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(template.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </>
              )}
              {!template.isCustom && (
                <Button variant="outline" size="sm" onClick={() => onEdit({ ...template, isCustom: true })}>
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              )}
            </div>
            <Button size="sm" onClick={() => onUseTemplate(template.id)}>
              <Zap className="h-4 w-4 mr-1" />
              使用
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// 模板编辑器组件
interface TemplateEditorProps {
  template: any
  onSave: (template: any) => void
  onCancel: () => void
}

function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "")
  const [description, setDescription] = useState(template?.description || "")
  const [category, setCategory] = useState(template?.category || "content")
  const [configJson, setConfigJson] = useState(template ? JSON.stringify(template, null, 2) : "{}")
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleSave = () => {
    if (!name.trim()) {
      alert("请输入模板名称")
      return
    }

    try {
      const config = JSON.parse(configJson)
      onSave({
        ...config,
        name,
        description,
        category,
        isCustom: true,
      })
    } catch (err) {
      setJsonError("JSON格式错误: " + (err as Error).message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="template-name">模板名称</Label>
        <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="输入模板名称" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-description">描述</Label>
        <Textarea
          id="template-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述模板的用途和功能"
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-category">分类</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="template-category">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {workflowTemplateCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-config">模板配置 (JSON)</Label>
        <Textarea
          id="template-config"
          value={configJson}
          onChange={(e) => {
            setConfigJson(e.target.value)
            setJsonError(null)
          }}
          placeholder="输入JSON格式的模板配置"
          className="min-h-[300px] font-mono text-sm"
        />
        {jsonError && <p className="text-sm text-red-500">{jsonError}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存模板
        </Button>
      </div>
    </div>
  )
}

// 获取分类名称
function getCategoryName(categoryId: string): string {
  const category = workflowTemplateCategories.find((c) => c.id === categoryId)
  return category ? category.name : categoryId
}

// 获取步骤数量文本
function getStepCount(steps: any[]): string {
  return `${steps.length} 个步骤`
}

// 获取触发器类型名称
function getTriggerTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    schedule: "定时触发",
    event: "事件触发",
    manual: "手动触发",
    api: "API触发",
  }

  return typeNames[type] || type
}
