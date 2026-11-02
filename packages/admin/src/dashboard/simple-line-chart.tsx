"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
}

interface SimpleLineChartProps {
  data: DataPoint[]
  height?: number
  lineColor?: string
  fillColor?: string
  labelColor?: string
}

export function SimpleLineChart({
  data,
  height = 200,
  lineColor = "#3b82f6",
  fillColor = "rgba(59, 130, 246, 0.1)",
  labelColor = "#6b7280",
}: SimpleLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Calculate max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value))
    const pointSpacing = canvas.offsetWidth / (data.length - 1)
    const pointHeightScale = (height - 40) / maxValue

    // Draw line and fill
    ctx.beginPath()
    ctx.moveTo(0, height - data[0].value * pointHeightScale - 25)

    data.forEach((point, index) => {
      const x = index * pointSpacing
      const y = height - point.value * pointHeightScale - 25
      ctx.lineTo(x, y)
    })

    // Fill area under the line
    ctx.lineTo((data.length - 1) * pointSpacing, height - 25)
    ctx.lineTo(0, height - 25)
    ctx.fillStyle = fillColor
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.moveTo(0, height - data[0].value * pointHeightScale - 25)

    data.forEach((point, index) => {
      const x = index * pointSpacing
      const y = height - point.value * pointHeightScale - 25
      ctx.lineTo(x, y)
    })

    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points and labels
    data.forEach((point, index) => {
      const x = index * pointSpacing
      const y = height - point.value * pointHeightScale - 25

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"
      ctx.fill()
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label
      ctx.fillStyle = labelColor
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(point.label, x, height - 10)
    })
  }, [data, height, lineColor, fillColor, labelColor])

  return <canvas ref={canvasRef} style={{ width: "100%", height }} />
}
