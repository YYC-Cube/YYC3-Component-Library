import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "./components/navbar"
import Footer from "./components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "一言一语AI视听中心",
  description: "用AI创造你的音乐和视觉世界",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-deep-space-blue text-white min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
