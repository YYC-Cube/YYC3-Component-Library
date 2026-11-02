"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1081739642971_.pic_hd.jpg-4pMh6q57vP4fy6Uuv55anVxCeYVHOq.jpeg"
                alt="DXJ Music Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span
                className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                Dxj-Music
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/word"
              className={`text-white hover:text-blue-400 transition-colors ${isActive("/word") ? "text-blue-400" : ""}`}
            >
              一言
            </Link>
            <Link
              href="/speech"
              className={`text-white hover:text-blue-400 transition-colors ${
                isActive("/speech") ? "text-blue-400" : ""
              }`}
            >
              一语
            </Link>
            <Link
              href="/lyrics"
              className={`text-white hover:text-blue-400 transition-colors ${
                isActive("/lyrics") ? "text-blue-400" : ""
              }`}
            >
              一词
            </Link>
            <Link
              href="/compose"
              className={`text-white hover:text-blue-400 transition-colors ${
                isActive("/compose") ? "text-blue-400" : ""
              }`}
            >
              一曲
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-white transition-all"
            >
              个人中心
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gray-300 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95">
            <Link
              href="/word"
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-500/20"
              onClick={() => setIsOpen(false)}
            >
              一言
            </Link>
            <Link
              href="/speech"
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-500/20"
              onClick={() => setIsOpen(false)}
            >
              一语
            </Link>
            <Link
              href="/lyrics"
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-500/20"
              onClick={() => setIsOpen(false)}
            >
              一词
            </Link>
            <Link
              href="/compose"
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-500/20"
              onClick={() => setIsOpen(false)}
            >
              一曲
            </Link>
            <Link
              href="/profile"
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-500/20"
              onClick={() => setIsOpen(false)}
            >
              个人中心
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
