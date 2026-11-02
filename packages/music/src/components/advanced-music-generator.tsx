"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Loader, Music, Play, Pause, Download } from "lucide-react"

export default function AdvancedMusicGenerator() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("电子")
  const [tempo, setTempo] = useState(120)
  const [duration, setDuration] = useState(60)
  const [mood, setMood] = useState("平静")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMusic, setGeneratedMusic] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, tempo, duration, mood }),
      })

      const data = await response.json()
      setGeneratedMusic(data)
    } catch (error) {
      console.error("Error generating music:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Music className="w-6 h-6 text-blue-400 mr-2" />
        高级AI音乐生成器
      </h2>

      <div className="space-y-4">
        <Textarea
          placeholder="描述你想要的音乐..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">音乐风格</label>
            <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="电子、古典、爵士..." />
          </div>

          <div>
            <label className="text-sm font-medium">情绪</label>
            <Input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="平静、激动、忧伤..." />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">速度 (BPM): {tempo}</label>
          <Slider min={60} max={200} step={1} value={[tempo]} onValueChange={(value) => setTempo(value[0])} />
        </div>

        <div>
          <label className="text-sm font-medium">时长 (秒): {duration}</label>
          <Slider min={30} max={180} step={10} value={[duration]} onValueChange={(value) => setDuration(value[0])} />
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating || !prompt} className="w-full">
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            "生成音乐"
          )}
        </Button>
      </div>

      {generatedMusic && (
        <div className="space-y-4">
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">生成结果</h3>
            <p className="text-sm text-white/80">{generatedMusic.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="flex-grow bg-blue-900/30 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: isPlaying ? "100%" : "0%", transitionDuration: isPlaying ? `${duration}s` : "0s" }}
              />
            </div>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
