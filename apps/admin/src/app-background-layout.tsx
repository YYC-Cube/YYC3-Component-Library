"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { useBackground } from "../contexts/background-context"

interface AppBackgroundLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function AppBackgroundLayout({ children, className }: AppBackgroundLayoutProps) {
  const { background } = useBackground()

  const backgroundMap = {
    cityscape: "url('/bg-cityscape.png')",
    "tech-globe": "url('/bg-tech-globe.png')",
    "digital-earth": "url('/bg-digital-earth.png')",
  }

  return (
    <div
      className={cn("min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000", className)}
      style={{
        backgroundImage: backgroundMap[background],
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {children}
    </div>
  )
}
