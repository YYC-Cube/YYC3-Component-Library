// ✅ 插件市场仪表盘界面（M8.4）

import { pluginRegistry } from '@/lib/ai-ops-expansion/plugin-market-adapter'

export default function PluginDashboard() {
  const plugins = pluginRegistry.modules

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧩 插件市场 · 扩展模块管理</h1>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">模块名称</th>
            <th className="px-4 py-2 text-left">路径</th>
            <th className="px-4 py-2 text-left">兼容版本</th>
            <th className="px-4 py-2 text-left">启用状态</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{p.entryPath}</td>
              <td className="px-4 py-2">{p.compatibleVersion}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    p.enabled ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  {p.enabled ? '启用' : '禁用'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
