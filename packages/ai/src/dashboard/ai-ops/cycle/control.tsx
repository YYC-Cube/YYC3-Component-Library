// ✅ 智能运营闭环控制界面（M12.0.3）

import { MetricCollector } from '@/lib/ai-ops-cyclic-engine/metric-collector'
import { StrategyDispatcher } from '@/lib/ai-ops-cyclic-engine/strategy-dispatcher'
import { ExecutionFeedback } from '@/lib/ai-ops-cyclic-engine/execution-feedback'
import { Optimizer } from '@/lib/ai-ops-cyclic-engine/optimizer'

export default function CycleControlDashboard() {
  const collector = new MetricCollector()
  const dispatcher = new StrategyDispatcher()
  const feedback = new ExecutionFeedback()
  const optimizer = new Optimizer()

  // 注入演示数据：指标、触发器与执行反馈
  collector.recordMetric({
    name: '预测利润', value: 950000, unit: '¥', source: 'M8.0', timestamp: new Date().toISOString()
  })
  collector.recordMetric({
    name: '员工满意度', value: 4.6, unit: 'score', source: 'M7.7', timestamp: new Date().toISOString()
  })

  dispatcher.registerTrigger({
    metricName: '预测利润', threshold: 900000, condition: '>', action: '启动成本优化模块'
  })

  feedback.recordExecution({
    taskId: 'task-1', module: 'M8.0', executedAt: new Date().toISOString(), result: '成功'
  })
  feedback.recordExecution({
    taskId: 'task-2', module: 'M8.1', executedAt: new Date().toISOString(), result: '失败', blockers: ['缺少ESG评分数据']
  })

  const metrics = collector.getSnapshot()
  dispatcher.evaluate(metrics)
  const summary = feedback.getSummary()
  const blockers = feedback.getBlockers()
  const suggestions = optimizer.suggestAdjustment(summary, blockers)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔄 智能运营闭环 · 控制中心</h1>

      <section>
        <h2 className="text-xl font-semibold">📊 指标快照</h2>
        <ul className="list-disc ml-6">
          {Object.entries(metrics).map(([name, value], i) => (
            <li key={i}>{name}：{value}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">🚀 策略触发记录</h2>
        <ul className="list-disc ml-6">
          {dispatcher.getLogs().map((log, i) => (
            <li key={i}>
              {log.trigger.metricName} → {log.trigger.action} · 状态：{log.status}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">📋 执行反馈摘要</h2>
        <p>成功：{summary['成功']} · 失败：{summary['失败']} · 部分完成：{summary['部分完成']}</p>
        <p className="mt-2">阻塞点：{blockers.join('、') || '无'}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">🧠 优化建议</h2>
        <ul className="list-disc ml-6">
          {suggestions.map((s, i) => (
            <li key={i}>
              模块：{s.targetModule} · 调整：{s.adjustment} · 原因：{s.reason}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
