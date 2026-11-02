"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import type * as THREE from "three"

function AudioBlock({
  position,
  color,
  onDrag,
}: { position: [number, number, number]; color: string; onDrag: (position: [number, number, number]) => void }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [isDragging, setIsDragging] = useState(false)

  const bind = useDrag(
    ({ offset: [x, y] }) => {
      meshRef.current.position.x = x / 50
      meshRef.current.position.y = -y / 50
      onDrag([meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z])
      setIsDragging(true)
    },
    { preventDefault: true },
  )

  useFrame(() => {
    if (isDragging) {
      meshRef.current.scale.set(1.1, 1.1, 1.1)
    } else {
      meshRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      {...(bind() as ThreeElements["mesh"])}
      onPointerUp={() => setIsDragging(false)}
    >
      <boxGeometry args={[1, 0.5, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function AudioTrackBlocks() {
  const [blocks, setBlocks] = useState([
    { id: 1, position: [-2, 1, 0], color: "#4A00E0" },
    { id: 2, position: [0, 1, 0], color: "#8E2DE2" },
    { id: 3, position: [2, 1, 0], color: "#FF4E00" },
  ])

  const handleDrag = (id: number, newPosition: [number, number, number]) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, position: newPosition } : block)))
  }

  return (
    <div className="w-full h-64">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {blocks.map((block) => (
          <AudioBlock
            key={block.id}
            position={block.position}
            color={block.color}
            onDrag={(newPosition) => handleDrag(block.id, newPosition)}
          />
        ))}
      </Canvas>
    </div>
  )
}
