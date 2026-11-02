"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, SkipForward, Video, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type MVStyle = "movie" | "anime" | "vlog"

export default function AIMVGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // Assuming 3 minutes duration
  const [selectedStyle, setSelectedStyle] = useState<MVStyle>("movie")
  const [lyricsVisualization, setLyricsVisualization] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prevTime + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate MV generation
    setTimeout(() => {
      setIsGenerating(false)
      setIsPlaying(true)
    }, 3000)
  }

  const togglePlay = () => setIsPlaying(!isPlaying)

  const handleStyleChange = (style: MVStyle) => setSelectedStyle(style)

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
    if (!isPlaying) setIsPlaying(true)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">AI智能MV生成系统</h2>

      <div className="flex space-x-4">
        <Button variant={selectedStyle === "movie" ? "default" : "outline"} onClick={() => handleStyleChange("movie")}>
          电影感
        </Button>
        <Button variant={selectedStyle === "anime" ? "default" : "outline"} onClick={() => handleStyleChange("anime")}>
          动漫风
        </Button>
        <Button variant={selectedStyle === "vlog" ? "default" : "outline"} onClick={() => handleStyleChange("vlog")}>
          Vlog
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => setLyricsVisualization(!lyricsVisualization)}>
          <Type className={`h-4 w-4 ${lyricsVisualization ? "text-blue-500" : ""}`} />
        </Button>
        <span className="text-sm">歌词可视化: {lyricsVisualization ? "开启" : "关闭"}</span>
      </div>

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-16 h-16 text-gray-600" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
        <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} />
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" size="icon" onClick={togglePlay} disabled={isGenerating}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" disabled={isGenerating}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "生成中..." : "生成MV"}
        </Button>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
