"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
  color: string
}

interface SimpleDonutChartProps {
  data: DataPoint[]
  size?: number
  thickness?: number
  labelColor?: string
}

export function SimpleDonutChart({ data, size = 200, thickness = 40, labelColor = "#6b7280" }: SimpleDonutChartProps) {
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
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Calculate total value
    const total = data.reduce((sum, point) => sum + point.value, 0)
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    // Draw segments
    let startAngle = -Math.PI / 2

    data.forEach((point) => {
      const segmentAngle = (point.value / total) * Math.PI * 2

      // Draw segment
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
      ctx.arc(centerX, centerY, radius - thickness, startAngle + segmentAngle, startAngle, true)
      ctx.closePath()
      ctx.fillStyle = point.color
      ctx.fill()

      startAngle += segmentAngle
    })

    // Draw center circle (for donut hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - thickness, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = "#000"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(total.toString(), centerX, centerY)
    ctx.font = "12px sans-serif"
    ctx.fillStyle = labelColor
    ctx.fillText("总计", centerX, centerY + 20)

    // Draw legend
    const legendY = size - 30
    let legendX = 10

    data.forEach((point) => {
      // Draw color box
      ctx.fillStyle = point.color
      ctx.fillRect(legendX, legendY, 10, 10)

      // Draw label
      ctx.fillStyle = labelColor
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${point.label}: ${point.value}`, legendX + 15, legendY + 8)

      legendX += 80
    })
  }, [data, size, thickness, labelColor])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={size} height={size} style={{ maxWidth: "100%" }} />
    </div>
  )
}
