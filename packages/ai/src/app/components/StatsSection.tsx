import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from './LanguageContext';

/**
 * 迷你波形图生成（伪随机）
 */
function generateSparkline(points: number, seed: number): number[] {
  const data: number[] = [];
  let value = 0.5;
  for (let i = 0; i < points; i++) {
    value += (Math.sin(i * 0.8 + seed) * 0.3 + (Math.random() - 0.5) * 0.15);
    value = Math.max(0.1, Math.min(0.9, value));
    data.push(value);
  }
  return data;
}

function AnimatedCounter({
  value,
  suffix,
  isDecimal,
  isInView,
}: {
  value: number;
  suffix: string;
  isDecimal?: boolean;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      /** 缓动函数 — ease out */
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = value * eased;
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * 迷你波形图组件
 */
function Sparkline({
  data,
  color,
  isInView,
}: {
  data: number[];
  color: string;
  isInView: boolean;
}) {
  const width = 80;
  const height = 24;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${(1 - v) * height}`)
    .join(' ');

  return (
    <motion.svg
      width={width}
      height={height}
      className="mx-auto mt-3"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 填充区域 */}
      <motion.polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color.replace('#', '')})`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      {/* 线条 */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* 端点发光 */}
      <motion.circle
        cx={width}
        cy={(1 - data[data.length - 1]) * height}
        r="2"
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: [0, 1, 0.5], scale: 1 } : {}}
        transition={{ duration: 1, delay: 2.5 }}
      />
    </motion.svg>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const { t } = useLanguage();

  const stats = [
    {
      value: 15000,
      suffix: '+',
      label: t('活跃学员', 'Active Learners'),
      color: '#7c3aed',
      trend: t('+12% 本月', '+12% this month'),
      sparkData: generateSparkline(20, 1),
    },
    {
      value: 120,
      suffix: '+',
      label: t('课程模块', 'Course Modules'),
      color: '#06b6d4',
      trend: t('+8 新增', '+8 new'),
      sparkData: generateSparkline(20, 2),
    },
    {
      value: 98,
      suffix: '%',
      label: t('完成率', 'Completion Rate'),
      color: '#10b981',
      trend: t('↑ 2.3%', '↑ 2.3%'),
      sparkData: generateSparkline(20, 3),
    },
    {
      value: 4.9,
      suffix: '/5',
      label: t('学员评分', 'Student Rating'),
      color: '#f59e0b',
      isDecimal: true,
      trend: t('持续满分', 'Consistently high'),
      sparkData: generateSparkline(20, 4),
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group cursor-default text-center py-10 px-4 backdrop-blur-xl overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              {/* 边缘渐变分隔 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)',
                }}
              />

              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${stat.color}15, transparent 70%)`,
                }}
              />

              <div className="relative">
                {/* 数值 */}
                <p
                  className="text-3xl md:text-4xl mb-1"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: stat.color,
                  }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isDecimal={stat.isDecimal}
                    isInView={isInView}
                  />
                </p>

                {/* 标签 */}
                <p
                  className="text-white/40 text-sm mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </p>

                {/* 趋势标注 */}
                <motion.p
                  className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    color: stat.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stat.trend}
                </motion.p>

                {/* 迷你波形图 */}
                <Sparkline data={stat.sparkData} color={stat.color} isInView={isInView} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
