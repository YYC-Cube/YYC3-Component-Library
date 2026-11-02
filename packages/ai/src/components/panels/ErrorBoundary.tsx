/**
 * @file ErrorBoundary.tsx
 * @description 面板级错误边界 — 崩溃隔离/友好错误UI/一键恢复/错误日志/堆栈展开
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags error-boundary, crash-recovery, fault-tolerance, panel
 */

import React, { Component, type ErrorInfo } from "react";
import {
  TriangleAlert, RotateCcw, ChevronDown, ChevronRight,
  Copy, Bug, X,
} from "lucide-react";

/* ─── 类型 ─── */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  panelId?: string;
  panelType?: string;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showStack: boolean;
  copied: boolean;
}

/* ─── 错误边界组件 ─── */
export class PanelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showStack: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // 错误日志记录
    console.error(
      `[YYC³ PanelErrorBoundary] 面板 ${this.props.panelId || "unknown"} (${this.props.panelType || "unknown"}) 发生错误:`,
      error,
      errorInfo
    );
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showStack: false,
      copied: false,
    });
    this.props.onReset?.();
  };

  handleCopyError = (): void => {
    const { error, errorInfo } = this.state;
    const report = [
      `[YYC³ Error Report]`,
      `Panel: ${this.props.panelId || "unknown"}`,
      `Type: ${this.props.panelType || "unknown"}`,
      `Time: ${new Date().toISOString()}`,
      `Error: ${error?.message || "Unknown"}`,
      `Stack:\n${error?.stack || "N/A"}`,
      `Component Stack:\n${errorInfo?.componentStack || "N/A"}`,
    ].join("\n");

    navigator.clipboard.writeText(report).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error, showStack, copied } = this.state;
    const title = this.props.fallbackTitle || "面板加载异常";

    return (
      <div
        className="flex flex-col items-center justify-center h-full p-6 gap-4"
        style={{ background: "#14142a" }}
      >
        {/* 错误图标 */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(255,107,107,0.08)",
            border: "1px solid rgba(255,107,107,0.15)",
          }}
        >
          <TriangleAlert size={24} style={{ color: "#ff6b6b" }} />
        </div>

        {/* 标题 */}
        <div className="text-center">
          <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
            {title}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
            该面板遇到了意外错误，不会影响其他面板
          </div>
        </div>

        {/* 错误摘要 */}
        {error && (
          <div
            className="w-full max-w-[320px] rounded-lg px-3 py-2"
            style={{
              background: "rgba(255,107,107,0.04)",
              border: "1px solid rgba(255,107,107,0.1)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Bug size={11} style={{ color: "#ff6b6b" }} />
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#ff6b6b" }}>
                {error.name || "Error"}
              </span>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {error.message}
            </div>
          </div>
        )}

        {/* 堆栈展开 */}
        {error?.stack && (
          <div className="w-full max-w-[320px]">
            <button
              onClick={() => this.setState({ showStack: !showStack })}
              className="flex items-center gap-1 w-full transition-colors"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
            >
              {showStack ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              <span>错误堆栈</span>
            </button>
            {showStack && (
              <pre
                className="mt-1 p-2 rounded-lg overflow-auto max-h-[160px]"
                style={{
                  fontSize: "9px",
                  fontFamily: "monospace",
                  color: "rgba(255,255,255,0.3)",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.06) transparent",
                }}
              >
                {error.stack}
              </pre>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors"
            style={{
              fontSize: "12px",
              background: "rgba(0,255,135,0.08)",
              color: "#00ff87",
              border: "1px solid rgba(0,255,135,0.15)",
            }}
          >
            <RotateCcw size={12} />
            重新加载
          </button>
          <button
            onClick={this.handleCopyError}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors"
            style={{
              fontSize: "12px",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Copy size={12} />
            {copied ? "已复制" : "复制错误"}
          </button>
        </div>

        {/* 面板标识 */}
        {this.props.panelId && (
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.12)" }}>
            Panel: {this.props.panelId} · Type: {this.props.panelType || "-"}
          </div>
        )}
      </div>
    );
  }
}
