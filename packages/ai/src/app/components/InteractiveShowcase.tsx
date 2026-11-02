import { useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'motion/react';
import { Move, Hand, MousePointer2, Volume2, Fingerprint, Eye } from 'lucide-react';
import { useLanguage } from './LanguageContext';

function useInteractions() {
  const { t } = useLanguage();
  return [
    {
      id: 'gesture',
      icon: Hand,
      title: t('手势导航', 'Gesture Navigation'),
      description: t(
        '滑动、捏合、拖拽 — 无缝浏览内容',
        'Swipe, pinch, and drag to navigate seamlessly through content'
      ),
      demo: 'swipe' as const,
      color: '#7c3aed',
    },
    {
      id: 'hover',
      icon: Eye,
      title: t('悬停发现', 'Hover Discovery'),
      description: t(
        '内容随你探索自动揭示 — 无需点击',
        'Content reveals itself as you explore — no clicks required'
      ),
      demo: 'hover' as const,
      color: '#06b6d4',
    },
    {
      id: 'drag',
      icon: Move,
      title: t('拖拽排列', 'Drag & Arrange'),
      description: t(
        '拖拽元素以重排、优化你的学习节奏',
        'Drag elements to reorder, prioritize, and organize your learning'
      ),
      demo: 'drag' as const,
      color: '#10b981',
    },
    {
      id: 'tap',
      icon: Fingerprint,
      title: t('触控反馈', 'Tap Response'),
      description: t(
        '每次触摸都触发即时的视觉与触觉反馈',
        'Every touch triggers immediate visual and haptic feedback'
      ),
      demo: 'tap' as const,
      color: '#f59e0b',
    },
    {
      id: 'voice',
      icon: Volume2,
      title: t('语音控制', 'Voice Control'),
      description: t(
        '自然语音导航、搜索与内容交互',
        'Speak naturally to navigate, search, and interact with content'
      ),
      demo: 'voice' as const,
      color: '#ef4444',
    },
    {
      id: 'context',
      icon: MousePointer2,
      title: t('上下文感知', 'Context Awareness'),
      description: t(
        '界面根据你的行为与偏好自适应',
        'The interface adapts based on your behavior and preferences'
      ),
      demo: 'context' as const,
      color: '#8b5cf6',
    },
  ];
}

type InteractionItem = ReturnType<typeof useInteractions>[0];

/** 玻璃面板基础样式 — 渐变替代边框 */
const glassPanel: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
};

const glassEdge: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
};

export function InteractiveShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { t } = useLanguage();
  const interactions = useInteractions();

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Section header */}
        <div className="text-center mb-20">
          <p
            className="text-sm text-emerald-400 mb-3 tracking-widest uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('设计理念', 'Design Philosophy')}
          </p>
          <h2
            className="text-3xl md:text-5xl text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}
          >
            {t('无界', 'Borderless')}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {' '}
              {t('交互', 'Interaction')}
            </span>
          </h2>
          <p
            className="text-white/40 max-w-lg mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t(
              '体验下方每种交互模式。每个元素都响应你的自然手势。',
              'Try each interaction pattern below. Every element responds to your natural gestures.'
            )}
          </p>
        </div>

        {/* Interactive demos grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          {interactions.map((item, index) => (
            <InteractionDemo key={item.id} item={item} index={index} isInView={isInView} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function InteractionDemo({
  item,
  index,
  isInView,
}: {
  item: InteractionItem;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {item.demo === 'swipe' && <SwipeDemo item={item} />}
      {item.demo === 'hover' && <HoverDemo item={item} />}
      {item.demo === 'drag' && <DragDemo item={item} />}
      {item.demo === 'tap' && <TapDemo item={item} />}
      {item.demo === 'voice' && <VoiceDemo item={item} />}
      {item.demo === 'context' && <ContextDemo item={item} />}
    </motion.div>
  );
}

function SwipeDemo({ item }: { item: InteractionItem }) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    [
      `linear-gradient(135deg, ${item.color}30, transparent)`,
      'transparent',
      `linear-gradient(135deg, transparent, ${item.color}30)`,
    ]
  );
  const Icon = item.icon;
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative overflow-hidden backdrop-blur-xl p-6 h-64 cursor-grab active:cursor-grabbing group"
      style={glassPanel}
      whileHover={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${item.color}08)` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={glassEdge} />
      <motion.div className="absolute inset-0" style={{ background }} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" style={{ color: item.color }} />
          <h3 className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {item.description}
        </p>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 flex items-center justify-center"
            style={{
              x,
              background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
            }}
            drag="x"
            dragConstraints={{ left: -80, right: 80 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.1 }}
          >
            <Hand className="w-6 h-6" style={{ color: item.color }} />
          </motion.div>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          {t('左右拖拽', 'Drag left or right')}
        </p>
      </div>
    </motion.div>
  );
}

function HoverDemo({ item }: { item: InteractionItem }) {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const Icon = item.icon;
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative overflow-hidden backdrop-blur-xl p-6 h-64 group"
      style={glassPanel}
      whileHover={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${item.color}08)` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={glassEdge} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" style={{ color: item.color }} />
          <h3 className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {item.description}
        </p>
        <div className="flex-1 grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="cursor-pointer"
              style={{
                backgroundColor:
                  hoveredCell === i
                    ? `${item.color}40`
                    : hoveredCell !== null &&
                      Math.abs((hoveredCell % 4) - (i % 4)) +
                        Math.abs(Math.floor(hoveredCell / 4) - Math.floor(i / 4)) <=
                        1
                    ? `${item.color}20`
                    : 'rgba(255,255,255,0.03)',
              }}
              onHoverStart={() => setHoveredCell(i)}
              onHoverEnd={() => setHoveredCell(null)}
              animate={{
                scale: hoveredCell === i ? 1.1 : 1,
              }}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          {t('悬停网格', 'Hover over the grid')}
        </p>
      </div>
    </motion.div>
  );
}

function DragDemo({ item }: { item: InteractionItem }) {
  const [items] = useState([
    { zh: '学习', en: 'Learn' },
    { zh: '构建', en: 'Build' },
    { zh: '发布', en: 'Ship' },
    { zh: '扩展', en: 'Scale' },
  ]);
  const Icon = item.icon;
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative overflow-hidden backdrop-blur-xl p-6 h-64 group"
      style={glassPanel}
      whileHover={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${item.color}08)` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={glassEdge} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" style={{ color: item.color }} />
          <h3 className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {item.description}
        </p>
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {items.map((label, i) => (
            <motion.div
              key={label.en}
              className="px-4 py-2 text-white/70 text-sm cursor-grab active:cursor-grabbing flex items-center gap-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              }}
              drag="y"
              dragConstraints={{ top: -10, bottom: 10 }}
              dragElastic={0.1}
              whileDrag={{ scale: 1.03, backgroundColor: `${item.color}20`, zIndex: 10 }}
              whileHover={{ x: 4 }}
            >
              <span className="text-xs text-white/30">{i + 1}.</span>
              {t(label.zh, label.en)}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TapDemo({ item }: { item: InteractionItem }) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [tapCount, setTapCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const { t } = useLanguage();

  const handleTap = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-5), { id, x, y }]);
    setTapCount((prev) => prev + 1);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <motion.div
      className="relative overflow-hidden backdrop-blur-xl p-6 h-64 cursor-pointer group"
      style={glassPanel}
      whileHover={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${item.color}08)` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={glassEdge} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" style={{ color: item.color }} />
          <h3 className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {item.description}
        </p>
        <div
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          onClick={handleTap}
        >
          <div className="absolute inset-0" style={{ backgroundColor: `${item.color}05` }} />
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: item.color,
                translateX: '-50%',
                translateY: '-50%',
              }}
              initial={{ width: 0, height: 0, opacity: 0.5 }}
              animate={{ width: 120, height: 120, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
          <div className="relative text-center">
            <p
              className="text-3xl text-white/80"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {tapCount}
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              {t('次触控', 'taps registered')}
            </p>
          </div>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          {t('点击区域任意位置', 'Click anywhere in the area')}
        </p>
      </div>
    </motion.div>
  );
}

function VoiceDemo({ item }: { item: InteractionItem }) {
  const [isListening, setIsListening] = useState(false);
  const Icon = item.icon;
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative overflow-hidden backdrop-blur-xl p-6 h-64 group"
      style={glassPanel}
      whileHover={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${item.color}08)` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={glassEdge} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" style={{ color: item.color }} />
          <h3 className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {item.description}
        </p>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="relative cursor-pointer"
            onTap={() => setIsListening(!isListening)}
            whileTap={{ scale: 0.9 }}
          >
            {/* Pulse rings — 无圆角 */}
            {isListening && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    style={{ border: `1px solid ${item.color}` }}
                    animate={{
                      scale: [1, 2.5],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </>
            )}
            <div
              className="w-16 h-16 flex items-center justify-center"
              style={{
                background: isListening
                  ? `linear-gradient(135deg, ${item.color}30, ${item.color}15)`
                  : `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
              }}
            >
              <Volume2
                className="w-6 h-6"
                style={{ color: isListening ? item.color : `${item.color}80` }}
              />
            </div>
          </motion.div>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          {isListening
            ? t('聆听中... 轻触停止', 'Listening... tap to stop')
            : t('轻触激活', 'Tap to activate')}
        </p>
      </div>
    </motion.div>
  );
}

function ContextDemo({ item }: { item: InteractionItem }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const { t } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      className="relative overflow-hidden backdrop-blur-xl p-6 h-64 group"
      style={glassPanel}
      whileHover={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${item.color}08)` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={glassEdge} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" style={{ color: item.color }} />
          <h3 className="text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {item.description}
        </p>
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
        >
          {/* Radial gradient follows mouse */}
          <div
            className="absolute inset-0 transition-all duration-100"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${item.color}25, transparent 50%)`,
            }}
          />

          {/* Grid of responsive dots */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-2 p-2">
            {Array.from({ length: 48 }).map((_, i) => {
              const col = i % 8;
              const row = Math.floor(i / 8);
              const dotX = (col / 7) * 100;
              const dotY = (row / 5) * 100;
              const dist = Math.sqrt(
                Math.pow(dotX - mousePos.x, 2) + Math.pow(dotY - mousePos.y, 2)
              );
              const scale = Math.max(0.3, 1 - dist / 60);
              const opacity = Math.max(0.1, 1 - dist / 80);

              return (
                <div key={i} className="flex items-center justify-center">
                  <div
                    className="transition-all duration-150"
                    style={{
                      width: `${4 * scale}px`,
                      height: `${4 * scale}px`,
                      backgroundColor: item.color,
                      opacity,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          {t('移动光标', 'Move your cursor')}
        </p>
      </div>
    </motion.div>
  );
}
