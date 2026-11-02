/**
 * @file QuickActionsToolbar.tsx
 * @description 智能一键操作浮动工具栏 — 上下文感知、分组操作、结果预览、剪贴板历史面板
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags component, quick-actions, toolbar, floating, context-aware, clipboard
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Copy, FileText, Code, AlignLeft, RefreshCw, Zap,
  BookOpen, MessageSquare, Bug, TestTube, FileCode,
  Languages, Pencil, Maximize2, SpellCheck,
  X, ChevronDown, Check, LoaderCircle,
  Clipboard, Trash2, Clock, ArrowRightLeft,
  ListCollapse, Sparkles,
} from "lucide-react";
import { useQuickActionsStore, ACTION_DEFINITIONS, type ActionType } from "../../stores/quickActionsStore";
import { executeAction } from "../../services/quickActionsService";
import { useI18nStore } from "../../stores/i18nStore";
import { useNotificationStore } from "../../stores/notificationStore";

/* ─── 图标映射 ─── */
const ICON_MAP: Record<string, React.ReactNode> = {
  Copy: <Copy size={14} />,
  FileText: <FileText size={14} />,
  Code: <Code size={14} />,
  AlignLeft: <AlignLeft size={14} />,
  RefreshCw: <RefreshCw size={14} />,
  Zap: <Zap size={14} />,
  BookOpen: <BookOpen size={14} />,
  MessageSquare: <MessageSquare size={14} />,
  Bug: <Bug size={14} />,
  TestTube: <TestTube size={14} />,
  FileCode: <FileCode size={14} />,
  Languages: <Languages size={14} />,
  Pencil: <Pencil size={14} />,
  Maximize2: <Maximize2 size={14} />,
  SpellCheck: <SpellCheck size={14} />,
  ListCollapse: <ListCollapse size={14} />,
  ArrowRightLeft: <ArrowRightLeft size={14} />,
};

/* ─── 分组标签 ─── */
const GROUP_TABS = [
  { id: "all" as const, label: "qa.groupAll", icon: <Sparkles size={13} /> },
  { id: "code" as const, label: "qa.groupCode", icon: <Code size={13} /> },
  { id: "ai" as const, label: "qa.groupAI", icon: <BookOpen size={13} /> },
  { id: "text" as const, label: "qa.groupText", icon: <Pencil size={13} /> },
  { id: "document" as const, label: "qa.groupDoc", icon: <FileText size={13} /> },
];

/* ═══════════════════════════════════════════════════════════
 * 主工具栏组件
 * ═══════════════════════════════════════════════════════════ */

export const QuickActionsToolbar: React.FC = () => {
  const {
    isToolbarVisible, toolbarPosition, activeGroup, context,
    currentExecution, clipboardHistory, isClipboardPanelOpen,
    isResultPanelOpen, resultContent, resultTitle,
    hideToolbar, setActiveGroup, toggleClipboardPanel, hideResult,
  } = useQuickActionsStore();
  const { t } = useI18nStore();
  const notifications = useNotificationStore();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /* ─── 点击外部关闭 ─── */
  useEffect(() => {
    if (!isToolbarVisible) return;
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        hideToolbar();
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [isToolbarVisible, hideToolbar]);

  /* ─── Escape 关闭 ─── */
  useEffect(() => {
    if (!isToolbarVisible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideToolbar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isToolbarVisible, hideToolbar]);

  /* ─── 执行操作 ─── */
  const handleAction = useCallback(
    async (actionType: ActionType) => {
      if (!context) return;

      // 非 AI 的 copy 类操作：立即执行并提示
      if (["copy", "copy-markdown", "copy-html"].includes(actionType)) {
        try {
          await executeAction(actionType, context);
          setCopiedId(actionType);
          setTimeout(() => setCopiedId(null), 1500);
          notifications.success(t("qa.copied" as any), "", { autoCloseDelay: 1500 });
        } catch (err) {
          notifications.error(t("common.error"), err instanceof Error ? err.message : "");
        }
        return;
      }

      // AI 操作：执行并展示结果
      try {
        const result = await executeAction(actionType, context);
        useQuickActionsStore.getState().showResult(
          t(ACTION_DEFINITIONS.find((a) => a.type === actionType)?.title as any || ""),
          result
        );
      } catch (err) {
        notifications.error(t("common.error"), err instanceof Error ? err.message : "");
      }
    },
    [context, notifications, t]
  );

  /* ─── 筛选操作项 ─── */
  const filteredActions = ACTION_DEFINITIONS.filter(
    (a) => activeGroup === "all" || a.group === activeGroup
  );

  if (!isToolbarVisible) return null;

  /* ─── 计算位置（避免超出视口） ─── */
  const maxW = 420;
  const maxH = 360;
  const left = Math.min(toolbarPosition.x, window.innerWidth - maxW - 16);
  const top = Math.min(toolbarPosition.y + 8, window.innerHeight - maxH - 16);

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[9999]"
      style={{ left, top }}
    >
      {/* ═══ 主工具栏 ═══ */}
      <div
        className="rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,10,40,0.92), rgba(20,12,50,0.88))",
          minWidth: 320,
          maxWidth: maxW,
        }}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[11px] text-white/70">{t("qa.title" as any)}</span>
            {context?.selection.text && (
              <span className="text-[10px] text-white/30 ml-1">
                {context.selection.text.length} chars
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleClipboardPanel}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
              title={t("qa.clipboard" as any)}
            >
              <Clipboard size={13} />
            </button>
            <button
              onClick={hideToolbar}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* 分组标签 */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/5 overflow-x-auto">
          {GROUP_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGroup(tab.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] whitespace-nowrap transition-all ${
                activeGroup === tab.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
              }`}
            >
              {tab.icon}
              {t(tab.label as any)}
            </button>
          ))}
        </div>

        {/* 操作列表 */}
        <div className="max-h-[240px] overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
          {filteredActions.map((action) => {
            const isProcessing = currentExecution?.actionType === action.type && currentExecution.status === "processing";
            const justCopied = copiedId === action.type;

            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.type)}
                disabled={isProcessing}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all group ${
                  isProcessing
                    ? "bg-purple-500/10 cursor-wait"
                    : "hover:bg-white/5 active:bg-white/10"
                }`}
              >
                {/* 图标 */}
                <span className={`flex-shrink-0 ${
                  action.requiresAI ? "text-purple-400" : "text-cyan-400"
                } ${isProcessing ? "animate-pulse" : ""}`}>
                  {isProcessing ? <LoaderCircle size={14} className="animate-spin" /> : ICON_MAP[action.icon] || <Code size={14} />}
                </span>

                {/* 标题 + 描述 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/80 group-hover:text-white transition-colors truncate">
                      {t(action.title as any)}
                    </span>
                    {action.requiresAI && (
                      <span className="flex-shrink-0 text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/20">
                        AI
                      </span>
                    )}
                  </div>
                </div>

                {/* 快捷键 / 状态 */}
                <div className="flex-shrink-0 flex items-center gap-1">
                  {justCopied && <Check size={12} className="text-green-400" />}
                  {action.shortcut && !isProcessing && !justCopied && (
                    <span className="text-[9px] text-white/20 font-mono">
                      {action.shortcut.replace("Mod", "⌘")}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 底部状态栏 */}
        {currentExecution && currentExecution.status === "processing" && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-white/5 bg-purple-500/5">
            <LoaderCircle size={11} className="animate-spin text-purple-400" />
            <span className="text-[10px] text-purple-300/70">
              {t("qa.processing" as any)}...
            </span>
          </div>
        )}
      </div>

      {/* ═══ 结果面板 ═══ */}
      {isResultPanelOpen && resultContent && (
        <div
          className="mt-2 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(20,12,50,0.92))",
            maxWidth: maxW,
          }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <span className="text-[11px] text-purple-300">
              {resultTitle || t("qa.result" as any)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(resultContent);
                  notifications.success(t("qa.copied" as any), "", { autoCloseDelay: 1200 });
                }}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                title={t("common.copy")}
              >
                <Copy size={12} />
              </button>
              <button
                onClick={hideResult}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-3">
            <pre className="text-[11px] text-white/70 whitespace-pre-wrap break-words font-mono">
              {resultContent}
            </pre>
          </div>
        </div>
      )}

      {/* ═══ 剪贴板历史面板 ═══ */}
      {isClipboardPanelOpen && (
        <ClipboardHistoryPanel />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
 * 剪贴板历史面板
 * ═══════════════════════════════════════════════════════════ */

const ClipboardHistoryPanel: React.FC = () => {
  const {
    clipboardHistory,
    removeClipboardItem,
    clearClipboardHistory,
    toggleClipboardPanel,
  } = useQuickActionsStore();
  const { t } = useI18nStore();
  const notifications = useNotificationStore();

  const handlePaste = useCallback(
    async (content: string) => {
      await navigator.clipboard.writeText(content);
      notifications.success(t("qa.copied" as any), "", { autoCloseDelay: 1200 });
    },
    [notifications, t]
  );

  return (
    <div
      className="mt-2 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(20,12,50,0.92))",
        minWidth: 320,
        maxWidth: 420,
      }}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Clipboard size={13} className="text-cyan-400" />
          <span className="text-[11px] text-white/70">{t("qa.clipboardHistory" as any)}</span>
          <span className="text-[9px] text-white/30">{clipboardHistory.length}</span>
        </div>
        <div className="flex items-center gap-1">
          {clipboardHistory.length > 0 && (
            <button
              onClick={clearClipboardHistory}
              className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
              title={t("qa.clearHistory" as any)}
            >
              <Trash2 size={12} />
            </button>
          )}
          <button
            onClick={toggleClipboardPanel}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* 历史列表 */}
      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
        {clipboardHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Clipboard size={20} className="text-white/10" />
            <span className="text-[10px] text-white/20">{t("qa.clipboardEmpty" as any)}</span>
          </div>
        ) : (
          <div className="p-1.5 space-y-0.5">
            {clipboardHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 group transition-colors cursor-pointer"
                onClick={() => handlePaste(item.content)}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {item.type === "code" ? (
                    <Code size={12} className="text-cyan-400/60" />
                  ) : (
                    <FileText size={12} className="text-white/30" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <pre className="text-[10px] text-white/50 group-hover:text-white/70 truncate whitespace-nowrap overflow-hidden font-mono transition-colors">
                    {item.content.slice(0, 80)}
                  </pre>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.language && (
                      <span className="text-[8px] text-purple-400/50">{item.language}</span>
                    )}
                    <span className="text-[8px] text-white/15 flex items-center gap-0.5">
                      <Clock size={8} />
                      {formatTimeAgo(item.copiedAt)}
                    </span>
                    <span className="text-[8px] text-white/15">
                      {item.size > 1024 ? `${(item.size / 1024).toFixed(1)}KB` : `${item.size}B`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeClipboardItem(item.id);
                  }}
                  className="flex-shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── 辅助：时间格式化 ─── */
function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时前`;
  return `${Math.floor(diff / 86_400_000)}天前`;
}

/* ═══════════════════════════════════════════════════════════
 * 内联操作按钮条 (嵌入编辑器顶部或代码选中时的快捷条)
 * ═══════════════════════════════════════════════════════════ */

export const QuickActionsInlineBar: React.FC<{
  context: import("../../stores/quickActionsStore").ActionContext | null;
  compact?: boolean;
}> = ({ context, compact = false }) => {
  const { t } = useI18nStore();
  const notifications = useNotificationStore();
  const { currentExecution } = useQuickActionsStore();
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const quickActions: { type: ActionType; icon: React.ReactNode; label: string; ai: boolean }[] = [
    { type: "copy", icon: <Copy size={12} />, label: t("qa.copy" as any), ai: false },
    { type: "copy-markdown", icon: <FileText size={12} />, label: "MD", ai: false },
    { type: "explain", icon: <BookOpen size={12} />, label: t("qa.explain" as any), ai: true },
    { type: "refactor", icon: <RefreshCw size={12} />, label: t("qa.refactor" as any), ai: true },
    { type: "find-issues", icon: <Bug size={12} />, label: t("qa.findIssues" as any), ai: true },
    { type: "translate", icon: <Languages size={12} />, label: t("qa.translate" as any), ai: true },
  ];

  const handleAction = useCallback(
    async (actionType: ActionType) => {
      if (!context) return;
      try {
        const result = await executeAction(actionType, context);
        if (["copy", "copy-markdown", "copy-html"].includes(actionType)) {
          setCopiedAction(actionType);
          setTimeout(() => setCopiedAction(null), 1500);
          notifications.success(t("qa.copied" as any), "", { autoCloseDelay: 1200 });
        } else {
          useQuickActionsStore.getState().showResult(
            t(ACTION_DEFINITIONS.find((a) => a.type === actionType)?.title as any || ""),
            result
          );
        }
      } catch (err) {
        notifications.error(t("common.error"), err instanceof Error ? err.message : "");
      }
    },
    [context, notifications, t]
  );

  if (!context?.selection.text) return null;

  return (
    <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-black/20 border border-white/5">
      {(compact ? quickActions.slice(0, 4) : quickActions).map((qa) => {
        const isProcessing = currentExecution?.actionType === qa.type && currentExecution.status === "processing";
        const isCopied = copiedAction === qa.type;

        return (
          <button
            key={qa.type}
            onClick={() => handleAction(qa.type)}
            disabled={isProcessing}
            className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] transition-all ${
              isCopied
                ? "text-green-400"
                : qa.ai
                ? "text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/10"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            } ${isProcessing ? "animate-pulse cursor-wait" : ""}`}
            title={qa.label}
          >
            {isProcessing ? (
              <LoaderCircle size={12} className="animate-spin" />
            ) : isCopied ? (
              <Check size={12} />
            ) : (
              qa.icon
            )}
            {!compact && <span>{qa.label}</span>}
          </button>
        );
      })}

      {/* 展开更多 */}
      <button
        onClick={() => {
          if (context) {
            useQuickActionsStore.getState().showToolbar(
              { x: window.innerWidth / 2 - 160, y: 100 },
              context
            );
          }
        }}
        className="flex items-center gap-0.5 px-1.5 py-1 rounded text-[10px] text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
        title={t("qa.moreActions" as any)}
      >
        <ChevronDown size={12} />
      </button>
    </div>
  );
};
