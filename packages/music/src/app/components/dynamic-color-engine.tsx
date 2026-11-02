"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"

type ColorTheme = {
  primary: string
  secondary: string
  accent: string
}

export function useDynamicColor() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>({
    primary: "#4A00E0",
    secondary: "#8E2DE2",
    accent: "#FF4E00",
  })

  const analyzeAudio = (audioData: Uint8Array) => {
    const highFreq = audioData.slice(audioData.length / 2).reduce((a, b) => a + b, 0) / (audioData.length / 2)
    const lowFreq = audioData.slice(0, audioData.length / 2).reduce((a, b) => a + b, 0) / (audioData.length / 2)
    const complexity = audioData.reduce((acc, val, i, arr) => acc + Math.abs(val - (arr[i - 1] || 0)), 0)

    if (highFreq > lowFreq && highFreq > 128) {
      return { primary: "#BC00FF", secondary: "#9000FF", accent: "#D400FF" }
    } else if (lowFreq > highFreq && lowFreq > 128) {
      return { primary: "#FF4E00", secondary: "#FF7300", accent: "#FF9900" }
    } else if (complexity > 1000) {
      return { primary: "#FF0000", secondary: "#00FF00", accent: "#0000FF" }
    } else {
      return { primary: "#4A00E0", secondary: "#8E2DE2", accent: "#FF4E00" }
    }
  }

  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateColor = () => {
      analyser.getByteFrequencyData(dataArray)
      const newTheme = analyzeAudio(dataArray)
      setColorTheme(newTheme)
      requestAnimationFrame(updateColor)
    }

    // In a real app, you'd connect this to your audio source
    // For demonstration, we'll use an oscillator
    const oscillator = audioContext.createOscillator()
    oscillator.connect(analyser)
    oscillator.start()

    updateColor()

    return () => {
      oscillator.stop()
      audioContext.close()
    }
  }, []) // Removed analyzeAudio from the dependency array

  return colorTheme
}

export default function DynamicColorEngine({ children }: { children: React.ReactNode }) {
  const colorTheme = useDynamicColor()
  const { gl } = useThree()

  useEffect(() => {
    gl.setClearColor(colorTheme.primary)
  }, [colorTheme, gl])

  return (
    <group>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { colorTheme })
        }
        return child
      })}
    </group>
  )
}
