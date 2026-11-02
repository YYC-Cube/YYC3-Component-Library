"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { EmotionAudioPlayer } from "@/components/audio/emotion-audio-player"
import { Brain, Lightbulb, Target, Award } from "lucide-react"

interface LearningSession {
  id: string
  title: string
  progress: number
  difficulty: "beginner" | "intermediate" | "advanced"
  emotion: "happy" | "calm" | "sad" | "encouraging" | "default"
  achievements: string[]
}

interface EnhancedLearningExperienceProps {
  onEmotionChange?: (emotion: "happy" | "calm" | "sad" | "encouraging" | "default") => void
}

export function EnhancedLearningExperience({ onEmotionChange }: EnhancedLearningExperienceProps) {
  const [currentSession, setCurrentSession] = useState<LearningSession>({
    id: "1",
    title: "数据可视化基础",
    progress: 65,
    difficulty: "beginner",
    emotion: "encouraging",
    achievements: ["完成第一个图表", "掌握基础概念"],
  })

  const [learningMood, setLearningMood] = useState<"focused" | "struggling" | "achieving" | "exploring">("focused")

  // 根据学习状态自动调整情感音效
  useEffect(() => {
    let emotion: "happy" | "calm" | "sad" | "encouraging" | "default" = "default"

    switch (learningMood) {
      case "achieving":
        emotion = "happy"
        break
      case "focused":
        emotion = "calm"
        break
      case "struggling":
        emotion = "encouraging"
        break
      case "exploring":
        emotion = "default"
        break
    }

    setCurrentSession((prev) => ({ ...prev, emotion }))
    onEmotionChange?.(emotion)
  }, [learningMood, onEmotionChange])

  // 模拟学习进度更新
  const updateProgress = (increment: number) => {
    setCurrentSession((prev) => {
      const newProgress = Math.min(100, prev.progress + increment)

      // 根据进度变化调整学习心情
      if (increment > 0) {
        if (newProgress >= 90) {
          setLearningMood("achieving")
        } else {
          setLearningMood("focused")
        }
      } else {
        setLearningMood("struggling")
      }

      return { ...prev, progress: newProgress }
    })
  }

  // 获取难度对应的颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#36B37E" // 竹绿色
      case "intermediate":
        return "#4A90E2" // 云蓝色
      case "advanced":
        return "#9B51E0" // 紫藤色
      default:
        return "#4A90E2"
    }
  }

  // 获取学习心情对应的图标和描述
  const getMoodInfo = (mood: string) => {
    switch (mood) {
      case "focused":
        return { icon: <Brain className="h-5 w-5" />, text: "专注学习中", color: "#4A90E2" }
      case "struggling":
        return { icon: <Lightbulb className="h-5 w-5" />, text: "需要帮助", color: "#F5A623" }
      case "achieving":
        return { icon: <Award className="h-5 w-5" />, text: "表现优秀", color: "#36B37E" }
      case "exploring":
        return { icon: <Target className="h-5 w-5" />, text: "探索新知", color: "#9B51E0" }
      default:
        return { icon: <Brain className="h-5 w-5" />, text: "学习中", color: "#4A90E2" }
    }
  }

  const moodInfo = getMoodInfo(learningMood)

  return (
    <motion.div
      className="enhanced-learning-experience"
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginBottom: "24px",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 学习会话信息 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3
            style={{
              color: "#1A3E5E",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {currentSession.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                background: getDifficultyColor(currentSession.difficulty),
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {currentSession.difficulty === "beginner"
                ? "初级"
                : currentSession.difficulty === "intermediate"
                  ? "中级"
                  : "高级"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: moodInfo.color }}>
              {moodInfo.icon}
              <span style={{ fontSize: "14px" }}>{moodInfo.text}</span>
            </div>
          </div>
        </div>

        {/* 情感音效播放器 */}
        <EmotionAudioPlayer emotion={currentSession.emotion} autoPlay={false} />
      </div>

      {/* 学习进度 */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span style={{ color: "#1A3E5E", fontWeight: "bold" }}>学习进度</span>
          <span style={{ color: "#4A90E2", fontWeight: "bold" }}>{currentSession.progress}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${getDifficultyColor(currentSession.difficulty)}, #36B37E)`,
              borderRadius: "4px",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${currentSession.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* 成就展示 */}
      {currentSession.achievements.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ color: "#1A3E5E", marginBottom: "12px", fontWeight: "bold" }}>🏆 学习成就</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {currentSession.achievements.map((achievement, index) => (
              <motion.span
                key={index}
                style={{
                  background: "linear-gradient(135deg, #F5A623, #F7931E)",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {achievement}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* 学习控制按钮 */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <motion.button
          onClick={() => updateProgress(10)}
          style={{
            background: "#36B37E",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          完成练习 (+10%)
        </motion.button>

        <motion.button
          onClick={() => updateProgress(-5)}
          style={{
            background: "#F5A623",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          需要帮助 (-5%)
        </motion.button>

        <motion.button
          onClick={() => setLearningMood("exploring")}
          style={{
            background: "#9B51E0",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          探索新内容
        </motion.button>
      </div>
    </motion.div>
  )
}
