// ✅ AI运营智能体 · 对话式交互界面（M10.0.4）

import { useState } from 'react'
import { TaskSensor } from '@/lib/ai-ops-agent/task-sensor'
import { StrategyEngine } from '@/lib/ai-ops-agent/strategy-engine'

export default function AgentChat() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    const reply = generateAgentReply(input)
    setMessages([...messages, `🧑‍💼 你：${input}`, `🤖 智能体：${reply}`])
    setInput('')
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">💬 AI运营智能体 · 对话协同</h1>

      <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <p key={i} className="text-sm">{msg}</p>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="请输入任务、问题或策略请求…"
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          发送
        </button>
      </div>
    </div>
  )
}

function generateAgentReply(input: string): string {
  if (input.includes('优化')) return '建议优先处理高优任务，并协调相关模块联动。'
  if (input.includes('阻塞')) return '已识别阻塞点，建议发起跨角色协作请求。'
  if (input.includes('策略')) return '已生成策略建议：按优先级执行，每日同步进度。'
  return '已记录请求，建议补充任务标签与目标。'
}
