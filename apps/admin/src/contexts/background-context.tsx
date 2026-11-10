"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type BackgroundType = "cityscape" | "tech-globe" | "digital-earth"

interface BackgroundContextType {
  background: BackgroundType
  setBackground: (background: BackgroundType) => void
  cycleBackground: () => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  // Get from localStorage if available, otherwise default to cityscape
  const [background, setBackground] = useState<BackgroundType>(() => {
    // 只在客户端执行
    if (typeof window !== "undefined") {
      const savedBackground = localStorage.getItem("appBackground") as BackgroundType | null
      if (savedBackground && ["cityscape", "tech-globe", "digital-earth"].includes(savedBackground)) {
        return savedBackground
      }
    }
    return "cityscape"
  })

  // Save to localStorage when background changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appBackground", background)
    }
  }, [background])

  // Function to cycle through backgrounds
  const cycleBackground = () => {
    setBackground((current) => {
      if (current === "cityscape") return "tech-globe"
      if (current === "tech-globe") return "digital-earth"
      return "cityscape"
    })
  }

  return (
    <BackgroundContext.Provider value={{ background, setBackground, cycleBackground }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return context
}
