import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

/**
 * 无按钮语言切换器
 * 悬停展开，点击/轻触切换语言
 * 遵循"无边界核心"设计理念 · 主题感知
 */
export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed top-6 right-6 z-50 flex items-center gap-0 cursor-pointer select-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={toggleLanguage}
      whileTap={{ scale: 0.92 }}
    >
      {/* 展开标签 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="flex items-center gap-2 mr-3"
            initial={{ opacity: 0, x: 10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 10, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="text-xs whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", color: colors.textMuted }}
            >
              {language === 'zh' ? 'Switch to English' : '切换到中文'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 语言指示器 */}
      <motion.div
        className="relative w-10 h-10 flex items-center justify-center overflow-hidden backdrop-blur-xl"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))'
            : colors.inputBg,
        }}
        animate={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))'
            : colors.inputBg,
        }}
        whileHover={{ scale: 1.1 }}
      >
        {/* 扫描线效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.08) 50%, transparent 100%)',
            backgroundSize: '100% 200%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '0% 200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* 边缘光晕 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
          }}
        />

        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            className="relative text-sm text-white/80"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            initial={{ opacity: 0, y: 8, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -8, rotateX: 90 }}
            transition={{ duration: 0.25 }}
          >
            {language === 'zh' ? '中' : 'EN'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}