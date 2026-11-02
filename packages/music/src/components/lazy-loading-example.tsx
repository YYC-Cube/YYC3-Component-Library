"use client"

import { Suspense, lazy } from "react"
import { Loader } from "lucide-react"

// 懒加载重量级组件
const HeavyComponent = lazy(() => import("./heavy-component"))
const AIMVGenerator = lazy(() => import("./creation/AIMVGenerator"))
const ThreeDVisualization = lazy(() => import("./3d-visualization"))

export default function LazyLoadingExample() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">懒加载组件示例</h2>

      {/* 使用Suspense包裹懒加载组件 */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64 bg-deep-space-blue/30 rounded-lg">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-2">加载中...</span>
          </div>
        }
      >
        <HeavyComponent />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64 bg-deep-space-blue/30 rounded-lg">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-2">加载MV生成器...</span>
          </div>
        }
      >
        <AIMVGenerator />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64 bg-deep-space-blue/30 rounded-lg">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-2">加载3D可视化...</span>
          </div>
        }
      >
        <ThreeDVisualization />
      </Suspense>
    </div>
  )
}
