import type React from "react"

interface PageBackgroundProps {
  image: string
  children: React.ReactNode
  overlay?: boolean
  overlayOpacity?: number
}

export default function PageBackground({ image, children, overlay = true, overlayOpacity = 0.1 }: PageBackgroundProps) {
  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center relative"
      style={{ backgroundImage: `url(${image})` }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: overlayOpacity }}></div>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  )
}
