"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Progress } from "@yyc3/ui/progress"
import { Alert, AlertDescription } from "@yyc3/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Mic, MicOff, Brain, Zap, Target, TrendingUp, MessageSquare, AlertTriangle } from "lucide-react"
import { voiceCommandEngine, type CommandMatch } from "@yyc3/lib"
import { nlpProcessor, type NLPResult } from "@yyc3/lib"
import { multiLanguageSpeechManager, type SpeechRecognitionResult } from "@yyc3/lib"

export interface EnhancedVoiceControlProps {
  onCommandExecuted?: (command: string, params?: any) => void
  onNLPResult?: (result: NLPResult) => void
  className?: string
}

export function EnhancedVoiceControl({ onCommandExecuted, onNLPResult, className }: EnhancedVoiceControlProps) {
  // 语音识别状态
  const [isListening, setIsListening] = useState(false)
  const [speechResults, setSpeechResults] = useState<SpeechRecognitionResult[]>([])
  const [recognitionError, setRecognitionError] = useState<string | null>(null)

  // 命令匹配状态
  const [commandMatches, setCommandMatches] = useState<CommandMatch[]>([])
  const [executedCommands, setExecutedCommands] = useState<string[]>([])
  const [nlpResults, setNlpResults] = useState<NLPResult[]>([])

  // 统计信息
  const [stats, setStats] = useState({
    totalCommands: 0,
    successfulMatches: 0,
    averageConfidence: 0,
    topIntents: [] as { intent: string; count: number }[],
  })

  // 服务实例
  const speechManager = multiLanguageSpeechManager
  const recognitionService = speechManager.getRecognitionService()

  // 初始化
  useEffect(() => {
    // 更新上下文
    voiceCommandEngine.updateContext({
      currentPage: window.location.pathname,
      recentCommands: executedCommands.slice(-5),
    })

    // 设置语音识别回调
    recognitionService.onResult(handleSpeechResult)
    recognitionService.onError(handleSpeechError)

    return () => {
      stopListening()
    }
  }, [])

  // 处理语音识别结果
  const handleSpeechResult = useCallback((result: SpeechRecognitionResult) => {
    setSpeechResults((prev) => [result, ...prev.slice(0, 9)])
    setRecognitionError(null)

    if (result.isFinal) {
      processCommand(result.transcript)
    }
  }, [])

  // 处理语音识别错误
  const handleSpeechError = useCallback((error: string) => {
    setRecognitionError(error)
    setIsListening(false)
  }, [])

  // 处理命令
  const processCommand = useCallback((text: string) => {
    // NLP 处理
    const nlpResult = nlpProcessor.process(text)
    setNlpResults((prev) => [nlpResult, ...prev.slice(0, 9)])
    onNLPResult?.(nlpResult)

    // 命令匹配
    const matches = voiceCommandEngine.matchCommand(text)
    setCommandMatches((prev) => [...matches, ...prev.slice(0, 19)])

    if (matches.length > 0) {
      const bestMatch = matches[0]
      if (bestMatch.confidence > 0.5) {
        executeCommand(bestMatch)
      } else {
        // 低置信度匹配，询问用户确认
        handleLowConfidenceMatch(bestMatch)
      }
    } else {
      handleNoMatch(text)
    }

    updateStats()
  }, [])

  // 执行命令
  const executeCommand = useCallback((match: CommandMatch) => {
    // 源件缺陷适配（Phase 7 精度抽取）：match.pattern 为 string（源代码悬空链 .description 已修正）
    const commandText = `${match.command}: ${match.originalText ?? ''}`
    setExecutedCommands((prev) => [commandText, ...prev.slice(0, 9)])

    // 语音反馈
    const feedback = generateFeedback(match)
    speechManager.speakInLanguage(feedback)

    // 执行具体命令逻辑
    onCommandExecuted?.(match.pattern.id, match.parameters)

    // 根据命令类型执行相应操作
    switch (match.pattern.id) {
      case "switch_chart_type":
        handleChartTypeSwitch(match.parameters?.chartType)
        break
      case "filter_time_period":
        handleTimeFilter(match.parameters?.timePeriod)
        break
      case "export_data":
        handleDataExport(match.parameters?.format)
        break
      case "navigate_page":
        handleNavigation(match.parameters?.page)
        break
      case "search_content":
        handleSearch(match.parameters?.query)
        break
      case "help_command":
        handleHelp()
        break
      default:
        console.log("执行命令:", match.pattern.id, match.parameters)
    }
  }, [])

  // 处理低置信度匹配
  const handleLowConfidenceMatch = useCallback((match: CommandMatch) => {
    const message = `我理解您想要${match.pattern.description}，置信度${(match.confidence * 100).toFixed(1)}%，是否确认执行？`
    speechManager.speakInLanguage(message)
  }, [])

  // 处理无匹配情况
  const handleNoMatch = useCallback((text: string) => {
    const message = "抱歉，我没有理解您的指令。请尝试说'帮助'查看可用命令。"
    speechManager.speakInLanguage(message)
  }, [])

  // 生成反馈信息
  const generateFeedback = useCallback((match: CommandMatch): string => {
    const confidence = (match.confidence * 100).toFixed(1)
    return `正在执行${match.pattern.description}，置信度${confidence}%`
  }, [])

  // 具体命令处理函数
  const handleChartTypeSwitch = (chartType: string) => {
    console.log("切换图表类型:", chartType)
  }

  const handleTimeFilter = (timePeriod?: string) => {
    console.log("时间筛选:", timePeriod)
  }

  const handleDataExport = (format?: string) => {
    console.log("数据导出:", format)
  }

  const handleNavigation = (page?: string) => {
    const routes: { [key: string]: string } = {
      home: "/",
      dashboard: "/dashboard",
      users: "/users",
      settings: "/settings",
      charts: "/charts",
      analytics: "/analytics",
      files: "/files",
      search: "/search",
    }

    if (page && routes[page]) {
      window.location.href = routes[page]
    }
  }

  const handleSearch = (query?: string) => {
    console.log("搜索:", query)
  }

  const handleHelp = () => {
    const commands = voiceCommandEngine.getAllPatterns()
    const helpText = `可用命令包括：${commands
      .slice(0, 5)
      .map((p) => p.description)
      .join("、")}`
    speechManager.speakInLanguage(helpText)
  }

  // 更新统计信息
  const updateStats = useCallback(() => {
    const engineStats = voiceCommandEngine.getStats()
    const intentCounts = new Map<string, number>()

    nlpResults.forEach((result) => {
      intentCounts.set(result.intent, (intentCounts.get(result.intent) || 0) + 1)
    })

    const topIntents = Array.from(intentCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([intent, count]) => ({ intent, count }))

    const avgConfidence =
      commandMatches.length > 0
        ? commandMatches.reduce((sum, match) => sum + match.confidence, 0) / commandMatches.length
        : 0

    setStats({
      totalCommands: engineStats.totalPatterns,
      successfulMatches: commandMatches.filter((m) => m.confidence > 0.5).length,
      averageConfidence: avgConfidence,
      topIntents,
    })
  }, [commandMatches, nlpResults])

  // 开始语音识别
  const startListening = () => {
    if (!recognitionService.isSupported()) {
      setRecognitionError("浏览器不支持语音识别")
      return
    }

    try {
      recognitionService.startListening({
        continuous: true,
        interimResults: true,
      })
      setIsListening(true)
      setRecognitionError(null)
    } catch (error) {
      setRecognitionError("启动语音识别失败")
    }
  }

  // 停止语音识别
  const stopListening = () => {
    recognitionService.stopListening()
    setIsListening(false)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 主控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>智能语音控制</span>
            </div>
            <Badge variant={isListening ? "default" : "secondary"}>{isListening ? "监听中" : "已停止"}</Badge>
          </CardTitle>
          <CardDescription>基于AI的自然语言理解和命令执行</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 控制按钮 */}
          <div className="flex space-x-2">
            {!isListening ? (
              <Button onClick={startListening} disabled={!recognitionService.isSupported()}>
                <Mic className="w-4 h-4 mr-2" />
                开始智能识别
              </Button>
            ) : (
              <Button onClick={stopListening} variant="outline">
                <MicOff className="w-4 h-4 mr-2" />
                停止识别
              </Button>
            )}
          </div>

          {/* 错误提示 */}
          {recognitionError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{recognitionError}</AlertDescription>
            </Alert>
          )}

          {/* 统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCommands}</div>
              <div className="text-sm text-gray-500">可用命令</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.successfulMatches}</div>
              <div className="text-sm text-gray-500">成功匹配</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(stats.averageConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500">平均置信度</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{nlpResults.length}</div>
              <div className="text-sm text-gray-500">处理次数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matches">命令匹配</TabsTrigger>
          <TabsTrigger value="nlp">NLP分析</TabsTrigger>
          <TabsTrigger value="speech">语音结果</TabsTrigger>
          <TabsTrigger value="commands">命令库</TabsTrigger>
        </TabsList>

        {/* 命令匹配标签页 */}
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>命令匹配结果</span>
              </CardTitle>
              <CardDescription>最近的命令匹配和执行记录</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {commandMatches.length > 0 ? (
                    commandMatches.map((match, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              match.confidence > 0.7 ? "default" : match.confidence > 0.5 ? "secondary" : "outline"
                            }
                          >
                            {match.pattern.category}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Progress value={match.confidence * 100} className="w-20 h-2" />
                            <span className="text-sm text-gray-500">{(match.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{match.pattern.description}</p>
                          <p className="text-sm text-gray-600">原文: {match.originalText}</p>
                          {Object.keys(match.parameters).length > 0 && (
                            <p className="text-sm text-blue-600">参数: {JSON.stringify(match.parameters)}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">暂无命令匹配记录</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NLP分析标签页 */}
        <TabsContent value="nlp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>自然语言处理</span>
              </CardTitle>
              <CardDescription>文本分析、意图识别和实体提取结果</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {nlpResults.length > 0 ? (
                    nlpResults.map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{result.intent}</Badge>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                result.sentiment === "positive"
                                  ? "default"
                                  : result.sentiment === "negative"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {result.sentiment}
                            </Badge>
                            <span className="text-sm text-gray-500">{result.language}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">置信度: </span>
                            <Progress value={result.confidence * 100} className="inline-block w-20 h-2 mx-2" />
                            <span className="text-sm">{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                          {result.entities.length > 0 && (
                            <div>
                              <span className="text-sm font-medium">实体: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.entities.map((entity, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {entity.type}: {entity.value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {result.keywords.length > 0 && (
                            <div>
                              <span className="text-sm font-medium">关键词: </span>
                              <span className="text-sm text-gray-600">{result.keywords.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">暂无NLP分析结果</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 语音结果标签页 */}
        <TabsContent value="speech">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>语音识别结果</span>
              </CardTitle>
              <CardDescription>原始语音识别文本和置信度</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {speechResults.length > 0 ? (
                    speechResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          result.isFinal ? "bg-green-50 dark:bg-green-900/20" : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={result.isFinal ? "default" : "secondary"}>
                            {result.isFinal ? "最终结果" : "临时结果"}
                          </Badge>
                          <span className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</span>
                        </div>
                        <p className="font-medium mb-2">{result.transcript}</p>
                        {result.confidence && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">置信度:</span>
                            <Progress value={result.confidence * 100} className="flex-1 h-2" />
                            <span className="text-sm text-gray-500">{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">暂无语音识别结果</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 命令库标签页 */}
        <TabsContent value="commands">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>可用命令库</span>
              </CardTitle>
              <CardDescription>所有注册的语音命令和使用示例</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {voiceCommandEngine.getAllPatterns().map((pattern, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{pattern.category}</Badge>
                        <Badge variant="secondary">优先级: {pattern.priority}</Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{pattern.description}</h4>
                        <div>
                          <span className="text-sm font-medium">示例: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pattern.examples.map((example, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">关键词: </span>
                          <span className="text-sm text-gray-600">{pattern.keywords.join(", ")}</span>
                        </div>
                        {pattern.parameters && pattern.parameters.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">参数: </span>
                            <div className="text-sm text-gray-600">
                              {pattern.parameters.map((param, i) => (
                                <span key={i}>
                                  {param.name}({param.type}){i < pattern.parameters!.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 意图统计 */}
      {stats.topIntents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>意图统计</span>
            </CardTitle>
            <CardDescription>最常用的语音意图分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topIntents.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{item.intent}</span>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={(item.count / Math.max(...stats.topIntents.map((i) => i.count))) * 100}
                      className="w-20 h-2"
                    />
                    <span className="text-sm text-gray-500">{item.count}次</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
