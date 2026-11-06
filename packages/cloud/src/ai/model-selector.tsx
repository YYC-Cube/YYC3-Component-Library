/**
 * ⟨YYC³⟩ 模型选择器组件
 * 用于选择和管理本地大模型
 */

"use client"

import { useState } from "react"
import { useOllama } from "@yyc3/lib"
import { RefreshCw, Check, ChevronDown, AlertCircle, Loader2 } from "lucide-react"

export function ModelSelector() {
  const { models, selectedModel, setSelectedModel, isLoading, error, refreshModels } = useOllama()
  const [isOpen, setIsOpen] = useState(false)

  const formatSize = (size: string) => {
    return size.replace(/\s+/g, " ")
  }

  const handleRefresh = async () => {
    await refreshModels()
  }

  return (
    <div className="relative">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-yy-ink-standard/70">选择大模型</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full flex items-center justify-between px-3 py-2 text-left 
              bg-white border rounded-md shadow-sm
              ${error ? "border-red-300" : "border-yy-cloud-standard/30"}
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yy-cloud-standard
            `}
            disabled={isLoading}
            aria-label={selectedModel ? `当前选择: ${selectedModel}` : "选择模型"} // 修复无障碍问题
          >
            <div className="flex items-center">
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 text-yy-cloud-standard animate-spin" />
              ) : (
                <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-r from-yy-cloud-standard to-yy-cloud-light" />
              )}
              <span>{selectedModel || "选择模型"}</span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {error && (
            <div className="flex items-center mt-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{String(error)}</span>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 flex items-center justify-between p-2 bg-white border-b">
            <span className="text-sm font-medium">可用模型 ({models.length})</span>
            <button
              onClick={handleRefresh}
              className="p-1 text-gray-500 hover:text-yy-cloud-standard focus:outline-none"
              disabled={isLoading}
              aria-label="刷新模型列表" // 修复无障碍问题
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <ul className="py-1">
            {models.map((model) => (
              <li key={model.name}>
                <button
                  type="button"
                  className={`
                    w-full px-3 py-2 text-left flex items-center justify-between
                    hover:bg-gray-100 focus:outline-none
                    ${selectedModel === model.name ? "bg-yy-cloud-standard/10" : ""}
                  `}
                  onClick={() => {
                    setSelectedModel(model.name)
                    setIsOpen(false)
                  }}
                  aria-label={`选择模型: ${model}`} // 修复无障碍问题
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatSize(model.size)} • 修改于 {new Date(model.size).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  {selectedModel === model.name && <Check className="w-5 h-5 text-yy-cloud-standard" />}
                </button>
              </li>
            ))}
            {models.length === 0 && !isLoading && <li className="px-3 py-2 text-sm text-gray-500">未找到模型</li>}
          </ul>
        </div>
      )}
    </div>
  )
}