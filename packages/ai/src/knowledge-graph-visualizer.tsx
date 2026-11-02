"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network, GitBranch, Zap, Brain, Search, Filter, Download, Share2, Eye, EyeOff } from "lucide-react"

interface KnowledgeNode {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  estimatedTime: number
  prerequisites: string[]
  completed: boolean
  position: { x: number; y: number }
  connections: string[]
  importance: number // PageRank权重
  emotion?: "neutral" | "encouraging" | "challenging"
}

interface KnowledgeEdge {
  source: string
  target: string
  type: "prerequisite" | "related" | "extension"
  weight: number
}

interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

// 示例知识图谱数据
const sampleKnowledgeGraph: KnowledgeGraph = {
  nodes: [
    {
      id: "1",
      title: "HTML基础",
      description: "网页结构的基础语言",
      difficulty: "beginner",
      category: "前端基础",
      estimatedTime: 60,
      prerequisites: [],
      completed: true,
      position: { x: 100, y: 200 },
      connections: ["2", "3"],
      importance: 0.9,
      emotion: "encouraging",
    },
    {
      id: "2",
      title: "CSS样式",
      description: "网页样式和布局设计",
      difficulty: "beginner",
      category: "前端基础",
      estimatedTime: 90,
      prerequisites: ["1"],
      completed: true,
      position: { x: 300, y: 150 },
      connections: ["1", "4", "5"],
      importance: 0.8,
      emotion: "neutral",
    },
    {
      id: "3",
      title: "JavaScript基础",
      description: "网页交互编程语言",
      difficulty: "intermediate",
      category: "编程语言",
      estimatedTime: 120,
      prerequisites: ["1"],
      completed: false,
      position: { x: 300, y: 250 },
      connections: ["1", "6", "7"],
      importance: 0.95,
      emotion: "challenging",
    },
    {
      id: "4",
      title: "CSS Grid布局",
      description: "现代网页布局技术",
      difficulty: "intermediate",
      category: "前端进阶",
      estimatedTime: 75,
      prerequisites: ["2"],
      completed: false,
      position: { x: 500, y: 100 },
      connections: ["2", "8"],
      importance: 0.6,
      emotion: "neutral",
    },
    {
      id: "5",
      title: "CSS动画",
      description: "网页动画效果实现",
      difficulty: "intermediate",
      category: "前端进阶",
      estimatedTime: 90,
      prerequisites: ["2"],
      completed: false,
      position: { x: 500, y: 200 },
      connections: ["2", "8"],
      importance: 0.5,
      emotion: "encouraging",
    },
    {
      id: "6",
      title: "DOM操作",
      description: "动态操作网页元素",
      difficulty: "intermediate",
      category: "前端进阶",
      estimatedTime: 100,
      prerequisites: ["3"],
      completed: false,
      position: { x: 500, y: 300 },
      connections: ["3", "7", "8"],
      importance: 0.7,
      emotion: "neutral",
    },
    {
      id: "7",
      title: "ES6+特性",
      description: "现代JavaScript语法",
      difficulty: "intermediate",
      category: "编程语言",
      estimatedTime: 110,
      prerequisites: ["3"],
      completed: false,
      position: { x: 500, y: 400 },
      connections: ["3", "6", "9"],
      importance: 0.8,
      emotion: "challenging",
    },
    {
      id: "8",
      title: "React基础",
      description: "现代前端框架",
      difficulty: "advanced",
      category: "前端框架",
      estimatedTime: 150,
      prerequisites: ["4", "5", "6"],
      completed: false,
      position: { x: 700, y: 200 },
      connections: ["4", "5", "6", "9"],
      importance: 0.9,
      emotion: "challenging",
    },
    {
      id: "9",
      title: "React Hooks",
      description: "现代React开发模式",
      difficulty: "advanced",
      category: "前端框架",
      estimatedTime: 120,
      prerequisites: ["7", "8"],
      completed: false,
      position: { x: 900, y: 300 },
      connections: ["7", "8"],
      importance: 0.85,
      emotion: "challenging",
    },
  ],
  edges: [
    { source: "1", target: "2", type: "prerequisite", weight: 0.9 },
    { source: "1", target: "3", type: "prerequisite", weight: 0.8 },
    { source: "2", target: "4", type: "prerequisite", weight: 0.7 },
    { source: "2", target: "5", type: "prerequisite", weight: 0.6 },
    { source: "3", target: "6", type: "prerequisite", weight: 0.8 },
    { source: "3", target: "7", type: "prerequisite", weight: 0.9 },
    { source: "4", target: "8", type: "prerequisite", weight: 0.6 },
    { source: "5", target: "8", type: "prerequisite", weight: 0.5 },
    { source: "6", target: "8", type: "prerequisite", weight: 0.8 },
    { source: "7", target: "9", type: "prerequisite", weight: 0.9 },
    { source: "8", target: "9", type: "prerequisite", weight: 0.8 },
    { source: "6", target: "7", type: "related", weight: 0.4 },
  ],
}

function KnowledgeGraphNode({
  node,
  isSelected,
  onSelect,
  onComplete,
  scale = 1,
}: {
  node: KnowledgeNode
  isSelected: boolean
  onSelect: (id: string) => void
  onComplete: (id: string) => void
  scale?: number
}) {
  const getDifficultyColor = () => {
    switch (node.difficulty) {
      case "beginner":
        return "#36B37E" // 竹绿色
      case "intermediate":
        return "#4A90E2" // 云蓝色
      case "advanced":
        return "#9B51E0" // 紫藤色
      default:
        return "#4A90E2"
    }
  }

  const getEmotionBorder = () => {
    switch (node.emotion) {
      case "encouraging":
        return "#F5A623" // 琥珀色
      case "challenging":
        return "#DE4C4A" // 砖红色
      default:
        return getDifficultyColor()
    }
  }

  const nodeSize = 60 + node.importance * 40 // 根据重要性调整大小

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: node.position.x * scale,
        top: node.position.y * scale,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.2 : 1,
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => onSelect(node.id)}
    >
      <div
        className="relative flex items-center justify-center rounded-full text-white font-bold text-sm shadow-lg"
        style={{
          width: nodeSize,
          height: nodeSize,
          backgroundColor: getDifficultyColor(),
          border: `3px solid ${getEmotionBorder()}`,
          boxShadow: isSelected ? "0 0 20px rgba(74, 144, 226, 0.5)" : "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {node.completed && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs">
            ✓
          </div>
        )}
        <div className="text-center">
          <div className="text-xs font-bold">{node.title.split(" ")[0]}</div>
          <div className="text-xs opacity-80">{node.estimatedTime}min</div>
        </div>
      </div>

      {/* 节点详情弹窗 */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-64 shadow-xl border-2" style={{ borderColor: getEmotionBorder() }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    style={{
                      backgroundColor: getDifficultyColor(),
                      color: "white",
                    }}
                  >
                    {node.difficulty === "beginner" ? "初级" : node.difficulty === "intermediate" ? "中级" : "高级"}
                  </Badge>
                  <div className="text-sm text-muted-foreground">重要性: {(node.importance * 100).toFixed(0)}%</div>
                </div>
                <CardTitle className="text-sm">{node.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{node.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>类别: {node.category}</span>
                  <span>时长: {node.estimatedTime}分钟</span>
                </div>
                {node.prerequisites.length > 0 && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">前置要求: </span>
                    <span>{node.prerequisites.length}个</span>
                  </div>
                )}
                {!node.completed && (
                  <Button size="sm" className="w-full mt-2" onClick={() => onComplete(node.id)}>
                    标记完成
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function KnowledgeGraphEdge({
  edge,
  nodes,
  scale = 1,
}: {
  edge: KnowledgeEdge
  nodes: KnowledgeNode[]
  scale?: number
}) {
  const sourceNode = nodes.find((n) => n.id === edge.source)
  const targetNode = nodes.find((n) => n.id === edge.target)

  if (!sourceNode || !targetNode) return null

  const getEdgeColor = () => {
    switch (edge.type) {
      case "prerequisite":
        return "#4A90E2" // 云蓝色
      case "related":
        return "#F5A623" // 琥珀色
      case "extension":
        return "#36B37E" // 竹绿色
      default:
        return "#4A90E2"
    }
  }

  const strokeWidth = 2 + edge.weight * 3

  return (
    <motion.line
      x1={sourceNode.position.x * scale}
      y1={sourceNode.position.y * scale}
      x2={targetNode.position.x * scale}
      y2={targetNode.position.y * scale}
      stroke={getEdgeColor()}
      strokeWidth={strokeWidth}
      strokeDasharray={edge.type === "related" ? "5,5" : "0"}
      opacity={0.7}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  )
}

export default function KnowledgeGraphVisualizer() {
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph>(sampleKnowledgeGraph)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"full" | "path" | "completed">("full")
  const [searchTerm, setSearchTerm] = useState("")
  const [showEdges, setShowEdges] = useState(true)
  const [scale, setScale] = useState(1)

  const filteredNodes = knowledgeGraph.nodes.filter((node) => {
    const matchesSearch = searchTerm === "" || node.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesView =
      viewMode === "full" ||
      (viewMode === "completed" && node.completed) ||
      (viewMode === "path" &&
        !node.completed &&
        node.prerequisites.every((prereq) => knowledgeGraph.nodes.find((n) => n.id === prereq)?.completed))

    return matchesSearch && matchesView
  })

  const handleCompleteNode = useCallback((nodeId: string) => {
    setKnowledgeGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => (node.id === nodeId ? { ...node, completed: true } : node)),
    }))
  }, [])

  const completedCount = knowledgeGraph.nodes.filter((node) => node.completed).length
  const totalCount = knowledgeGraph.nodes.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                知识图谱可视化
                <Badge variant="outline">{totalCount}个节点</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">基于PageRank算法的智能知识关联</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEdges(!showEdges)}
              className="flex items-center gap-2"
            >
              {showEdges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              连接线
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索知识点..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="full">全部节点</option>
              <option value="path">学习路径</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">缩放:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number.parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">{(scale * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* 进度统计 */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">学习进度</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} ({progressPercentage.toFixed(0)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        {/* 图例 */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-sm">初级</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">中级</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-sm">高级</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500"></div>
            <span className="text-sm">前置关系</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-1 bg-amber-500"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, transparent, transparent 2px, #F5A623 2px, #F5A623 4px)",
              }}
            ></div>
            <span className="text-sm">相关关系</span>
          </div>
        </div>

        {/* 知识图谱可视化区域 */}
        <div className="relative w-full h-96 border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <svg className="absolute inset-0 w-full h-full">
            {showEdges &&
              knowledgeGraph.edges.map((edge, index) => (
                <KnowledgeGraphEdge
                  key={`${edge.source}-${edge.target}`}
                  edge={edge}
                  nodes={filteredNodes}
                  scale={scale}
                />
              ))}
          </svg>

          {filteredNodes.map((node) => (
            <KnowledgeGraphNode
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={setSelectedNode}
              onComplete={handleCompleteNode}
              scale={scale}
            />
          ))}

          {/* 空状态 */}
          {filteredNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>没有找到匹配的知识点</p>
                <p className="text-sm">尝试调整搜索条件或视图模式</p>
              </div>
            </div>
          )}
        </div>

        {/* 底部统计信息 */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              显示节点: {filteredNodes.length}/{totalCount}
            </span>
            <span>连接关系: {knowledgeGraph.edges.length}</span>
            <span>
              平均重要性:{" "}
              {(
                (knowledgeGraph.nodes.reduce((acc, node) => acc + node.importance, 0) / knowledgeGraph.nodes.length) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <GitBranch className="w-4 h-4 mr-2" />
              生成路径
            </Button>
            <Button size="sm">
              <Zap className="w-4 h-4 mr-2" />
              AI优化
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
