/**
 * @file CrossWindowDropZone.tsx
 * @description 跨窗口拖拽放置区域 v2.0 — 完整 Tab meta 恢复 + 面板状态无损迁移
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-18
 * @updated 2026-03-19
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags cross-window, drag, drop-zone, panel-transfer, meta-restore
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, ArrowDownToLine, FileCode, Bot, Terminal, Eye, Database } from "lucide-react";
import {
  crossWindowDragService,
  CrossWindowDragMessage,
  PanelStateSnapshot,
} from "../../services/crossWindowDragService";
import { useLayoutStore, PanelType } from "../../stores/layoutStore";

/* ─── 面板类型图标 ─── */
const typeIconMap: Partial<Record<string, React.ElementType>> = {
  "code-editor": FileCode,
  "ai-chat": Bot,
  terminal: Terminal,
  preview: Eye,
  database: Database,
};

export const CrossWindowDropZone: React.FC = () => {
  const [incomingDrag, setIncomingDrag] = useState<CrossWindowDragMessage | null>(null);
  const [dropReady, setDropReady] = useState(false);
  const { createPanel, createTab, panels, tabs } = useLayoutStore();

  /**
   * v2.0: 从完整面板快照恢复面板状态
   */
  const restorePanelFromSnapshot = useCallback(
    (snapshot: PanelStateSnapshot) => {
      const panelType = (snapshot.panelType || "code-editor") as PanelType;

      // 创建面板（自带一个默认 Tab）
      const newPanelId = createPanel(panelType, snapshot.panelTitle);

      // 如果快照含多个 Tab，逐个恢复
      if (snapshot.tabs.length > 1) {
        // 跳过第一个（已被 createPanel 创建）
        for (let i = 1; i < snapshot.tabs.length; i++) {
          const tabSnap = snapshot.tabs[i];
          const tabType = (tabSnap.type || panelType) as PanelType;
          createTab(newPanelId, tabType, tabSnap.title);
        }
      }

      // 恢复第一个 Tab 的 meta
      const newPanel = useLayoutStore.getState().panels[newPanelId];
      if (newPanel && snapshot.tabs.length > 0) {
        const firstTab = snapshot.tabs[0];
        const firstTabId = newPanel.tabs[0];
        if (firstTabId) {
          const store = useLayoutStore.getState();
          const existingTab = store.tabs[firstTabId];
          if (existingTab) {
            // 恢复 meta（文件路径、编辑器光标等）
            const restoredMeta: Record<string, unknown> = {
              ...(firstTab.meta || {}),
              // 如果有编辑器状态，注入到 meta 中
              ...(snapshot.editorStates?.[firstTab.tabId]
                ? {
                    _editorState: snapshot.editorStates[firstTab.tabId],
                    filePath: snapshot.editorStates[firstTab.tabId].filePath,
                    language: snapshot.editorStates[firstTab.tabId].language,
                    cursorPosition: snapshot.editorStates[firstTab.tabId].cursorPosition,
                    scrollPosition: snapshot.editorStates[firstTab.tabId].scrollPosition,
                    selections: snapshot.editorStates[firstTab.tabId].selections,
                  }
                : {}),
              // AI chat 上下文
              ...(snapshot.chatContext ? { _chatContext: snapshot.chatContext } : {}),
              // 终端工作目录
              ...(snapshot.terminalCwd ? { terminalCwd: snapshot.terminalCwd } : {}),
              // 数据库连接
              ...(snapshot.dbConnectionId ? { dbConnectionId: snapshot.dbConnectionId } : {}),
              // 预览设备配置
              ...(snapshot.previewDevice ? { previewDevice: snapshot.previewDevice } : {}),
              // 标记为跨窗口恢复
              _crossWindowRestored: true,
              _sourceWindowId: incomingDrag?.sourceWindowId,
              _restoredAt: Date.now(),
            };

            // 更新 Tab meta（通过 store 直接设置）
            useLayoutStore.setState((s) => ({
              tabs: {
                ...s.tabs,
                [firstTabId]: {
                  ...existingTab,
                  title: firstTab.title,
                  isPinned: firstTab.isPinned,
                  isModified: firstTab.isModified,
                  isUnsaved: firstTab.isUnsaved,
                  meta: restoredMeta,
                },
              },
            }));
          }
        }
      }

      return newPanelId;
    },
    [createPanel, createTab, incomingDrag]
  );

  /* ─── 监听外部窗口的拖拽消息 ─── */
  useEffect(() => {
    const unsubStart = crossWindowDragService.on("drag-start", (msg) => {
      setIncomingDrag(msg);
    });
    const unsubCancel = crossWindowDragService.on("drag-cancel", () => {
      setIncomingDrag(null);
      setDropReady(false);
    });
    const unsubEnd = crossWindowDragService.on("drag-end", () => {
      setIncomingDrag(null);
      setDropReady(false);
    });
    const unsubTransfer = crossWindowDragService.on("panel-transfer", (msg) => {
      if (msg.targetWindowId === crossWindowDragService.getWindowId()) {
        if (msg.panelSnapshot) {
          // v2.0: 使用完整快照恢复面板
          restorePanelFromSnapshot(msg.panelSnapshot);
        } else {
          // 兼容旧版：仅创建空面板
          const panelType = (msg.panelType || "code-editor") as PanelType;
          createPanel(panelType);
        }
        setIncomingDrag(null);
        setDropReady(false);
      }
    });

    return () => {
      unsubStart();
      unsubCancel();
      unsubEnd();
      unsubTransfer();
    };
  }, [createPanel, restorePanelFromSnapshot]);

  /* ─── 处理放置 ─── */
  const handleDrop = useCallback(() => {
    if (!incomingDrag) return;
    crossWindowDragService.endDrag(crossWindowDragService.getWindowId());
    setIncomingDrag(null);
    setDropReady(false);
  }, [incomingDrag]);

  if (!incomingDrag) return null;

  const TypeIcon = typeIconMap[incomingDrag.panelType] || Monitor;
  const tabCount = incomingDrag.panelSnapshot?.tabs.length || 0;
  const hasEditorState = !!(incomingDrag.panelSnapshot?.editorStates &&
    Object.keys(incomingDrag.panelSnapshot.editorStates).length > 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9995] pointer-events-auto"
        style={{ background: "rgba(0,0,0,0.15)" }}
        onMouseUp={handleDrop}
        onMouseEnter={() => setDropReady(true)}
        onMouseLeave={() => setDropReady(false)}
      >
        {/* 边框高亮 */}
        <motion.div
          animate={{
            borderColor: dropReady
              ? "rgba(0,255,135,0.6)"
              : "rgba(96,239,255,0.3)",
            boxShadow: dropReady
              ? "inset 0 0 40px rgba(0,255,135,0.08)"
              : "inset 0 0 20px rgba(96,239,255,0.04)",
          }}
          className="absolute inset-2 rounded-2xl pointer-events-none"
          style={{
            border: "2px dashed rgba(96,239,255,0.3)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        />

        {/* 中心提示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
            style={{
              background: "rgba(14,14,28,0.95)",
              backdropFilter: "blur(20px)",
              border: dropReady
                ? "1px solid rgba(0,255,135,0.3)"
                : "1px solid rgba(96,239,255,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              minWidth: "280px",
            }}
          >
            {dropReady ? (
              <ArrowDownToLine size={28} style={{ color: "#00ff87" }} />
            ) : (
              <TypeIcon size={28} style={{ color: "#60efff" }} />
            )}

            <p className="m-0" style={{
              fontSize: "14px",
              fontWeight: 600,
              color: dropReady ? "#00ff87" : "#60efff",
            }}>
              {dropReady ? "释放以接收面板" : "从其他窗口拖入面板"}
            </p>

            {/* 面板详情 */}
            <div className="flex flex-col items-center gap-1">
              <p className="m-0" style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                来源: {incomingDrag.sourceWindowId.slice(0, 12)}...
                {incomingDrag.panelType && ` · ${incomingDrag.panelType}`}
              </p>

              {/* v2.0: 显示快照详情 */}
              {incomingDrag.panelSnapshot && (
                <div className="flex flex-wrap gap-2 mt-1 justify-center">
                  {tabCount > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "10px",
                        background: "rgba(0,255,135,0.1)",
                        color: "#00ff87",
                        border: "1px solid rgba(0,255,135,0.15)",
                      }}
                    >
                      {tabCount} 个标签页
                    </span>
                  )}
                  {hasEditorState && (
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "10px",
                        background: "rgba(96,239,255,0.1)",
                        color: "#60efff",
                        border: "1px solid rgba(96,239,255,0.15)",
                      }}
                    >
                      含编辑器状态
                    </span>
                  )}
                  {incomingDrag.panelSnapshot.chatContext && (
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "10px",
                        background: "rgba(168,85,247,0.1)",
                        color: "#a855f7",
                        border: "1px solid rgba(168,85,247,0.15)",
                      }}
                    >
                      含对话上下文
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
