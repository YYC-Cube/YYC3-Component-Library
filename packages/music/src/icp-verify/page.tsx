"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ICPVerify() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the ICP verification page
    window.location.href = "https://beian.miit.gov.cn/"
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-white">正在跳转到ICP备案验证页面...</p>
    </div>
  )
}
