import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Icosahedron, Box, Octahedron } from "@react-three/drei"
import type * as THREE from "three"

type Props = {
  colorTheme?: {
    primary: string
    secondary: string
    accent: string
  }
}

export function LowPolyButton({ colorTheme }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const defaultColor = "#4A00E0"

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <Octahedron ref={meshRef} args={[1, 0]}>
      <meshPhongMaterial color={colorTheme?.primary || defaultColor} shininess={100} />
    </Octahedron>
  )
}

export function DataVisualization({ colorTheme }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          args={[0.1, 0.1, 0.1]}
          position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5].map((v) => v * 2)}
        >
          <meshPhongMaterial color={colorTheme?.secondary || "#8E2DE2"} transparent opacity={0.7} />
        </Box>
      ))}
    </group>
  )
}

export function CyberpunkAvatar({ colorTheme }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <Icosahedron ref={meshRef} args={[1, 1]}>
      <meshPhongMaterial color={colorTheme?.accent || "#FF4E00"} wireframe />
    </Icosahedron>
  )
}
