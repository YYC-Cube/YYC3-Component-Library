"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Mic, Music, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import VoiceTunnel from "./components/voice-tunnel"
import MusicPassword from "./components/music-password"
import FaceScanner from "./components/face-scanner"
import GalaxyVortex from "./components/galaxy-vortex"
import CyberpunkAvatar from "./components/cyberpunk-avatar"
import { ErrorBoundary } from "react-error-boundary"

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="text-red-500 p-4 bg-red-100 rounded-lg">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function LoginPage() {
  const [loginMode, setLoginMode] = useState<"voice" | "music" | "face" | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [voiceEmotion, setVoiceEmotion] = useState<"neutral" | "angry" | "calm">("neutral")
  const [backgroundGradient, setBackgroundGradient] = useState("from-[#4A00E0] to-[#8E2DE2]")
  const [showGalaxyVortex, setShowGalaxyVortex] = useState(false)
  const [avatarGenerated, setAvatarGenerated] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    if (isListening) {
      setBackgroundGradient("from-[#FFD700] to-[#FF6B6B]")
    } else {
      setBackgroundGradient("from-[#4A00E0] to-[#8E2DE2]")
    }
  }, [isListening])

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const handleVoiceLogin = () => {
    setIsListening(true)

    // Simulate voice recognition and emotion detection
    setTimeout(() => {
      setIsListening(false)
      const emotions = ["neutral", "angry", "calm"]
      setVoiceEmotion(emotions[Math.floor(Math.random() * emotions.length)] as "neutral" | "angry" | "calm")
      setShowGalaxyVortex(true)
    }, 3000)
  }

  return (
    <div
      className={`min-h-screen w-full bg-[#0A1A2F] relative overflow-hidden bg-gradient-to-br ${backgroundGradient}`}
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls enableZoom={false} enablePan={false} />
          {showGalaxyVortex ? <GalaxyVortex /> : <VoiceTunnel emotion={voiceEmotion} isActive={isListening} />}
        </Canvas>
      </div>

      {/* Login Interface */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-8 p-8 rounded-2xl backdrop-blur-xl bg-white/5">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-blue-200">Choose your login method</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="ghost"
              className={`flex flex-col items-center p-6 rounded-xl transition-all
              ${loginMode === "voice" ? "bg-gradient-to-r from-[#FFD700] to-[#FF6B6B]" : "hover:bg-white/10"}
            `}
              onClick={() => setLoginMode("voice")}
            >
              <Mic className="h-8 w-8 mb-2" />
              <span>Voice</span>
            </Button>

            <Button
              variant="ghost"
              className={`flex flex-col items-center p-6 rounded-xl transition-all
              ${loginMode === "music" ? "bg-gradient-to-r from-[#FFD700] to-[#FF6B6B]" : "hover:bg-white/10"}
            `}
              onClick={() => setLoginMode("music")}
            >
              <Music className="h-8 w-8 mb-2" />
              <span>Melody</span>
            </Button>

            <Button
              variant="ghost"
              className={`flex flex-col items-center p-6 rounded-xl transition-all
              ${loginMode === "face" ? "bg-gradient-to-r from-[#FFD700] to-[#FF6B6B]" : "hover:bg-white/10"}
            `}
              onClick={() => setLoginMode("face")}
            >
              <Camera className="h-8 w-8 mb-2" />
              <span>Face</span>
            </Button>
          </div>

          {/* Login Mode Content */}
          <div className="mt-8">
            {loginMode === "voice" && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className={`w-24 h-24 rounded-full transition-all ${
                    isListening ? "bg-red-500/20 animate-pulse" : "bg-white/10"
                  }`}
                  onClick={handleVoiceLogin}
                >
                  <Mic className={`h-8 w-8 ${isListening ? "text-red-500" : "text-white"}`} />
                </Button>
                <p className="mt-4 text-blue-200">Say "星辰大海" to login</p>
              </div>
            )}

            {loginMode === "music" && <MusicPassword />}
            {loginMode === "face" && <FaceScanner onAvatarGenerated={() => setAvatarGenerated(true)} />}
          </div>
        </div>
      </div>

      {avatarGenerated && (
        <div className="absolute bottom-4 right-4 w-32 h-32">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls enableZoom={false} enablePan={false} />
            <CyberpunkAvatar />
          </Canvas>
        </div>
      )}
    </div>
  )
}

export default function LoginPageWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LoginPage />
    </ErrorBoundary>
  )
}
