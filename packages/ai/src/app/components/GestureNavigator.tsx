import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

/**
 * 上下文感知导航
 * 键盘 ↑↓ 箭头导航 · 触摸滑动检测 · 区段切换动效
 * 遵循"无按钮设计"：所有导航通过手势、键盘、滑动完成
 */

const SECTION_IDS = ['hero', 'courses', 'path', 'interactions'];

export function GestureNavigator() {
  const [transitioning, setTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('down');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const isNavigatingRef = useRef(false);
  const { t } = useLanguage();
  const { colors } = useTheme();

  /**
   * 平滑滚动到指定区段
   */
  const navigateToSection = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (isNavigatingRef.current) return;
      if (index < 0 || index >= SECTION_IDS.length) return;

      isNavigatingRef.current = true;
      setTransitionDirection(direction);
      setTransitioning(true);
      setCurrentSectionIndex(index);

      const el = document.getElementById(SECTION_IDS[index]);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        setTransitioning(false);
        isNavigatingRef.current = false;
      }, 800);
    },
    []
  );

  /**
   * 获取当前最近的区段索引
   */
  const getCurrentIndex = useCallback((): number => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        const dist = Math.abs(el.offsetTop + el.offsetHeight / 2 - scrollPos);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      }
    });

    return closestIndex;
  }, []);

  /**
   * 键盘导航: ↑ ↓ 箭头
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const current = getCurrentIndex();
        navigateToSection(current + 1, 'down');
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const current = getCurrentIndex();
        navigateToSection(current - 1, 'up');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getCurrentIndex, navigateToSection]);

  /**
   * 触摸滑动检测（移动端）
   */
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const velocity = Math.abs(deltaY) / deltaTime;

      // 快速滑动阈值：距离 > 80px 且 速度 > 0.5px/ms
      if (Math.abs(deltaY) > 80 && velocity > 0.5) {
        const current = getCurrentIndex();
        if (deltaY > 0) {
          navigateToSection(current + 1, 'down');
        } else {
          navigateToSection(current - 1, 'up');
        }
      }

      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [getCurrentIndex, navigateToSection]);

  /**
   * 同步滚动位置到当前区段索引
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!isNavigatingRef.current) {
        setCurrentSectionIndex(getCurrentIndex());
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getCurrentIndex]);

  const sectionNames = [
    t('首页', 'Home'),
    t('课程', 'Courses'),
    t('路径', 'Path'),
    t('交互', 'Interactions'),
  ];

  return (
    <>
      {/* 过渡动效叠加层 */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 方向性扫描线 */}
            <motion.div
              className="absolute left-0 right-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 30%, rgba(6,182,212,0.5) 50%, rgba(124,58,237,0.4) 70%, transparent 100%)',
              }}
              initial={{ top: transitionDirection === 'down' ? '0%' : '100%' }}
              animate={{ top: transitionDirection === 'down' ? '100%' : '0%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />

            {/* 区段名称闪烁 */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1, 1.1] }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-sm tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: colors.textMuted }}
              >
                {sectionNames[currentSectionIndex]}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部区段进度指示器 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        {SECTION_IDS.map((id, i) => (
          <motion.div
            key={id}
            className="cursor-pointer relative"
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              const direction = i > currentSectionIndex ? 'down' : 'up';
              navigateToSection(i, direction);
            }}
          >
            <div
              className="w-6 h-0.5 transition-all duration-500"
              style={{
                background:
                  i === currentSectionIndex
                    ? 'linear-gradient(90deg, #7c3aed, #06b6d4)'
                    : 'rgba(255,255,255,0.1)',
              }}
            />
            {i === currentSectionIndex && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  filter: 'blur(4px)',
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}