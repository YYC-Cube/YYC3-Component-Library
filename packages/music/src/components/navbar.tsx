"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Star, Music, Mic, PenTool, Zap, User, Shield, Radio } from "lucide-react"
import { motion } from "framer-motion"

export default function Navbar() {
  const [starPower, setStarPower] = useState(1580)
  const pathname = usePathname()

  const navItems = [
    { href: "/word", icon: Zap, label: "一言" },
    { href: "/speech", icon: Mic, label: "一语" },
    { href: "/lyrics", icon: PenTool, label: "一词" },
    { href: "/compose", icon: Music, label: "一曲" },
    { href: "/anti-cheat", icon: Shield, label: "反作弊" },
    { href: "/broadcast", icon: Radio, label: "广播" },
  ]

  return (
    <nav className="bg-deep-space-blue/80 backdrop-blur-md border-b border-blue-900/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                一言一语AI视听中心
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "text-white bg-blue-900/50"
                    : "text-gray-300 hover:bg-blue-900/30 hover:text-white"
                } transition-colors duration-200`}
              >
                <item.icon className="inline-block w-4 h-4 mr-1" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <motion.div
              className="flex items-center bg-blue-900/30 rounded-full px-3 py-1 mr-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{starPower}</span>
            </motion.div>
            <Link
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <User className="inline-block w-4 h-4 mr-1" />
              个人中心
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
