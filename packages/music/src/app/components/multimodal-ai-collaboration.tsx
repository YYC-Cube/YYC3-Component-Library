"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"

// Simulated AI generation functions
const generateMusic = async (prompt: string) => {
  console.log("Generating music for:", prompt)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return "https://example.com/generated_music.mp3"
}

const generateScene = async (prompt: string) => {
  console.log("Generating 3D scene for:", prompt)
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return "https://example.com/generated_scene.glb"
}

const generateLyrics = async (prompt: string) => {
  console.log("Generating lyrics for:", prompt)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return "AI generated lyrics based on the prompt: " + prompt
}

const MultimodalAICollaboration = () => {
  const [prompt, setPrompt] = useState("")
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null)
  const [generatedScene, setGeneratedScene] = useState<string | null>(null)
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null)
  const [aiHumanBalance, setAiHumanBalance] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    const musicUrl = await generateMusic(prompt)
    const sceneUrl = await generateScene(prompt)
    const lyrics = await generateLyrics(prompt)
    setGeneratedMusic(musicUrl)
    setGeneratedScene(sceneUrl)
    setGeneratedLyrics(lyrics)
    setIsGenerating(false)
  }

  const handleAIHumanBalanceChange = (value: number[]) => {
    setAiHumanBalance(value[0])
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">多模态AI艺术家协作系统</h2>

      <Textarea
        placeholder="输入你的创意故事大纲..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">AI-人类协作比例</label>
        <Slider min={0} max={100} step={1} value={[aiHumanBalance]} onValueChange={handleAIHumanBalanceChange} />
        <div className="flex justify-between text-sm text-gray-400">
          <span>全AI生成</span>
          <span>AI辅助</span>
          <span>纯人工</span>
        </div>
      </div>

      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "生成中..." : "开始创作"}
      </Button>

      {generatedMusic && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">生成的音乐</h3>
          <audio controls src={generatedMusic} className="w-full" />
        </div>
      )}

      {generatedLyrics && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">生成的歌词</h3>
          <p className="text-sm bg-black/30 p-4 rounded">{generatedLyrics}</p>
        </div>
      )}

      {generatedScene && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">生成的3D场景</h3>
          <div className="w-full h-64">
            <Canvas>
              <OrbitControls />
              <Environment preset="city" />
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </Canvas>
          </div>
        </div>
      )}
    </div>
  )
}

export default MultimodalAICollaboration
