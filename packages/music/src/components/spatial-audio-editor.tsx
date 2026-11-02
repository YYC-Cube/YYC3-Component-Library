"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import type * as THREE from "three"

function AudioTrack({ position, color, name }: { position: [number, number, number]; color: string; name: string }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const { camera } = useThree()

  useFrame(() => {
    if (mesh.current) {
      mesh.current.lookAt(camera.position)
    }
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
      <Text position={[0, 0.7, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </mesh>
  )
}

const SpatialAudioEditor = () => {
  const [tracks, setTracks] = useState([
    { id: 1, name: "主音轨", position: [0, 0, 0], color: "#ff0000" },
    { id: 2, name: "和声", position: [2, 0, 2], color: "#00ff00" },
    { id: 3, name: "鼓点", position: [-2, 0, -2], color: "#0000ff" },
  ])

  const [selectedTrack, setSelectedTrack] = useState<number | null>(null)
  const [volume, setVolume] = useState(50)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleTrackMove = (id: number, newPosition: [number, number, number]) => {
    setTracks(tracks.map((track) => (track.id === id ? { ...track, position: newPosition } : track)))
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    // Here you would implement actual volume change logic
    console.log(`Changed volume for track ${selectedTrack} to ${value[0]}`)
  }

  useEffect(() => {
    // Any code that needs to access DOM elements should be placed here
    // For example, if you need to add event listeners to the canvas:
    if (canvasRef.current) {
      const canvasElement = canvasRef.current.querySelector("canvas")
      if (canvasElement) {
        const handleCanvasClick = (event: MouseEvent) => {
          // Handle canvas click event
          console.log("Canvas clicked", event)
        }
        canvasElement.addEventListener("click", handleCanvasClick)
        return () => {
          canvasElement.removeEventListener("click", handleCanvasClick)
        }
      }
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">三维空间化视听编辑</h2>

      <div ref={canvasRef} className="w-full h-96">
        <Canvas camera={{ position: [0, 5, 10] }}>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {tracks.map((track) => (
            <AudioTrack key={track.id} position={track.position} color={track.color} name={track.name} />
          ))}
        </Canvas>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">音轨控制</h3>
        <div className="flex space-x-4">
          {tracks.map((track) => (
            <motion.button
              key={track.id}
              className={`px-4 py-2 rounded-full ${selectedTrack === track.id ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedTrack(track.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {track.name}
            </motion.button>
          ))}
        </div>
        {selectedTrack && (
          <div className="space-y-2">
            <label className="text-sm font-medium">音量</label>
            <Slider min={0} max={100} step={1} value={[volume]} onValueChange={handleVolumeChange} />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-400">提示：在3D场景中拖动音轨图标来调整空间音频位置。选择音轨后可以调节音量。</p>
    </div>
  )
}

export default SpatialAudioEditor
