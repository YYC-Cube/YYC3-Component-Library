import type React from "react"
import type { Metadata } from "next"
import { ResponsiveLayoutProvider } from "@/components/layout/responsive-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "言语云企业管理系统",
  description: "Created with 言语云",
  generator: "v0.dev",
  openGraph: {
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.png"],
    creator: "言语云",
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ResponsiveLayoutProvider>{children}</ResponsiveLayoutProvider>
      </body>
    </html>
  )
}
