"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestSupabase() {
  const [status, setStatus] = useState("检查中...")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // 简单测试Supabase连接
        const { data, error } = await supabase.from("测试").select("*").limit(1)

        if (error) {
          setStatus(`连接错误: ${error.message}`)
        } else {
          setStatus("连接成功!")
        }
      } catch (err) {
        setStatus(`发生错误: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supabase连接测试</h1>
      <p className="mt-2">状态: {status}</p>
    </div>
  )
}
