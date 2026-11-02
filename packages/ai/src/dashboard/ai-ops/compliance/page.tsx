// ✅ 合规与审计自动化仪表盘（审计评分与日志可视化）

import { runAuditSimulation } from '@/lib/ai-ops/compliance-audit-engine'
import auditLogs from '@/test/audit_logs.mock.json'

export default async function CompliancePage() {
  const { report, security } = await runAuditSimulation(auditLogs as any)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🛡️ 合规与审计自动化</h1>
        <p className="text-gray-600 mt-2">自动记录关键操作，生成审计报告，支持安全评分与风险等级标记</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold">🔐 安全评分</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <MetricCard title="总体评分" value={`${security.overall}`} />
          <MetricCard title="认证" value={`${security.categories.authentication}`} />
          <MetricCard title="授权" value={`${security.categories.authorization}`} />
          <MetricCard title="数据保护" value={`${security.categories.dataProtection}`} />
          <MetricCard title="网络安全" value={`${security.categories.networkSecurity}`} />
        </div>
        <TrendBanner trend={security.trend} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">📋 审计摘要</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <MetricCard title="总操作" value={`${report.summary.totalOperations}`} />
          <MetricCard title="成功" value={`${report.summary.successfulOperations}`} />
          <MetricCard title="失败" value={`${report.summary.failedOperations}`} />
          <MetricCard title="高风险/违规" value={`${report.summary.violations}`} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">🗒️ 审计日志</h2>
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">时间</th>
                <th className="px-3 py-2 text-left">用户</th>
                <th className="px-3 py-2 text-left">操作</th>
                <th className="px-3 py-2 text-left">IP</th>
                <th className="px-3 py-2 text-left">风险</th>
                <th className="px-3 py-2 text-left">结果</th>
              </tr>
            </thead>
            <tbody>
              {(auditLogs as any[]).map((l, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2 text-sm text-gray-600">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2">{l.user}</td>
                  <td className="px-3 py-2">{l.action}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{l.ip}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">评估中</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700">success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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

function TrendBanner({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  const map = {
    improving: { text: '趋势：向好 ✅', color: 'green' },
    stable: { text: '趋势：稳定 ⚖️', color: 'gray' },
    declining: { text: '趋势：下降 ⚠️', color: 'yellow' },
  }
  const cfg = map[trend]
  return (
    <div className={`bg-${cfg.color}-100 border-l-4 border-${cfg.color}-500 p-4 mt-4`}>
      <p className={`text-${cfg.color}-700 font-semibold`}>{cfg.text}</p>
    </div>
  )
}
