"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Html } from "@react-three/drei"
import type * as THREE from "three"

function HolographicSphere({ isExploding }: { isExploding: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const particlesRef = useRef<THREE.Points>(null!)

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.5
    }
    if (particlesRef.current && isExploding) {
      particlesRef.current.rotation.y += delta * 2
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] *= 1.01
        positions[i + 1] *= 1.01
        positions[i + 2] *= 1.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <Sphere ref={sphereRef} args={[1, 32, 32]}>
        <meshPhongMaterial
          color="#4A00E0"
          emissive="#8E2DE2"
          specular="#FFFFFF"
          shininess={100}
          transparent
          opacity={0.8}
        />
      </Sphere>
      {isExploding && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1000}
              array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.05} color="#00FFFF" />
        </points>
      )}
    </group>
  )
}

export default function HolographicCapsule() {
  const [isExploding, setIsExploding] = useState(false)
  const [showDNA, setShowDNA] = useState(false)

  const handleLongPress = () => {
    setIsExploding(true)
    setTimeout(() => {
      setShowDNA(true)
    }, 2000)
  }

  return (
    <div className="w-full h-64 relative">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <HolographicSphere isExploding={isExploding} />
        {showDNA && (
          <Html center>
            <div className="text-white text-xs bg-black/50 p-2 rounded">版权DNA: 0x7f3a2b1c...</div>
          </Html>
        )}
      </Canvas>
      <button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded"
        onMouseDown={() => setTimeout(handleLongPress, 1000)}
        onMouseUp={() => clearTimeout()}
        onTouchStart={() => setTimeout(handleLongPress, 1000)}
        onTouchEnd={() => clearTimeout()}
      >
        长按导出
      </button>
    </div>
  )
}
