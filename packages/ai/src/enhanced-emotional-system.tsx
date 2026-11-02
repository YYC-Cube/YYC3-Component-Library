"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// YYC³ 品牌色彩系统
const YYC3_COLORS = {
  墨青色: "#2C3E50", // 深度思考、专业沉稳
  云蓝色: "#3498DB", // 智能科技、清晰理性
  竹绿色: "#27AE60", // 学习成长、生机活力
  琥珀色: "#F39C12", // 创意灵感、温暖活跃
  砖红色: "#E74C3C", // 警告提醒、重要强调
  紫藤色: "#9B59B6", // 创新突破、艺术美感
  玉白色: "#ECF0F1", // 纯净简洁、内容承载
}

// 情感状态类型
type EmotionState = "happy" | "calm" | "focused" | "creative" | "anxious" | "confused" | "excited"

// 拟人化风格类型
type PersonaStyle = "warm" | "humor" | "encourage"

interface EmotionalFeedback {
  text: string
  emojis: string[]
  soundType: string
  animation: string
  visualTheme: {
    primaryColor: string
    secondaryColor: string
    backgroundGradient: string
  }
}

// 高级情感化音效系统
class AdvancedEmotionalSoundSystem {
  private audioContext: AudioContext | null = null
  private isInitialized = false
  private currentEmotion: EmotionState = "calm"

  async initialize() {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }
      this.isInitialized = true
      console.log("[v0] Advanced emotional sound system initialized")
    } catch (error) {
      console.log("[v0] Audio context initialization failed, using fallback")
      this.isInitialized = false
    }
  }

  // 基于情感状态生成合成音效
  async playEmotionalSound(emotion: EmotionState, intensity = 0.5) {
    await this.initialize()

    if (!this.audioContext || !this.isInitialized) {
      console.log("[v0] Using fallback notification sound")
      return
    }

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // 根据情感状态设置音频参数
      const emotionConfig = this.getEmotionSoundConfig(emotion)

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(emotionConfig.frequency, this.audioContext.currentTime)
      oscillator.type = emotionConfig.waveType

      // 音量包络
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(intensity * 0.3, this.audioContext.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + emotionConfig.duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + emotionConfig.duration)

      console.log(`[v0] Playing ${emotion} emotional sound`)
    } catch (error) {
      console.log("[v0] Sound generation failed:", error)
    }
  }

  private getEmotionSoundConfig(emotion: EmotionState) {
    const configs = {
      happy: { frequency: 523.25, waveType: "sine" as OscillatorType, duration: 0.6 }, // C5 - 竹绿色
      calm: { frequency: 261.63, waveType: "sine" as OscillatorType, duration: 1.0 }, // C4 - 云蓝色
      focused: { frequency: 349.23, waveType: "triangle" as OscillatorType, duration: 0.4 }, // F4 - 墨青色
      creative: { frequency: 440.0, waveType: "sawtooth" as OscillatorType, duration: 0.8 }, // A4 - 琥珀色
      anxious: { frequency: 196.0, waveType: "sine" as OscillatorType, duration: 1.2 }, // G3 - 舒缓低频
      confused: { frequency: 293.66, waveType: "triangle" as OscillatorType, duration: 0.5 }, // D4 - 提示音
      excited: { frequency: 659.25, waveType: "square" as OscillatorType, duration: 0.3 }, // E5 - 紫藤色
    }
    return configs[emotion] || configs.calm
  }

  // 播放欢迎音效
  async playWelcomeSound() {
    await this.playEmotionalSound("calm", 0.4)
    setTimeout(() => this.playEmotionalSound("happy", 0.3), 300)
  }

  // 播放进入音效
  async playEnterSound() {
    await this.playEmotionalSound("focused", 0.5)
  }
}

// 情感识别与分析系统
class EmotionDetector {
  detectFromInteraction(interactionType: string, duration: number): EmotionState {
    // 基于交互行为模式判断情感状态
    if (interactionType === "quick_click" && duration < 1000) {
      return "excited"
    } else if (interactionType === "hover" && duration > 3000) {
      return "focused"
    } else if (interactionType === "multiple_clicks") {
      return "anxious"
    } else {
      return "calm"
    }
  }

  detectFromTime(): EmotionState {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return "focused" // 晨间专注
    if (hour >= 12 && hour < 18) return "creative" // 午后创意
    if (hour >= 18 && hour < 22) return "calm" // 晚间放松
    return "calm" // 深夜平静
  }
}

// 拟人化表情包选择器
class EmojiSelector {
  private emojiLibrary = {
    happy: {
      warm: ["🌟", "✨", "🌈", "🌻", "💖"],
      humor: ["🎉", "🦄", "🌈", "🎊", "🐱"],
      encourage: ["👏", "🚀", "💪", "🏆", "⭐"],
    },
    calm: {
      warm: ["🌙", "💙", "🕊️", "🌊", "☁️"],
      humor: ["😌", "🐢", "🍃", "🌸", "🦋"],
      encourage: ["🧘", "🌱", "💎", "🔮", "🌺"],
    },
    focused: {
      warm: ["🎯", "💡", "📚", "🔍", "⚡"],
      humor: ["🤓", "🧠", "🔬", "📊", "💻"],
      encourage: ["🎓", "🏅", "📈", "🔥", "💯"],
    },
    creative: {
      warm: ["🎨", "🌟", "💫", "🦋", "🌈"],
      humor: ["🎭", "🎪", "🎨", "🎵", "🎬"],
      encourage: ["💡", "🚀", "✨", "🌟", "🎯"],
    },
    anxious: {
      warm: ["🤗", "💚", "🌿", "🕊️", "💙"],
      humor: ["🐼", "🐨", "🌸", "🍃", "🦋"],
      encourage: ["💪", "🌱", "🌟", "💖", "🌈"],
    },
    confused: {
      warm: ["💡", "🤔", "🌱", "📚", "🔍"],
      humor: ["🐔", "❓", "🤷", "🧩", "🔮"],
      encourage: ["💪", "🎯", "📈", "🚀", "⭐"],
    },
    excited: {
      warm: ["🎉", "✨", "🌟", "💖", "🌈"],
      humor: ["🎊", "🦄", "🎪", "🎭", "🎨"],
      encourage: ["🚀", "🏆", "💯", "🔥", "⭐"],
    },
  }

  select(emotion: EmotionState, style: PersonaStyle): string[] {
    return this.emojiLibrary[emotion][style] || this.emojiLibrary[emotion]["warm"]
  }
}

// 视觉主题选择器
class VisualThemeSelector {
  select(emotion: EmotionState): EmotionalFeedback["visualTheme"] {
    const themes = {
      happy: {
        primaryColor: YYC3_COLORS.竹绿色,
        secondaryColor: YYC3_COLORS.玉白色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.竹绿色}20, ${YYC3_COLORS.云蓝色}10)`,
      },
      calm: {
        primaryColor: YYC3_COLORS.云蓝色,
        secondaryColor: YYC3_COLORS.玉白色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.云蓝色}20, ${YYC3_COLORS.墨青色}10)`,
      },
      focused: {
        primaryColor: YYC3_COLORS.墨青色,
        secondaryColor: YYC3_COLORS.云蓝色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.墨青色}25, ${YYC3_COLORS.云蓝色}15)`,
      },
      creative: {
        primaryColor: YYC3_COLORS.琥珀色,
        secondaryColor: YYC3_COLORS.紫藤色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.琥珀色}20, ${YYC3_COLORS.紫藤色}15)`,
      },
      anxious: {
        primaryColor: YYC3_COLORS.云蓝色,
        secondaryColor: YYC3_COLORS.玉白色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.云蓝色}15, ${YYC3_COLORS.玉白色}10)`,
      },
      confused: {
        primaryColor: YYC3_COLORS.紫藤色,
        secondaryColor: YYC3_COLORS.云蓝色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.紫藤色}20, ${YYC3_COLORS.云蓝色}15)`,
      },
      excited: {
        primaryColor: YYC3_COLORS.琥珀色,
        secondaryColor: YYC3_COLORS.竹绿色,
        backgroundGradient: `linear-gradient(135deg, ${YYC3_COLORS.琥珀色}25, ${YYC3_COLORS.竹绿色}20)`,
      },
    }
    return themes[emotion] || themes.calm
  }
}

// 主要的情感化交互系统组件
export default function EnhancedEmotionalSystem({
  onEmotionChange,
  currentEmotion = "calm",
}: {
  onEmotionChange?: (emotion: EmotionState) => void
  currentEmotion?: EmotionState
}) {
  const [emotion, setEmotion] = useState<EmotionState>(currentEmotion)
  const [persona, setPersona] = useState<PersonaStyle>("warm")
  const [feedback, setFeedback] = useState<EmotionalFeedback | null>(null)
  const [isActive, setIsActive] = useState(false)

  const soundSystemRef = useRef<AdvancedEmotionalSoundSystem>()
  const emotionDetectorRef = useRef<EmotionDetector>()
  const emojiSelectorRef = useRef<EmojiSelector>()
  const themeSelector = useRef<VisualThemeSelector>()

  useEffect(() => {
    soundSystemRef.current = new AdvancedEmotionalSoundSystem()
    emotionDetectorRef.current = new EmotionDetector()
    emojiSelectorRef.current = new EmojiSelector()
    themeSelector.current = new VisualThemeSelector()

    // 初始化音效系统
    soundSystemRef.current.initialize()

    // 播放欢迎音效
    setTimeout(() => {
      soundSystemRef.current?.playWelcomeSound()
    }, 1000)
  }, [])

  // 情感状态变化处理
  useEffect(() => {
    if (emotion !== currentEmotion) {
      setEmotion(currentEmotion)
      generateEmotionalFeedback(currentEmotion)
    }
  }, [currentEmotion])

  // 生成情感化反馈
  const generateEmotionalFeedback = async (newEmotion: EmotionState) => {
    if (!emojiSelectorRef.current || !themeSelector.current) return

    const newFeedback: EmotionalFeedback = {
      text: getEmotionalText(newEmotion, persona),
      emojis: emojiSelectorRef.current.select(newEmotion, persona),
      soundType: newEmotion,
      animation: getAnimationType(newEmotion),
      visualTheme: themeSelector.current.select(newEmotion),
    }

    setFeedback(newFeedback)
    setIsActive(true)

    // 播放对应情感音效
    await soundSystemRef.current?.playEmotionalSound(newEmotion, 0.4)

    // 通知父组件情感状态变化
    onEmotionChange?.(newEmotion)

    console.log(`[v0] Generated emotional feedback for ${newEmotion}:`, newFeedback)
  }

  // 获取情感化文本
  const getEmotionalText = (emotion: EmotionState, style: PersonaStyle): string => {
    const texts = {
      happy: {
        warm: "太棒了！您的学习热情让我感到温暖 ✨",
        humor: "哇哦！看起来今天的学习状态超级棒呢！🎉",
        encourage: "继续保持这种积极的学习态度！您做得很好！🚀",
      },
      calm: {
        warm: "感受到您内心的平静，让我们一起专注学习 🌙",
        humor: "像云朵一样轻松自在，学习也可以很惬意哦 ☁️",
        encourage: "保持这种沉稳的状态，稳步前进最重要 💙",
      },
      focused: {
        warm: "您的专注力让我印象深刻，继续保持 🎯",
        humor: "专注模式已开启！大脑正在高速运转中 🧠",
        encourage: "专注是成功的关键，您正走在正确的道路上！💡",
      },
      creative: {
        warm: "感受到您的创意火花在闪耀 ✨",
        humor: "创意大爆发！您的想象力真是太棒了 🎨",
        encourage: "释放您的创造力，让想法自由飞翔！🦋",
      },
      anxious: {
        warm: "我理解您的感受，让我们一起慢慢来 🤗",
        humor: "深呼吸，像小熊猫一样放松下来 🐼",
        encourage: "每一步都是进步，您比想象中更强大 💪",
      },
      confused: {
        warm: "困惑是学习的开始，我们一起探索答案 💡",
        humor: "小问号变成小灯泡的时刻到了！🔍",
        encourage: "提出问题是智慧的表现，继续探索！🌱",
      },
      excited: {
        warm: "您的兴奋感染了我，让我们一起享受学习！🌟",
        humor: "兴奋值爆表！准备好迎接新知识了吗？🎊",
        encourage: "保持这种热情，您将收获满满！🏆",
      },
    }
    return texts[emotion][style] || texts[emotion]["warm"]
  }

  // 获取动画类型
  const getAnimationType = (emotion: EmotionState): string => {
    const animations = {
      happy: "bounce",
      calm: "fade",
      focused: "pulse",
      creative: "rotate",
      anxious: "gentle",
      confused: "shake",
      excited: "zoom",
    }
    return animations[emotion] || "fade"
  }

  // 交互事件处理
  const handleInteraction = (interactionType: string) => {
    if (!emotionDetectorRef.current) return

    const detectedEmotion = emotionDetectorRef.current.detectFromInteraction(interactionType, Date.now())
    if (detectedEmotion !== emotion) {
      generateEmotionalFeedback(detectedEmotion)
    }
  }

  return (
    <div className="emotional-system">
      <AnimatePresence>
        {isActive && feedback && (
          <motion.div
            className="fixed top-4 right-4 z-50 max-w-sm"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl"
              style={{
                background: feedback.visualTheme.backgroundGradient,
                borderColor: feedback.visualTheme.primaryColor + "40",
              }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="text-2xl"
                  animate={
                    feedback.animation === "bounce"
                      ? { y: [0, -10, 0] }
                      : feedback.animation === "pulse"
                        ? { scale: [1, 1.2, 1] }
                        : feedback.animation === "rotate"
                          ? { rotate: [0, 360] }
                          : feedback.animation === "shake"
                            ? { x: [-2, 2, -2, 2, 0] }
                            : feedback.animation === "zoom"
                              ? { scale: [1, 1.5, 1] }
                              : { opacity: [0.7, 1, 0.7] }
                  }
                  transition={{
                    duration: feedback.animation === "rotate" ? 2 : 1,
                    repeat: feedback.animation === "pulse" ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {feedback.emojis[0]}
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2" style={{ color: feedback.visualTheme.secondaryColor }}>
                    {feedback.text}
                  </p>
                  <div className="flex gap-1">
                    {feedback.emojis.slice(1, 4).map((emoji, index) => (
                      <motion.span
                        key={index}
                        className="text-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 情感状态指示器 */}
      <div className="fixed bottom-4 left-4 z-40">
        <motion.div
          className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-xs font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          情感状态: {emotion} | 风格: {persona}
        </motion.div>
      </div>

      {/* 隐藏的交互触发器 */}
      <div
        className="fixed inset-0 pointer-events-none"
        onMouseMove={() => handleInteraction("hover")}
        onClick={() => handleInteraction("click")}
      />
    </div>
  )
}
