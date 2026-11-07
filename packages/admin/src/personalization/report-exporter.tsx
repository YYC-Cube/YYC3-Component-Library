"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Input } from "@yyc3/ui-enterprise/input"
import { Label } from "@yyc3/ui-enterprise/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Checkbox } from "@yyc3/ui-enterprise/checkbox"
import { RadioGroup, RadioGroupItem } from "@yyc3/ui-enterprise/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Download, FileSpreadsheet, FileIcon as FilePdf, FileJson, Mail, Calendar, Clock } from "lucide-react"

export function ReportExporter({ onExport, onClose, reportType = "sales" }) {
  const [activeTab, setActiveTab] = useState("format")
  const [exportSettings, setExportSettings] = useState({
    format: "excel",
    includeCharts: true,
    includeSummary: true,
    includeRawData: true,
    dateRange: "custom",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    schedule: "once",
    recipients: "",
    filename: `${reportType}-report-${new Date().toISOString().split("T")[0]}`,
  })

  const handleExport = () => {
    onExport && onExport(exportSettings)
    // 在实际应用中，这里会处理导出逻辑
    console.log("Exporting with settings:", exportSettings)
  }

  const updateSettings = (key, value) => {
    setExportSettings({
      ...exportSettings,
      [key]: value,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>导出报表</CardTitle>
        <CardDescription>自定义报表导出选项和格式</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format">
              <div className="flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>格式</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="data">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>数据范围</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>计划</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4 pt-4">
            <div>
              <Label>导出格式</Label>
              <RadioGroup
                value={exportSettings.format}
                onValueChange={(value) => updateSettings("format", value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem value="excel" id="excel" className="peer sr-only" />
                  <Label
                    htmlFor="excel"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <FileSpreadsheet className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Excel</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                  <Label
                    htmlFor="pdf"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <FilePdf className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">PDF</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="json" id="json" className="peer sr-only" />
                  <Label
                    htmlFor="json"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <FileJson className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">JSON</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>内容选项</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={exportSettings.includeCharts}
                    onCheckedChange={(checked) => updateSettings("includeCharts", checked)}
                  />
                  <Label htmlFor="include-charts">包含图表</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-summary"
                    checked={exportSettings.includeSummary}
                    onCheckedChange={(checked) => updateSettings("includeSummary", checked)}
                  />
                  <Label htmlFor="include-summary">包含摘要</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-raw-data"
                    checked={exportSettings.includeRawData}
                    onCheckedChange={(checked) => updateSettings("includeRawData", checked)}
                  />
                  <Label htmlFor="include-raw-data">包含原始数据</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="filename">文件名</Label>
              <Input
                id="filename"
                value={exportSettings.filename}
                onChange={(e) => updateSettings("filename", e.target.value)}
                className="mt-1"
              />
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 pt-4">
            <div>
              <Label>日期范围</Label>
              <RadioGroup
                value={exportSettings.dateRange}
                onValueChange={(value) => updateSettings("dateRange", value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="today" id="today" />
                  <Label htmlFor="today">今天</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yesterday" id="yesterday" />
                  <Label htmlFor="yesterday">昨天</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="last7days" id="last7days" />
                  <Label htmlFor="last7days">过去7天</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="thisMonth" id="thisMonth" />
                  <Label htmlFor="thisMonth">本月</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lastMonth" id="lastMonth" />
                  <Label htmlFor="lastMonth">上月</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">自定义</Label>
                </div>
              </RadioGroup>
            </div>

            {exportSettings.dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">开始日期</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={exportSettings.startDate}
                    onChange={(e) => updateSettings("startDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">结束日期</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={exportSettings.endDate}
                    onChange={(e) => updateSettings("endDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label>数据粒度</Label>
              <Select
                value={exportSettings.granularity}
                onValueChange={(value) => updateSettings("granularity", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择数据粒度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">按天</SelectItem>
                  <SelectItem value="weekly">按周</SelectItem>
                  <SelectItem value="monthly">按月</SelectItem>
                  <SelectItem value="quarterly">按季度</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 pt-4">
            <div>
              <Label>导出计划</Label>
              <RadioGroup
                value={exportSettings.schedule}
                onValueChange={(value) => updateSettings("schedule", value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="once" id="once" />
                  <Label htmlFor="once">立即导出一次</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="schedule-daily" />
                  <Label htmlFor="schedule-daily">每日导出</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="schedule-weekly" />
                  <Label htmlFor="schedule-weekly">每周导出</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="schedule-monthly" />
                  <Label htmlFor="schedule-monthly">每月导出</Label>
                </div>
              </RadioGroup>
            </div>

            {exportSettings.schedule !== "once" && (
              <div>
                <Label htmlFor="recipients">收件人邮箱</Label>
                <div className="flex items-center mt-1">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipients"
                    placeholder="输入邮箱地址，多个邮箱用逗号分隔"
                    value={exportSettings.recipients}
                    onChange={(e) => updateSettings("recipients", e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">报表将自动发送到指定邮箱</p>
              </div>
            )}

            {exportSettings.schedule !== "once" && (
              <div>
                <Label>高级选项</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="attach-file"
                      checked={exportSettings.attachFile}
                      onCheckedChange={(checked) => updateSettings("attachFile", checked)}
                    />
                    <Label htmlFor="attach-file">附加文件</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-summary-email"
                      checked={exportSettings.includeSummaryEmail}
                      onCheckedChange={(checked) => updateSettings("includeSummaryEmail", checked)}
                    />
                    <Label htmlFor="include-summary-email">在邮件中包含摘要</Label>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出报表
        </Button>
      </CardFooter>
    </Card>
  )
}
