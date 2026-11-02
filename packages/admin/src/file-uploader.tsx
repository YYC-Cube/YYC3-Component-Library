/**
 * @file 文件上传组件
 * @description 提供文件的上传、预览、管理功能，支持拖拽上传、文件校验和进度显示
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Badge } from "@yyc3/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@yyc3/ui/tooltip"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Upload, File, FileText, Image, Video, FileQuestion, Trash2, Download, Eye, Search, Plus, Filter, X, ChevronDown, Clock, AlertCircle, CheckCircle, Settings, FolderPlus, FolderOpen, Share2, Archive, Info } from "lucide-react"

// 模拟数据 - 已上传文件列表
const uploadedFiles = [
  {
    id: "file1",
    name: "项目计划书.pdf",
    type: "pdf",
    size: 2560000, // 2.5MB
    uploadTime: "2024-10-10 09:30:15",
    uploader: "张三",
    department: "销售部",
    status: "completed",
    downloadCount: 28,
    previewUrl: "https://picsum.photos/id/20/400/225",
    category: "文档",
    tags: ["项目", "计划", "重要"]
  },
  {
    id: "file2",
    name: "产品设计稿.fig",
    type: "fig",
    size: 15600000, // 15.6MB
    uploadTime: "2024-10-09 14:20:30",
    uploader: "李四",
    department: "研发部",
    status: "completed",
    downloadCount: 15,
    previewUrl: null,
    category: "设计",
    tags: ["设计", "产品"]
  },
  {
    id: "file3",
    name: "营销活动照片.jpg",
    type: "jpg",
    size: 3200000, // 3.2MB
    uploadTime: "2024-10-08 16:45:20",
    uploader: "王五",
    department: "市场部",
    status: "completed",
    downloadCount: 42,
    previewUrl: "https://picsum.photos/id/26/400/300",
    category: "图片",
    tags: ["营销", "活动", "照片"]
  },
  {
    id: "file4",
    name: "季度财务报表.xlsx",
    type: "xlsx",
    size: 850000, // 850KB
    uploadTime: "2024-10-07 11:10:55",
    uploader: "赵六",
    department: "财务部",
    status: "completed",
    downloadCount: 36,
    previewUrl: null,
    category: "报表",
    tags: ["财务", "报表", "季度"]
  },
  {
    id: "file5",
    name: "产品演示视频.mp4",
    type: "mp4",
    size: 56000000, // 56MB
    uploadTime: "2024-10-06 10:05:12",
    uploader: "孙七",
    department: "产品部",
    status: "completed",
    downloadCount: 58,
    previewUrl: "https://picsum.photos/id/96/400/225",
    category: "视频",
    tags: ["产品", "演示", "视频"]
  }
]

// 模拟数据 - 上传统计
const uploadStats = [
  { month: "1月", count: 45, size: 230 },
  { month: "2月", count: 52, size: 280 },
  { month: "3月", count: 49, size: 250 },
  { month: "4月", count: 63, size: 320 },
  { month: "5月", count: 71, size: 380 },
  { month: "6月", count: 68, size: 350 },
  { month: "7月", count: 75, size: 420 },
  { month: "8月", count: 82, size: 460 },
  { month: "9月", count: 79, size: 440 },
  { month: "10月", count: 85, size: 490 }
]

// 文件类型图标映射
const fileTypeIcons: { [key: string]: React.ReactNode } = {
  pdf: <FileText className="h-8 w-8 text-red-500" />,
  doc: <FileText className="h-8 w-8 text-blue-500" />,
  docx: <FileText className="h-8 w-8 text-blue-500" />,
  xls: <FileText className="h-8 w-8 text-green-500" />,
  xlsx: <FileText className="h-8 w-8 text-green-500" />,
  ppt: <FileText className="h-8 w-8 text-orange-500" />,
  pptx: <FileText className="h-8 w-8 text-orange-500" />,
  jpg: <Image className="h-8 w-8 text-purple-500" />,
  jpeg: <Image className="h-8 w-8 text-purple-500" />,
  png: <Image className="h-8 w-8 text-purple-500" />,
  gif: <Image className="h-8 w-8 text-purple-500" />,
  mp4: <Video className="h-8 w-8 text-pink-500" />,
  avi: <Video className="h-8 w-8 text-pink-500" />,
  mov: <Video className="h-8 w-8 text-pink-500" />,
  zip: <File className="h-8 w-8 text-yellow-500" />,
  rar: <File className="h-8 w-8 text-yellow-500" />,
  7z: <File className="h-8 w-8 text-yellow-500" />,
  default: <FileQuestion className="h-8 w-8 text-gray-500" />
}

// 文件分类选项
const fileCategories = [
  { value: "all", label: "全部分类" },
  { value: "文档", label: "文档" },
  { value: "图片", label: "图片" },
  { value: "视频", label: "视频" },
  { value: "设计", label: "设计" },
  { value: "报表", label: "报表" },
  { value: "其他", label: "其他" }
]

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function FileUploader() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [files, setFiles] = useState(uploadedFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // 过滤文件列表
  const filteredFiles = files.filter(
    file => (
      searchTerm === "" || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (categoryFilter === "all" || file.category === categoryFilter)
  )

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startUploadSimulation()
    }
  }

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("bg-blue-50", "border-blue-200")
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("bg-blue-50", "border-blue-200")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("bg-blue-50", "border-blue-200")
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      startUploadSimulation()
    }
  }

  // 模拟文件上传过程
  const startUploadSimulation = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            // 模拟上传完成后的操作
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  // 处理文件预览
  const handlePreviewFile = (file: any) => {
    setSelectedFile(file)
    setIsPreviewDialogOpen(true)
  }

  // 处理文件下载
  const handleDownloadFile = (file: any) => {
    console.log("下载文件:", file.name)
  }

  // 处理文件删除
  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  // 打开文件选择器
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 获取文件图标
  const getFileIcon = (type: string) => {
    return fileTypeIcons[type.toLowerCase()] || fileTypeIcons.default
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              文件管理
            </CardTitle>
            <CardDescription>
              上传、管理和分享各类文件资料
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="upload">上传文件</TabsTrigger>
                <TabsTrigger value="manage">文件管理</TabsTrigger>
                <TabsTrigger value="statistics">上传统计</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "upload" && (
          <div className="space-y-6">
            {/* 拖拽上传区域 */}
            <div
              ref={dropZoneRef}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:bg-gray-50"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
              <Upload className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-medium mb-2">拖拽文件到此处或点击上传>
              <p className="text-sm text-gray-500 mb-4">
                支持 PDF、Word、Excel、图片、视频等格式，单个文件最大500MB
              </p>
              <Button onClick={(e) => {
                e.stopPropagation()
                openFilePicker()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                选择文件
              </Button>
            </div

            {/* 上传设置 */}
            <Card variant="outline">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    上传设置
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsDialogOpen(true)}
                  >
                    更多设置
                  </Button>
                </div
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">文件分类</label>
                    <Select defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileCategories.filter(c => c.value !== "all").map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">存储位置>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue placeholder="选择存储位置" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">默认存储库</SelectItem>
                        <SelectItem value="team">团队共享空间</SelectItem>
                        <SelectItem value="private">私人存储空间</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">访问权限</label>
                    <Select defaultValue="team">
                      <SelectTrigger>
                        <SelectValue placeholder="选择访问权限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">公开</SelectItem>
                        <SelectItem value="team">团队可见>
                        <SelectItem value="private">仅自己可见</SelectItem>
                        <SelectItem value="custom">自定义权限</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card

            {/* 上传进度 */}
            {isUploading && (
              <Card variant="outline">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    上传进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">正在上传文件...</span>
                        <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        /<div
                      </div
                    </div
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        取消上传
                      </Button>
                    </div
                  </div
                </CardContent
              </Card
            )}
          </div
        )}

        {activeTab === "manage" && (
          <div className="space-y-4">
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索文件..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="文件分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select
                <Button variant="ghost">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  新建文件夹
                </Button>
                <Button variant="ghost">
                  <Download className="mr-2 h-4 w-4" />
                  批量下载
                </Button>
              </div>
            </div

            {/* 文件列表 */}
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <FileQuestion className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">暂无文件</h3>
                <p className="text-sm text-gray-500">
                  {searchTerm || categoryFilter !== "all" 
                    ? "没有找到符合条件的文件，请尝试调整筛选条件"
                    : "点击上传按钮开始添加文件"
                  }
                </p>
              </div
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2 px-4 pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <CardTitle className="text-sm font-medium line-clamp-1 w-[150px]">
                              {file.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                              {formatFileSize(file.size)}
                            </CardDescription>
                          </div>
                        <div className="relative group">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                                onClick={() => handlePreviewFile(file)}
                              >
                                <Eye className="h-4 w-4" />
                                预览
                              </button
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download className="h-4 w-4" />
                                下载
                              </button
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                              >
                                <Share2 className="h-4 w-4" />
                                分享
                              </button
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                              >
                                <Archive className="h-4 w-4" />
                                归档
                              </button
                              <button
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center gap-2"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                删除
                              </button
                            </div
                          </div
                        </div
                      </div
                    </CardHeader
                    <CardContent className="px-4 pb-4 pt-0">
                      {file.previewUrl ? (
                        <div
                          className="rounded-md overflow-hidden cursor-pointer mb-3 hover:opacity-90 transition-opacity"
                          onClick={() => handlePreviewFile(file)}
                        >
                          <img
                            src={file.previewUrl}
                            alt={file.name}
                            className="w-full h-32 object-cover"
                          />
                        </div
                      ) : null}
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>上传时间:</span>
                          <span>{file.uploadTime}</span>
                        </div
                        <div className="flex justify-between">
                          <span>上传人:</span>
                          <span>{file.uploader}</span>
                        </div
                        <div className="flex justify-between">
                          <span>所属部门:</span>
                          <span>{file.department}</span>
                        </div
                        <div className="flex justify-between">
                          <span>下载次数:</span>
                          <span>{file.downloadCount}</span>
                        </div
                      </div
                      <div className="mt-3 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {file.category}
                        </Badge>
                        {file.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div
                    </CardContent
                  </Card
                ))}
              </div
            )}
          </div
        )}

        {activeTab === "statistics" && (
          <div className="space-y-6">
            {/* 上传统计概览 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">总文件数>
                  <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader
                <CardContent>
                  <div className="text-2xl font-bold">{files.length}</div>
                  <div className="text-xs text-muted-foreground">所有已上传文件总数</div>
                </CardContent
              </Card
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">总存储空间</CardTitle>
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                </CardHeader
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatFileSize(
                      files.reduce((total, file) => total + file.size, 0)
                    )}
                  </div
                  <div className="text-xs text-muted-foreground">已使用存储空间</div>
                </CardContent
              </Card
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">总下载次数</CardTitle>
                  <Download className="h-4 w-4 text-green-500" />
                </CardHeader
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {files.reduce((total, file) => total + file.downloadCount, 0)}
                  </div
                  <div className="text-xs text-muted-foreground">所有文件下载次数总和</div>
                </CardContent
              </Card
            </div

            {/* 上传趋势图表 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>上传趋势分析</CardTitle>
                <CardDescription>最近10个月文件上传统计</CardDescription>
              </CardHeader
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={uploadStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="count" name="上传数量" fill="#3b82f6" />
                      <Bar dataKey="size" name="上传大小(MB)" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div
              </CardContent
            </Card

            {/* 存储空间使用建议 */}
            <Card variant="outline">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  存储空间建议
                </CardTitle>
              </CardHeader
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <span className="font-medium">存储空间充足</span>
                      <span className="ml-1">当前存储空间使用率低于30%，无需扩容。</span>
                    </div>
                  </div
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <span className="font-medium">清理建议>
                      <span className="ml-1">建议定期清理3个月前的临时文件和重复文件，以优化存储空间。</span>
                    </div>
                  </div
                </div
              </CardContent
            </Card
          </div
        )}

        {/* 文件预览对话框 */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center justify-between">
                <span>预览: {selectedFile?.name}</span>
                <Badge variant="outline">{formatFileSize(selectedFile?.size || 0)}</Badge>
              </DialogTitle>
              <DialogDescription>
                上传时间: {selectedFile?.uploadTime} | 上传人: {selectedFile?.uploader}
              </DialogDescription>
            </DialogHeader
            <div className="flex-1 overflow-auto py-4">
              {selectedFile?.previewUrl ? (
                <img
                  src={selectedFile.previewUrl}
                  alt={selectedFile.name}
                  className="w-full max-h-[500px] object-contain mx-auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  {getFileIcon(selectedFile?.type || "")}
                  <p className="mt-4 text-gray-500">此文件类型不支持在线预览</p>
                </div
              )}
            </div
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsPreviewDialogOpen(false)}
              >
                关闭
              </Button
              <Button
                onClick={() => {
                  handleDownloadFile(selectedFile)
                  setIsPreviewDialogOpen(false)
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                下载文件
              </Button
            </DialogFooter
          </DialogContent
        </Dialog

        {/* 设置对话框 */}
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                上传设置
              </DialogTitle>
              <DialogDescription>配置文件上传的高级选项
              </DialogDescription>
            </DialogHeader
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">允许上传的文件类型</label>
                <Input
                  placeholder="例如: .jpg,.png,.pdf,.docx"
                  defaultValue=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.avi,.zip,.rar"
                />
              </div
              <div className="grid gap-2">
                <label className="text-sm font-medium">最大文件大小限制 (MB)</label>
                <Input type="number" defaultValue="500" />
              </div
              <div className="grid gap-2">
                <label className="text-sm font-medium">自动生成缩略图</label>
                <Select defaultValue="true">
                  <SelectTrigger>
                    <SelectValue placeholder="选择是否自动生成" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectContent>
                </Select>
              </div
              <div className="grid gap-2">
                <label className="text-sm font-medium">默认存储位置</label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="选择默认存储位置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">默认存储库</SelectItem>
                    <SelectItem value="team">团队共享空间</SelectItem>
                    <SelectItem value="private">私人存储空间</SelectItem>
                  </SelectContent>
                </Select>
              </div
            </div
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                取消
              </Button
              <Button onClick={() => setIsSettingsDialogOpen(false)}>
                保存设置
              </Button
            </DialogFooter
          </DialogContent
        </Dialog
      </CardContent
    </Card
  )
}