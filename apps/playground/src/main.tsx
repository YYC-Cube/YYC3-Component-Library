// ============================================================
// YYC³ · Playground 入口（Phase 7 apps 门户批次 · 2026-11-07）
// 六域包实时导入演示：各域一个代表性组件 + 域标签页切换
// ============================================================
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@yyc3/theme/styles'
import { ClawButton } from '@yyc3/ui-enterprise'
import { ModernCard } from '@yyc3/city'
import { ServerStats } from '@yyc3/cloud'
import { VitalSigns } from '@yyc3/medical'
import { CustomerSatisfaction } from '@yyc3/design'
import { CoreFeatures } from '@yyc3/financial'

const domains: Array<{ id: string; label: string; node: React.ReactNode }> = [
  { id: 'ui', label: 'UI 基础件', node: <ClawButton variant="primary">Claw 按钮</ClawButton> },
  {
    id: 'city',
    label: 'City 数字城市',
    node: (
      <ModernCard>
        <div style={{ padding: 16, color: '#666' }}>城市数据卡片（ModernCard）</div>
      </ModernCard>
    ),
  },
  { id: 'cloud', label: 'Cloud 云平台', node: <ServerStats /> },
  { id: 'medical', label: 'Medical 医疗', node: <VitalSigns /> },
  { id: 'design', label: 'Design 管理设计', node: <CustomerSatisfaction /> },
  { id: 'financial', label: 'Financial 金融', node: <CoreFeatures language="zh" /> },
]

function App() {
  const [active, setActive] = useState(domains[0].id)
  const current = domains.find((d) => d.id === active) ?? domains[0]
  return (
    <div style={{ fontFamily: 'system-ui, "PingFang SC", sans-serif', padding: 24 }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>YYC³ Playground — 六域组件实验场</h1>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #d0d5dd',
              background: d.id === active ? '#4f46e5' : '#fff',
              color: d.id === active ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {d.label}
          </button>
        ))}
      </nav>
      <section>{current.node}</section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
