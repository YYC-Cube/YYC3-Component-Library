"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
}

interface SimpleBarChartProps {
  data: DataPoint[]
  height?: number
  barColor?: string
  labelColor?: string
}

export function SimpleBarChart({
  data,
  height = 200,
  barColor = "#3b82f6",
  labelColor = "#6b7280",
}: SimpleBarChartProps) {
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
    const barWidth = (canvas.offsetWidth / data.length) * 0.6
    const spacing = (canvas.offsetWidth / data.length) * 0.4
    const barHeightScale = (height - 40) / maxValue

    // Draw bars
    data.forEach((point, index) => {
      const x = index * (barWidth + spacing) + spacing / 2
      const barHeight = point.value * barHeightScale
      const y = height - barHeight - 25

      // Draw bar
      ctx.fillStyle = barColor
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 4)
      ctx.fill()

      // Draw label
      ctx.fillStyle = labelColor
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(point.label, x + barWidth / 2, height - 10)

      // Draw value
      ctx.fillStyle = labelColor
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5)
    })
  }, [data, height, barColor, labelColor])

  return <canvas ref={canvasRef} style={{ width: "100%", height }} />
}
