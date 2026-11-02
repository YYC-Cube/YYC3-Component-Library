// ✅ 人机共创 · 团队空间界面（M11.0.3）

import { CocreationRitual } from '@/lib/ai-ops-cocreation/cocreation-ritual'

export default function CocreationSpace() {
  const ritual = new CocreationRitual()
  const milestones = ritual.getMilestones('doc-001')

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">✨ 人机共创空间 · ESG战略文档</h1>

      <section>
        <h2 className="text-xl font-semibold">🎯 共创里程碑</h2>
        <ul className="list-disc ml-6">
          {milestones.map((m, i) => (
            <li key={i}>
              <strong>{m.title}</strong> · {m.description} · <span className="text-green-600">{m.badge}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">👥 共创成员</h2>
        <div className="flex space-x-4">
          {milestones[0]?.celebrants.map((c, i) => (
            <div key={i} className="bg-white shadow rounded px-4 py-2">
              {c}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
