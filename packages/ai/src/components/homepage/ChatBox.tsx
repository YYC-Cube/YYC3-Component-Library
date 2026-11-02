/**
 * @file ChatBox.tsx
 * @description 智能编程 AI 聊天框 — 集成液态玻璃风格、多功能工具栏、智能路由决策、文件拖放
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.1.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags chat, ai, glassmorphism, routing, multimodal
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Upload, FolderOpen, Link, PenTool, Code, Clipboard,
  User, Settings, Bot, X, ArrowUp, FileUp,
} from "lucide-react";
import { useConversationStore } from "../../stores/conversationStore";
import { analyzeIntent } from "../../utils/intentAnalyzer";
import { analyzeProgrammingDepth } from "../../utils/programmingDepthAnalyzer";
import { extractAndSubmitFromConversation } from "../../services/taskInferenceService";

/* ─── 模拟 AI 响应 ─── */
const AI_RESPONSES: Record<string, string> = {
  default: `你好！我是 YYC³ AI Code 智能编程助手。我可以帮助你：

- **设计 UI 界面** — 描述你想要的界面，我来生成代码
- **编写代码** — 提供需求，我帮你实现
- **调试问题** — 粘贴代码，我帮你排查
- **项目架构** — 讨论技术方案和最佳实践

请告诉我你想做什么？`,
  design: `好的，我检测到你想进行 **UI 设计**相关的工作。

我建议进入 **多联式布局设计器** 来完成这项工作：
- 可视化拖拽布局
- 实时代码预览
- 多设备响应式适配

正在为你准备设计环境...`,
  code: `收到！让我来帮你编写代码。

\`\`\`typescript
// 示例：React 组件模板
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Component: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="container">
      <h2>{title}</h2>
      {children}
    </div>
  );
};
\`\`\`

需要我进一步完善或修改吗？`,
};

const getAIResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();
  const designKw = ["设计", "布局", "界面", "ui", "ux", "页面", "layout", "design"];
  const codeKw = ["代码", "函数", "组件", "实现", "code", "function", "component"];
  if (designKw.some((k) => lower.includes(k))) return AI_RESPONSES.design;
  if (codeKw.some((k) => lower.includes(k))) return AI_RESPONSES.code;
  return AI_RESPONSES.default;
};

/* ─── 主组件 ─── */
export const ChatBox: React.FC = () => {
  const navigate = useNavigate();
  const { messages, isStreaming, addMessage, setStreaming } = useConversationStore();
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [routeNotice, setRouteNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);

  /* ─── 自动调整输入框高度 ─── */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  /* ─── 自动滚动到底部 ─── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ─── 点击外部关闭菜单 ─── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  /* ─── 智能路由决策：监控对话深度 ─── */
  useEffect(() => {
    if (hasNavigatedRef.current || messages.length <= 3) return;
    const analysis = analyzeProgrammingDepth(messages);
    if (analysis.shouldNavigateToWorkbench) {
      hasNavigatedRef.current = true;
      setRouteNotice("检测到深度编程需求，即将切换至 AI 交互工作台...");
      setTimeout(() => {
        navigate(`/ai-workbench?depth=${analysis.depth}`);
      }, 2000);
    }
  }, [messages, navigate]);

  /* ─── 发送消息 ─── */
  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    addMessage({ role: "user", content: userMsg });

    /* ─── 智能路由决策：首次消息意图分析 ─── */
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    if (userMsgCount === 0 && !hasNavigatedRef.current) {
      const intent = analyzeIntent(userMsg);
      if (intent.shouldNavigateToLayoutDesigner) {
        hasNavigatedRef.current = true;
        setStreaming(true);
        await new Promise((r) => setTimeout(r, 600));
        addMessage({ role: "assistant", content: getAIResponse(userMsg) });
        setStreaming(false);
        setRouteNotice(`意图识别置信度 ${(intent.confidence * 100).toFixed(0)}%，正在导航至布局设计器...`);
        setTimeout(() => {
          const ctx = encodeURIComponent(intent.userContext);
          navigate(`/layout-designer?context=${ctx}`);
        }, 2200);
        return;
      }
    }

    setStreaming(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
    addMessage({ role: "assistant", content: getAIResponse(userMsg) });
    setStreaming(false);

    /* ─── 对话自动提取任务（每 3 条用户消息检测一次） ─── */
    const updatedMessages = useConversationStore.getState().messages;
    const userCount = updatedMessages.filter((m) => m.role === "user").length;
    if (userCount > 0 && userCount % 3 === 0) {
      const extracted = extractAndSubmitFromConversation(
        updatedMessages.map((m) => ({ role: m.role, content: m.content }))
      );
      if (extracted > 0) {
        setRouteNotice(`AI 从对话中提取了 ${extracted} 个待办任务`);
        setTimeout(() => setRouteNotice(null), 3000);
      }
    }
  }, [input, isStreaming, addMessage, setStreaming, messages, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ─── 文件拖放处理 ─── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const names = files.map((f) => f.name).join(", ");
      addMessage({ role: "user", content: `[已导入文件] ${names}` });
    }
  };

  /* ─── 工具栏项 ─── */
  const toolbarItems = [
    { icon: Upload, label: "上传图片", desc: "PNG, JPG, GIF, SVG", accept: "image/*" },
    { icon: FolderOpen, label: "导入文件", desc: "支持多文件", accept: "*/*", multiple: true },
    { icon: Link, label: "GitHub 链接", desc: "仓库 URL" },
    { icon: PenTool, label: "Figma 文件", desc: ".fig 文件", accept: ".fig" },
    { icon: Code, label: "代码片段", desc: "多语言代码" },
    { icon: Clipboard, label: "剪贴板", desc: "Ctrl+V" },
  ];

  /* ─── 消息渲染 ─── */
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        if (match) {
          return (
            <div key={idx} className="my-3 rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="opacity-60" style={{ fontSize: "12px" }}>{match[1] || "code"}</span>
              </div>
              <pre className="p-4 overflow-x-auto m-0" style={{ fontSize: "13px", lineHeight: 1.6 }}>
                <code>{match[2]}</code>
              </pre>
            </div>
          );
        }
      }
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx}>
          {boldParts.map((bp, bIdx) => {
            if (bp.startsWith("**") && bp.endsWith("**")) {
              return <strong key={bIdx} style={{ fontWeight: 600 }}>{bp.slice(2, -2)}</strong>;
            }
            const codeParts = bp.split(/(`[^`]+`)/g);
            return codeParts.map((cp, cIdx) => {
              if (cp.startsWith("`") && cp.endsWith("`")) {
                return (
                  <code key={cIdx} className="px-1.5 py-0.5 rounded" style={{ background: "rgba(0,255,135,0.15)", fontSize: "0.9em" }}>
                    {cp.slice(1, -1)}
                  </code>
                );
              }
              return <span key={cIdx}>{cp}</span>;
            });
          })}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}
      className="w-full max-w-[720px] mx-auto px-4"
    >
      {/* ─── 文件拖放包裹层 ─── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: isDragOver ? "2px solid rgba(0,255,135,0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
          transition: "border 0.2s ease",
        }}
      >
        {/* 拖放覆盖层 */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(0,255,135,0.08)", backdropFilter: "blur(4px)" }}
            >
              <div className="flex flex-col items-center gap-3">
                <FileUp size={40} style={{ color: "#00ff87" }} />
                <p className="m-0" style={{ fontSize: "16px", fontWeight: 600, color: "#00ff87" }}>释放文件以导入</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 工具栏 ─── */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: menuOpen ? "rgba(0,255,135,0.2)" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--foreground)",
              }}
              aria-label="展开多功能菜单"
              title="展开多功能菜单"
            >
              {menuOpen ? <X size={16} /> : <Plus size={16} />}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 z-50 w-64 rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(30, 30, 40, 0.95)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  {toolbarItems.map((item, idx) => {
                    if (item.accept) {
                      return (
                        <label
                          key={idx}
                          className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer"
                          style={{
                            borderBottom: idx < toolbarItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                            color: "rgba(255,255,255,0.9)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <item.icon size={18} className="opacity-70 flex-shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</span>
                            <span className="opacity-50" style={{ fontSize: "12px" }}>{item.desc}</span>
                          </div>
                          <input
                            type="file"
                            accept={item.accept}
                            multiple={item.multiple}
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                const names = files.map((f) => f.name).join(", ");
                                addMessage({ role: "user", content: `[${item.label}] ${names}` });
                              }
                              setMenuOpen(false);
                            }}
                          />
                        </label>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left"
                        style={{
                          borderBottom: idx < toolbarItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                          color: "rgba(255,255,255,0.9)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <item.icon size={18} className="opacity-70 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</span>
                          <span className="opacity-50" style={{ fontSize: "12px" }}>{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 右侧图标 — 导航至对应页面 */}
          <div />
        </div>

        {/* ─── 消息区域（紧凑） ─── */}
        <div
          className="overflow-y-auto px-4 py-3 space-y-3"
          style={{ minHeight: "280px", maxHeight: "320px" }}
        >
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Bot size={36} className="mb-3 opacity-25" />
              <p className="opacity-40 m-0 mb-1" style={{ fontSize: "15px", fontWeight: 500 }}>
                YYC³ AI Code 智能编程助手
              </p>
              <p className="opacity-30 m-0" style={{ fontSize: "13px" }}>
                输入您的需求，AI 将为您生成代码...
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-[520px]">
                {[
                  "创建一个 Dashboard 布局",
                  "帮我设计登录页面",
                  "写一个 React 表单组件",
                  "优化这段代码的性能",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="px-3.5 py-2 rounded-xl transition-all duration-200"
                    style={{
                      fontSize: "13px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0,255,135,0.08)";
                      e.currentTarget.style.borderColor = "rgba(0,255,135,0.25)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #60efff, #a855f7)"
                    : "linear-gradient(135deg, #00ff87, #60efff)",
                }}
              >
                {msg.role === "user" ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
              </div>
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3"
                style={{
                  background: msg.role === "user" ? "rgba(96, 239, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${msg.role === "user" ? "rgba(96, 239, 255, 0.2)" : "rgba(255,255,255,0.08)"}`,
                  fontSize: "14px",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {renderMessageContent(msg.content)}
              </div>
            </motion.div>
          ))}

          {/* 流式加载指示 */}
          {isStreaming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #00ff87, #60efff)" }}>
                <Bot size={14} color="white" />
              </div>
              <div className="rounded-2xl px-4 py-3 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="opacity-50" style={{ fontSize: "13px" }}>AI 正在思考</span>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: ["#00ff87", "#60efff", "#a855f7"][i] }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 路由通知条 */}
          <AnimatePresence>
            {routeNotice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.2)" }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00ff87" }} />
                <span style={{ fontSize: "13px", color: "#00ff87" }}>{routeNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* ─── 输入区域 ─── */}
        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div
            className="flex items-end gap-2 rounded-xl px-4 py-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的需求，AI 将为您生成代码..."
              disabled={isStreaming}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none py-1.5"
              style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--foreground)", maxHeight: "150px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 mb-0.5"
              style={{
                background: input.trim() && !isStreaming ? "linear-gradient(135deg, #00ff87, #60efff)" : "rgba(255,255,255,0.08)",
                opacity: input.trim() && !isStreaming ? 1 : 0.4,
                cursor: input.trim() && !isStreaming ? "pointer" : "default",
              }}
              aria-label="发送"
            >
              <ArrowUp size={16} color={input.trim() && !isStreaming ? "#000" : "rgba(255,255,255,0.5)"} />
            </button>
          </div>
          <p className="text-center mt-2 mb-0 opacity-25" style={{ fontSize: "11px" }}>
            Enter 发送 · Shift+Enter 换行 · 支持拖放文件导入
          </p>
        </div>
      </div>
    </motion.div>
  );
};