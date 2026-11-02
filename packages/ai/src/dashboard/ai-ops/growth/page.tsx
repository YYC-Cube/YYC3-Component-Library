// ✅ 员工成长路径仪表盘界面（M8.2）

import { analyzeGrowthPath } from '@/lib/ai-ops-expansion/growth-path-analyzer'

export default async function GrowthDashboard() {
  const profile = await fetchEmployeeProfile() // 模拟或真实数据
  const result = analyzeGrowthPath(profile)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧭 员工成长路径分析</h1>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold">👤 {profile.name}</h2>
        <p>当前岗位：{profile.currentRole}</p>
        <p>推荐岗位：{result.recommendedNextRole}</p>
        <p>
          晋升资格：
          <span className={result.eligibleForPromotion ? 'text-green-600' : 'text-red-600'}>
            {result.eligibleForPromotion ? '✅ 已满足' : '❌ 未满足'}
          </span>
        </p>
      </div>

      {!result.eligibleForPromotion && (
        <div>
          <h2 className="text-xl font-semibold mt-4">📌 待补充条件</h2>
          <ul className="list-disc ml-6">
            {result.missingCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
