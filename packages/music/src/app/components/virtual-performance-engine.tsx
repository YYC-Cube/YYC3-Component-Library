"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type * as THREE from "three"

function VirtualIdol({ mood }: { mood: "calm" | "energetic" }) {
  const idolRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (idolRef.current) {
      if (mood === "calm") {
        idolRef.current.rotation.y += delta * 0.5
      } else {
        idolRef.current.rotation.y += delta * 2
        idolRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.1
      }
    }
  })

  return (
    <group ref={idolRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 16]} />
        <meshStandardMaterial color="#4A00E0" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#8E2DE2" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.2, 1.1, 0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.2, 1.1, 0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

const VirtualPerformanceEngine = () => {
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [mood, setMood] = useState<"calm" | "energetic">("calm")
  const [audience, setAudience] = useState(0)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMoodChange = (value: number[]) => {
    setMood(value[0] > 50 ? "energetic" : "calm")
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">虚拟演出引擎</h2>

      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
        />
        {avatarImage && (
          <img src={avatarImage || "/placeholder.svg"} alt="Avatar" className="w-32 h-32 object-cover rounded-full" />
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">表演情绪</label>
        <Slider min={0} max={100} step={1} value={[mood === "calm" ? 0 : 100]} onValueChange={handleMoodChange} />
        <div className="flex justify-between text-sm text-gray-400">
          <span>柔和</span>
          <span>激烈</span>
        </div>
      </div>

      <div className="w-full h-64">
        <Canvas>
          <OrbitControls />
          <Environment preset="sunset" />
          <VirtualIdol mood={mood} />
        </Canvas>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">观众数量: {audience}</label>
        <Slider min={0} max={1000} step={1} value={[audience]} onValueChange={(value) => setAudience(value[0])} />
      </div>

      <Button onClick={() => alert("虚拟演唱会开始！")}>开始演出</Button>
    </div>
  )
}

export default VirtualPerformanceEngine
