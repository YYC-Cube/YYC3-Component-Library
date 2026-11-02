/**
 * @file LayoutDesignerPage.tsx
 * @description 多联式布局设计器页面 v2.2 — 布局导出/导入 + 命令绑定 + 会话恢复
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.2.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags layout, designer, multi-panel, workspace
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, LayoutDashboard, Save, RotateCcw, Keyboard,
  Globe, Layers, Check, Download, Upload,
} from "lucide-react";
import { WorkspaceContainer } from "../components/panels/WorkspaceContainer";
import { ActivityBar } from "../components/panels/ActivityBar";
import { LayoutSwitcher } from "../components/panels/LayoutSwitcher";
import { StatusBar } from "../components/StatusBar";
import { useLayoutStore } from "../stores/layoutStore";
import { useThemeStore } from "../stores/themeStore";
import { useI18nStore, supportedLocales } from "../stores/i18nStore";
import { LayoutTemplateSelector } from "../components/panels/LayoutTemplates";
import { useSessionStore } from "../stores/sessionStore";
import { SessionAutoSaver, useSessionRestore } from "../components/SessionManager";
import { useCommandBindings } from "../hooks/useCommandBindings";
import { QuickActionsToolbar } from "../components/panels/QuickActionsToolbar";
import { LeftSidebar } from "../components/panels/LeftSidebar";

const LayoutDesignerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const context = searchParams.get("context") || "";
  const [showLayoutSwitcher, setShowLayoutSwitcher] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { saveLayout, applyDefaultLayout, activePanelId, panels, tabs } = useLayoutStore();
  const theme = useThemeStore();
  const { locale, setLocale, t } = useI18nStore();
  const session = useSessionStore();

  const handleSave = () => {
    if (layoutName.trim()) {
      saveLayout(layoutName.trim());
      setLayoutName("");
      setShowSaveDialog(false);
    }
  };

  /* 布局导出 */
  const handleExportLayout = () => {
    const json = useLayoutStore.getState().exportLayout();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yyc3-layout-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* 布局导入 */
  const handleImportLayout = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.yyc3-layout";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = useLayoutStore.getState().importLayout(ev.target?.result as string);
        if (!result) alert("布局文件格式无效");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  /* 应用主题 CSS 变量 */
  useEffect(() => {
    theme.applyTheme();
  }, []);

  /* 会话自动保存 — 已委托给 SessionAutoSaver 组件 */

  /* 首次加载尝试恢复 — 已委托给 useSessionRestore 钩子 */
  useSessionRestore();

  /* 命令面板绑定真实操作 */
  useCommandBindings();

  return (
    <div className="h-screen flex flex-col" style={{ background: "#0a0a12", color: "rgba(255,255,255,0.9)" }}>
      {/* 顶部状态栏 */}
      <div
        className="flex items-center justify-between px-3 h-[38px] min-h-[38px] flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10, 10, 22, 0.95)",
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            title="返回首页"
          >
            <ArrowLeft size={14} />
          </button>
          <LayoutDashboard size={15} className="opacity-50" />
          <span style={{ fontSize: "13px", fontWeight: 600, opacity: 0.8 }}>多联式布局设计器</span>
          {context && (
            <span
              className="ml-2 px-2 py-0.5 rounded-full"
              style={{ fontSize: "10px", background: "rgba(0,255,135,0.08)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.15)" }}
            >
              AI 上下文已加载
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* 语言切换 */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-30 hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.04)" }}
              title={locale === "zh-CN" ? "切换语言" : "Switch Language"}
            >
              <Globe size={13} />
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-[800]" onClick={() => setShowLangMenu(false)} />
                <div
                  className="absolute right-0 top-full mt-1 z-[801] rounded-lg py-1 overflow-hidden"
                  style={{
                    background: "rgba(20,20,35,0.97)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    minWidth: "140px",
                  }}
                >
                  {supportedLocales.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => { setLocale(loc.id); setShowLangMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors"
                      style={{
                        fontSize: "11.5px",
                        color: locale === loc.id ? "#00ff87" : "rgba(255,255,255,0.6)",
                        background: locale === loc.id ? "rgba(0,255,135,0.06)" : "transparent",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = locale === loc.id ? "rgba(0,255,135,0.06)" : "transparent"; }}
                    >
                      <span>{loc.flag}</span>
                      <span>{loc.nativeLabel}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* 布局模板 */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-30 hover:opacity-70"
            style={{ background: showTemplates ? "rgba(96,239,255,0.1)" : "rgba(255,255,255,0.04)", color: showTemplates ? "#60efff" : undefined }}
            title={t("layout.title")}
          >
            <Layers size={13} />
          </button>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-30 hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title="快捷键"
          >
            <Keyboard size={13} />
          </button>
          <button
            onClick={() => applyDefaultLayout()}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-30 hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title="重置布局"
          >
            <RotateCcw size={13} />
          </button>
          {/* 布局导出 */}
          <button
            onClick={handleExportLayout}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-30 hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title="导出布局"
          >
            <Download size={13} />
          </button>
          {/* 布局导入 */}
          <button
            onClick={handleImportLayout}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-30 hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title="导入布局"
          >
            <Upload size={13} />
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors"
            style={{ fontSize: "12px", background: "rgba(0,255,135,0.08)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.15)" }}
          >
            <Save size={12} />
            保存布局
          </button>
        </div>
      </div>

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 活动条 */}
        <ActivityBar
          onSaveLayout={() => setShowSaveDialog(true)}
          onToggleLayoutSwitcher={() => setShowLayoutSwitcher(!showLayoutSwitcher)}
        />

        {/* 布局切换器 */}
        <LayoutSwitcher isOpen={showLayoutSwitcher} onClose={() => setShowLayoutSwitcher(false)} />

        {/* 左侧侧栏 */}
        <LeftSidebar />

        {/* 工作区 */}
        <div className="flex-1 overflow-hidden">
          <WorkspaceContainer />
        </div>
      </div>

      {/* 底部状态栏 */}
      <StatusBar />

      {/* 布局模板选择器 */}
      <LayoutTemplateSelector
        visible={showTemplates}
        onClose={() => setShowTemplates(false)}
        anchorY={38}
      />

      {/* 保存布局对话框 */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-5 w-[340px]"
              style={{
                background: "rgba(20, 20, 35, 0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="m-0 mb-4" style={{ fontSize: "16px", fontWeight: 600 }}>保存布局</h3>
              <input
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                placeholder="输入布局名称..."
                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.9)",
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)" }}
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={!layoutName.trim()}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{
                    fontSize: "13px",
                    background: layoutName.trim() ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.04)",
                    color: layoutName.trim() ? "#00ff87" : "rgba(255,255,255,0.3)",
                    border: layoutName.trim() ? "1px solid rgba(0,255,135,0.2)" : "1px solid transparent",
                  }}
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快捷键面板 */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-4 z-50 rounded-xl p-4 w-[260px]"
            style={{
              background: "rgba(20,20,35,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            }}
          >
            <h4 className="m-0 mb-3 opacity-60" style={{ fontSize: "12px", fontWeight: 600 }}>快捷键</h4>
            {[
              { keys: "Ctrl/⌘ + S", desc: "保存布局" },
              { keys: "Ctrl/⌘ + Shift + R", desc: "重置布局" },
              { keys: "Ctrl/⌘ + Tab", desc: "切换标签页" },
              { keys: "双击标签页", desc: "固定/取消固定" },
              { keys: "拖拽标签页", desc: "移动至其他面板" },
              { keys: "拖拽分割线", desc: "调整面板比例" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{item.desc}</span>
                <kbd
                  className="px-1.5 py-0.5 rounded"
                  style={{ fontSize: "10px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {item.keys}
                </kbd>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 会话恢复横幅 */}
      <AnimatePresence>
        {session.showRestoreBanner && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{
              background: "rgba(20,20,35,0.97)",
              border: "1px solid rgba(0,255,135,0.15)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,135,0.05)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,255,135,0.1)" }}
            >
              <Check size={12} style={{ color: "#00ff87" }} />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                {t("session.restored")}
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
                {t("session.restoreDesc")}
              </div>
            </div>
            <button
              onClick={() => session.dismissRestoreBanner()}
              className="px-3 py-1 rounded-md transition-colors flex-shrink-0"
              style={{
                fontSize: "11px",
                background: "rgba(0,255,135,0.08)",
                color: "#00ff87",
                border: "1px solid rgba(0,255,135,0.12)",
              }}
            >
              {t("session.dismiss")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 会话自动保存 */}
      <SessionAutoSaver />

      {/* 快捷操作工具栏 */}
      <QuickActionsToolbar />
    </div>
  );
};

export default LayoutDesignerPage;