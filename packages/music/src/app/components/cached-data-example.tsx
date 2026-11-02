"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

export default function CachedDataExample() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("music")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/trending?category=${category}`)
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const invalidateCache = async () => {
    await fetch("/api/trending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    })
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [category])

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button variant={category === "music" ? "default" : "outline"} onClick={() => setCategory("music")}>
          音乐
        </Button>
        <Button variant={category === "video" ? "default" : "outline"} onClick={() => setCategory("video")}>
          视频
        </Button>
        <Button onClick={invalidateCache}>刷新缓存</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-deep-space-blue/30 rounded-lg">
          <Loader className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-deep-space-blue/30 p-4 rounded-lg">
          <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
