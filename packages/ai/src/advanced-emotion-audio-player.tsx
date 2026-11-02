"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

// YYC³品牌色彩系统的情感皮肤
const emotionSkins = {
  happy: {
    bg: "linear-gradient(135deg, #fffbe6 0%, #ffdbdb 100%)",
    emoji: "🎉",
    color: "#ff7d7d",
    brandColor: "#F5A623", // 琥珀色
  },
  calm: {
    bg: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
    emoji: "🌊",
    color: "#3090F0",
    brandColor: "#4A90E2", // 云蓝色
  },
  sad: {
    bg: "linear-gradient(135deg, #f4f5f7 0%, #a3b1c6 100%)",
    emoji: "😢",
    color: "#6c7a89",
    brandColor: "#1A3E5E", // 墨青色
  },
  learning: {
    bg: "linear-gradient(135deg, #e6ffed 0%, #b7eb8f 100%)",
    emoji: "📚",
    color: "#36B37E",
    brandColor: "#36B37E", // 竹绿色
  },
  minimal: {
    bg: "#fff",
    emoji: "🎵",
    color: "#222",
    brandColor: "#1A3E5E", // 墨青色
  },
}

interface EmotionAudioPlayerProps {
  url?: string
  emotion?: keyof typeof emotionSkins
  onPlayStateChange?: (playing: boolean) => void
  autoPlay?: boolean
}

export default function AdvancedEmotionAudioPlayer({
  url = "/sounds/success/success_happy.mp3",
  emotion = "minimal",
  onPlayStateChange,
  autoPlay = false,
}: EmotionAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [skin, setSkin] = useState(emotion)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [useSynthMode, setUseSynthMode] = useState(false)

  const createSynthSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      if (audioContext.state === "suspended") {
        audioContext.resume().then(() => {
          console.log("[v0] 音频上下文已恢复")
        })
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)

      console.log("[v0] 合成音效播放成功，频率:", frequency, "持续时间:", duration)
      return true
    } catch (error) {
      console.log("[v0] 合成音效播放失败:", error.message || error)
      return false
    }
  }

  useEffect(() => {
    console.log("[v0] 音效播放状态:", playing)
    if (onPlayStateChange) {
      onPlayStateChange(playing)
    }
  }, [playing, onPlayStateChange])

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play()
      setPlaying(true)
    }
  }, [autoPlay])

  const handleSkinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSkin = e.target.value as keyof typeof emotionSkins
    setSkin(newSkin)
    // 皮肤切换时播放相应音效
    if (playing) {
      setPlaying(false)
      setTimeout(() => {
        setPlaying(true)
      }, 100)
    }
  }

  useEffect(() => {
    console.log("[v0] 初始化音效播放器，直接启用合成音效模式")
    setUseSynthMode(true)
    setAudioError("使用合成音效")
    setAudioLoaded(false)
  }, [])

  const togglePlay = () => {
    console.log("[v0] 尝试播放音效, useSynthMode:", useSynthMode)

    const frequencies = {
      happy: 523.25, // C5
      calm: 440.0, // A4
      sad: 329.63, // E4
      learning: 493.88, // B4
      minimal: 261.63, // C4
    }

    if (playing) {
      setPlaying(false)
      console.log("[v0] 停止播放")
      return
    }

    if (createSynthSound(frequencies[skin], 0.8)) {
      setPlaying(true)
      console.log("[v0] 合成音效开始播放")
      // 模拟播放完成
      setTimeout(() => {
        setPlaying(false)
        console.log("[v0] 合成音效播放完成")
      }, 800)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    // 更新合成音效的音量
    if (useSynthMode) {
      console.log("[v0] 更新合成音效音量:", newVolume)
    }
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!useSynthMode) return

    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const progressBarWidth = progressBar.clientWidth
    const percentage = (clickPosition / progressBarWidth) * 100

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percentage / 100) * audioRef.current.duration
      setProgress(percentage)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      className="w-80 rounded-2xl shadow-lg p-6 flex flex-col items-center m-4 transition-all duration-300"
      style={{
        background: emotionSkins[skin].bg,
        color: emotionSkins[skin].color,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-4xl mb-3"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
        animate={{
          scale: playing ? [1, 1.2, 1] : 1,
          rotate: playing ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          duration: playing ? 2 : 0.5,
          repeat: playing ? Number.POSITIVE_INFINITY : 0,
          repeatType: "reverse",
        }}
      >
        {emotionSkins[skin].emoji}
      </motion.div>

      <motion.button
        className="text-lg px-5 py-2 rounded-xl border-none mb-3 cursor-pointer transition-all duration-200 font-medium text-white"
        onClick={togglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: emotionSkins[skin].brandColor,
        }}
      >
        {playing ? "⏸️ 暂停" : "▶️ 播放"}
      </motion.button>

      <div
        className="w-full h-1.5 rounded-full mb-3 relative overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: playing ? "100%" : "0%",
            backgroundColor: emotionSkins[skin].brandColor,
          }}
        />
      </div>

      <div className="w-full flex justify-between text-sm mb-2 opacity-70">
        <span>{playing ? "播放中" : "就绪"}</span>
        <span>合成音效</span>
      </div>

      <div className="w-full flex items-center mb-2 gap-2">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 rounded-full bg-white bg-opacity-30 outline-none slider"
          style={{
            background: `linear-gradient(to right, ${emotionSkins[skin].brandColor} 0%, ${emotionSkins[skin].brandColor} ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`,
          }}
        />
      </div>

      <select
        className="mt-2 px-3 py-1.5 rounded-md border border-current text-sm bg-white bg-opacity-80 cursor-pointer transition-all duration-200 hover:bg-opacity-100"
        value={skin}
        onChange={handleSkinChange}
        style={{
          borderColor: emotionSkins[skin].brandColor,
          color: emotionSkins[skin].brandColor,
        }}
      >
        <option value="happy">情感：开心 🎉</option>
        <option value="calm">情感：温柔 🌊</option>
        <option value="sad">情感：安慰 😢</option>
        <option value="learning">学习成长 📚</option>
        <option value="minimal">极简科技 🎵</option>
      </select>

      <div className="text-xs opacity-60 mt-1">🎵 Web Audio API 合成音效</div>
    </motion.div>
  )
}
