"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Check } from "lucide-react"

export default function FaceScanner() {
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [avatarGenerated, setAvatarGenerated] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setScanning(true)
      // Simulate scan completion
      setTimeout(() => {
        setScanning(false)
        setScanComplete(true)
        // Stop camera
        stream.getTracks().forEach((track) => track.stop())
        // Generate 3D avatar
        setTimeout(() => {
          setAvatarGenerated(true)
        }, 2000)
      }, 3000)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  useEffect(() => {
    if (scanComplete && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        // Simulate 3D avatar generation
        ctx.fillStyle = "#4A00E0"
        ctx.beginPath()
        ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
      }
    }
  }, [scanComplete])

  return (
    <div className="space-y-6">
      <div className="relative w-64 h-64 mx-auto rounded-xl overflow-hidden bg-black/20">
        {scanning && (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-blue-500 animate-pulse">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-scan" />
            </div>
          </>
        )}

        {!scanning && !scanComplete && (
          <div className="flex items-center justify-center h-full">
            <Button variant="ghost" size="lg" className="w-16 h-16 rounded-full bg-white/10" onClick={startScanning}>
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        )}

        {scanComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
            {avatarGenerated ? (
              <canvas ref={canvasRef} width={150} height={150} className="rounded-full" />
            ) : (
              <Check className="h-16 w-16 text-green-500" />
            )}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-blue-200">
        {scanning
          ? "Scanning..."
          : scanComplete
            ? avatarGenerated
              ? "3D Avatar Generated"
              : "Generating 3D Avatar..."
            : "Position your face in the frame"}
      </p>
    </div>
  )
}
