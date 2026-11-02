"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface AnimatedLogoProps {
  onAnimationComplete?: () => void
}

export function AnimatedLogo({ onAnimationComplete }: AnimatedLogoProps) {
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing((prev) => !prev)
    }, 3000)

    return () => clearInterval(glowInterval)
  }, [])

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
        delay: 0.5,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className={`relative transition-all duration-1000 ${
          isGlowing ? "drop-shadow-[0_0_20px_rgba(74,144,226,0.6)]" : ""
        }`}
        animate={{
          y: [0, -10, 0],
          scale: isGlowing ? 1.05 : 1,
        }}
        transition={{
          y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          scale: { duration: 1, ease: "easeInOut" },
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YanYUCloud%C2%B3-3xbyGypi5OaveS2vyKmS715VZ1tj1Y.png"
          alt="YYC³ EasyVizAI"
          width={120}
          height={120}
          className="w-24 h-24 md:w-32 md:h-32"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
