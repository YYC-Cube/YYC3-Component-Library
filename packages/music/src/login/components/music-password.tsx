"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Play, Square } from "lucide-react"

export default function MusicPassword() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [matchPercentage, setMatchPercentage] = useState(0)
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const dataArray = useRef<Uint8Array | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyser.current = audioContext.current.createAnalyser()
    analyser.current.fftSize = 2048
    const bufferLength = analyser.current.frequencyBinCount
    dataArray.current = new Uint8Array(bufferLength)

    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  const handlePlayMelody = () => {
    setIsPlaying(true)
    // Simulate melody playback
    setTimeout(() => setIsPlaying(false), 4000)
  }

  const handleRecordMelody = () => {
    setIsRecording(true)
    // Simulate recording and matching
    setTimeout(() => {
      setIsRecording(false)
      setMatchPercentage(85) // Example match percentage
    }, 4000)
  }

  useEffect(() => {
    if (!canvasRef.current || !analyser.current || !dataArray.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const WIDTH = canvas.width
      const HEIGHT = canvas.height

      requestAnimationFrame(draw)

      analyser.current!.getByteTimeDomainData(dataArray.current!)

      ctx.fillStyle = "rgb(10, 26, 47)"
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      ctx.lineWidth = 2
      ctx.strokeStyle = "rgb(74, 0, 224)"

      ctx.beginPath()

      const sliceWidth = (WIDTH * 1.0) / dataArray.current!.length
      let x = 0

      for (let i = 0; i < dataArray.current!.length; i++) {
        const v = dataArray.current![i] / 128.0
        const y = (v * HEIGHT) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()
  }, [])

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} width={300} height={100} className="w-full" />
      <div className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className={`w-16 h-16 rounded-full ${isPlaying ? "bg-green-500/20 animate-pulse" : "bg-white/10"}`}
          onClick={handlePlayMelody}
          disabled={isPlaying || isRecording}
        >
          {isPlaying ? <Square className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <p className="text-sm text-blue-200">Listen to melody</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className={`w-16 h-16 rounded-full ${isRecording ? "bg-red-500/20 animate-pulse" : "bg-white/10"}`}
          onClick={handleRecordMelody}
          disabled={isPlaying || isRecording}
        >
          <Mic className={`h-6 w-6 ${isRecording ? "text-red-500" : ""}`} />
        </Button>
        <p className="text-sm text-blue-200">Hum the melody</p>
      </div>

      {matchPercentage > 0 && (
        <div className="text-center">
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] h-2 rounded-full transition-all duration-1000"
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
          <p className="text-sm text-blue-200">Match: {matchPercentage}%</p>
        </div>
      )}
    </div>
  )
}
