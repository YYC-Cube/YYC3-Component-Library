/**
 * @file LayoutTemplates.tsx
 * @description 工作区布局模板 — 预设布局快速切换（编码/调试/设计/全栈/极简/AI辅助）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags layout, templates, presets, workspace, mode-switch
 */

import React, { useState } from "react";
import {
  LayoutDashboard, Code, Bug, Paintbrush, Layers, Minus, Bot,
  Check, ChevronDown, ChevronUp, Save, X,
} from "lucide-react";
import {
  useLayoutStore,
  type LayoutNode,
  type PanelState,
  type Tab,
  type PanelType,
} from "../../stores/layoutStore";
import { useTranslation, type TranslationKey } from "../../stores/i18nStore";

/* ─── 辅助函数 ─── */
const uid = () => crypto.randomUUID().slice(0, 8);

function makePanel(id: string, type: PanelType, title: string, tabId: string): PanelState {
  return {
    id, type, title,
    tabs: [tabId],
    activeTabId: tabId,
    isLocked: false,
    isMinimized: false,
    isMaximized: false,
  };
}

function makeTab(id: string, panelId: string, type: PanelType, title: string, pinned = true): Tab {
  return {
    id, panelId, title, type,
    isPinned: pinned, isModified: false, isUnsaved: false, hasError: false,
  };
}

/* ─── 布局模板定义 ─── */
export interface LayoutTemplate {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  icon: React.ElementType;
  color: string;
  panelTypes: PanelType[];
  build: () => { panels: Record<string, PanelState>; tabs: Record<string, Tab>; tree: LayoutNode };
}

export const layoutTemplates: LayoutTemplate[] = [
  /* ─── 编码模式 ─── */
  {
    id: "coding",
    nameKey: "layout.coding",
    descKey: "layout.codingDesc",
    icon: Code,
    color: "#00ff87",
    panelTypes: ["file-browser", "code-editor", "terminal"],
    build: () => {
      const fp = "p-files", ep = "p-editor", tp = "p-term";
      const ft = "t-files", et = "t-editor", tt = "t-term";
      return {
        panels: {
          [fp]: makePanel(fp, "file-browser", "文件", ft),
          [ep]: makePanel(ep, "code-editor", "编辑器", et),
          [tp]: makePanel(tp, "terminal", "终端", tt),
        },
        tabs: {
          [ft]: makeTab(ft, fp, "file-browser", "文件"),
          [et]: makeTab(et, ep, "code-editor", "App.tsx", false),
          [tt]: makeTab(tt, tp, "terminal", "终端"),
        },
        tree: {
          kind: "split",
          direction: "horizontal",
          ratio: 18,
          first: { kind: "leaf", panelId: fp },
          second: {
            kind: "split",
            direction: "vertical",
            ratio: 72,
            first: { kind: "leaf", panelId: ep },
            second: { kind: "leaf", panelId: tp },
          },
        },
      };
    },
  },

  /* ─── 调试模式 ─── */
  {
    id: "debug",
    nameKey: "layout.debug",
    descKey: "layout.debugDesc",
    icon: Bug,
    color: "#ff6b6b",
    panelTypes: ["file-browser", "code-editor", "debug", "terminal", "output"],
    build: () => {
      const fp = "p-files", ep = "p-editor", dp = "p-debug", tp = "p-term", op = "p-output";
      const ft = "t-files", et = "t-editor", dt = "t-debug", tt = "t-term", ot = "t-output";
      return {
        panels: {
          [fp]: makePanel(fp, "file-browser", "文件", ft),
          [ep]: makePanel(ep, "code-editor", "编辑器", et),
          [dp]: makePanel(dp, "debug", "调试", dt),
          [tp]: makePanel(tp, "terminal", "终端", tt),
          [op]: makePanel(op, "output", "输出", ot),
        },
        tabs: {
          [ft]: makeTab(ft, fp, "file-browser", "文件"),
          [et]: makeTab(et, ep, "code-editor", "App.tsx", false),
          [dt]: makeTab(dt, dp, "debug", "调试"),
          [tt]: makeTab(tt, tp, "terminal", "终端"),
          [ot]: makeTab(ot, op, "output", "输出"),
        },
        tree: {
          kind: "split",
          direction: "horizontal",
          ratio: 16,
          first: { kind: "leaf", panelId: fp },
          second: {
            kind: "split",
            direction: "horizontal",
            ratio: 55,
            first: {
              kind: "split",
              direction: "vertical",
              ratio: 65,
              first: { kind: "leaf", panelId: ep },
              second: {
                kind: "split",
                direction: "horizontal",
                ratio: 50,
                first: { kind: "leaf", panelId: tp },
                second: { kind: "leaf", panelId: op },
              },
            },
            second: { kind: "leaf", panelId: dp },
          },
        },
      };
    },
  },

  /* ─── 设计模式 ─── */
  {
    id: "design",
    nameKey: "layout.design",
    descKey: "layout.designDesc",
    icon: Paintbrush,
    color: "#a855f7",
    panelTypes: ["file-browser", "code-editor", "preview"],
    build: () => {
      const fp = "p-files", ep = "p-editor", pp = "p-preview";
      const ft = "t-files", et = "t-editor", pt = "t-preview";
      return {
        panels: {
          [fp]: makePanel(fp, "file-browser", "文件", ft),
          [ep]: makePanel(ep, "code-editor", "编辑器", et),
          [pp]: makePanel(pp, "preview", "预览", pt),
        },
        tabs: {
          [ft]: makeTab(ft, fp, "file-browser", "文件"),
          [et]: makeTab(et, ep, "code-editor", "App.tsx", false),
          [pt]: makeTab(pt, pp, "preview", "预览"),
        },
        tree: {
          kind: "split",
          direction: "horizontal",
          ratio: 16,
          first: { kind: "leaf", panelId: fp },
          second: {
            kind: "split",
            direction: "horizontal",
            ratio: 50,
            first: { kind: "leaf", panelId: ep },
            second: { kind: "leaf", panelId: pp },
          },
        },
      };
    },
  },

  /* ─── 全栈模式 ─── */
  {
    id: "fullstack",
    nameKey: "layout.fullstack",
    descKey: "layout.fullstackDesc",
    icon: Layers,
    color: "#60efff",
    panelTypes: ["file-browser", "code-editor", "preview", "terminal", "ai-chat"],
    build: () => {
      const fp = "p-files", ep = "p-editor", pp = "p-preview", tp = "p-term", ap = "p-ai";
      const ft = "t-files", et = "t-editor", pt = "t-preview", tt = "t-term", at = "t-ai";
      return {
        panels: {
          [fp]: makePanel(fp, "file-browser", "文件", ft),
          [ep]: makePanel(ep, "code-editor", "编辑器", et),
          [pp]: makePanel(pp, "preview", "预览", pt),
          [tp]: makePanel(tp, "terminal", "终端", tt),
          [ap]: makePanel(ap, "ai-chat", "AI 助手", at),
        },
        tabs: {
          [ft]: makeTab(ft, fp, "file-browser", "文件"),
          [et]: makeTab(et, ep, "code-editor", "App.tsx", false),
          [pt]: makeTab(pt, pp, "preview", "预览"),
          [tt]: makeTab(tt, tp, "terminal", "终端"),
          [at]: makeTab(at, ap, "ai-chat", "AI 助手"),
        },
        tree: {
          kind: "split",
          direction: "horizontal",
          ratio: 18,
          first: { kind: "leaf", panelId: fp },
          second: {
            kind: "split",
            direction: "horizontal",
            ratio: 55,
            first: {
              kind: "split",
              direction: "vertical",
              ratio: 68,
              first: { kind: "leaf", panelId: ep },
              second: { kind: "leaf", panelId: tp },
            },
            second: {
              kind: "split",
              direction: "vertical",
              ratio: 55,
              first: { kind: "leaf", panelId: pp },
              second: { kind: "leaf", panelId: ap },
            },
          },
        },
      };
    },
  },

  /* ─── 极简模式 ─── */
  {
    id: "minimal",
    nameKey: "layout.minimal",
    descKey: "layout.minimalDesc",
    icon: Minus,
    color: "rgba(255,255,255,0.5)",
    panelTypes: ["code-editor"],
    build: () => {
      const ep = "p-editor";
      const et = "t-editor";
      return {
        panels: { [ep]: makePanel(ep, "code-editor", "编辑器", et) },
        tabs: { [et]: makeTab(et, ep, "code-editor", "App.tsx", false) },
        tree: { kind: "leaf", panelId: ep },
      };
    },
  },

  /* ─── AI 辅助模式 ─── */
  {
    id: "ai-assisted",
    nameKey: "layout.aiAssisted",
    descKey: "layout.aiAssistedDesc",
    icon: Bot,
    color: "#00ff87",
    panelTypes: ["code-editor", "preview", "ai-chat"],
    build: () => {
      const ep = "p-editor", pp = "p-preview", ap = "p-ai";
      const et = "t-editor", pt = "t-preview", at = "t-ai";
      return {
        panels: {
          [ep]: makePanel(ep, "code-editor", "编辑器", et),
          [pp]: makePanel(pp, "preview", "预览", pt),
          [ap]: makePanel(ap, "ai-chat", "AI 助手", at),
        },
        tabs: {
          [et]: makeTab(et, ep, "code-editor", "App.tsx", false),
          [pt]: makeTab(pt, pp, "preview", "预览"),
          [at]: makeTab(at, ap, "ai-chat", "AI 助手"),
        },
        tree: {
          kind: "split",
          direction: "horizontal",
          ratio: 30,
          first: { kind: "leaf", panelId: ap },
          second: {
            kind: "split",
            direction: "horizontal",
            ratio: 50,
            first: { kind: "leaf", panelId: ep },
            second: { kind: "leaf", panelId: pp },
          },
        },
      };
    },
  },
];

/* ─── 面板类型图标小点 ─── */
const PanelDots: React.FC<{ types: PanelType[] }> = ({ types }) => {
  const colorMap: Record<PanelType, string> = {
    "code-editor": "#00ff87",
    "file-browser": "#e8a838",
    preview: "#60efff",
    terminal: "#a855f7",
    "ai-chat": "#00ff87",
    debug: "#ff6b6b",
    output: "#ffb86c",
    search: "#60efff",
    database: "#336791",
    "version-control": "#f97316",
    "ai-provider": "#a855f7",
    "ai-monitor": "#60efff",
    "plugin-manager": "#34d399",
  };
  return (
    <div className="flex items-center gap-0.5">
      {types.map((type, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: colorMap[type] || "rgba(255,255,255,0.2)" }}
        />
      ))}
    </div>
  );
};

/* ─── 布局模板选择器组件 ─── */
export const LayoutTemplateSelector: React.FC<{
  visible: boolean;
  onClose: () => void;
  anchorY?: number;
}> = ({ visible, onClose, anchorY }) => {
  const { t } = useTranslation();
  const { saveLayout } = useLayoutStore();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);

  const applyTemplate = (template: LayoutTemplate) => {
    const { panels, tabs, tree } = template.build();
    useLayoutStore.setState({
      panels,
      tabs,
      layoutTree: tree,
      activePanelId: Object.keys(panels)[1] || Object.keys(panels)[0],
    });
    setActiveTemplate(template.id);
    setTimeout(onClose, 300);
  };

  const handleSave = () => {
    if (saveName.trim()) {
      saveLayout(saveName.trim());
      setSaveName("");
      setShowSave(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[900]" onClick={onClose} />
      <div
        className="fixed z-[901] rounded-xl overflow-hidden"
        style={{
          right: "12px",
          top: anchorY ? `${anchorY + 8}px` : "60px",
          width: "320px",
          maxHeight: "480px",
          background: "rgba(15,15,30,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={14} style={{ color: "#60efff" }} />
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              {t("layout.title")}
            </span>
          </div>
          <button onClick={onClose} className="opacity-30 hover:opacity-60 transition-opacity">
            <X size={13} />
          </button>
        </div>

        {/* 模板列表 */}
        <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
          {layoutTemplates.map((template) => {
            const Icon = template.icon;
            const isActive = activeTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all"
                style={{
                  background: isActive ? `${template.color}08` : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${template.color}06`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? `${template.color}08` : "transparent"; }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${template.color}12`,
                    border: `1px solid ${template.color}20`,
                  }}
                >
                  <Icon size={15} style={{ color: template.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: isActive ? template.color : "rgba(255,255,255,0.8)",
                    }}>
                      {t(template.nameKey)}
                    </span>
                    {isActive && <Check size={10} style={{ color: template.color }} />}
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                    {t(template.descKey)}
                  </div>
                  <div className="mt-1">
                    <PanelDots types={template.panelTypes} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 保存当前布局 */}
        <div className="px-3.5 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {showSave ? (
            <div className="flex items-center gap-1.5">
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setShowSave(false); }}
                placeholder="布局名称..."
                autoFocus
                className="flex-1 px-2 py-1 rounded bg-transparent outline-none"
                style={{ fontSize: "11px", border: "1px solid rgba(0,255,135,0.2)", color: "rgba(255,255,255,0.8)" }}
              />
              <button
                onClick={handleSave}
                className="p-1 rounded"
                style={{ color: "#00ff87" }}
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => setShowSave(false)}
                className="p-1 rounded opacity-30"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSave(true)}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <Save size={10} />
              {t("layout.saveAsCurrent")}
            </button>
          )}
        </div>
      </div>
    </>
  );
};