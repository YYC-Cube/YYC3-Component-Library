/**
 * @file SettingsShared.tsx
 * @description 设置页面共享 UI 组件 — 卡片、开关行、滑块、输入框等原子组件
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, ui, shared, atoms
 */

import React from "react";
import {
  ToggleRight, ToggleLeft, X, Pencil, Trash2,
} from "lucide-react";

/* ─── 玻璃卡片 ─── */
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}> = ({ children, className = "", highlight = false }) => (
  <div
    className={`rounded-xl p-4 ${className}`}
    style={{
      background: highlight
        ? "linear-gradient(135deg, rgba(0,255,135,0.04), rgba(96,239,255,0.04))"
        : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.06)"}`,
    }}
  >
    {children}
  </div>
);

/* ─── 节标题 ─── */
export const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>{title}</h3>
        {description && (
          <p className="m-0 mt-0.5" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
            {description}
          </p>
        )}
      </div>
    </div>
    {action}
  </div>
);

/* ─── 开关行 ─── */
export const ToggleRow: React.FC<{
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ label, description, value, onChange, disabled }) => (
  <div
    className="flex items-center justify-between py-2.5"
    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
  >
    <div>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>{label}</span>
      {description && (
        <p className="m-0 mt-0.5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          {description}
        </p>
      )}
    </div>
    <button
      onClick={() => !disabled && onChange(!value)}
      style={{ background: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer", padding: 0, opacity: disabled ? 0.4 : 1 }}
    >
      {value ? <ToggleRight size={26} color="#00ff87" /> : <ToggleLeft size={26} color="rgba(255,255,255,0.3)" />}
    </button>
  </div>
);

/* ─── 滑块行 ─── */
export const SliderRow: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step, unit = "", onChange }) => (
  <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28"
        style={{ accentColor: "#00ff87" }}
      />
      <span className="w-14 text-right" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
        {value}{unit}
      </span>
    </div>
  </div>
);

/* ─── 选择行 ─── */
export const SelectRow: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2.5 py-1 rounded-lg"
      style={{
        fontSize: "12px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        outline: "none",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

/* ─── 文本输入行 ─── */
export const InputRow: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (v: string) => void;
}> = ({ label, value, placeholder, type = "text", onChange }) => (
  <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="px-2.5 py-1 rounded-lg w-48 text-right"
      style={{
        fontSize: "12px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        outline: "none",
      }}
    />
  </div>
);

/* ─── 标签胶囊 ─── */
export const Badge: React.FC<{
  text: string;
  color?: string;
  bg?: string;
}> = ({ text, color = "#60efff", bg = "rgba(96,239,255,0.1)" }) => (
  <span
    className="px-1.5 py-0.5 rounded"
    style={{ fontSize: "10px", background: bg, color }}
  >
    {text}
  </span>
);

/* ─── 操作按钮 ─── */
export const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick: () => void;
  variant?: "outline" | "filled";
}> = ({ icon, label, color = "#00ff87", onClick, variant = "outline" }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
    style={{
      fontSize: "12px",
      color,
      background: variant === "filled" ? `${color}15` : "rgba(255,255,255,0.04)",
      border: `1px solid ${variant === "filled" ? `${color}25` : "rgba(255,255,255,0.06)"}`,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}40`; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = variant === "filled" ? `${color}25` : "rgba(255,255,255,0.06)"; }}
  >
    {icon}
    {label}
  </button>
);

/* ─── 列表项卡片 ─── */
export const ItemCard: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: (v: boolean) => void;
  enabled?: boolean;
}> = ({ children, active = false, onEdit, onDelete, onToggle, enabled = true }) => (
  <div
    className="rounded-xl p-3.5 transition-all"
    style={{
      background: active ? "rgba(0,255,135,0.04)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.06)"}`,
    }}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Pencil size={12} color="rgba(255,255,255,0.5)" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Trash2 size={12} color="rgba(255,100,100,0.6)" />
          </button>
        )}
        {onToggle && (
          <button onClick={() => onToggle(!enabled)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {enabled ? <ToggleRight size={24} color="#00ff87" /> : <ToggleLeft size={24} color="rgba(255,255,255,0.3)" />}
          </button>
        )}
      </div>
    </div>
  </div>
);

/* ─── 对话框 ─── */
export const SettingsDialog: React.FC<{
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
}> = ({ title, open, onClose, children, onConfirm, confirmLabel = "确定" }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, rgba(20,20,40,0.98), rgba(15,15,30,0.98))",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="m-0" style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <X size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
        {children}
        {onConfirm && (
          <div className="flex justify-end gap-2 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ fontSize: "13px", color: "#0a0a12", background: "#00ff87", border: "none", fontWeight: 600 }}
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── 空状态 ─── */
export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-3">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
      {icon}
    </div>
    <p className="m-0" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>{title}</p>
    <p className="m-0" style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>{description}</p>
    {action}
  </div>
);