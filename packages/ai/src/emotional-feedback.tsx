"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Zap, Target, Coffee } from "lucide-react"

interface EmotionalFeedbackProps {
  userEmotion: "happy" | "anxious" | "confused" | "motivated" | "neutral"
  onEmotionChange: (emotion: string) => void
}

export function EmotionalFeedback({ userEmotion, onEmotionChange }: EmotionalFeedbackProps) {
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState("😊")

  const emotionConfig = {
    happy: {
      emoji: "😊",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      message: "学习状态很棒！继续保持这种积极性",
      suggestions: ["尝试更有挑战性的内容", "分享你的学习心得"],
    },
    motivated: {
      emoji: "🚀",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      message: "动力满满！是学习的好时机",
      suggestions: ["制定更高的学习目标", "探索新的知识领域"],
    },
    anxious: {
      emoji: "😰",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      message: "感到有压力？让我们放慢节奏",
      suggestions: ["回顾已掌握的内容", "尝试更简单的练习"],
    },
    confused: {
      emoji: "🤔",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      message: "遇到困难很正常，我们一起解决",
      suggestions: ["查看相关基础知识", "寻求AI助手帮助"],
    },
    neutral: {
      emoji: "😐",
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      message: "准备好开始学习了吗？",
      suggestions: ["选择感兴趣的主题", "设定学习目标"],
    },
  }

  const config = emotionConfig[userEmotion]

  useEffect(() => {
    setCurrentEmoji(config.emoji)
    if (userEmotion === "happy" || userEmotion === "motivated") {
      setShowEncouragement(true)
      const timer = setTimeout(() => setShowEncouragement(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [userEmotion, config.emoji])

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {currentEmoji}
          </motion.div>
          <div>
            <h3 className={`font-semibold ${config.color}`}>情感状态检测</h3>
            <p className="text-sm text-muted-foreground">{config.message}</p>
          </div>
        </div>

        <AnimatePresence>
          {showEncouragement && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-2 bg-white/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">太棒了！学习动力爆棚 🎉</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">建议行动：</p>
          {config.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-1 h-1 rounded-full bg-current opacity-50"></div>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEmotionChange("happy")}
            className="flex items-center gap-1"
          >
            <Smile className="w-3 h-3" />
            开心
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEmotionChange("motivated")}
            className="flex items-center gap-1"
          >
            <Target className="w-3 h-3" />
            有动力
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEmotionChange("anxious")}
            className="flex items-center gap-1"
          >
            <Coffee className="w-3 h-3" />
            有压力
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
