"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Network, Target } from "lucide-react"

interface KnowledgeNode {
  id: string
  label: string
  category: string
  level: number
  connections: string[]
  mastery: number
  position: { x: number; y: number; z: number }
}

interface KnowledgeEdge {
  from: string
  to: string
  strength: number
  type: "prerequisite" | "related" | "advanced"
}

export default function KnowledgeGraph3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState([0.5])
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  // Sample knowledge graph data
  const [nodes] = useState<KnowledgeNode[]>([
    {
      id: "data-viz-basics",
      label: "数据可视化基础",
      category: "foundation",
      level: 1,
      connections: ["chart-types", "data-processing"],
      mastery: 85,
      position: { x: 0, y: 0, z: 0 },
    },
    {
      id: "chart-types",
      label: "图表类型",
      category: "core",
      level: 2,
      connections: ["interactive-charts", "d3-basics"],
      mastery: 70,
      position: { x: 100, y: 50, z: -50 },
    },
    {
      id: "data-processing",
      label: "数据处理",
      category: "core",
      level: 2,
      connections: ["data-cleaning", "data-analysis"],
      mastery: 60,
      position: { x: -100, y: 50, z: 50 },
    },
    {
      id: "interactive-charts",
      label: "交互式图表",
      category: "advanced",
      level: 3,
      connections: ["animation", "user-interaction"],
      mastery: 45,
      position: { x: 150, y: 100, z: 0 },
    },
    {
      id: "d3-basics",
      label: "D3.js基础",
      category: "technical",
      level: 3,
      connections: ["svg-manipulation", "data-binding"],
      mastery: 30,
      position: { x: 50, y: 100, z: -100 },
    },
    {
      id: "ai-insights",
      label: "AI洞察分析",
      category: "ai",
      level: 4,
      connections: ["pattern-recognition", "predictive-analytics"],
      mastery: 20,
      position: { x: 0, y: 150, z: 75 },
    },
  ])

  const [edges] = useState<KnowledgeEdge[]>([
    { from: "data-viz-basics", to: "chart-types", strength: 0.9, type: "prerequisite" },
    { from: "data-viz-basics", to: "data-processing", strength: 0.8, type: "prerequisite" },
    { from: "chart-types", to: "interactive-charts", strength: 0.7, type: "prerequisite" },
    { from: "chart-types", to: "d3-basics", strength: 0.6, type: "related" },
    { from: "data-processing", to: "ai-insights", strength: 0.5, type: "advanced" },
  ])

  // 3D rendering logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas size
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Update rotation if playing
      if (isPlaying) {
        setRotation((prev) => ({
          x: prev.x + rotationSpeed[0] * 0.01,
          y: prev.y + rotationSpeed[0] * 0.005,
        }))
      }

      // Render edges first (behind nodes)
      edges.forEach((edge) => {
        const fromNode = nodes.find((n) => n.id === edge.from)
        const toNode = nodes.find((n) => n.id === edge.to)

        if (fromNode && toNode) {
          // Simple 3D to 2D projection
          const from2D = project3DTo2D(fromNode.position, centerX, centerY, zoom, rotation)
          const to2D = project3DTo2D(toNode.position, centerX, centerY, zoom, rotation)

          ctx.beginPath()
          ctx.moveTo(from2D.x, from2D.y)
          ctx.lineTo(to2D.x, to2D.y)
          ctx.strokeStyle = edge.type === "prerequisite" ? "#3b82f6" : edge.type === "related" ? "#10b981" : "#f59e0b"
          ctx.lineWidth = edge.strength * 3
          ctx.globalAlpha = 0.6
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })

      // Render nodes
      nodes.forEach((node) => {
        const pos2D = project3DTo2D(node.position, centerX, centerY, zoom, rotation)

        // Node circle
        ctx.beginPath()
        ctx.arc(pos2D.x, pos2D.y, 20 + node.level * 5, 0, 2 * Math.PI)

        // Color based on category
        const colors = {
          foundation: "#3b82f6",
          core: "#10b981",
          advanced: "#f59e0b",
          technical: "#8b5cf6",
          ai: "#ef4444",
        }
        ctx.fillStyle = colors[node.category as keyof typeof colors] || "#6b7280"
        ctx.fill()

        // Mastery ring
        ctx.beginPath()
        ctx.arc(pos2D.x, pos2D.y, 25 + node.level * 5, 0, (node.mastery / 100) * 2 * Math.PI)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.stroke()

        // Label
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(node.label, pos2D.x, pos2D.y + 35 + node.level * 5)
      })

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, edges, isPlaying, rotationSpeed, zoom, rotation])

  // Simple 3D to 2D projection
  const project3DTo2D = (
    pos3D: { x: number; y: number; z: number },
    centerX: number,
    centerY: number,
    zoom: number,
    rotation: { x: number; y: number },
  ) => {
    // Apply rotation
    const cosX = Math.cos(rotation.x)
    const sinX = Math.sin(rotation.x)
    const cosY = Math.cos(rotation.y)
    const sinY = Math.sin(rotation.y)

    // Rotate around Y axis
    const x = pos3D.x * cosY - pos3D.z * sinY
    let z = pos3D.x * sinY + pos3D.z * cosY
    let y = pos3D.y

    // Rotate around X axis
    const newY = y * cosX - z * sinX
    z = y * sinX + z * cosX
    y = newY

    // Project to 2D
    const distance = 300
    const scale = (distance / (distance + z)) * zoom

    return {
      x: centerX + x * scale,
      y: centerY + y * scale,
    }
  }

  const handleNodeClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    // Find clicked node (simplified)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    nodes.forEach((node) => {
      const pos2D = project3DTo2D(node.position, centerX, centerY, zoom, rotation)
      const distance = Math.sqrt((clickX - pos2D.x) ** 2 + (clickY - pos2D.y) ** 2)

      if (distance < 25 + node.level * 5) {
        setSelectedNode(node)
      }
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              3D知识图谱
            </CardTitle>
            <CardDescription>交互式3D知识网络，展示学习路径和知识点关联</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRotation({ x: 0, y: 0 })}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">旋转速度:</span>
              <Slider
                value={rotationSpeed}
                onValueChange={setRotationSpeed}
                max={2}
                min={0}
                step={0.1}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-96 border rounded-lg cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50"
              onClick={handleNodeClick}
            />

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <h4 className="font-semibold text-sm mb-2">图例</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>基础知识</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>核心技能</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>高级应用</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>技术实现</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>AI智能</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  {selectedNode.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">掌握程度</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedNode.mastery}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedNode.mastery}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">难度等级</p>
                    <Badge variant="outline">Level {selectedNode.level}</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">相关知识点</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.connections.map((connectionId) => {
                      const connectedNode = nodes.find((n) => n.id === connectionId)
                      return connectedNode ? (
                        <Badge key={connectionId} variant="secondary" className="text-xs">
                          {connectedNode.label}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
