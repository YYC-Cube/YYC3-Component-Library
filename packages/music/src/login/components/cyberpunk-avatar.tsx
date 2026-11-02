import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function CyberpunkAvatar() {
  const avatarRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (avatarRef.current) {
      avatarRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={avatarRef}>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4A00E0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 32]} />
        <meshStandardMaterial color="#8E2DE2" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Neon Lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -0.8, 0, 0, 0.8, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00FFFF" linewidth={2} />
      </line>

      {/* Holographic Aura */}
      <sprite scale={[1.5, 1.5, 1.5]}>
        <spriteMaterial
          map={new THREE.TextureLoader().load("/holographic-texture.png")}
          color="#00FFFF"
          transparent
          opacity={0.5}
        />
      </sprite>

      <pointLight position={[0, 0, 2]} color="#00FFFF" intensity={0.5} />
    </group>
  )
}
