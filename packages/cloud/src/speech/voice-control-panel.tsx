"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Alert, AlertDescription } from "@yyc3/ui/alert"
import { Progress } from "@yyc3/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Slider } from "@yyc3/ui/slider"
import { Switch } from "@yyc3/ui/switch"
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  Square,
  Languages,
  MessageSquare,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { multiLanguageSpeechManager, type SpeechRecognitionResult } from "@yyc3/lib"

export interface VoiceControlPanelProps {
  onCommandExecuted?: (command: string, params?: any) => void
  onSpeechResult?: (result: SpeechRecognitionResult) => void
  className?: string
}

export function VoiceControlPanel({ onCommandExecuted, onSpeechResult, className }: VoiceControlPanelProps) {
  // 语音识别状态
  const [isListening, setIsListening] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState<SpeechRecognitionResult | null>(null)
  const [recognitionError, setRecognitionError] = useState<string | null>(null)

  // 语音合成状态
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechQueue, setSpeechQueue] = useState<string[]>([])

  // 语言和语音设置
  const [currentLanguage, setCurrentLanguage] = useState("zh-CN")
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([])
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 1,
  })

  // 功能开关
  const [continuousListening, setContinuousListening] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [showInterimResults, setShowInterimResults] = useState(true)

  // 服务实例
  const speechManager = multiLanguageSpeechManager
  const recognitionService = speechManager.getRecognitionService()
  const synthesisService = speechManager.getSynthesisService()

  // 初始化
  useEffect(() => {
    // 加载支持的语言
    const languages = speechManager.getSupportedLanguages()
    setAvailableLanguages(languages)

    // 设置语音识别回调
    recognitionService.onResult((result) => {
      setRecognitionResult(result)
      setRecognitionError(null)
      onSpeechResult?.(result)

      // 自动播报识别结果
      if (autoSpeak && result.isFinal) {
        speakText(`识别到：${result.transcript}`)
      }
    })

    recognitionService.onError((error) => {
      setRecognitionError(String(error))
      setIsListening(false)
    })

    // 监听语音合成状态
    const checkSpeechStatus = () => {
      const status = synthesisService.getStatus()
      setIsSpeaking(status.speaking)
      setIsPaused(status.paused)
    }

    const statusInterval = setInterval(checkSpeechStatus, 100)

    return () => {
      clearInterval(statusInterval)
      stopListening()
      stopSpeaking()
    }
  }, [])

  // 开始语音识别
  const startListening = () => {
    if (!recognitionService.isSupported()) {
      setRecognitionError("浏览器不支持语音识别")
      return
    }

    try {
      recognitionService.startListening({
        language: currentLanguage,
        continuous: continuousListening,
        interimResults: showInterimResults,
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

  // 语音播报
  const speakText = async (text: string) => {
    if (!text.trim()) return

    try {
      setSpeechQueue((prev) => [...prev, text])
      await speechManager.speakInLanguage(text, currentLanguage)
      setSpeechQueue((prev) => prev.filter((item) => item !== text))
    } catch (error) {
      console.error("语音播报失败:", error)
      setSpeechQueue((prev) => prev.filter((item) => item !== text))
    }
  }

  // 停止语音播报
  const stopSpeaking = () => {
    synthesisService.stop()
    setSpeechQueue([])
  }

  // 暂停/恢复语音播报
  const toggleSpeechPause = () => {
    if (isPaused) {
      synthesisService.resume()
    } else {
      synthesisService.pause()
    }
  }

  // 切换语言
  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    speechManager.switchLanguage(language)

    // 如果正在监听，重新启动以应用新语言
    if (isListening) {
      stopListening()
      setTimeout(() => startListening(), 100)
    }
  }

  // 更新语音设置
  const updateVoiceSettings = (key: string, value: number) => {
    const newSettings = { ...voiceSettings, [key]: value }
    setVoiceSettings(newSettings)
    synthesisService.setDefaultSettings(newSettings)
  }

  // 测试语音播报
  const testSpeech = () => {
    const testTexts = {
      "zh-CN": "你好，这是语音测试。",
      "en-US": "Hello, this is a speech test.",
      "ja-JP": "こんにちは、これは音声テストです。",
      "ko-KR": "안녕하세요, 이것은 음성 테스트입니다.",
    }

    const testText = testTexts[currentLanguage as keyof typeof testTexts] || testTexts["zh-CN"]
    speakText(testText)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 语音识别控制 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>语音识别</span>
            </div>
            <Badge variant={isListening ? "default" : "secondary"}>{isListening ? "监听中" : "已停止"}</Badge>
          </CardTitle>
          <CardDescription>使用语音控制图表和界面操作</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 识别控制按钮 */}
          <div className="flex space-x-2">
            {!isListening ? (
              <Button onClick={startListening} disabled={!recognitionService.isSupported()}>
                <Mic className="w-4 h-4 mr-2" />
                开始识别
              </Button>
            ) : (
              <Button onClick={stopListening} variant="outline">
                <MicOff className="w-4 h-4 mr-2" />
                停止识别
              </Button>
            )}
          </div>

          {/* 识别结果显示 */}
          {recognitionResult && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">识别结果</span>
                <Badge variant={recognitionResult.isFinal ? "default" : "secondary"}>
                  {recognitionResult.isFinal ? "最终" : "临时"}
                </Badge>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm">{recognitionResult.transcript}</p>
                {recognitionResult.confidence && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">置信度:</span>
                    <Progress value={recognitionResult.confidence * 100} className="flex-1 h-2" />
                    <span className="text-xs text-gray-500">{(recognitionResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {recognitionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{recognitionError}</AlertDescription>
            </Alert>
          )}

          {/* 识别设置 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">连续识别</span>
              <Switch checked={continuousListening} onCheckedChange={setContinuousListening} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">显示临时结果</span>
              <Switch checked={showInterimResults} onCheckedChange={setShowInterimResults} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">自动播报</span>
              <Switch checked={autoSpeak} onCheckedChange={setAutoSpeak} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 语音合成控制 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>语音播报</span>
            </div>
            <Badge variant={isSpeaking ? "default" : "secondary"}>
              {isSpeaking ? (isPaused ? "已暂停" : "播报中") : "空闲"}
            </Badge>
          </CardTitle>
          <CardDescription>文本转语音播报功能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 播报控制按钮 */}
          <div className="flex space-x-2">
            <Button onClick={testSpeech} disabled={!synthesisService.isSupported()}>
              <Play className="w-4 h-4 mr-2" />
              测试播报
            </Button>
            {isSpeaking && (
              <>
                <Button onClick={toggleSpeechPause} variant="outline">
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? "继续" : "暂停"}
                </Button>
                <Button onClick={stopSpeaking} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  停止
                </Button>
              </>
            )}
          </div>

          {/* 播报队列 */}
          {speechQueue.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">播报队列</span>
              <div className="space-y-1">
                {speechQueue.map((text, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span className="flex-1 truncate">{text}</span>
                    {index === 0 && <Badge variant="outline">播报中</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 语音设置 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">语速</span>
                <span className="text-sm text-gray-500">{voiceSettings.rate.toFixed(1)}x</span>
              </div>
              <Slider
                value={[voiceSettings.rate]}
                onValueChange={([value]) => updateVoiceSettings("rate", value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">音调</span>
                <span className="text-sm text-gray-500">{voiceSettings.pitch.toFixed(1)}</span>
              </div>
              <Slider
                value={[voiceSettings.pitch]}
                onValueChange={([value]) => updateVoiceSettings("pitch", value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">音量</span>
                <span className="text-sm text-gray-500">{Math.round(voiceSettings.volume * 100)}%</span>
              </div>
              <Slider
                value={[voiceSettings.volume]}
                onValueChange={([value]) => updateVoiceSettings("volume", value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 多语言设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="w-5 h-5" />
            <span>多语言设置</span>
          </CardTitle>
          <CardDescription>选择语音识别和播报的语言</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 语言选择 */}
          <div className="space-y-2">
            <span className="text-sm font-medium">当前语言</span>
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {lang.hasVoice ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 语言支持状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4" />
              <span className="text-sm">语音识别</span>
              {recognitionService.isSupported() ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">语音合成</span>
              {synthesisService.isSupported() ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 语音命令帮助 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>语音命令</span>
          </CardTitle>
          <CardDescription>可用的语音控制命令</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">图表控制</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">切换线图</span> - 改为线图
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">切换柱图</span> - 改为柱图
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">放大</span> - 放大图表
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">缩小</span> - 缩小图表
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">数据操作</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">播报数据</span> - 语音播报数据
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">导出图片</span> - 导出PNG图片
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">显示上周</span> - 筛选上周数据
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">深色主题</span> - 切换主题
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
