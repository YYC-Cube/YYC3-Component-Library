"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

interface EmotionAudioPlayerProps {
  emotion: "happy" | "calm" | "sad" | "encouraging" | "default"
  autoPlay?: boolean
  className?: string
}

interface AudioConfig {
  volume: number
  fadeInDuration: number
  fadeOutDuration: number
  soundUrl: string
}

const emotionConfigs: Record<string, AudioConfig> = {
  happy: {
    volume: 0.6,
    fadeInDuration: 0.3,
    fadeOutDuration: 0.5,
    soundUrl: "/sounds/success_happy.mp3",
  },
  calm: {
    volume: 0.3,
    fadeInDuration: 0.8,
    fadeOutDuration: 1.0,
    soundUrl: "/sounds/notify_calm.mp3",
  },
  sad: {
    volume: 0.3,
    fadeInDuration: 1.0,
    fadeOutDuration: 1.2,
    soundUrl: "/sounds/error_sad.mp3",
  },
  encouraging: {
    volume: 0.5,
    fadeInDuration: 0.4,
    fadeOutDuration: 0.6,
    soundUrl: "/sounds/encourage.mp3",
  },
  default: {
    volume: 0.5,
    fadeInDuration: 0.5,
    fadeOutDuration: 0.5,
    soundUrl: "/sounds/default.mp3",
  },
}

export function EmotionAudioPlayer({ emotion, autoPlay = false, className }: EmotionAudioPlayerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const config = emotionConfigs[emotion] || emotionConfigs.default

  // 初始化音频上下文
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
      } catch (error) {
        console.error("[v0] Failed to initialize audio context:", error)
      }
    }

    initAudioContext()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // 播放情感化音效
  const playEmotionSound = async () => {
    if (!audioContextRef.current || !gainNodeRef.current || isPlaying) return

    setIsLoading(true)

    try {
      // 恢复音频上下文（处理浏览器自动播放策略）
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }

      // 获取音频数据
      const response = await fetch(config.soundUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)

      // 创建音频源
      sourceRef.current = audioContextRef.current.createBufferSource()
      sourceRef.current.buffer = audioBuffer
      sourceRef.current.connect(gainNodeRef.current)

      // 设置音量和淡入效果
      const currentTime = audioContextRef.current.currentTime
      gainNodeRef.current.gain.setValueAtTime(0, currentTime)
      gainNodeRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : config.volume, currentTime + config.fadeInDuration)

      // 播放音效
      sourceRef.current.start(0)
      setIsPlaying(true)

      // 音效结束处理
      sourceRef.current.onended = () => {
        setIsPlaying(false)
        sourceRef.current = null
      }
    } catch (error) {
      console.error("[v0] Failed to play emotion sound:", error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 停止播放
  const stopSound = () => {
    if (sourceRef.current && gainNodeRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime
      gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + config.fadeOutDuration)

      setTimeout(() => {
        if (sourceRef.current) {
          sourceRef.current.stop()
          sourceRef.current = null
        }
        setIsPlaying(false)
      }, config.fadeOutDuration * 1000)
    }
  }

  // 切换静音
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (gainNodeRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime
      gainNodeRef.current.gain.linearRampToValueAtTime(isMuted ? config.volume : 0, currentTime + 0.1)
    }
  }

  // 自动播放
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        playEmotionSound()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, emotion])

  // 获取情感对应的颜色和图标
  const getEmotionStyle = () => {
    switch (emotion) {
      case "happy":
        return {
          color: "#F5A623", // 琥珀色
          bgColor: "rgba(245, 166, 35, 0.1)",
          icon: "🎉",
        }
      case "calm":
        return {
          color: "#36B37E", // 竹绿色
          bgColor: "rgba(54, 179, 126, 0.1)",
          icon: "🌊",
        }
      case "sad":
        return {
          color: "#DE4C4A", // 砖红色
          bgColor: "rgba(222, 76, 74, 0.1)",
          icon: "💙",
        }
      case "encouraging":
        return {
          color: "#9B51E0", // 紫藤色
          bgColor: "rgba(155, 81, 224, 0.1)",
          icon: "💪",
        }
      default:
        return {
          color: "#4A90E2", // 云蓝色
          bgColor: "rgba(74, 144, 226, 0.1)",
          icon: "🎵",
        }
    }
  }

  const emotionStyle = getEmotionStyle()

  return (
    <motion.div
      className={`emotion-audio-player ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "20px",
        background: emotionStyle.bgColor,
        border: `1px solid ${emotionStyle.color}`,
        cursor: "pointer",
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 情感图标 */}
      <span style={{ fontSize: "16px" }}>{emotionStyle.icon}</span>

      {/* 播放/暂停按钮 */}
      <motion.button
        onClick={isPlaying ? stopSound : playEmotionSound}
        disabled={isLoading}
        style={{
          background: "none",
          border: "none",
          color: emotionStyle.color,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "2px",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{
              width: "16px",
              height: "16px",
              border: `2px solid ${emotionStyle.color}`,
              borderTop: "2px solid transparent",
              borderRadius: "50%",
            }}
          />
        ) : isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} />
        )}
      </motion.button>

      {/* 静音按钮 */}
      <motion.button
        onClick={toggleMute}
        style={{
          background: "none",
          border: "none",
          color: isMuted ? "#ccc" : emotionStyle.color,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "2px",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </motion.button>

      {/* 音量可视化 */}
      {isPlaying && !isMuted && (
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{
                width: "2px",
                height: "8px",
                background: emotionStyle.color,
                borderRadius: "1px",
              }}
              animate={{
                scaleY: [0.3, 1, 0.3],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
