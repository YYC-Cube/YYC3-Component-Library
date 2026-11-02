// src/components/error/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, Button, Text } from '@mantine/core'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: _error,
      errorInfo
    })

    // 上报错误到服务器
    this.reportError(_error, errorInfo)
  }

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      await fetch('/api/v1/log/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6">
            <Alert
                icon="⚠️"
                title="应用遇到错误"
                color="red"
                mb="md"
              >
              <Text mb="md">
                很抱歉，应用遇到了一个意外错误。我们已经记录了这个问题，请稍后重试。
              </Text>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary>错误详情（开发模式）</summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                <Button onClick={this.handleReset} variant="outline">
                  重新加载
                </Button>
                <Button onClick={() => window.location.reload()}>
                  刷新页面
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}