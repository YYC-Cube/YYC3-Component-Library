"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Label } from "@yyc3/ui-enterprise/label"
import { Textarea } from "@yyc3/ui-enterprise/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Switch } from "@yyc3/ui-enterprise/switch"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import {
  Globe,
  Languages,
  Clock,
  Calendar,
  DollarSign,
  Hash,
  Download,
  Upload,
  Save,
  Settings,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileText,
  Database,
} from "lucide-react"

// 支持的语言列表
const supportedLanguages = [
  { code: "zh-CN", name: "简体中文", nativeName: "简体中文", flag: "🇨🇳", rtl: false },
  { code: "zh-TW", name: "繁体中文", nativeName: "繁體中文", flag: "🇹🇼", rtl: false },
  { code: "en-US", name: "English (US)", nativeName: "English", flag: "🇺🇸", rtl: false },
  { code: "en-GB", name: "English (UK)", nativeName: "English", flag: "🇬🇧", rtl: false },
  { code: "ja-JP", name: "日本語", nativeName: "日本語", flag: "🇯🇵", rtl: false },
  { code: "ko-KR", name: "한국어", nativeName: "한국어", flag: "🇰🇷", rtl: false },
  { code: "fr-FR", name: "Français", nativeName: "Français", flag: "🇫🇷", rtl: false },
  { code: "de-DE", name: "Deutsch", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
  { code: "es-ES", name: "Español", nativeName: "Español", flag: "🇪🇸", rtl: false },
  { code: "it-IT", name: "Italiano", nativeName: "Italiano", flag: "🇮🇹", rtl: false },
  { code: "pt-BR", name: "Português (Brasil)", nativeName: "Português", flag: "🇧🇷", rtl: false },
  { code: "ar-SA", name: "العربية", nativeName: "العربية", flag: "🇸🇦", rtl: true },
]

// 时区选项
const timezoneOptions = [
  { value: "Asia/Shanghai", label: "中国标准时间 (UTC+8)", offset: "+08:00" },
  { value: "Asia/Tokyo", label: "日本标准时间 (UTC+9)", offset: "+09:00" },
  { value: "Asia/Seoul", label: "韩国标准时间 (UTC+9)", offset: "+09:00" },
  { value: "America/New_York", label: "美国东部时间 (UTC-5)", offset: "-05:00" },
  { value: "America/Los_Angeles", label: "美国西部时间 (UTC-8)", offset: "-08:00" },
  { value: "Europe/London", label: "英国时间 (UTC+0)", offset: "+00:00" },
  { value: "Europe/Paris", label: "欧洲中部时间 (UTC+1)", offset: "+01:00" },
  { value: "Europe/Berlin", label: "德国时间 (UTC+1)", offset: "+01:00" },
  { value: "Australia/Sydney", label: "澳大利亚东部时间 (UTC+10)", offset: "+10:00" },
  { value: "Pacific/Auckland", label: "新西兰时间 (UTC+12)", offset: "+12:00" },
  { value: "Asia/Dubai", label: "阿联酋时间 (UTC+4)", offset: "+04:00" },
  { value: "Asia/Singapore", label: "新加坡时间 (UTC+8)", offset: "+08:00" },
  { value: "UTC", label: "协调世界时 (UTC+0)", offset: "+00:00" },
]

// 日期格式选项
const dateFormatOptions = [
  { value: "YYYY-MM-DD", label: "2024-01-15 (ISO格式)", example: "2024-01-15" },
  { value: "YYYY年MM月DD日", label: "2024年01月15日 (中文)", example: "2024年01月15日" },
  { value: "MM/DD/YYYY", label: "01/15/2024 (美式)", example: "01/15/2024" },
  { value: "DD/MM/YYYY", label: "15/01/2024 (欧式)", example: "15/01/2024" },
  { value: "DD.MM.YYYY", label: "15.01.2024 (德式)", example: "15.01.2024" },
  { value: "DD-MM-YYYY", label: "15-01-2024 (英式)", example: "15-01-2024" },
  { value: "MMM DD, YYYY", label: "Jan 15, 2024 (英文月份)", example: "Jan 15, 2024" },
  { value: "DD MMM YYYY", label: "15 Jan 2024 (英文简写)", example: "15 Jan 2024" },
]

// 时间格式选项
const timeFormatOptions = [
  { value: "HH:mm:ss", label: "24小时制 (带秒)", example: "14:30:45" },
  { value: "HH:mm", label: "24小时制 (不带秒)", example: "14:30" },
  { value: "hh:mm:ss A", label: "12小时制 (带秒)", example: "02:30:45 PM" },
  { value: "hh:mm A", label: "12小时制 (不带秒)", example: "02:30 PM" },
]

// 货币选项
const currencyOptions = [
  { code: "CNY", symbol: "¥", name: "人民币" },
  { code: "USD", symbol: "$", name: "美元" },
  { code: "EUR", symbol: "€", name: "欧元" },
  { code: "JPY", symbol: "¥", name: "日元" },
  { code: "KRW", symbol: "₩", name: "韩元" },
  { code: "GBP", symbol: "£", name: "英镑" },
  { code: "AUD", symbol: "A$", name: "澳元" },
  { code: "CAD", symbol: "C$", name: "加元" },
  { code: "CHF", symbol: "CHF", name: "瑞士法郎" },
  { code: "HKD", symbol: "HK$", name: "港币" },
  { code: "SGD", symbol: "S$", name: "新加坡元" },
]

// 数字分隔符选项
const separatorOptions = [
  { decimal: ".", thousand: ",", label: "1,234.56 (英美式)" },
  { decimal: ",", thousand: ".", label: "1.234,56 (欧式)" },
  { decimal: ".", thousand: " ", label: "1 234.56 (法式)" },
  { decimal: ".", thousand: "", label: "1234.56 (无分隔符)" },
]

// 示例翻译数据
const sampleTranslations: Record<string, Record<string, string>> = {
  "zh-CN": {
    "app.title": "客户服务中心",
    "app.welcome": "欢迎使用我们的系统",
    "nav.dashboard": "仪表板",
    "nav.customers": "客户管理",
    "nav.tasks": "任务管理",
    "nav.settings": "系统设置",
    "button.save": "保存",
    "button.cancel": "取消",
    "button.submit": "提交",
    "message.success": "操作成功",
    "message.error": "操作失败",
    "form.required": "此字段为必填项",
  },
  "en-US": {
    "app.title": "Customer Service Center",
    "app.welcome": "Welcome to our system",
    "nav.dashboard": "Dashboard",
    "nav.customers": "Customer Management",
    "nav.tasks": "Task Management",
    "nav.settings": "System Settings",
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.submit": "Submit",
    "message.success": "Operation successful",
    "message.error": "Operation failed",
    "form.required": "This field is required",
  },
  "ja-JP": {
    "app.title": "カスタマーサービスセンター",
    "app.welcome": "システムへようこそ",
    "nav.dashboard": "ダッシュボード",
    "nav.customers": "顧客管理",
    "nav.tasks": "タスク管理",
    "nav.settings": "システム設定",
    "button.save": "保存",
    "button.cancel": "キャンセル",
    "button.submit": "送信",
    "message.success": "操作が成功しました",
    "message.error": "操作が失敗しました",
    "form.required": "この項目は必須です",
  },
}

export function InternationalizationManager() {
  // 翻译编辑状态
  const [translationValues, setTranslationValues] = useState<Record<string, Record<string, string>>>({})

  // 本地化配置状态
  const [localizationConfig, setLocalizationConfig] = useState({
    timezone: "Asia/Shanghai",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "HH:mm:ss",
    currency: "CNY",
    decimalSeparator: ".",
    thousandSeparator: ",",
    firstDayOfWeek: 1, // 1 = Monday, 0 = Sunday
    rtlSupport: false,
  })

  // 导出设置状态
  const [exportLanguage, setExportLanguage] = useState("zh-CN")
  const [exportFormat, setExportFormat] = useState("json")

  // 导入设置状态
  const [importLanguage, setImportLanguage] = useState("zh-CN")
  const [importMode, setImportMode] = useState("merge")

  // 其他状态
  const [selectedLanguage, setSelectedLanguage] = useState("zh-CN")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isAutoTranslateEnabled, setIsAutoTranslateEnabled] = useState(false)
  const [isRTLEnabled, setIsRTLEnabled] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 获取翻译值（优先使用编辑状态）
  const getTranslationValue = (language: string, key: string): string => {
    return (
      translationValues[language]?.[key] || sampleTranslations[language as keyof typeof sampleTranslations]?.[key] || ""
    )
  }

  // 更新翻译值
  const updateTranslationValue = (language: string, key: string, value: string) => {
    setTranslationValues((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [key]: value,
      },
    }))
  }

  // 保存翻译
  const saveTranslation = async () => {
    setIsSaving(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("保存翻译:", translationValues)
      // 这里应该调用实际的API
    } catch (error) {
      console.error("保存翻译失败:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // 保存本地化设置
  const saveLocalizationSettings = async () => {
    setIsSaving(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("保存本地化设置:", localizationConfig)
      // 这里应该调用实际的API
    } catch (error) {
      console.error("保存本地化设置失败:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // 格式化时间显示
  const formatTime = (date: Date, timezone: string, format: string): string => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour12: format.includes("A"),
        hour: "2-digit",
        minute: "2-digit",
        ...(format.includes("ss") && { second: "2-digit" }),
      }
      return new Intl.DateTimeFormat("en-US", options).format(date)
    } catch {
      return date.toLocaleTimeString()
    }
  }

  // 格式化日期显示
  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`
      case "YYYY年MM月DD日":
        return `${year}年${month}月${day}日`
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`
      case "DD.MM.YYYY":
        return `${day}.${month}.${year}`
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`
      default:
        return date.toLocaleDateString()
    }
  }

  // 格式化数字显示
  const formatNumber = (num: number, decimal: string, thousand: string): string => {
    const parts = num.toFixed(2).split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
    return parts.join(decimal)
  }

  // 格式化货币显示
  const formatCurrency = (amount: number, currencyCode: string, decimal: string, thousand: string): string => {
    const currency = currencyOptions.find((c) => c.code === currencyCode)
    const formattedAmount = formatNumber(amount, decimal, thousand)
    return `${currency?.symbol || ""}${formattedAmount}`
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">国际化管理</h1>
          <p className="text-muted-foreground">管理多语言翻译和本地化设置</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Globe className="w-3 h-3" />
            <span>{supportedLanguages.length} 种语言</span>
          </Badge>
          <Button onClick={saveTranslation} disabled={isSaving}>
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            保存设置
          </Button>
        </div>
      </div>

      <Tabs defaultValue="translations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translations" className="flex items-center space-x-2">
            <Languages className="w-4 h-4" />
            <span>翻译管理</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>本地化设置</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>预览效果</span>
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>导入导出</span>
          </TabsTrigger>
        </TabsList>

        {/* 翻译管理 */}
        <TabsContent value="translations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 语言选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="w-5 h-5" />
                  <span>选择语言</span>
                </CardTitle>
                <CardDescription>选择要编辑的语言</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                        selectedLanguage === lang.code
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{lang.flag}</span>
                          <div>
                            <div className="font-medium">{lang.nativeName}</div>
                            <div className="text-sm text-gray-500">{lang.name}</div>
                          </div>
                        </div>
                        {lang.rtl && (
                          <Badge variant="secondary" className="text-xs">
                            RTL
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 翻译编辑 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>翻译内容</span>
                </CardTitle>
                <CardDescription>
                  编辑 {supportedLanguages.find((l) => l.code === selectedLanguage)?.nativeName} 的翻译内容
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {Object.keys(sampleTranslations["zh-CN"]).map((key) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`translation-${key}`} className="text-sm font-medium text-gray-700">
                          {key}
                        </Label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            原文: {sampleTranslations["zh-CN"][key]}
                          </div>
                          <Textarea
                            id={`translation-${key}`}
                            value={getTranslationValue(selectedLanguage, key)}
                            onChange={(e) => updateTranslationValue(selectedLanguage, key, e.target.value)}
                            placeholder={`输入 ${supportedLanguages.find((l) => l.code === selectedLanguage)?.nativeName} 翻译`}
                            className="min-h-[60px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 本地化设置 */}
        <TabsContent value="localization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 时间和日期设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>时间设置</span>
                </CardTitle>
                <CardDescription>配置时区和时间格式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">时区</Label>
                  <Select
                    value={localizationConfig.timezone}
                    onValueChange={(value) => setLocalizationConfig((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezoneOptions.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">日期格式</Label>
                  <Select
                    value={localizationConfig.dateFormat}
                    onValueChange={(value) => setLocalizationConfig((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormatOptions.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-format">时间格式</Label>
                  <Select
                    value={localizationConfig.timeFormat}
                    onValueChange={(value) => setLocalizationConfig((prev) => ({ ...prev, timeFormat: value }))}
                  >
                    <SelectTrigger id="time-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFormatOptions.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 货币和数字设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>货币设置</span>
                </CardTitle>
                <CardDescription>配置货币和数字格式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">默认货币</Label>
                  <Select
                    value={localizationConfig.currency}
                    onValueChange={(value) => setLocalizationConfig((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimal-separator">小数分隔符</Label>
                  <Select
                    value={localizationConfig.decimalSeparator}
                    onValueChange={(value) => setLocalizationConfig((prev) => ({ ...prev, decimalSeparator: value }))}
                  >
                    <SelectTrigger id="decimal-separator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=".">点号 (.)</SelectItem>
                      <SelectItem value=",">逗号 (,)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thousand-separator">千位分隔符</Label>
                  <Select
                    value={localizationConfig.thousandSeparator}
                    onValueChange={(value) => setLocalizationConfig((prev) => ({ ...prev, thousandSeparator: value }))}
                  >
                    <SelectTrigger id="thousand-separator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">逗号 (,)</SelectItem>
                      <SelectItem value=".">点号 (.)</SelectItem>
                      <SelectItem value=" ">空格 ( )</SelectItem>
                      <SelectItem value="">无分隔符</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 其他设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>其他设置</span>
                </CardTitle>
                <CardDescription>配置其他本地化选项</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>RTL文本支持</Label>
                    <p className="text-sm text-muted-foreground">支持从右到左的文本方向</p>
                  </div>
                  <Switch checked={isRTLEnabled} onCheckedChange={setIsRTLEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动翻译</Label>
                    <p className="text-sm text-muted-foreground">启用AI自动翻译功能</p>
                  </div>
                  <Switch checked={isAutoTranslateEnabled} onCheckedChange={setIsAutoTranslateEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first-day">一周开始日</Label>
                  <Select
                    value={localizationConfig.firstDayOfWeek.toString()}
                    onValueChange={(value) =>
                      setLocalizationConfig((prev) => ({ ...prev, firstDayOfWeek: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger id="first-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">星期日</SelectItem>
                      <SelectItem value="1">星期一</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={saveLocalizationSettings} className="w-full" disabled={isSaving}>
                  {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  保存本地化设置
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 预览效果 */}
        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 实时预览 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">实时预览</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-blue-700">
                      <Clock className="w-4 h-4" />
                      <span>时间显示</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-mono text-blue-800">
                      {formatTime(currentTime, localizationConfig.timezone, localizationConfig.timeFormat)}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      {timezoneOptions.find((tz) => tz.value === localizationConfig.timezone)?.label}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <Calendar className="w-4 h-4" />
                      <span>日期显示</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-green-800">
                      {formatDate(currentTime, localizationConfig.dateFormat)}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      {dateFormatOptions.find((df) => df.value === localizationConfig.dateFormat)?.label}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-purple-700">
                      <Hash className="w-4 h-4" />
                      <span>数字格式</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-purple-800">
                      {formatNumber(
                        1234567.89,
                        localizationConfig.decimalSeparator,
                        localizationConfig.thousandSeparator,
                      )}
                    </div>
                    <div className="text-sm text-purple-600 mt-1">示例数字格式化</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-orange-700">
                      <DollarSign className="w-4 h-4" />
                      <span>货币格式</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-orange-800">
                      {formatCurrency(
                        1234.56,
                        localizationConfig.currency,
                        localizationConfig.decimalSeparator,
                        localizationConfig.thousandSeparator,
                      )}
                    </div>
                    <div className="text-sm text-orange-600 mt-1">
                      {currencyOptions.find((c) => c.code === localizationConfig.currency)?.name}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 多语言预览 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">多语言预览</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {supportedLanguages.map((lang) => (
                    <Card key={lang.code} className={`${lang.rtl ? "text-right" : "text-left"}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </div>
                          {lang.rtl && (
                            <Badge variant="outline" className="text-xs">
                              RTL
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>标题:</strong> {getTranslationValue(lang.code, "app.title")}
                        </div>
                        <div className="text-sm">
                          <strong>欢迎:</strong> {getTranslationValue(lang.code, "app.welcome")}
                        </div>
                        <div className="text-sm">
                          <strong>按钮:</strong> {getTranslationValue(lang.code, "button.save")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        {/* 导入导出 */}
        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 导出设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>导出翻译</span>
                </CardTitle>
                <CardDescription>将翻译内容导出为文件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-language">选择语言</Label>
                  <Select value={exportLanguage} onValueChange={setExportLanguage}>
                    <SelectTrigger id="export-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有语言</SelectItem>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.nativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-format">导出格式</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger id="export-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON 格式</SelectItem>
                      <SelectItem value="csv">CSV 格式</SelectItem>
                      <SelectItem value="xlsx">Excel 格式</SelectItem>
                      <SelectItem value="xml">XML 格式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-empty" className="rounded border-gray-300" />
                  <Label htmlFor="include-empty" className="text-sm">
                    包含空翻译项
                  </Label>
                </div>

                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  导出翻译文件
                </Button>
              </CardContent>
            </Card>

            {/* 导入设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>导入翻译</span>
                </CardTitle>
                <CardDescription>从文件导入翻译内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="import-language">目标语言</Label>
                  <Select value={importLanguage} onValueChange={setImportLanguage}>
                    <SelectTrigger id="import-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.nativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="import-mode">导入模式</Label>
                  <Select value={importMode} onValueChange={setImportMode}>
                    <SelectTrigger id="import-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merge">合并模式（保留现有翻译）</SelectItem>
                      <SelectItem value="overwrite">覆盖模式（替换所有翻译）</SelectItem>
                      <SelectItem value="append">追加模式（只添加新翻译）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="validate-format" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="validate-format" className="text-sm">
                    导入前验证格式
                  </Label>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">拖拽文件到此处或点击选择文件</p>
                  <p className="text-xs text-gray-500">支持 JSON, CSV, Excel, XML 格式</p>
                  <Button variant="outline" className="mt-3 bg-transparent">
                    选择文件
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 批量操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>批量操作</span>
              </CardTitle>
              <CardDescription>批量管理翻译内容</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                  <CheckCircle className="w-4 h-4" />
                  <span>批量验证</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                  <AlertCircle className="w-4 h-4" />
                  <span>查找缺失</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                  <RefreshCw className="w-4 h-4" />
                  <span>自动翻译</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
