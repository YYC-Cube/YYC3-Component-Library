import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

/**
 * 手势驱动主题切换器
 * 无按钮设计 — 水平拖拽切换深色/浅色
 * 悬停展开提示，拖过阈值自动切换
 */
export function ThemeSwitcher() {
  const { mode, toggleTheme, isDark, colors } = useTheme();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const dragX = useMotionValue(0);
  const hasSwitchedRef = useRef(false);

  /** 拖拽过程中的视觉变换 */
  const orbBg = useTransform(
    dragX,
    [-40, 0, 40],
    [
      'linear-gradient(135deg, rgba(250,204,21,0.3), rgba(251,191,36,0.15))',
      isDark
        ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))'
        : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(250,204,21,0.1))',
      'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
    ]
  );

  const handleDrag = (_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 30 && !hasSwitchedRef.current) {
      hasSwitchedRef.current = true;
      toggleTheme();
    }
  };

  const handleDragEnd = () => {
    hasSwitchedRef.current = false;
  };

  return (
    <motion.div
      className="fixed top-6 left-6 z-50 flex items-center gap-0 select-none"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 主题拖拽球 */}
      <motion.div
        className="relative cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.9 }}
        onTap={toggleTheme}
      >
        {/* 外层脉冲 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)'
              : 'radial-gradient(circle, rgba(250,204,21,0.15), transparent 70%)',
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* 核心球体 */}
        <motion.div
          className="relative w-10 h-10 flex items-center justify-center overflow-hidden backdrop-blur-xl"
          style={{ background: orbBg }}
        >
          {/* 扫描线 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
              backgroundSize: '100% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '0% 200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* 边缘光晕 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: colors.glassEdge }}
          />

          {/* 模式图标 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="relative"
              initial={{ opacity: 0, rotateY: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                /* 月亮符号 */
                <span className="text-sm" style={{ color: 'rgba(167,139,250,0.8)' }}>
                  ☽
                </span>
              ) : (
                /* 太阳符号 */
                <span className="text-sm" style={{ color: 'rgba(250,204,21,0.9)' }}>
                  ☀
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 悬停展开提示 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="flex items-center gap-2 ml-3"
            initial={{ opacity: 0, x: -10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: -10, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="text-xs whitespace-nowrap"
              style={{
                color: colors.textMuted,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {isDark
                ? t('拖拽切换浅色', 'Drag to switch light')
                : t('拖拽切换深色', 'Drag to switch dark')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
