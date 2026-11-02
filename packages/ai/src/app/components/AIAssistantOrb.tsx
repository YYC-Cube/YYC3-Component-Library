import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

/**
 * AI 助手浮窗 — 上下文感知悬浮球
 * 无按钮交互：悬停展开、轻触激活、手势收起
 * 根据当前滚动区段动态推荐
 */

const SECTION_IDS = ['hero', 'courses', 'path', 'interactions'];

interface ContextSuggestion {
  text: string;
  icon: string;
}

export function AIAssistantOrb() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [typedText, setTypedText] = useState('');
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useLanguage();
  const { colors } = useTheme();

  /** 滚动区段检测 */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setCurrentSection(SECTION_IDS[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** 上下文建议数据 */
  const contextSuggestions: Record<string, ContextSuggestion[]> = {
    hero: [
      { text: t('向下滚动发现更多课程', 'Scroll down to discover courses'), icon: '↓' },
      { text: t('试试键盘 ↓ 快速导航', 'Try arrow keys for quick nav'), icon: '⌨' },
      { text: t('欢迎来到 YYC³ 智能教育', 'Welcome to YYC³ AI Education'), icon: '✦' },
    ],
    courses: [
      { text: t('点击卡片查看课程详情', 'Click a card to see course details'), icon: '◇' },
      { text: t('悬停预览 · 点击展开', 'Hover to preview · click to expand'), icon: '◈' },
      { text: t('向下拖拽关闭详情面板', 'Drag down to close detail panel'), icon: '↕' },
    ],
    path: [
      { text: t('点击节点查看技能详情', 'Click a node to see skill details'), icon: '◉' },
      { text: t('已完成 2/6 学习阶段', '2/6 stages completed'), icon: '▰' },
      { text: t('当前进度：机器学习基础', 'Current: Machine Learning Basics'), icon: '⚡' },
    ],
    interactions: [
      { text: t('拖拽 · 悬停 · 轻触 — 体验无界交互', 'Drag · Hover · Tap — experience borderless'), icon: '✧' },
      { text: t('每个演示都可以实际操作', 'Every demo is fully interactive'), icon: '◆' },
      { text: t('试试语音控制演示', 'Try the voice control demo'), icon: '◎' },
    ],
  };

  const suggestions = contextSuggestions[currentSection] || contextSuggestions.hero;

  /** 打字机效果 */
  useEffect(() => {
    if (!isExpanded) {
      setTypedText('');
      return;
    }

    const fullText = suggestions[0].text;
    let charIndex = 0;
    setTypedText('');

    const typeChar = () => {
      if (charIndex < fullText.length) {
        setTypedText(fullText.slice(0, charIndex + 1));
        charIndex++;
        typingRef.current = setTimeout(typeChar, 30);
      }
    };

    typingRef.current = setTimeout(typeChar, 300);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [isExpanded, currentSection]);

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-50 flex items-end gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      {/* 上下文面板 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mb-2 backdrop-blur-2xl overflow-hidden"
            style={{
              background: colors.panelBg,
              width: 260,
            }}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 面板边缘光晕 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 40%, transparent 60%, rgba(6,182,212,0.06) 100%)',
              }}
            />

            {/* 顶部状态栏 */}
            <div className="relative px-4 pt-3 pb-2 flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5"
                style={{ backgroundColor: isActive ? '#10b981' : '#7c3aed' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: colors.textMuted }}
              >
                {t('AI 上下文感知', 'AI Context Aware')}
              </span>
            </div>

            {/* 打字机内容 */}
            <div className="relative px-4 pb-2">
              <p
                className="text-xs min-h-[32px]"
                style={{ fontFamily: "'Inter', sans-serif", color: colors.textSecondary }}
              >
                {typedText}
                <motion.span
                  className="inline-block w-px h-3 bg-purple-400 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </p>
            </div>

            {/* 建议列表 */}
            <div className="relative px-3 pb-3 space-y-1">
              {suggestions.slice(1).map((suggestion, i) => (
                <motion.div
                  key={`${currentSection}-${i}`}
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer group"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  whileHover={{
                    background: 'rgba(124,58,237,0.1)',
                    x: 2,
                  }}
                >
                  <span className="text-[10px] text-purple-400/60 group-hover:text-purple-400 transition-colors">
                    {suggestion.icon}
                  </span>
                  <span
                    className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {suggestion.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* 底部分隔线 */}
            <div className="px-4 pb-3">
              <div
                className="h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)',
                }}
              />
              <p
                className="text-[8px] text-white/15 mt-2 text-center"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t('悬停探索 · 轻触交互', 'Hover to explore · Tap to interact')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI 核心球 */}
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        onTap={() => setIsActive(!isActive)}
        whileTap={{ scale: 0.9 }}
      >
        {/* 外层脉冲环 */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* 第二层环 */}
        {isActive && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 60%)',
            }}
            animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        )}

        {/* 核心球体 */}
        <motion.div
          className="relative w-12 h-12 flex items-center justify-center overflow-hidden"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))'
              : 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
          }}
          animate={{
            background: isActive
              ? [
                  'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))',
                  'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(124,58,237,0.4))',
                  'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))',
                ]
              : undefined,
          }}
          transition={isActive ? { duration: 4, repeat: Infinity } : {}}
          whileHover={{ scale: 1.1 }}
        >
          {/* 内部扫描 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)',
              backgroundSize: '100% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '0% 200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* 边缘光晕 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)',
            }}
          />

          {/* AI 图标 */}
          <span
            className="relative text-sm text-white/80"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            AI
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}