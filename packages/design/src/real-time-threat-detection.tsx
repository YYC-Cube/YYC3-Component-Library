"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Progress } from "@yyc3/ui-enterprise/progress"
import { Alert, AlertDescription } from "@yyc3/ui-enterprise/alert"
import {
  Shield,
  AlertTriangle,
  Eye,
  Activity,
  Lock,
  Unlock,
  Zap,
  Globe,
  Bug,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Clock,
  MapPin,
  FileX,
  Key,
  Skull,
} from "lucide-react"

interface ThreatEvent {
  id: string
  type: "malware" | "intrusion" | "ddos" | "phishing" | "bruteforce" | "injection"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  timestamp: Date
  status: "detected" | "blocked" | "investigating" | "resolved"
  description: string
  location: string
  userAgent?: string
  attempts?: number
}

interface SecurityMetric {
  name: string
  value: number
  trend: "up" | "down" | "stable"
  status: "safe" | "warning" | "danger"
  description: string
}

interface VulnerabilityReport {
  id: string
  component: string
  severity: "low" | "medium" | "high" | "critical"
  cve: string
  description: string
  solution: string
  discovered: Date
  patched: boolean
}

export function RealTimeThreatDetection() {
  const [threats, setThreats] = useState<ThreatEvent[]>([
    {
      id: "1",
      type: "bruteforce",
      severity: "high",
      source: "203.0.113.45",
      target: "/api/auth/login",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: "blocked",
      description: "检测到暴力破解登录尝试",
      location: "北京, 中国",
      attempts: 15,
    },
    {
      id: "2",
      type: "injection",
      severity: "critical",
      source: "198.51.100.23",
      target: "/api/users/search",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "blocked",
      description: "SQL注入攻击尝试",
      location: "未知",
      userAgent: "Mozilla/5.0 (compatible; scanner/1.0)",
    },
    {
      id: "3",
      type: "ddos",
      severity: "medium",
      source: "多个IP",
      target: "/",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: "investigating",
      description: "检测到异常流量模式",
      location: "全球",
      attempts: 1250,
    },
  ])

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      name: "威胁检测率",
      value: 98.5,
      trend: "up",
      status: "safe",
      description: "成功检测并阻止的威胁比例",
    },
    {
      name: "响应时间",
      value: 0.3,
      trend: "down",
      status: "safe",
      description: "威胁检测到阻止的平均时间(秒)",
    },
    {
      name: "误报率",
      value: 2.1,
      trend: "down",
      status: "safe",
      description: "误判为威胁的正常请求比例",
    },
    {
      name: "系统负载",
      value: 45.2,
      trend: "stable",
      status: "safe",
      description: "安全监控系统的CPU使用率",
    },
  ])

  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityReport[]>([
    {
      id: "1",
      component: "React",
      severity: "medium",
      cve: "CVE-2023-1234",
      description: "React组件中的XSS漏洞",
      solution: "升级到React 18.2.1或更高版本",
      discovered: new Date(Date.now() - 24 * 60 * 60 * 1000),
      patched: true,
    },
    {
      id: "2",
      component: "Node.js",
      severity: "high",
      cve: "CVE-2023-5678",
      description: "HTTP请求走私漏洞",
      solution: "升级到Node.js 18.18.0或更高版本",
      discovered: new Date(Date.now() - 48 * 60 * 60 * 1000),
      patched: false,
    },
  ])

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [autoBlock, setAutoBlock] = useState(true)
  const [alertLevel, setAlertLevel] = useState<"low" | "medium" | "high">("medium")

  // 模拟实时威胁检测
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // 随机生成新的威胁事件
      if (Math.random() < 0.1) {
        // 10%概率生成新威胁
        const newThreat: ThreatEvent = {
          id: Date.now().toString(),
          type: ["malware", "intrusion", "ddos", "phishing", "bruteforce", "injection"][
            Math.floor(Math.random() * 6)
          ] as any,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          target: ["/api/auth", "/api/users", "/api/data", "/admin"][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          status: autoBlock ? "blocked" : "detected",
          description: "检测到可疑活动",
          location: ["北京", "上海", "深圳", "未知"][Math.floor(Math.random() * 4)],
          attempts: Math.floor(Math.random() * 50) + 1,
        }

        setThreats((prev) => [newThreat, ...prev].slice(0, 10))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isMonitoring, autoBlock])

  const getThreatIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <Bug className="w-4 h-4" />
      case "intrusion":
        return <Unlock className="w-4 h-4" />
      case "ddos":
        return <Zap className="w-4 h-4" />
      case "phishing":
        return <FileX className="w-4 h-4" />
      case "bruteforce":
        return <Key className="w-4 h-4" />
      case "injection":
        return <Skull className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "detected":
        return "bg-blue-100 text-blue-800"
      case "blocked":
        return "bg-green-100 text-green-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-600" />
      case "down":
        return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
      case "stable":
        return <div className="w-3 h-0.5 bg-gray-400" />
      default:
        return null
    }
  }

  const handleThreatAction = (threatId: string, action: "block" | "allow" | "investigate") => {
    setThreats((prev) =>
      prev.map((threat) =>
        threat.id === threatId
          ? { ...threat, status: action === "block" ? "blocked" : action === "allow" ? "resolved" : "investigating" }
          : threat,
      ),
    )
  }

  const criticalThreats = threats.filter((t) => t.severity === "critical").length
  const highThreats = threats.filter((t) => t.severity === "high").length
  const blockedThreats = threats.filter((t) => t.status === "blocked").length

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-red-50/20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">实时威胁检测</h1>
          <p className="text-slate-600 mt-2">AI驱动的智能安全防护系统</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={isMonitoring ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            <Activity className="w-4 h-4 mr-1" />
            {isMonitoring ? "监控中" : "已停止"}
          </Badge>
          <Button variant={isMonitoring ? "destructive" : "default"} onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? "停止监控" : "开始监控"}
          </Button>
        </div>
      </div>

      {/* 威胁概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">严重威胁</p>
                <p className="text-3xl font-bold text-red-600">{criticalThreats}</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">高危威胁</p>
                <p className="text-3xl font-bold text-orange-600">{highThreats}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">已阻止</p>
                <p className="text-3xl font-bold text-green-600">{blockedThreats}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总威胁</p>
                <p className="text-3xl font-bold text-blue-600">{threats.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 安全指标 */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            安全性能指标
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {metric.name === "响应时间" ? `${metric.value}s` : `${metric.value}%`}
                  </span>
                  <Badge
                    className={
                      metric.status === "safe"
                        ? "bg-green-100 text-green-800"
                        : metric.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {metric.status === "safe" ? "正常" : metric.status === "warning" ? "警告" : "危险"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{metric.description}</p>
                <Progress value={metric.name === "响应时间" ? 100 - metric.value * 10 : metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时威胁事件 */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-red-600" />
                实时威胁事件
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-600">自动阻止</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoBlock(!autoBlock)}
                  className={autoBlock ? "bg-green-50 border-green-200" : ""}
                >
                  {autoBlock ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {threats.map((threat) => (
              <div key={threat.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${getSeverityColor(threat.severity)}`}>
                      {getThreatIcon(threat.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{threat.description}</h4>
                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {threat.source}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {threat.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {threat.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity === "low"
                        ? "低危"
                        : threat.severity === "medium"
                          ? "中危"
                          : threat.severity === "high"
                            ? "高危"
                            : "严重"}
                    </Badge>
                    <Badge className={getStatusColor(threat.status)}>
                      {threat.status === "detected"
                        ? "检测到"
                        : threat.status === "blocked"
                          ? "已阻止"
                          : threat.status === "investigating"
                            ? "调查中"
                            : "已解决"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    目标: <code className="bg-slate-100 px-1 rounded">{threat.target}</code>
                    {threat.attempts && <span className="ml-2">尝试次数: {threat.attempts}</span>}
                  </div>
                  <div className="flex space-x-2">
                    {threat.status === "detected" && (
                      <>
                        <Button size="sm" variant="destructive" onClick={() => handleThreatAction(threat.id, "block")}>
                          阻止
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleThreatAction(threat.id, "investigate")}
                        >
                          调查
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 漏洞报告 */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bug className="w-5 h-5 mr-2 text-yellow-600" />
              漏洞扫描报告
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{vuln.component}</h4>
                    <p className="text-sm text-slate-600 mt-1">{vuln.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                      <span>CVE: {vuln.cve}</span>
                      <span>发现时间: {vuln.discovered.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(vuln.severity)}>
                      {vuln.severity === "low"
                        ? "低危"
                        : vuln.severity === "medium"
                          ? "中危"
                          : vuln.severity === "high"
                            ? "高危"
                            : "严重"}
                    </Badge>
                    <Badge className={vuln.patched ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {vuln.patched ? "已修复" : "未修复"}
                    </Badge>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>解决方案:</strong> {vuln.solution}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
