"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type VoiceTunnelProps = {
  emotion: "neutral" | "angry" | "calm"
  isActive: boolean
}

export default function VoiceTunnel({ emotion, isActive }: VoiceTunnelProps) {
  const tunnelRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = 5000
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount
      const angle = t * Math.PI * 20
      const radius = t * 2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = t * 10 - 5
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += delta * 0.2
    }

    if (particlesRef.current && isActive) {
      particlesRef.current.rotation.z -= delta * 0.5
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 2] -= delta * 2
        if (positions[i3 + 2] < -5) {
          positions[i3 + 2] = 5
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const getEmotionColor = () => {
    switch (emotion) {
      case "angry":
        return new THREE.Color("#FF4444")
      case "calm":
        return new THREE.Color("#44AAFF")
      default:
        return new THREE.Color("#4A00E0")
    }
  }

  return (
    <group>
      {/* Tunnel Mesh */}
      <mesh ref={tunnelRef}>
        <cylinderGeometry args={[2, 2, 10, 32, 1, true]} />
        <meshPhongMaterial side={THREE.BackSide} color={getEmotionColor()} transparent opacity={0.5} />
      </mesh>

      {/* Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={getEmotionColor()}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />

      {/* Directional Lights */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
    </group>
  )
}
