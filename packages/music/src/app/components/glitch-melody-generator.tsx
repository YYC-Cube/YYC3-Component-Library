"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"

export default function GlitchMelodyGenerator() {
  const [isRecording, setIsRecording] = useState(false)
  const [melody, setMelody] = useState<number[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const handleVoiceInput = () => {
    setIsRecording(true)
    // Simulate voice input and AI melody generation
    setTimeout(() => {
      setIsRecording(false)
      const generatedMelody = Array.from({ length: 8 }, () => Math.random() * 500 + 200)
      setMelody(generatedMelody)
      playGlitchMelody(generatedMelody)
    }, 3000)
  }

  const playGlitchMelody = (notes: number[]) => {
    if (!audioContextRef.current) return

    notes.forEach((freq, index) => {
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop()
        }
        oscillatorRef.current = audioContextRef.current!.createOscillator()
        oscillatorRef.current.type = "sawtooth"
        oscillatorRef.current.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime)

        const gainNode = audioContextRef.current!.createGain()
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.2)

        oscillatorRef.current.connect(gainNode)
        gainNode.connect(audioContextRef.current!.destination)

        oscillatorRef.current.start()
      }, index * 250)
    })
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="lg"
        className={`w-16 h-16 rounded-full ${isRecording ? "bg-red-500/20 animate-pulse" : "bg-white/10"}`}
        onClick={handleVoiceInput}
        disabled={isRecording}
      >
        <Mic className={`h-6 w-6 ${isRecording ? "text-red-500" : "text-white"}`} />
      </Button>
      <p className="text-sm text-blue-200">
        {isRecording ? "Listening..." : 'Say "量子纠缠的爱情" to generate a Glitch melody'}
      </p>
      {melody.length > 0 && (
        <div className="flex justify-center space-x-2">
          {melody.map((freq, index) => (
            <div key={index} className="w-4 bg-blue-500" style={{ height: `${(freq / 700) * 100}px` }} />
          ))}
        </div>
      )}
    </div>
  )
}
