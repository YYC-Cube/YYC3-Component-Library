"use client"

import { useCallback, useEffect, useState } from "react"
import { Volume2, VolumeX, Music, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface EmotionConfig {
  volume: number
  frequency: number[]
  duration: number
  fadeIn: number
  fadeOut: number
}

interface SoundEffect {
  type: "success" | "progress" | "encouragement" | "notification" | "error" | "achievement"
  emotion: "happy" | "calm" | "excited" | "anxious" | "motivated" | "neutral"
}

class AdvancedEmotionalSoundSystem {
  private audioContext: AudioContext | null = null
  private enabled = true
  private masterVolume = 0.6
  private currentEmotion = "neutral"
  private environmentMode: "day" | "night" | "focus" = "day"

  // YYC³ 品牌色彩映射到音效配置
  private emotionConfigs: Record<string, EmotionConfig> = {
    neutral: {
      volume: 0.4,
      frequency: [440], // 标准A音
      duration: 0.5,
      fadeIn: 0.2,
      fadeOut: 0.3,
    },
    calm: {
      volume: 0.3,
      frequency: [220, 330, 440], // 低频温柔音
      duration: 0.8,
      fadeIn: 0.3,
      fadeOut: 0.5,
    },
    happy: {
      volume: 0.5,
      frequency: [523, 659, 784], // 明亮愉快音
      duration: 0.6,
      fadeIn: 0.1,
      fadeOut: 0.3,
    },
    motivated: {
      volume: 0.6,
      frequency: [440, 554, 659, 880], // 激励上升音
      duration: 1.0,
      fadeIn: 0.2,
      fadeOut: 0.4,
    },
    anxious: {
      volume: 0.25,
      frequency: [174, 285, 396], // 舒缓低频音
      duration: 1.2,
      fadeIn: 0.5,
      fadeOut: 0.7,
    },
    excited: {
      volume: 0.7,
      frequency: [659, 784, 988, 1175], // 高频庆祝音
      duration: 0.4,
      fadeIn: 0.05,
      fadeOut: 0.2,
    },
  }

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        this.detectEnvironment()
      } catch (e) {
        console.log("Web Audio API 不支持")
      }
    }
  }

  // 根据时间和环境自动调整音量
  private detectEnvironment() {
    const hour = new Date().getHours()
    if (hour < 8 || hour > 22) {
      this.environmentMode = "night"
      this.masterVolume = 0.2 // 夜间模式降低音量
    } else if (hour >= 9 && hour <= 17) {
      this.environmentMode = "focus"
      this.masterVolume = 0.4 // 工作时间适中音量
    } else {
      this.environmentMode = "day"
      this.masterVolume = 0.6 // 日间正常音量
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  setCurrentEmotion(emotion: string) {
    this.currentEmotion = emotion
  }

  // 播放情感化音效
  async playEmotionalSound(soundEffect: SoundEffect) {
    if (!this.enabled || !this.audioContext) {
      console.log("[v0] 音效系统未启用或AudioContext未初始化")
      return
    }

    const config = this.emotionConfigs[soundEffect.emotion] || this.emotionConfigs.neutral
    if (!config) {
      console.log("[v0] 无法找到音效配置")
      return
    }

    if (typeof config.volume !== "number") {
      console.log("[v0] 音效配置中volume属性无效")
      return
    }

    const finalVolume = this.masterVolume * config.volume

    let frequencies = [...config.frequency]
    let duration = config.duration

    switch (soundEffect.type) {
      case "success":
        frequencies = config.frequency.map((f) => f * 1.2)
        break
      case "achievement":
        frequencies = [...config.frequency, ...config.frequency.map((f) => f * 1.5)]
        duration = duration * 1.5
        break
      case "error":
        frequencies = config.frequency.map((f) => f * 0.8)
        break
      case "progress":
        frequencies = [config.frequency[0]]
        duration = 0.2
        break
    }

    for (let i = 0; i < frequencies.length; i++) {
      setTimeout(() => {
        this.playTone(frequencies[i], finalVolume, duration, config.fadeIn, config.fadeOut)
      }, i * 100)
    }
  }

  // 播放单个音调
  private playTone(frequency: number, volume: number, duration: number, fadeIn: number, fadeOut: number) {
    if (!this.audioContext || typeof frequency !== "number" || typeof volume !== "number") {
      console.log("[v0] playTone参数无效")
      return
    }

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const filterNode = this.audioContext.createBiquadFilter()

      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = "sine"

      filterNode.type = "lowpass"
      filterNode.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime)
      filterNode.Q.setValueAtTime(1, this.audioContext.currentTime)

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + fadeIn)
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + duration - fadeOut)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (error) {
      console.log("[v0] 播放音效时出错:", error)
    }
  }

  async playCelebrationSound() {
    const celebrationSequence = [
      { type: "achievement" as const, emotion: "excited" as const },
      { type: "success" as const, emotion: "happy" as const },
      { type: "achievement" as const, emotion: "motivated" as const },
    ]

    for (let i = 0; i < celebrationSequence.length; i++) {
      setTimeout(() => {
        this.playEmotionalSound(celebrationSequence[i])
      }, i * 300)
    }
  }

  async playAmbientSound(emotion: string, duration = 5000) {
    if (!this.enabled || !this.audioContext) return

    const config = this.emotionConfigs[emotion] || this.emotionConfigs.neutral
    const baseFreq = config.frequency[0]

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filterNode = this.audioContext.createBiquadFilter()

    oscillator.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(baseFreq * 0.5, this.audioContext.currentTime)
    oscillator.type = "triangle"

    filterNode.type = "lowpass"
    filterNode.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + 1)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }
}

interface EmotionAudioPlayerProps {
  currentEmotion?: string
  onEmotionChange?: (emotion: string) => void
}

export default function EmotionAudioPlayer({ currentEmotion = "neutral", onEmotionChange }: EmotionAudioPlayerProps) {
  const [soundSystem] = useState(() => new AdvancedEmotionalSoundSystem())
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState([60])
  const [currentStyle, setCurrentStyle] = useState<"warm" | "humor" | "encourage">("warm")
  const [isPlaying, setIsPlaying] = useState(false)

  const personalityStyles = {
    warm: { name: "温柔关怀型", color: "bg-blue-500", emoji: "🤗" },
    humor: { name: "幽默陪伴型", color: "bg-amber-500", emoji: "😄" },
    encourage: { name: "积极鼓励型", color: "bg-emerald-500", emoji: "💪" },
  }

  useEffect(() => {
    soundSystem.setCurrentEmotion(currentEmotion)
  }, [currentEmotion, soundSystem])

  const handleVolumeChange = useCallback(
    (newVolume: number[]) => {
      setVolume(newVolume)
      soundSystem.setMasterVolume(newVolume[0] / 100)
    },
    [soundSystem],
  )

  const toggleSound = useCallback(() => {
    const newState = !enabled
    setEnabled(newState)
    soundSystem.setEnabled(newState)

    if (newState) {
      soundSystem.playEmotionalSound({ type: "notification", emotion: "happy" })
    }
  }, [enabled, soundSystem])

  const testSound = useCallback(
    (emotion: string) => {
      setIsPlaying(true)
      soundSystem.playEmotionalSound({ type: "success", emotion: emotion as any })
      setTimeout(() => setIsPlaying(false), 1000)
    },
    [soundSystem],
  )

  const playCelebration = useCallback(() => {
    setIsPlaying(true)
    soundSystem.playCelebrationSound()
    setTimeout(() => setIsPlaying(false), 2000)
  }, [soundSystem])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          情感化音效系统
          <Badge variant="outline" className="ml-2">
            YYC³ 专业版
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">基于心理学原理的多模态音效反馈系统</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={enabled ? "default" : "outline"}
              size="sm"
              onClick={toggleSound}
              className="flex items-center gap-2"
            >
              {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {enabled ? "音效开启" : "音效关闭"}
            </Button>

            <div className="flex items-center gap-2 min-w-32">
              <span className="text-sm text-muted-foreground">音量</span>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={5}
                className="flex-1"
                disabled={!enabled}
              />
              <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              当前情绪: {currentEmotion === "happy" ? "开心" : currentEmotion === "calm" ? "平静" : "积极"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">拟人化风格</h4>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(personalityStyles).map(([key, style]) => (
              <Button
                key={key}
                variant={currentStyle === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStyle(key as any)}
                className="flex items-center gap-2 h-auto py-3"
                disabled={!enabled}
              >
                <div
                  className={`w-6 h-6 rounded-full ${style.color} flex items-center justify-center text-white text-xs`}
                >
                  {style.emoji}
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium">{style.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">音效测试</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { emotion: "happy", label: "开心", color: "bg-yellow-500" },
              { emotion: "calm", label: "平静", color: "bg-blue-500" },
              { emotion: "motivated", label: "积极", color: "bg-emerald-500" },
              { emotion: "anxious", label: "舒缓", color: "bg-purple-500" },
            ].map(({ emotion, label, color }) => (
              <Button
                key={emotion}
                variant="outline"
                size="sm"
                onClick={() => testSound(emotion)}
                disabled={!enabled || isPlaying}
                className="flex items-center gap-2"
              >
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">特殊音效</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playCelebration}
              disabled={!enabled || isPlaying}
              className="flex items-center gap-2 bg-transparent"
            >
              🎉 庆祝音效
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundSystem.playAmbientSound(currentEmotion, 3000)}
              disabled={!enabled || isPlaying}
              className="flex items-center gap-2"
            >
              🌊 环境音效
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { AdvancedEmotionalSoundSystem }
