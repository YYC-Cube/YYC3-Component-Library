import { type NextRequest, NextResponse } from "next/server"

// Mimosa finding 修复（13 阶段终验 · 2026-11-07）：
// SSRF 防护 —— 服务端发起 fetch 前校验目标 URL：默认仅允许 https:，并拒绝
// 私网/环回/链路本地（169.254.x，含云元数据）/0.0.0.0/.internal/.localhost
// 及纯数字十进制 IP 等内网目标。唯一例外：env 配置的本地 Ollama 地址
// （NEXT_PUBLIC_OLLAMA_URL，属部署方服务端配置、非请求方可控）允许 http+环回，
// 以保留本地模型功能。providerId 仅用于选择固定端点，不参与 URL 拼接。
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
    const { providerId } = await request.json()

    // 验证提供商配置
    let isValid = false
    let errorMessage = ""

    switch (providerId) {
      case "openai":
        // 验证OpenAI API密钥
        const openaiKey = process.env.OPENAI_API_KEY
        if (openaiKey) {
          // Mimosa finding 修复：fetch 前校验端点（严格 https+禁内网），非法由外层返回 400
          const openaiEndpoint = "https://api.openai.com/v1/models"
          if (!isSafeFetchUrl(openaiEndpoint)) {
            throw new SafeUrlValidationError(`不安全的 API 端点，已拦截: ${openaiEndpoint}`)
          }
          try {
            const response = await fetch(openaiEndpoint, {
              headers: {
                Authorization: `Bearer ${openaiKey}`,
              },
            })
            isValid = response.ok
            if (!isValid) {
              errorMessage = "OpenAI API密钥无效"
            }
          } catch (error) {
            errorMessage = "无法连接到OpenAI服务"
          }
        } else {
          errorMessage = "未配置OpenAI API密钥"
        }
        break

      case "anthropic":
        // 验证Anthropic API密钥
        const anthropicKey = process.env.ANTHROPIC_API_KEY
        if (anthropicKey) {
          // Mimosa finding 修复：fetch 前校验端点（严格 https+禁内网），非法由外层返回 400
          const anthropicEndpoint = "https://api.anthropic.com/v1/messages"
          if (!isSafeFetchUrl(anthropicEndpoint)) {
            throw new SafeUrlValidationError(`不安全的 API 端点，已拦截: ${anthropicEndpoint}`)
          }
          try {
            const response = await fetch(anthropicEndpoint, {
              method: "POST",
              headers: {
                "x-api-key": anthropicKey,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1,
                messages: [{ role: "user", content: "test" }],
              }),
            })
            isValid = response.status !== 401 // 401表示密钥无效
            if (!isValid) {
              errorMessage = "Anthropic API密钥无效"
            }
          } catch (error) {
            errorMessage = "无法连接到Anthropic服务"
          }
        } else {
          errorMessage = "未配置Anthropic API密钥"
        }
        break

      case "google":
        // 验证Google API密钥
        const googleKey = process.env.GOOGLE_API_KEY
        if (googleKey) {
          // Mimosa finding 修复：fetch 前校验端点（严格 https+禁内网），非法由外层返回 400
          const googleEndpoint = `https://generativelanguage.googleapis.com/v1/models?key=${googleKey}`
          if (!isSafeFetchUrl(googleEndpoint)) {
            throw new SafeUrlValidationError("不安全的 API 端点，已拦截")
          }
          try {
            const response = await fetch(googleEndpoint)
            isValid = response.ok
            if (!isValid) {
              errorMessage = "Google API密钥无效"
            }
          } catch (error) {
            errorMessage = "无法连接到Google AI服务"
          }
        } else {
          errorMessage = "未配置Google API密钥"
        }
        break

      case "local":
        // 验证本地Ollama服务
        // Mimosa finding 修复：fetch 前校验（env 配置仅放行 http+环回），非法由外层返回 400
        const ollamaUrl = resolveOllamaUrl()
        try {
          const response = await fetch(`${ollamaUrl}/api/tags`)
          isValid = response.ok
          if (!isValid) {
            errorMessage = "Ollama服务不可用"
          }
        } catch (error) {
          errorMessage = "无法连接到Ollama服务"
        }
        break

      default:
        errorMessage = "未知的提供商"
    }

    return NextResponse.json({
      success: isValid,
      providerId,
      error: isValid ? null : errorMessage,
    })
  } catch (error) {
    // Mimosa finding 修复：URL 校验不通过时返回 400
    if (error instanceof SafeUrlValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "不合法的服务地址",
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: "验证过程中发生错误",
      },
      { status: 500 },
    )
  }
}
