"use client"

import React, { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, Play, RotateCcw } from "lucide-react"
import { useVoiceSettings } from "@/hooks/use-voice-settings"

interface VoiceSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoiceSettingsDialog({ open, onOpenChange }: VoiceSettingsDialogProps) {
  const {
    profiles,
    selectedProfile,
    customSettings,
    availableVoices,
    isLoading,
    updateProfile,
    updateCustomSettings,
    testVoice,
  } = useVoiceSettings()

  const [testText, setTestText] = useState("您好，这是语音测试。欢迎使用智能教育助手！")

  const handleTestVoice = () => {
    testVoice(testText)
  }

  const handleResetSettings = () => {
    updateCustomSettings({
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            语音设置
          </DialogTitle>
          <DialogDescription>
            自定义语音输出设置，选择适合的语音配置文件
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profiles">语音配置</TabsTrigger>
            <TabsTrigger value="custom">自定义设置</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-4">
            <div className="grid gap-3">
              {Object.entries(profiles).map(([key, profile]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:border-blue-500 ${
                    selectedProfile === key ? "border-blue-500 bg-blue-50/50" : ""
                  }`}
                  onClick={() => updateProfile(key)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{profile.name}</CardTitle>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {profile.gender === "female" ? "女声" : profile.gender === "male" ? "男声" : "中性"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {profile.ageGroup === "adult" ? "成人" : profile.ageGroup === "young" ? "年轻" : "儿童"}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-xs text-muted-foreground">
                      <strong>适合学科：</strong>
                      {profile.subjects.map((subject) => {
                        const subjectNames: Record<string, string> = {
                          chinese: "语文",
                          math: "数学",
                          "math-competition": "奥数",
                          english: "英语",
                          science: "科学",
                          arts: "艺术",
                          programming: "编程",
                          history: "历史",
                        }
                        return subjectNames[subject] || subject
                      }).join("、")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      语速: {profile.settings.rate} | 音调: {profile.settings.pitch} | 音量: {profile.settings.volume}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="rate">语速</Label>
                <Slider
                  id="rate"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[customSettings.rate]}
                  onValueChange={([value]) => updateCustomSettings({ rate: value })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5 (慢)</span>
                  <span>当前: {customSettings.rate}</span>
                  <span>2.0 (快)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch">音调</Label>
                <Slider
                  id="pitch"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[customSettings.pitch]}
                  onValueChange={([value]) => updateCustomSettings({ pitch: value })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5 (低)</span>
                  <span>当前: {customSettings.pitch}</span>
                  <span>2.0 (高)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">音量</Label>
                <Slider
                  id="volume"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={[customSettings.volume]}
                  onValueChange={([value]) => updateCustomSettings({ volume: value })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1 (小)</span>
                  <span>当前: {customSettings.volume}</span>
                  <span>1.0 (大)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleResetSettings}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  重置默认
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 space-y-3">
          <Label htmlFor="test-text">测试语音</Label>
          <textarea
            id="test-text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full h-20 p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入要测试的文字..."
          />
          <Button onClick={handleTestVoice} className="w-full" disabled={isLoading}>
            <Play className="h-4 w-4 mr-2" />
            测试语音
          </Button>
        </div>

        {availableVoices.length > 0 && (
          <div className="border-t pt-4">
            <Label className="text-xs text-muted-foreground">
              系统可用语音: {availableVoices.length} 个
            </Label>
            <div className="text-xs text-muted-foreground mt-1">
              {availableVoices.slice(0, 3).map((voice) => voice.name).join("、")}
              {availableVoices.length > 3 && "..."}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}