import React from 'react';
import { motion } from 'motion/react';

const colors = [
  { name: 'Core Blue', hex: '#007AFF', role: '品牌主色' },
  { name: 'Cyan Flow', hex: '#00C6FF', role: '衍生色' },
  { name: 'Deep Space', hex: '#050510', role: '背景色' },
  { name: 'Warning Red', hex: '#FF4C4C', role: '警示色' },
];

const typography = [
  { role: '标题 (粗体)', spec: '24-48px, 1.2 行高', example: 'YYC³ EasyVizAI', class: 'font-bold text-4xl' },
  { role: '标题 (中等)', spec: '18-24px, 1.3 行高', example: '模块设计', class: 'font-medium text-2xl' },
  { role: '正文', spec: '14-16px, 1.5 行高', example: '云枢汇聚点。', class: 'text-base font-normal text-gray-300' },
  { role: '数据等宽', spec: '14-20px, Monospace', example: 'DATA_FLOW_01', class: 'font-mono text-sm text-brand-secondary' },
];

const motions = [
  { name: '能量流', desc: '粒子流动, 核心色' },
  { name: '机械感', desc: '精密, 物理驱动' },
  { name: '聚合', desc: '向中心汇聚' },
  { name: '扩散', desc: '从中心展开' },
];

export const DesignSystem = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Colors */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5">
        <h3 className="text-2xl font-bold text-white mb-6">色彩系统</h3>
        <div className="grid grid-cols-2 gap-4">
          {colors.map((c) => (
            <div key={c.hex} className="group relative overflow-hidden rounded-xl h-24 flex items-end p-4 border border-white/10 transition-transform hover:scale-105" style={{ background: c.hex }}>
              <div className="relative z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-mono">
                {c.hex}
              </div>
              <div className="absolute top-2 right-2 text-xs font-bold text-white/80 uppercase tracking-wider">{c.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5">
        <h3 className="text-2xl font-bold text-white mb-6">排版系统</h3>
        <div className="space-y-6">
          {typography.map((t) => (
            <div key={t.role} className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{t.role} — {t.spec}</span>
              <p className={t.class}>{t.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motion */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 lg:col-span-2">
        <h3 className="text-2xl font-bold text-white mb-6">动效原则</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {motions.map((m, i) => (
            <div key={m.name} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center">
              <div className="h-20 mb-4 rounded-lg bg-black/30 flex items-center justify-center overflow-hidden">
                {i === 0 && <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-8 h-8 rounded-full bg-brand-primary blur-md" />}
                {i === 1 && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-8 h-8 border-2 border-brand-secondary rounded-md" />}
                {i === 2 && <motion.div animate={{ scale: [1.5, 0.5, 1.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 bg-white rounded-full box-content border-4 border-brand-primary/50" />}
                {i === 3 && <motion.div animate={{ scale: [0.5, 1.5, 0.5], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-8 h-8 border border-white rounded-full" />}
              </div>
              <h4 className="font-bold text-white mb-1">{m.name}</h4>
              <p className="text-xs text-gray-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
