"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { type InstancedMesh, Object3D, MeshStandardMaterial, BufferGeometry } from "three"
import { AdaptiveDpr, AdaptiveEvents, BakeShadows } from "@react-three/drei"

// 实例化渲染优化
function InstancedParticles({ count = 1000 }) {
  const mesh = useRef<InstancedMesh>(null!)
  const { viewport, camera } = useThree()

  // 使用useMemo缓存几何体和材质
  const [geometry, material] = useMemo(() => {
    return [
      new BufferGeometry().setFromPoints(Array.from({ length: 1 }, () => ({ x: 0, y: 0, z: 0 }))),
      new MeshStandardMaterial({ color: "#4A00E0" }),
    ]
  }, [])

  // 使用useMemo预计算实例位置
  const dummy = useMemo(() => new Object3D(), [])
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        (Math.random() - 0.5) * 10,
      ],
      scale: Math.random() * 0.2 + 0.05,
      rotation: Math.random() * Math.PI,
    }))
  }, [count, viewport])

  useEffect(() => {
    // 一次性设置所有实例
    particles.forEach((particle, i) => {
      const [x, y, z] = particle.position
      dummy.position.set(x, y, z)
      dummy.rotation.set(0, particle.rotation, 0)
      dummy.scale.set(particle.scale, particle.scale, particle.scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [particles, dummy])

  // 优化动画帧率
  useFrame((state) => {
    // 只在可见区域内更新
    if (mesh.current.position.z > camera.position.z + 10) return

    // 使用时间增量而不是固定值
    const time = state.clock.getElapsedTime() * 0.1
    mesh.current.rotation.y = time
  })

  return (
    <instancedMesh ref={mesh} args={[geometry, material, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#4A00E0" />
    </instancedMesh>
  )
}

export default function OptimizedThreeScene() {
  return (
    <div className="w-full h-96">
      <Canvas>
        {/* 性能优化组件 */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <InstancedParticles count={1000} />
      </Canvas>
    </div>
  )
}
