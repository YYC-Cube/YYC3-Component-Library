// ✅ 协作空间任务分配界面（M9.0.1）

import { CollaborationSpace } from '@/lib/ai-ops-collab/collab-space'

export default function CollabDashboard() {
  const space = new CollaborationSpace('M8.0 财务预测模块')
  const snapshot = space.getSpaceSnapshot()

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤝 协作空间 · {snapshot.module}</h1>

      <section>
        <h2 className="text-xl font-semibold">👥 成员列表</h2>
        <ul className="list-disc ml-6">
          {snapshot.members.map((m) => (
            <li key={m.id}>
              {m.name}（{m.role}）
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">📋 任务分配</h2>
        <table className="w-full table-auto border mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">任务标题</th>
              <th className="px-4 py-2 text-left">负责人</th>
              <th className="px-4 py-2 text-left">状态</th>
              <th className="px-4 py-2 text-left">截止日期</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.tasks.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">{t.assignedTo}</td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">{t.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
