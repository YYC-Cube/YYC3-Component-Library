// ✅ ESG合规仪表盘界面建议（Next.js + Tailwind）

import { generateESGReport } from '@/lib/ai-ops-expansion/esg-compliance-tracker'

export default async function ESGDashboard() {
  const data = await fetchESGData()
  const report = generateESGReport(data)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🌱 ESG合规仪表盘</h1>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="平均碳排放" value={`${report.averageCarbon.toFixed(2)} 吨`} />
        <MetricCard title="员工满意度" value={report.averageSatisfaction.toFixed(2)} />
        <MetricCard title="治理评分" value={report.averageGovernance.toFixed(2)} />
      </div>

      <StatusBanner status={report.complianceStatus} />

      <div>
        <h2 className="text-xl font-semibold mt-4">📌 优化建议</h2>
        <ul className="list-disc ml-6">
          {report.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

function StatusBanner({ status }: { status: string }) {
  const color = status.includes('✅') ? 'green' : 'yellow'
  return (
    <div className={`bg-${color}-100 border-l-4 border-${color}-500 p-4 mt-4`}>
      <p className="text-${color}-700 font-semibold">{status}</p>
    </div>
  )
}
