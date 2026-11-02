import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Sparkles, Brain, Zap } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

/**
 * 打字机 Hook — 逐字输出
 */
function useTypingEffect(text: string, speed: number = 40) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const subtitleText = t(
    '无边界沉浸式学习体验，由你的交互驱动。无按钮，无边界，纯粹的探索之旅。',
    'A borderless, immersive learning experience driven by your interactions. No buttons. No boundaries. Just pure exploration.'
  );
  const { displayed: typedSubtitle, done: typingDone } = useTypingEffect(subtitleText, 35);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const orbs = [
    { x: '15%', y: '20%', size: 300, color: 'from-purple-600/20 to-cyan-500/10', delay: 0 },
    { x: '70%', y: '30%', size: 250, color: 'from-cyan-500/15 to-purple-600/10', delay: 1 },
    { x: '40%', y: '60%', size: 200, color: 'from-violet-500/15 to-blue-500/10', delay: 2 },
    { x: '85%', y: '70%', size: 180, color: 'from-blue-500/10 to-purple-500/15', delay: 0.5 },
  ];

  /** 轨道标签数据 */
  const orbitalTags = [
    { label: 'Neural Networks', angle: 0 },
    { label: 'Deep Learning', angle: 72 },
    { label: 'NLP', angle: 144 },
    { label: 'Computer Vision', angle: 216 },
    { label: 'MLOps', angle: 288 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Animated gradient orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute bg-gradient-radial ${orb.color} blur-3xl`}
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* 轨道环 — 围绕标题旋转 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative"
          style={{ width: 500, height: 500 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {/* 轨道线 */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, transparent 48%, rgba(124,58,237,0.06) 49%, rgba(124,58,237,0.06) 50%, transparent 51%)',
            }}
          />

          {/* 轨道标签 */}
          {orbitalTags.map((tag, i) => {
            const rad = (tag.angle * Math.PI) / 180;
            const x = Math.cos(rad) * 250 + 250;
            const y = Math.sin(rad) * 250 + 250;
            return (
              <motion.div
                key={tag.label}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                <span
                  className="text-[8px] text-white/10 whitespace-nowrap"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {tag.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 第二轨道环（逆向） */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ width: 380, height: 380 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, transparent 48%, rgba(6,182,212,0.04) 49%, rgba(6,182,212,0.04) 50%, transparent 51%)',
            }}
          />
        </motion.div>
      </div>

      {/* 标题后脉冲光环 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Main content with 3D tilt */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto select-none"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 mb-8 backdrop-blur-xl cursor-pointer overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(124,58,237,0.08) 50%, rgba(255,255,255,0.02) 100%)',
          }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(124, 58, 237, 0.15)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, transparent 30%, transparent 70%, rgba(6,182,212,0.1) 100%)',
            }}
          />
          <Sparkles className="w-4 h-4 text-purple-400 relative" />
          <span
            className="text-sm text-purple-300 relative"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('AI 驱动教育平台', 'AI-Powered Education Platform')}
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
          >
            <span style={{ color: colors.textPrimary }}>YYC</span>
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ³
            </span>
            <br />
            <span style={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(15,10,40,0.85)' }}>
              {t('AI 智能教育', 'AI Education')}
            </span>
          </h1>
        </motion.div>

        {/* Subtitle — 打字机效果 */}
        <motion.div
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 min-h-[60px]"
          style={{ fontFamily: "'Inter', sans-serif", color: colors.textSecondary }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span>{typedSubtitle}</span>
          {!typingDone && (
            <motion.span
              className="inline-block w-0.5 h-5 bg-purple-400/60 ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Interactive action areas */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <InteractiveZone
            icon={<Brain className="w-5 h-5" />}
            label={t('探索课程', 'Explore Courses')}
            gradient="from-purple-500 to-violet-600"
            hint={t('点击探索', 'Click to explore')}
            targetId="courses"
          />
          <InteractiveZone
            icon={<Zap className="w-5 h-5" />}
            label={t('学习路径', 'Learning Paths')}
            gradient="from-cyan-500 to-blue-600"
            hint={t('轻触发现', 'Tap to discover')}
            targetId="path"
          />
          <InteractiveZone
            icon={<Sparkles className="w-5 h-5" />}
            label={t('AI 助手', 'AI Assistant')}
            gradient="from-purple-500 to-cyan-500"
            hint={t('触摸激活', 'Touch to activate')}
            targetId="interactions"
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-xs text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t('向下滚动探索', 'Scroll to explore')}
          </span>
          <div
            className="w-5 h-8 flex justify-center pt-1"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <motion.div
              className="w-1 h-2 bg-purple-400"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function InteractiveZone({
  icon,
  label,
  gradient,
  hint,
  targetId,
}: {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  hint: string;
  targetId: string;
}) {
  const [active, setActive] = useState(false);

  const handleTap = () => {
    setActive(!active);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="relative group cursor-pointer select-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onTap={handleTap}
    >
      <div
        className="relative px-8 py-4 backdrop-blur-xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        {/* 边缘光晕 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
          }}
        />

        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />

        <div className="relative flex items-center gap-3">
          <div className="text-white/70 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <div className="text-left">
            <p
              className="text-white/90 text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {label}
            </p>
            <p className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">
              {hint}
            </p>
          </div>
        </div>
      </div>

      {/* Active indicator */}
      {active && (
        <motion.div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r ${gradient}`}
          layoutId="activeIndicator"
        />
      )}
    </motion.div>
  );
}