"use client"

import { useState } from "react"
import { Mic, Music, MapPin } from "lucide-react"

export default function CreativeSceneEmpowerment() {
  const [location, setLocation] = useState("西湖")
  const [isRecording, setIsRecording] = useState(false)

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation)
    // Simulate AI recommendation based on location
    if (newLocation === "西湖") {
      alert('AI推荐：基于您的位置，我们为您推荐"断桥残雪"歌词模板')
    }
  }

  const handleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      alert("已开启定位采风模式，正在收录环境声...")
    } else {
      alert("采风结束，已生成西湖特色音效包")
    }
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Music className="w-6 h-6 text-purple-400 mr-2" />
        创作场景赋能
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">地理灵感推荐</h3>
          <div className="flex items-center space-x-4">
            <MapPin className="w-5 h-5 text-blue-400" />
            <select
              className="flex-grow bg-blue-900/30 text-white rounded-lg p-2"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <option value="西湖">西湖</option>
              <option value="长安街">长安街</option>
              <option value="外滩">外滩</option>
            </select>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">定位采风模式</h3>
          <button
            className={`flex items-center justify-center w-full py-3 rounded-lg transition-colors duration-200 ${
              isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleRecording}
          >
            <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""} mr-2`} />
            {isRecording ? "停止采风" : "开始采风"}
          </button>
        </div>
        {isRecording && (
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-white/70">正在收录 {location} 的环境声，将自动生成地域特色音效包...</p>
            <div className="mt-2 h-2 bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
