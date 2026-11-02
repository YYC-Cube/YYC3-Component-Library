import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function GalaxyVortex() {
  const galaxyRef = useRef<THREE.Points>(null)
  const particlesCount = 10000
  const positions = new Float32Array(particlesCount * 3)
  const colors = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3
    const radius = Math.random() * 4 + 0.5
    const angle = Math.random() * Math.PI * 2
    const branchAngle = (i % 3) * ((2 * Math.PI) / 3)

    positions[i3] = Math.cos(angle + branchAngle) * radius
    positions[i3 + 1] = Math.sin(angle + branchAngle) * radius
    positions[i3 + 2] = (Math.random() - 0.5) * 0.5

    const mixedColor = new THREE.Color()
    mixedColor.setHSL(Math.random() * 0.2 + 0.6, 0.8, 0.5)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  useFrame((state, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <points ref={galaxyRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particlesCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
