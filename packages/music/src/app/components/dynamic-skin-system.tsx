"use client"

import type React from "react"

export default function DynamicSkinSystem({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-br from-deep-space-blue to-purple-900 text-white">{children}</div>
}
