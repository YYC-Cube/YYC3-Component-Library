// ✅ 插件评分与评论界面（M9.0.4）

type PluginRating = {
  pluginId: string
  user: string
  score: number // 1~5
  comment: string
  timestamp: string
}

const ratings: PluginRating[] = [
  {
    pluginId: 'm8-forecast',
    user: '张伟',
    score: 5,
    comment: '预测准确，集成顺畅，推荐使用！',
    timestamp: '2025-10-20T12:00:00Z'
  },
  {
    pluginId: 'm8-esg',
    user: '李娜',
    score: 4,
    comment: '功能完整，但数据源接入稍复杂。',
    timestamp: '2025-10-19T09:30:00Z'
  }
]

export default function PluginRatingPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">⭐ 插件评分与评论</h1>

      {ratings.map((r, i) => (
        <div key={i} className="bg-white shadow rounded p-4 space-y-1">
          <p className="text-sm text-gray-500">插件 ID：{r.pluginId}</p>
          <p className="text-lg font-semibold">评分：{r.score} / 5</p>
          <p className="text-gray-700">评论：{r.comment}</p>
          <p className="text-xs text-gray-400">用户：{r.user} · 时间：{r.timestamp}</p>
        </div>
      ))}
    </div>
  )
}
