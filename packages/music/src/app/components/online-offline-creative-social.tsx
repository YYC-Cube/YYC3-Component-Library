"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const OnlineOfflineCreativeSocial = () => {
  const [popupLocation, setPopupLocation] = useState("")
  const [fanTask, setFanTask] = useState("")
  const [submissions, setSubmissions] = useState<string[]>([])

  const handleCreatePopup = () => {
    alert(`创建快闪店: ${popupLocation}`)
  }

  const handleCreateFanTask = () => {
    alert(`发布粉丝共创任务: ${fanTask}`)
  }

  const handleSubmitFanContent = (content: string) => {
    setSubmissions([...submissions, content])
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">虚实联动的创作社交</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI艺术快闪店</h3>
        <Input placeholder="快闪店位置" value={popupLocation} onChange={(e) => setPopupLocation(e.target.value)} />
        <Button onClick={handleCreatePopup}>创建快闪店</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">粉丝共创任务</h3>
        <Textarea placeholder="描述任务需求" value={fanTask} onChange={(e) => setFanTask(e.target.value)} />
        <Button onClick={handleCreateFanTask}>发布任务</Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">粉丝投稿</h3>
        <div className="space-y-2">
          {submissions.map((submission, index) => (
            <div key={index} className="bg-blue-900/30 p-2 rounded">
              {submission}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Input
            placeholder="输入你的创意"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmitFanContent((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ""
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default OnlineOfflineCreativeSocial
