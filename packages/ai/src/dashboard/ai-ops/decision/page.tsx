// ✅ AI辅助决策模拟器界面（M8.3）

import { simulateDecision } from '@/lib/ai-ops-expansion/ai-decision-simulator'

export default async function DecisionDashboard() {
  const scenario = await fetchDecisionScenario() // 模拟或真实数据
  const result = simulateDecision(scenario)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 AI辅助决策模拟器</h1>

      <div className="bg-white shadow rounded p-4 space-y-2">
        <p>战略方向：{scenario.strategy}</p>
        <p>预算变动：{scenario.budgetChange}%</p>
        <p>KPI预估影响：{scenario.kpiImpact}%</p>
        <p>风险容忍度：{scenario.riskTolerance}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <InsightCard title="📈 预期结果" value={result.projectedOutcome} />
        <InsightCard title="⚠️ 风险评估" value={result.riskAssessment} />
        <InsightCard title="✅ 推荐行动" value={result.recommendation} />
      </div>
    </div>
  )
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
