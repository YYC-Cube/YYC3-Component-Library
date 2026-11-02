// ✅ AI运营智能体仪表盘界面（M10.0）

import { TaskSensor } from '@/lib/ai-ops-agent/task-sensor'
import { StrategyEngine } from '@/lib/ai-ops-agent/strategy-engine'

export default async function AgentDashboard() {
  const rawTasks = await fetchRawTasks() // 模拟或真实数据
  const sensor = new TaskSensor()
  const engine = new StrategyEngine()

  const insights = sensor.analyze(rawTasks)
  const strategy = engine.generatePlan(insights)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤖 AI运营智能体 · 策略中心</h1>

      <section>
        <h2 className="text-xl font-semibold">📋 待办任务分析</h2>
        <ul className="list-disc ml-6">
          {insights.map((i, idx) => (
            <li key={idx}>
              <strong>{i.title}</strong> · 优先级：{i.priority} · 建议：{i.recommendedAction}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">🧠 策略建议</h2>
        <p className="text-gray-700">{strategy.summary}</p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <StrategyCard title="✅ 可立即执行" items={strategy.urgentTasks} />
          <StrategyCard title="🤝 需协调处理" items={strategy.coordinationNeeded} />
          <StrategyCard title="📌 执行顺序" items={strategy.executionSequence} />
        </div>
      </section>
    </div>
  )
}

function StrategyCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <ul className="list-disc ml-4 mt-2">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
