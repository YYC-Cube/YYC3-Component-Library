import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';

/**
 * 全息 HUD 视觉层
 * 数据流粒子 · 网格线扫描 · 边缘呼吸光效 · 角标 · 扫描线
 * 纯视觉叠加层，pointer-events-none · 主题感知
 */
export function HolographicHUD() {
  const { isDark } = useTheme();
  /** 浅色模式下降低 HUD 可见度 */
  const opacity = isDark ? 1 : 0.4;

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-700"
      style={{ zIndex: 1, opacity }}
    >
      {/* 角标 HUD */}
      <CornerBrackets />

      {/* 水平扫描线 */}
      <ScanLine />

      {/* 边缘呼吸光效 */}
      <EdgeGlow />

      {/* 网格线 */}
      <GridOverlay />

      {/* 数据流 */}
      <DataStream />
    </div>
  );
}

/**
 * 四角 HUD 标记
 */
function CornerBrackets() {
  const bracketStyle = 'absolute w-8 h-8';
  const lineColor = 'rgba(124, 58, 237, 0.25)';

  return (
    <>
      {/* 左上 */}
      <div className={`${bracketStyle} top-4 left-4`}>
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{ background: `linear-gradient(90deg, ${lineColor}, transparent)` }}
        />
        <div
          className="absolute top-0 left-0 w-px h-full"
          style={{ background: `linear-gradient(180deg, ${lineColor}, transparent)` }}
        />
        <motion.div
          className="absolute top-0 left-0 w-1.5 h-1.5"
          style={{ backgroundColor: 'rgba(124, 58, 237, 0.5)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* 右上 */}
      <div className={`${bracketStyle} top-4 right-4`}>
        <div
          className="absolute top-0 right-0 w-full h-px"
          style={{ background: `linear-gradient(270deg, ${lineColor}, transparent)` }}
        />
        <div
          className="absolute top-0 right-0 w-px h-full"
          style={{ background: `linear-gradient(180deg, ${lineColor}, transparent)` }}
        />
        <motion.div
          className="absolute top-0 right-0 w-1.5 h-1.5"
          style={{ backgroundColor: 'rgba(6, 182, 212, 0.5)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* 左下 */}
      <div className={`${bracketStyle} bottom-4 left-4`}>
        <div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: `linear-gradient(90deg, ${lineColor}, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-px h-full"
          style={{ background: `linear-gradient(0deg, ${lineColor}, transparent)` }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-1.5 h-1.5"
          style={{ backgroundColor: 'rgba(6, 182, 212, 0.5)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* 右下 */}
      <div className={`${bracketStyle} bottom-4 right-4`}>
        <div
          className="absolute bottom-0 right-0 w-full h-px"
          style={{ background: `linear-gradient(270deg, ${lineColor}, transparent)` }}
        />
        <div
          className="absolute bottom-0 right-0 w-px h-full"
          style={{ background: `linear-gradient(0deg, ${lineColor}, transparent)` }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-1.5 h-1.5"
          style={{ backgroundColor: 'rgba(124, 58, 237, 0.5)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
      </div>
    </>
  );
}

/**
 * 水平扫描线 — 周期性扫过屏幕
 */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 20%, rgba(6,182,212,0.2) 50%, rgba(124,58,237,0.15) 80%, transparent 100%)',
      }}
      animate={{ top: ['-2%', '102%'] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
        repeatDelay: 4,
      }}
    />
  );
}

/**
 * 边缘呼吸光效 — 四边渐变脉冲
 */
function EdgeGlow() {
  return (
    <>
      {/* 顶部 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-24"
        style={{
          background:
            'linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 底部 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            'linear-gradient(0deg, rgba(6,182,212,0.05) 0%, transparent 100%)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* 左侧 */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-16"
        style={{
          background:
            'linear-gradient(90deg, rgba(124,58,237,0.04) 0%, transparent 100%)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* 右侧 */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-16"
        style={{
          background:
            'linear-gradient(270deg, rgba(6,182,212,0.04) 0%, transparent 100%)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
    </>
  );
}

/**
 * 极淡网格覆盖层
 */
function GridOverlay() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
  );
}

/**
 * 左侧数据流 — 向上流动的 HEX 数据
 */
function DataStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [streams, setStreams] = useState<Array<{ id: number; text: string; y: number }>>([]);
  const idCounterRef = useRef(0);

  const hexChars = '0123456789ABCDEF';
  const generateHex = (): string => {
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const id = idCounterRef.current++;
      const text = `0x${generateHex()}`;
      const y = Math.random() * 100;

      setStreams((prev) => {
        const next = [...prev, { id, text, y }];
        if (next.length > 8) next.shift();
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-6 top-1/4 bottom-1/4 w-16 overflow-hidden">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute left-0 text-[8px] text-purple-500/20 whitespace-nowrap"
          style={{
            fontFamily: "'Space Grotesk', monospace",
            top: `${stream.y}%`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 0.4, 0], y: -40 }}
          transition={{ duration: 4, ease: 'linear' }}
        >
          {stream.text}
        </motion.div>
      ))}
    </div>
  );
}