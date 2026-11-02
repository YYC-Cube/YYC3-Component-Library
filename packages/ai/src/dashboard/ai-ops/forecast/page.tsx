// ✅ 财务预测仪表盘界面（M8.0）

import { forecastFinancials } from '@/lib/ai-ops-expansion/financial-forecast-engine'

async function fetchFinancialInput() {
  // 可替换为真实数据源（API/数据库）；此处使用模拟数据
  return {
    revenue: [500000, 520000, 480000],
    cost: [400000, 430000, 450000],
    period: ['2025-Q1', '2025-Q2', '2025-Q3']
  }
}

export default async function ForecastDashboard() {
  const input = await fetchFinancialInput() // 模拟或真实数据
  const result = forecastFinancials(input)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📈 财务预测与预算建议</h1>

      <div className="grid grid-cols-3 gap-4">
        {result.projectedProfit.map((p, i) => (
          <MetricCard
            key={i}
            title={input.period[i]}
            value={`利润：¥${p.toLocaleString()}`}
            suggestion={result.budgetSuggestion[i]}
          />
        ))}
      </div>

      <RiskBanner level={result.riskLevel} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold">🧠 战略建议</h2>
        <ul className="list-disc ml-6">
          {generateStrategicTips(result.riskLevel).map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  suggestion
}: {
  title: string
  value: string
  suggestion: string
}) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-green-600 mt-1">{suggestion}</p>
    </div>
  )
}

function RiskBanner({ level }: { level: string }) {
  const color = level === '低风险' ? 'green' : level === '中风险' ? 'yellow' : 'red'
  return (
    <div className={`bg-${color}-100 border-l-4 border-${color}-500 p-4 mt-4`}>
      <p className={`text-${color}-700 font-semibold`}>当前风险等级：{level}</p>
    </div>
  )
}

function generateStrategicTips(level: string): string[] {
  if (level === '低风险') return ['可考虑扩大预算投入', '建议启动新项目或市场拓展']
  if (level === '中风险') return ['建议维持当前预算结构', '关注成本波动与增长趋势']
  return ['建议缩减预算支出', '优先优化高成本模块', '暂停非核心投资']
}
