import { type NextRequest, NextResponse } from "next/server"

// Mimosa finding 修复（13 阶段终验 · 2026-11-07）：
// SSRF 防护 —— 服务端发起 fetch 前校验目标 URL：默认仅允许 https:，并拒绝
// 私网/环回/链路本地（169.254.x，含云元数据）/0.0.0.0/.internal/.localhost
// 及纯数字十进制 IP 等内网目标。唯一例外：env 配置的本地 Ollama 地址
// （NEXT_PUBLIC_OLLAMA_URL，属部署方服务端配置、非请求方可控）允许 http+环回，
// 以保留本地模型功能。请求体输入（task.input / providerId）不参与任何 URL 拼接。
class SafeUrlValidationError extends Error {}

function isSafeFetchUrl(rawUrl: string, opts?: { allowLoopbackHttp?: boolean }): boolean {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return false
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "")
  const isLoopback = host === "localhost" || host === "::1" || host.endsWith(".localhost") || host.startsWith("127.")
  const isPrivate =
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === "0.0.0.0" ||
    host.endsWith(".internal") ||
    host.endsWith(".localhost") ||
    /^\d+$/.test(host)
  if (url.protocol !== "https:" && !(url.protocol === "http:" && opts?.allowLoopbackHttp === true && isLoopback)) {
    return false
  }
  return !isPrivate
}

// 解析本地 Ollama 服务地址（env 配置仅放行 http+环回，其余严格 https+禁内网）
function resolveOllamaUrl(): string {
  const raw = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434"
  if (!isSafeFetchUrl(raw, { allowLoopbackHttp: true })) {
    throw new SafeUrlValidationError(`不安全的模型服务地址，已拦截: ${raw}`)
  }
  return raw
}

export async function POST(request: NextRequest) {
  try {
    const task = await request.json()

    // 根据任务类型选择合适的处理方式
    let result

    switch (task.type) {
      case "code-generation":
        result = await executeCodeGeneration(task)
        break
      case "text-generation":
        result = await executeTextGeneration(task)
        break
      case "analysis":
        result = await executeAnalysis(task)
        break
      default:
        result = await executeGenericTask(task)
    }

    return NextResponse.json(result)
  } catch (error) {
    // Mimosa finding 修复：URL 校验不通过时返回 400
    if (error instanceof SafeUrlValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "不合法的服务地址",
          duration: 0,
          cost: 0,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "任务执行失败",
        duration: 0,
        cost: 0,
      },
      { status: 500 },
    )
  }
}

// 执行代码生成任务
async function executeCodeGeneration(task: any) {
  const startTime = Date.now()

  try {
    // 优先使用本地Ollama服务
    // Mimosa finding 修复：fetch 前校验（env 配置仅放行 http+环回）
    const ollamaUrl = resolveOllamaUrl()

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5-coder:latest",
        prompt: task.input,
        stream: false,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        result: data.response,
        model: "qwen2.5-coder:latest",
        duration: Date.now() - startTime,
        cost: 0, // 本地模型无成本
        confidence: 0.8,
      }
    }

    // 如果本地模型不可用，尝试使用云端API
    return await executeWithCloudAPI(task, startTime)
  } catch (error) {
    // Mimosa finding 修复：URL 校验失败需上抛，由外层返回 400
    if (error instanceof SafeUrlValidationError) throw error
    return {
      success: false,
      error: "代码生成失败",
      duration: Date.now() - startTime,
      cost: 0,
    }
  }
}

// 执行文本生成任务
async function executeTextGeneration(task: any) {
  const startTime = Date.now()

  try {
    // 优先使用本地模型
    // Mimosa finding 修复：fetch 前校验（env 配置仅放行 http+环回）
    const ollamaUrl = resolveOllamaUrl()

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:latest",
        prompt: task.input,
        stream: false,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        result: data.response,
        model: "qwen2.5:latest",
        duration: Date.now() - startTime,
        cost: 0,
        confidence: 0.8,
      }
    }

    return await executeWithCloudAPI(task, startTime)
  } catch (error) {
    // Mimosa finding 修复：URL 校验失败需上抛，由外层返回 400
    if (error instanceof SafeUrlValidationError) throw error
    return {
      success: false,
      error: "文本生成失败",
      duration: Date.now() - startTime,
      cost: 0,
    }
  }
}

// 执行分析任务
async function executeAnalysis(task: any) {
  const startTime = Date.now()

  try {
    // 分析任务使用更强的模型
    // Mimosa finding 修复：fetch 前校验（env 配置仅放行 http+环回）
    const ollamaUrl = resolveOllamaUrl()

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2:72b", // 使用用户的72B模型
        prompt: task.input,
        stream: false,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        result: data.response,
        model: "qwen2:72b",
        duration: Date.now() - startTime,
        cost: 0,
        confidence: 0.9,
      }
    }

    return await executeWithCloudAPI(task, startTime)
  } catch (error) {
    // Mimosa finding 修复：URL 校验失败需上抛，由外层返回 400
    if (error instanceof SafeUrlValidationError) throw error
    return {
      success: false,
      error: "分析任务失败",
      duration: Date.now() - startTime,
      cost: 0,
    }
  }
}

// 执行通用任务
async function executeGenericTask(task: any) {
  const startTime = Date.now()

  try {
    // Mimosa finding 修复：fetch 前校验（env 配置仅放行 http+环回）
    const ollamaUrl = resolveOllamaUrl()

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2:latest",
        prompt: task.input,
        stream: false,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        result: data.response,
        model: "qwen2:latest",
        duration: Date.now() - startTime,
        cost: 0,
        confidence: 0.8,
      }
    }

    return await executeWithCloudAPI(task, startTime)
  } catch (error) {
    // Mimosa finding 修复：URL 校验失败需上抛，由外层返回 400
    if (error instanceof SafeUrlValidationError) throw error
    return {
      success: false,
      error: "任务执行失败",
      duration: Date.now() - startTime,
      cost: 0,
    }
  }
}

// 使用云端API执行任务（仅在本地模型不可用时）
async function executeWithCloudAPI(task: any, startTime: number) {
  // 只有在配置了API密钥的情况下才尝试云端API
  const openaiKey = process.env.OPENAI_API_KEY

  if (openaiKey) {
    // Mimosa finding 修复：fetch 前校验云端端点（严格 https+禁内网）
    const openaiEndpoint = "https://api.openai.com/v1/chat/completions"
    if (!isSafeFetchUrl(openaiEndpoint)) {
      throw new SafeUrlValidationError(`不安全的云端 API 地址，已拦截: ${openaiEndpoint}`)
    }
    try {
      const response = await fetch(openaiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: task.input }],
          max_tokens: 2048,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          result: data.choices[0].message.content,
          model: "gpt-3.5-turbo",
          duration: Date.now() - startTime,
          cost: calculateOpenAICost(data.usage),
          confidence: 0.9,
        }
      }
    } catch (error) {
      console.error("云端API调用失败:", error)
    }
  }

  return {
    success: false,
    error: "所有AI服务都不可用",
    duration: Date.now() - startTime,
    cost: 0,
  }
}

// 计算OpenAI成本
function calculateOpenAICost(usage: any) {
  if (!usage) return 0

  const inputCost = (usage.prompt_tokens / 1000) * 0.0015
  const outputCost = (usage.completion_tokens / 1000) * 0.002

  return inputCost + outputCost
}
