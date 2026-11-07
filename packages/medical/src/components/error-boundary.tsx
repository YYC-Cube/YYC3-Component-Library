// ============================================================
// YYC³ · @yyc3/medical 前置件（medical T0+T1 批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/ai-medical-systemadvanced/components/error-boundary.tsx
// ============================================================
"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@yyc3/ui-enterprise"
import { Button } from "@yyc3/ui-enterprise"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染将显示回退UI
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // 可以在这里记录错误到错误报告服务
    console.error("组件错误:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  public render() {
    if (this.state.hasError) {
      // 自定义回退UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>出现错误</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p className="text-sm">组件渲染时发生错误。</p>
              {this.state.error && <p className="text-xs mt-1 font-mono">{this.state.error.toString()}</p>}
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={this.handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}
