/**
 * @file ThemeEditorPanel.tsx
 * @description 主题编辑器面板 — 可视化变量调节 + 实时预览 + 主题导入/导出 + 颜色选择
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, theme, editor, visual, colors, customization
 */

import React, { useState, useCallback } from "react";
import {
  Palette, Sun, Moon, Check, RotateCcw, Download, Upload,
  ChevronDown, ChevronRight, Sparkles, Eye, Paintbrush,
  CircleDot, Square, Layers, Zap, Droplets, Copy,
} from "lucide-react";
import {
  useThemeStore,
  themeVariants,
  accentPresets,
  type ThemeVariant,
  type AccentColor,
  type ThemeConfig,
} from "../../../stores/themeStore";
import { useTranslation } from "../../../stores/i18nStore";

/* ─── 滑动条组件 ─── */
const SliderControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  color?: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step, unit = "", color = "#00ff87", onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{label}</span>
        <span style={{ fontSize: "11px", color, fontWeight: 500 }}>
          {Number.isInteger(step) ? value : value.toFixed(2)}{unit}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <div
          className="absolute h-1 rounded-full left-0 right-0"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="absolute h-1 rounded-full left-0"
          style={{ width: `${pct}%`, background: `${color}50` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-3 h-3 rounded-full border-2 -translate-x-1/2 transition-all"
          style={{
            left: `${pct}%`,
            background: color,
            borderColor: `${color}80`,
            boxShadow: `0 0 8px ${color}30`,
          }}
        />
      </div>
    </div>
  );
};

/* ─── 折叠分组 ─── */
const Section: React.FC<{
  title: string;
  icon: React.ElementType;
  color: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon: Icon, color, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 transition-colors"
        style={{ background: open ? "rgba(255,255,255,0.02)" : "transparent" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = open ? "rgba(255,255,255,0.02)" : "transparent"; }}
      >
        {open ? <ChevronDown size={11} className="opacity-30" /> : <ChevronRight size={11} className="opacity-30" />}
        <Icon size={12} style={{ color }} />
        <span style={{ fontSize: "11.5px", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{title}</span>
      </button>
      {open && (
        <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── 实时预览小窗 ─── */
const ThemePreviewWidget: React.FC = () => {
  const { colors, config } = useThemeStore();
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: `${config.fontSize}px`,
      }}
    >
      {/* 模拟标题栏 */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ background: colors.panelBg, borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-2" style={{ fontSize: "9px", color: colors.textMuted }}>preview.tsx</span>
      </div>
      {/* 模拟代码行 */}
      <div className="px-2.5 py-2 space-y-1">
        <div className="flex items-center gap-1">
          <span style={{ color: "#c678dd", fontSize: "10px" }}>const</span>
          <span style={{ color: colors.accent, fontSize: "10px" }}>App</span>
          <span style={{ color: colors.textMuted, fontSize: "10px" }}>=</span>
          <span style={{ color: "#e5c07b", fontSize: "10px" }}>{"() => {"}</span>
        </div>
        <div className="flex items-center gap-1 pl-3">
          <span style={{ color: "#c678dd", fontSize: "10px" }}>return</span>
          <span style={{ color: colors.accentSecondary, fontSize: "10px" }}>{"<div>"}</span>
        </div>
        <div className="flex items-center gap-1 pl-6">
          <span style={{ color: "#98c379", fontSize: "10px" }}>"Hello YYC³"</span>
        </div>
        <div className="pl-3">
          <span style={{ color: colors.accentSecondary, fontSize: "10px" }}>{"</div>"}</span>
        </div>
        <div><span style={{ color: "#e5c07b", fontSize: "10px" }}>{"}"}</span></div>
      </div>
      {/* 模拟状态栏 */}
      <div
        className="flex items-center justify-between px-2.5 py-1"
        style={{ background: `${colors.accent}10`, borderTop: `1px solid ${colors.border}` }}
      >
        <span style={{ fontSize: "8px", color: colors.accent }}>Ready</span>
        <span style={{ fontSize: "8px", color: colors.textMuted }}>UTF-8</span>
      </div>
    </div>
  );
};

/* ─── 主面板 ─── */
export const ThemeEditorPanel: React.FC = () => {
  const { t } = useTranslation();
  const {
    config, colors,
    setVariant, setAccentColor, setFontSize, setUiScale,
    setGlassOpacity, setAnimationSpeed, setBlurStrength,
    setBorderRadius, resetToDefault,
  } = useThemeStore();

  const [showExport, setShowExport] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ config, colors }, null, 2);
    navigator.clipboard.writeText(data);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  }, [config, colors]);

  const handleImport = useCallback(() => {
    try {
      const data = JSON.parse(importValue);
      if (data.config) {
        if (data.config.variant) setVariant(data.config.variant);
        if (data.config.accentColor) setAccentColor(data.config.accentColor);
        if (data.config.fontSize) setFontSize(data.config.fontSize);
        if (data.config.uiScale) setUiScale(data.config.uiScale);
        if (data.config.glassOpacity) setGlassOpacity(data.config.glassOpacity);
        if (data.config.animationSpeed) setAnimationSpeed(data.config.animationSpeed);
        if (data.config.blurStrength) setBlurStrength(data.config.blurStrength);
        if (data.config.borderRadius) setBorderRadius(data.config.borderRadius);
      }
      setShowImport(false);
      setImportValue("");
    } catch {
      // ignore parse errors
    }
  }, [importValue]);

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* 标题 */}
      <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Palette size={15} style={{ color: colors.accent }} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{t("theme.title")}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowImport(!showImport)}
            className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity"
            title={t("theme.importTheme")}
          >
            <Upload size={12} />
          </button>
          <button
            onClick={handleExport}
            className="w-6 h-6 flex items-center justify-center rounded transition-opacity"
            style={{ opacity: copiedExport ? 1 : 0.4, color: copiedExport ? "#00ff87" : undefined }}
            title={t("theme.exportTheme")}
          >
            {copiedExport ? <Check size={12} /> : <Download size={12} />}
          </button>
          <button
            onClick={resetToDefault}
            className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity"
            title={t("theme.resetDefault")}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* 导入面板 */}
      {showImport && (
        <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(96,239,255,0.02)" }}>
          <div className="flex items-center gap-1 mb-1">
            <Upload size={10} style={{ color: "#60efff" }} />
            <span style={{ fontSize: "10px", color: "#60efff" }}>{t("theme.importTheme")}</span>
          </div>
          <textarea
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            placeholder='{"config": {...}, "colors": {...}}'
            className="w-full px-2 py-1.5 rounded resize-none bg-transparent outline-none"
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(96,239,255,0.15)",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              height: "60px",
            }}
          />
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={handleImport}
              className="px-2 py-0.5 rounded"
              style={{ fontSize: "10px", background: "rgba(0,255,135,0.08)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.15)" }}
            >
              {t("common.import")}
            </button>
            <button
              onClick={() => { setShowImport(false); setImportValue(""); }}
              className="px-2 py-0.5 rounded"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* 滚动区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 主题变体选择 */}
        <Section title={t("theme.variant")} icon={Sparkles} color="#a855f7" defaultOpen={true}>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(themeVariants) as ThemeVariant[]).map((key) => {
              const variant = themeVariants[key];
              const isActive = config.variant === key;
              return (
                <button
                  key={key}
                  onClick={() => setVariant(key)}
                  className="rounded-lg p-2 text-left transition-all"
                  style={{
                    background: isActive ? `${variant.colors.accent}10` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? `${variant.colors.accent}30` : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isActive && <Check size={9} style={{ color: variant.colors.accent }} />}
                    <span style={{ fontSize: "11px", fontWeight: isActive ? 600 : 400, color: isActive ? variant.colors.accent : "rgba(255,255,255,0.6)" }}>
                      {variant.name}
                    </span>
                  </div>
                  {/* 色条预览 */}
                  <div className="flex gap-0.5 mt-1">
                    {[variant.colors.accent, variant.colors.accentSecondary, variant.colors.bg, variant.colors.panelBg].map((c, i) => (
                      <div key={i} className="flex-1 h-2 rounded-sm" style={{ background: c, border: "1px solid rgba(255,255,255,0.06)" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.25)", marginTop: "4px" }}>
                    {variant.description}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* 强调色选择 */}
        <Section title={t("theme.accent")} icon={Paintbrush} color={colors.accent} defaultOpen={true}>
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.keys(accentPresets) as AccentColor[]).map((key) => {
              const preset = accentPresets[key];
              const isActive = config.accentColor === key;
              return (
                <button
                  key={key}
                  onClick={() => setAccentColor(key)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all"
                  style={{
                    background: isActive ? `${preset.color}12` : "transparent",
                    border: `1px solid ${isActive ? `${preset.color}30` : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: preset.color, boxShadow: isActive ? `0 0 8px ${preset.color}40` : "none" }}
                  >
                    {isActive && <Check size={8} style={{ color: "#000" }} />}
                  </div>
                  <span style={{ fontSize: "10.5px", color: isActive ? preset.color : "rgba(255,255,255,0.4)" }}>
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* 排版与布局 */}
        <Section title="排版与布局" icon={Layers} color="#60efff" defaultOpen={true}>
          <SliderControl
            label={t("theme.fontSize")}
            value={config.fontSize}
            min={10}
            max={18}
            step={1}
            unit="px"
            color="#60efff"
            onChange={setFontSize}
          />
          <SliderControl
            label={t("theme.uiScale")}
            value={config.uiScale}
            min={0.8}
            max={1.4}
            step={0.05}
            unit="x"
            color="#60efff"
            onChange={setUiScale}
          />
          <SliderControl
            label={t("theme.borderRadius")}
            value={config.borderRadius}
            min={0}
            max={24}
            step={1}
            unit="px"
            color="#60efff"
            onChange={setBorderRadius}
          />
        </Section>

        {/* 玻璃效果 */}
        <Section title="玻璃拟态" icon={Droplets} color="#a855f7" defaultOpen={false}>
          <SliderControl
            label={t("theme.glassOpacity")}
            value={config.glassOpacity}
            min={0}
            max={0.3}
            step={0.01}
            color="#a855f7"
            onChange={setGlassOpacity}
          />
          <SliderControl
            label={t("theme.blurStrength")}
            value={config.blurStrength}
            min={0}
            max={200}
            step={5}
            unit="px"
            color="#a855f7"
            onChange={setBlurStrength}
          />
        </Section>

        {/* 动画 */}
        <Section title="动画" icon={Zap} color="#ffb86c" defaultOpen={false}>
          <SliderControl
            label={t("theme.animationSpeed")}
            value={config.animationSpeed}
            min={0}
            max={3}
            step={0.1}
            unit="x"
            color="#ffb86c"
            onChange={setAnimationSpeed}
          />
        </Section>

        {/* 实时预览 */}
        <Section title={t("theme.preview")} icon={Eye} color="#00ff87" defaultOpen={true}>
          <ThemePreviewWidget />
        </Section>

        {/* 当前 CSS 变量 */}
        <Section title="CSS 变量" icon={Copy} color="rgba(255,255,255,0.4)" defaultOpen={false}>
          <div
            className="rounded-lg p-2 space-y-0.5"
            style={{
              background: "rgba(0,0,0,0.3)",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: "9.5px",
              lineHeight: "16px",
            }}
          >
            {[
              { key: "--yyc3-accent", val: colors.accent },
              { key: "--yyc3-accent-secondary", val: colors.accentSecondary },
              { key: "--yyc3-bg", val: colors.bg },
              { key: "--yyc3-panel-bg", val: colors.panelBg },
              { key: "--yyc3-border", val: colors.border },
              { key: "--yyc3-text", val: colors.text },
              { key: "--yyc3-text-muted", val: colors.textMuted },
              { key: "--yyc3-font-size", val: `${config.fontSize}px` },
              { key: "--yyc3-radius", val: `${config.borderRadius}px` },
              { key: "--yyc3-blur", val: `${config.blurStrength}px` },
            ].map((v) => (
              <div key={v.key} className="flex items-center gap-1.5">
                <span style={{ color: "#c678dd" }}>{v.key}</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>:</span>
                <span style={{ color: "#98c379" }}>{v.val}</span>
                {v.val.startsWith("#") && (
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: v.val, border: "1px solid rgba(255,255,255,0.1)" }} />
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};