"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Volume2, VolumeX, Sparkles, Sun, Moon, Coffee } from "lucide-react"

// 情感状态类型定义
interface EmotionState {
  type: "happy" | "anxious" | "confused" | "motivated" | "neutral" | "frustrated" | "excited"
  intensity: number
  timestamp: number
}

// 拟人化风格类型
interface PersonaStyle {
  name: string
  colors: string[]
  emojis: string[]
  soundStyle: string
  description: string
}

// 多模态反馈类型
interface MultiModalFeedback {
  text: string
  emojis: string[]
  sound: string
  animation: string
  visualTheme: string
  encouragement?: string
}

// YYC³品牌色彩情感映射
const YYC3_EMOTION_THEMES = {
  happy: {
    gradient: "from-emerald-400 via-teal-400 to-blue-400", // 竹绿到云蓝
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-300",
  },
  motivated: {
    gradient: "from-blue-500 via-indigo-500 to-purple-500", // 云蓝到紫藤
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
  },
  anxious: {
    gradient: "from-amber-400 via-orange-400 to-red-400", // 琥珀到砖红
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
  },
  confused: {
    gradient: "from-slate-400 via-gray-400 to-zinc-400", // 墨青色系
    bgColor: "bg-slate-50",
    textColor: "text-slate-700",
    borderColor: "border-slate-300",
  },
  neutral: {
    gradient: "from-gray-300 via-slate-300 to-zinc-300", // 玉白色系
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
  },
  frustrated: {
    gradient: "from-red-400 via-pink-400 to-rose-400", // 砖红色系
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-300",
  },
  excited: {
    gradient: "from-purple-400 via-violet-400 to-indigo-400", // 紫藤色系
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
  },
}

// 拟人化风格定义
const PERSONA_STYLES: Record<string, PersonaStyle> = {
  warm: {
    name: "温柔关怀型",
    colors: ["墨青色", "云蓝色"],
    emojis: ["🤗", "🌟", "💖", "🌻", "✨"],
    soundStyle: "柔和低频",
    description: "温暖陪伴，细心关怀",
  },
  humor: {
    name: "幽默陪伴型",
    colors: ["琥珀色", "玉白色"],
    emojis: ["😄", "🎉", "🌈", "🦄", "🎊"],
    soundStyle: "轻快明亮",
    description: "轻松愉快，化解压力",
  },
  encouraging: {
    name: "积极鼓励型",
    colors: ["竹绿色", "玉白色"],
    emojis: ["💪", "🚀", "⭐", "🎯", "🏆"],
    soundStyle: "激励昂扬",
    description: "积极向上，激发潜能",
  },
}

// 情感表情包库
const EMOTION_EMOJI_LIBRARY = {
  happy: {
    warm: ["🌻", "✨", "🌟", "💖", "🤗"],
    humor: ["😄", "🎉", "🌈", "🦄", "🎊"],
    encouraging: ["🎯", "⭐", "🏆", "💪", "🚀"],
  },
  anxious: {
    warm: ["🤗", "🌱", "💙", "🕊️", "🌿"],
    humor: ["🐱", "🐼", "🌸", "🍃", "🌺"],
    encouraging: ["💪", "🌟", "⚡", "🔥", "✊"],
  },
  confused: {
    warm: ["💡", "🤔", "🌱", "📚", "🔍"],
    humor: ["🐔", "❓", "🤷", "🧩", "🎭"],
    encouraging: ["🎯", "💡", "🚀", "⚡", "🔥"],
  },
  motivated: {
    warm: ["🌟", "✨", "💖", "🌻", "🌈"],
    humor: ["🚀", "⚡", "🎉", "🦄", "🌟"],
    encouraging: ["🏆", "💪", "🎯", "⭐", "🔥"],
  },
  neutral: {
    warm: ["😊", "🌸", "☁️", "🍃", "💙"],
    humor: ["😌", "🌿", "🌊", "🎈", "🌙"],
    encouraging: ["📈", "🎯", "⚡", "🌟", "💫"],
  },
  frustrated: {
    warm: ["🌿", "🕊️", "💧", "🌸", "🤗"],
    humor: ["🐢", "🍃", "🌺", "🦋", "🌊"],
    encouraging: ["💪", "🔥", "⚡", "🎯", "🚀"],
  },
  excited: {
    warm: ["✨", "🌟", "💖", "🌻", "🎈"],
    humor: ["🎉", "🦄", "🌈", "🎊", "⭐"],
    encouraging: ["🚀", "🏆", "💪", "🔥", "⚡"],
  },
}

// 高级音效系统
class AdvancedEmotionalSoundSystem {
  private audioContext: AudioContext | null = null
  private enabled = true
  private volume = 0.6
  private environmentMode: "day" | "night" | "work" = "day"

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.log("音频上下文不支持")
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setEnvironmentMode(mode: "day" | "night" | "work") {
    this.environmentMode = mode
    // 根据环境调整音量
    switch (mode) {
      case "night":
        this.volume = 0.2
        break
      case "work":
        this.volume = 0.4
        break
      case "day":
        this.volume = 0.6
        break
    }
  }

  // 情感化音效播放
  playEmotionalSound(emotion: string, persona: string) {
    if (!this.enabled || !this.audioContext) return

    const soundConfig = this.getSoundConfig(emotion, persona)
    this.generateEmotionalTone(soundConfig)
  }

  private getSoundConfig(emotion: string, persona: string) {
    const configs = {
      happy: {
        warm: { frequencies: [523, 659, 784], duration: 0.4, style: "gentle" },
        humor: { frequencies: [440, 554, 659, 880], duration: 0.6, style: "playful" },
        encouraging: { frequencies: [659, 784, 988], duration: 0.5, style: "uplifting" },
      },
      anxious: {
        warm: { frequencies: [220, 277, 330], duration: 0.8, style: "soothing" },
        humor: { frequencies: [330, 415, 523], duration: 0.5, style: "light" },
        encouraging: { frequencies: [440, 554, 659], duration: 0.6, style: "supportive" },
      },
      motivated: {
        warm: { frequencies: [440, 554, 659, 784], duration: 0.7, style: "inspiring" },
        humor: { frequencies: [523, 659, 784, 988], duration: 0.6, style: "energetic" },
        encouraging: { frequencies: [659, 784, 988, 1175], duration: 0.8, style: "powerful" },
      },
    }

    return (
      configs[emotion as keyof typeof configs]?.[persona as keyof typeof configs.happy] || configs.motivated.encouraging
    )
  }

  private generateEmotionalTone(config: any) {
    if (!this.audioContext) return

    config.frequencies.forEach((freq: number, index: number) => {
      setTimeout(() => {
        if (this.audioContext) {
          const oscillator = this.audioContext.createOscillator()
          const gainNode = this.audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(this.audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)
          oscillator.type = config.style === "gentle" ? "sine" : config.style === "playful" ? "triangle" : "square"

          gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + config.duration)

          oscillator.start(this.audioContext.currentTime)
          oscillator.stop(this.audioContext.currentTime + config.duration)
        }
      }, index * 150)
    })
  }
}

// 情感识别与分析系统
class EmotionAnalyzer {
  // 基于用户行为和输入的情感识别
  analyzeEmotion(userInput: string, behaviorData: any): EmotionState {
    // 简化的情感分析逻辑
    const positiveWords = ["好", "棒", "喜欢", "开心", "满意", "成功", "完成"]
    const negativeWords = ["难", "困难", "不懂", "错误", "失败", "焦虑", "担心"]
    const confusedWords = ["不明白", "疑问", "怎么", "为什么", "如何"]

    let emotion: EmotionState["type"] = "neutral"
    let intensity = 0.5

    if (positiveWords.some((word) => userInput.includes(word))) {
      emotion = "happy"
      intensity = 0.8
    } else if (negativeWords.some((word) => userInput.includes(word))) {
      emotion = "anxious"
      intensity = 0.7
    } else if (confusedWords.some((word) => userInput.includes(word))) {
      emotion = "confused"
      intensity = 0.6
    }

    // 根据行为数据调整
    if (behaviorData?.completionRate > 0.7) {
      emotion = "motivated"
      intensity = Math.min(intensity + 0.2, 1.0)
    }

    return {
      type: emotion,
      intensity,
      timestamp: Date.now(),
    }
  }
}

// 多模态反馈生成器
class MultiModalFeedbackGenerator {
  private emotionAnalyzer = new EmotionAnalyzer()
  private soundSystem = new AdvancedEmotionalSoundSystem()

  generateFeedback(userInput: string, behaviorData: any, selectedPersona: string): MultiModalFeedback {
    // 1. 情感识别
    const emotion = this.emotionAnalyzer.analyzeEmotion(userInput, behaviorData)

    // 2. 选择表情包
    const emojis = this.selectEmojis(emotion.type, selectedPersona)

    // 3. 生成鼓励文本
    const encouragement = this.generateEncouragement(emotion.type, selectedPersona)

    // 4. 选择视觉主题
    const visualTheme = YYC3_EMOTION_THEMES[emotion.type] || YYC3_EMOTION_THEMES.neutral

    return {
      text: encouragement,
      emojis,
      sound: `${emotion.type}_${selectedPersona}`,
      animation: `${emotion.type}_animation`,
      visualTheme: emotion.type,
      encouragement,
    }
  }

  private selectEmojis(emotion: EmotionState["type"], persona: string): string[] {
    const emojiSet =
      EMOTION_EMOJI_LIBRARY[emotion]?.[persona as keyof typeof EMOTION_EMOJI_LIBRARY.happy] ||
      EMOTION_EMOJI_LIBRARY.neutral.warm

    // 随机选择2-3个表情包
    const shuffled = [...emojiSet].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2)
  }

  private generateEncouragement(emotion: EmotionState["type"], persona: string): string {
    const encouragements = {
      happy: {
        warm: ["真棒！你的进步让人欣慰 🌟", "继续保持这份热情！", "你的努力正在开花结果 ✨"],
        humor: ["哇塞！你简直是学习小天才！🎉", "给你点个大大的赞！", "你这是要上天的节奏啊！🚀"],
        encouraging: ["太棒了！向着目标勇敢前进！💪", "你的坚持终将收获成功！", "继续冲刺，胜利就在前方！🏆"],
      },
      anxious: {
        warm: ["别担心，每个人都有迷茫的时候 🤗", "慢慢来，我会陪着你", "深呼吸，一切都会好起来的 🌱"],
        humor: ["焦虑小怪兽又来捣乱了？我们一起赶走它！🐱", "别慌别慌，天塌下来还有我呢！", "来，先喝口茶冷静一下 🍃"],
        encouraging: ["困难只是成长路上的垫脚石！💪", "相信自己，你比想象中更强大！", "每一次挑战都是突破的机会！⚡"],
      },
      confused: {
        warm: ["有疑问很正常，说明你在认真思考 💡", "我们一起慢慢理清思路", "不懂就问，这是学习的好习惯 📚"],
        humor: ["脑袋打结了？来，我帮你解开！🧩", "困惑小精灵在作怪？我们去抓它！", "问号脸是学霸的标配哦！❓"],
        encouraging: ["疑问是智慧的开始！🎯", "勇敢提问，突破认知边界！", "每个问题都是进步的阶梯！💡"],
      },
      motivated: {
        warm: ["你的积极态度真让人感动 ✨", "保持这份热情，未来可期", "你的努力我都看在眼里 💖"],
        humor: ["动力满满的样子真帅！⚡", "你这是开了挂吧！", "学习狂魔上线了！🚀"],
        encouraging: ["就是这股劲！继续冲刺！🏆", "你的坚持必将创造奇迹！", "目标就在前方，加油！💪"],
      },
    }

    const emotionEncouragements = encouragements[emotion] || encouragements.motivated
    const personaEncouragements =
      emotionEncouragements[persona as keyof typeof emotionEncouragements] || emotionEncouragements.encouraging

    return personaEncouragements[Math.floor(Math.random() * personaEncouragements.length)]
  }

  playEmotionalFeedback(feedback: MultiModalFeedback, persona: string) {
    this.soundSystem.playEmotionalSound(feedback.visualTheme, persona)
  }
}

// 主要组件
export default function AdvancedEmotionalSystem() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>({
    type: "motivated",
    intensity: 0.8,
    timestamp: Date.now(),
  })

  const [selectedPersona, setSelectedPersona] = useState<string>("warm")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [environmentMode, setEnvironmentMode] = useState<"day" | "night" | "work">("day")
  const [feedbackGenerator] = useState(() => new MultiModalFeedbackGenerator())
  const [currentFeedback, setCurrentFeedback] = useState<MultiModalFeedback | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // 模拟用户交互触发情感反馈
  const triggerEmotionalFeedback = useCallback(
    (userInput: string) => {
      const behaviorData = {
        completionRate: 0.6,
        timeSpent: 300,
        interactionCount: 15,
      }

      const feedback = feedbackGenerator.generateFeedback(userInput, behaviorData, selectedPersona)
      setCurrentFeedback(feedback)
      setShowFeedback(true)

      // 播放音效
      if (soundEnabled) {
        feedbackGenerator.playEmotionalFeedback(feedback, selectedPersona)
      }

      // 更新情感状态
      const newEmotion = feedbackGenerator["emotionAnalyzer"].analyzeEmotion(userInput, behaviorData)
      setCurrentEmotion(newEmotion)

      // 3秒后隐藏反馈
      setTimeout(() => setShowFeedback(false), 3000)
    },
    [selectedPersona, soundEnabled, feedbackGenerator],
  )

  const currentTheme = YYC3_EMOTION_THEMES[currentEmotion.type] || YYC3_EMOTION_THEMES.neutral

  return (
    <div className="space-y-6">
      {/* 情感状态显示 */}
      <Card className={`${currentTheme.bgColor} ${currentTheme.borderColor} border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentTheme.gradient} flex items-center justify-center`}
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${currentTheme.textColor}`}>情感状态监测</h3>
                <p className="text-sm text-muted-foreground">
                  当前情绪:{" "}
                  {currentEmotion.type === "happy"
                    ? "开心"
                    : currentEmotion.type === "anxious"
                      ? "焦虑"
                      : currentEmotion.type === "confused"
                        ? "困惑"
                        : currentEmotion.type === "motivated"
                          ? "积极"
                          : "平静"}
                  ({Math.round(currentEmotion.intensity * 100)}%)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const modes: ("day" | "night" | "work")[] = ["day", "night", "work"]
                  const currentIndex = modes.indexOf(environmentMode)
                  const nextMode = modes[(currentIndex + 1) % modes.length]
                  setEnvironmentMode(nextMode)
                }}
              >
                {environmentMode === "day" ? (
                  <Sun className="w-4 h-4" />
                ) : environmentMode === "night" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Coffee className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 拟人化风格选择 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">拟人化风格</h4>
            <div className="flex gap-2">
              {Object.entries(PERSONA_STYLES).map(([key, style]) => (
                <Button
                  key={key}
                  variant={selectedPersona === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPersona(key)}
                  className="text-xs"
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 情感反馈演示 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            情感化交互演示
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerEmotionalFeedback("我完成了这个任务，感觉很棒！")}
            >
              😊 开心反馈
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerEmotionalFeedback("这个问题好难，我有点焦虑")}>
              😰 焦虑反馈
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerEmotionalFeedback("我不太明白这个概念")}>
              🤔 困惑反馈
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerEmotionalFeedback("我要继续努力学习！")}>
              💪 积极反馈
            </Button>
          </div>

          {/* 情感反馈显示区域 */}
          <AnimatePresence>
            {showFeedback && currentFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring" }}
                className={`p-4 rounded-lg ${currentTheme.bgColor} ${currentTheme.borderColor} border-2`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {currentFeedback.emojis.map((emoji, index) => (
                      <motion.span
                        key={index}
                        className="text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {PERSONA_STYLES[selectedPersona].name}
                  </Badge>
                </div>

                <motion.p
                  className={`${currentTheme.textColor} font-medium`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentFeedback.encouragement}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
