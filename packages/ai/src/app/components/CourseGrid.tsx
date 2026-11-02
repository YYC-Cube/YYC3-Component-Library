import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'motion/react';
import { Brain, Code, Cpu, Database, Globe, Layers, ChevronRight, ChevronLeft, Clock, Users, Star, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';

/**
 * 课程数据 — 双语
 */
function useCourses() {
  const { t } = useLanguage();
  return [
    {
      id: 'ai-fundamentals',
      title: t('AI 基础', 'AI Fundamentals'),
      subtitle: t('掌握人工智能的核心基础', 'Master the foundations of artificial intelligence'),
      icon: Brain,
      color: 'from-purple-500 to-violet-600',
      bgGlow: 'rgba(124, 58, 237, 0.15)',
      image:
        'https://images.unsplash.com/photo-1760931969401-9bd6ee902798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwQUklMjB0ZWNobm9sb2d5JTIwZGFya3xlbnwxfHx8fDE3NzA3MDUyNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: t('12 周', '12 weeks'),
      students: '2,847',
      rating: 4.9,
      modules: [
        t('神经网络与深度学习', 'Neural Networks & Deep Learning'),
        t('自然语言处理', 'Natural Language Processing'),
        t('计算机视觉基础', 'Computer Vision Basics'),
        t('强化学习', 'Reinforcement Learning'),
      ],
    },
    {
      id: 'full-stack-dev',
      title: t('全栈开发', 'Full-Stack Development'),
      subtitle: t('从零构建现代 Web 应用', 'Build modern web applications from scratch'),
      icon: Code,
      color: 'from-cyan-500 to-blue-600',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      image:
        'https://images.unsplash.com/photo-1733412505442-36cfa59a4240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGRhcmslMjBzY3JlZW58ZW58MXx8fHwxNzcwNjcwMTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: t('16 周', '16 weeks'),
      students: '3,512',
      rating: 4.8,
      modules: [
        t('React 与 TypeScript 精通', 'React & TypeScript Mastery'),
        t('Node.js 与 Express 后端', 'Node.js & Express Backend'),
        t('数据库设计与 SQL', 'Database Design & SQL'),
        t('云部署与 CI/CD', 'Cloud Deployment & CI/CD'),
      ],
    },
    {
      id: 'machine-learning',
      title: t('机器学习', 'Machine Learning'),
      subtitle: t('从理论到生产级模型', 'From theory to production-ready models'),
      icon: Cpu,
      color: 'from-emerald-500 to-green-600',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      image:
        'https://images.unsplash.com/photo-1653564142048-d5af2cf9b50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBkYXRhJTIwc2NpZW5jZXxlbnwxfHx8fDE3NzA2NTcxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: t('14 周', '14 weeks'),
      students: '1,923',
      rating: 4.9,
      modules: [
        t('监督与无监督学习', 'Supervised & Unsupervised Learning'),
        t('特征工程', 'Feature Engineering'),
        t('模型优化', 'Model Optimization'),
        t('MLOps 与部署', 'MLOps & Deployment'),
      ],
    },
    {
      id: 'data-engineering',
      title: t('数据工程', 'Data Engineering'),
      subtitle: t('设计可扩展的数据流水线', 'Design scalable data pipelines'),
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      image:
        'https://images.unsplash.com/photo-1761740533449-b8d4385e60b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyYWwlMjBuZXR3b3JrJTIwYWJzdHJhY3QlMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc3MDc0ODU1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: t('10 周', '10 weeks'),
      students: '1,456',
      rating: 4.7,
      modules: [
        t('ETL 流水线架构', 'ETL Pipeline Architecture'),
        'Apache Spark & Hadoop',
        t('实时数据流处理', 'Real-time Data Streaming'),
        t('数据仓库设计', 'Data Warehouse Design'),
      ],
    },
    {
      id: 'robotics',
      title: t('机器人与物联网', 'Robotics & IoT'),
      subtitle: t('构建智能自主系统', 'Build intelligent autonomous systems'),
      icon: Layers,
      color: 'from-rose-500 to-pink-600',
      bgGlow: 'rgba(239, 68, 68, 0.12)',
      image:
        'https://images.unsplash.com/photo-1768323231757-35c50e087558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGVuZ2luZWVyaW5nJTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3NzA3NDg1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: t('18 周', '18 weeks'),
      students: '987',
      rating: 4.8,
      modules: [
        t('传感器集成', 'Sensor Integration'),
        t('运动规划', 'Motion Planning'),
        t('嵌入式系统', 'Embedded Systems'),
        t('机器人视觉', 'Computer Vision for Robotics'),
      ],
    },
    {
      id: 'cloud-native',
      title: t('云原生', 'Cloud Native'),
      subtitle: t('掌握现代云架构', 'Master modern cloud architecture'),
      icon: Globe,
      color: 'from-indigo-500 to-purple-600',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      image:
        'https://images.unsplash.com/photo-1764720573370-5008f1ccc9fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlZHVjYXRpb24lMjBjbGFzc3Jvb20lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MDY5MzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: t('12 周', '12 weeks'),
      students: '2,134',
      rating: 4.7,
      modules: [
        'Kubernetes & Docker',
        t('微服务架构', 'Microservices Architecture'),
        t('无服务器计算', 'Serverless Computing'),
        t('基础设施即代码', 'Infrastructure as Code'),
      ],
    },
  ];
}

/** 渐变边缘分隔样式 — 替代传统 border */
const glassEdge: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
};

const glassEdgeOverlay: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
};

export function CourseGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { t } = useLanguage();
  const courses = useCourses();

  /** 课程切换回调 */
  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (!expandedId) return;
      const currentIndex = courses.findIndex((c) => c.id === expandedId);
      if (currentIndex === -1) return;
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % courses.length
          : (currentIndex - 1 + courses.length) % courses.length;
      setExpandedId(courses[nextIndex].id);
    },
    [expandedId, courses]
  );

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      {/* Section header */}
      <motion.div
        className="max-w-6xl mx-auto mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p
          className="text-sm text-purple-400 mb-3 tracking-widest uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t('探索 & 发现', 'Explore & Discover')}
        </p>
        <h2
          className="text-3xl md:text-5xl text-white mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}
        >
          {t('交互式学习', 'Interactive Learning')}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {' '}
            {t('模块', 'Modules')}
          </span>
        </h2>
        <p className="text-white/40 max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
          {t(
            '点击展开模块详情，悬停预览。每张卡片都响应你的触控。',
            'Click any module to expand. Hover to preview. Each card responds to your touch.'
          )}
        </p>
      </motion.div>

      {/* Course grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
            isExpanded={expandedId === course.id}
            onToggle={() => setExpandedId(expandedId === course.id ? null : course.id)}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Expanded overlay */}
      <AnimatePresence mode="wait">
        {expandedId && (
          <CourseDetail
            key={expandedId}
            course={courses.find((c) => c.id === expandedId)!}
            courseIndex={courses.findIndex((c) => c.id === expandedId)}
            totalCourses={courses.length}
            onClose={() => setExpandedId(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

type CourseType = ReturnType<typeof useCourses>[0];

function CourseCard({
  course,
  index,
  isExpanded,
  onToggle,
  isInView,
}: {
  course: CourseType;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isInView: boolean;
}) {
  const Icon = course.icon;
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
    >
      <div
        className="relative overflow-hidden backdrop-blur-xl p-6 h-full transition-all duration-500"
        style={glassEdge}
      >
        {/* 边缘渐变 */}
        <div className="absolute inset-0 pointer-events-none" style={glassEdgeOverlay} />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${course.bgGlow}, transparent 70%)`,
          }}
        />

        {/* Image preview */}
        <div className="relative mb-5 overflow-hidden">
          <motion.div className="w-full h-40 overflow-hidden">
            <ImageWithFallback
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-20 group-hover:opacity-10 transition-opacity duration-500`}
          />

          {/* 扫描线 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.05) 50%, transparent 100%)',
              backgroundSize: '100% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '0% 200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 bg-gradient-to-br ${course.color}`}
              style={{
                background: `linear-gradient(135deg, ${course.bgGlow}, transparent)`,
              }}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h3
              className="text-white text-base"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {course.title}
            </h3>
          </div>

          <p className="text-white/40 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            {course.subtitle}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {course.students}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400/60" /> {course.rating}
            </span>
          </div>

          {/* Expand hint */}
          <motion.div
            className="absolute -right-1 -bottom-1 text-white/20 group-hover:text-white/50 transition-colors"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function CourseDetail({ course, courseIndex, totalCourses, onClose, onNavigate }: { course: CourseType; courseIndex: number; totalCourses: number; onClose: () => void; onNavigate: (direction: 'prev' | 'next') => void }) {
  const Icon = course.icon;
  const { t } = useLanguage();

  /** 手势拖拽关闭 */
  const dragY = useMotionValue(0);
  const dragOpacity = useTransform(dragY, [0, 200], [1, 0.3]);
  const dragScale = useTransform(dragY, [0, 200], [1, 0.92]);
  const backdropOpacity = useTransform(dragY, [0, 200], [0.7, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    /** 阈值：拖拽距离 > 100px 或 速度 > 500px/s */
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ opacity: backdropOpacity }}
      />

      {/* Detail panel — 手势拖拽关闭 */}
      <motion.div
        className="relative max-w-2xl w-full backdrop-blur-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,8,32,0.95) 0%, rgba(10,8,32,0.9) 100%)',
          y: dragY,
          opacity: dragOpacity,
          scale: dragScale,
        }}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 面板边缘光晕 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={glassEdgeOverlay}
        />

        {/* 顶部拖���手柄 — 替代 X 关闭按钮 */}
        <div className="relative flex justify-center pt-3 pb-1">
          <motion.div
            className="w-10 h-1"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* 手势提示 */}
        <motion.div
          className="flex items-center justify-center gap-1 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-3 h-3 text-white/15" />
          </motion.div>
          <span className="text-[9px] text-white/15" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t('向下滑动关闭', 'Swipe down to close')}
          </span>
        </motion.div>

        {/* Header image */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0820] via-transparent to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-20`} />
        </div>

        {/* Content */}
        <div className="p-8 -mt-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 bg-gradient-to-br ${course.color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2
                className="text-2xl text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {course.title}
              </h2>
              <p className="text-white/40 text-sm">{course.subtitle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-8 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {course.students} {t('名学员', 'students')}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" /> {course.rating}
            </span>
          </div>

          {/* Modules */}
          <p
            className="text-xs text-white/30 uppercase tracking-widest mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('课程模块', 'Course Modules')}
          </p>
          <div className="space-y-2">
            {course.modules.map((mod, i) => (
              <ModuleItem key={i} title={mod} index={i} color={course.color} />
            ))}
          </div>

          {/* Interactive enrollment zone */}
          <motion.div
            className="mt-8 relative overflow-hidden cursor-pointer group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative px-6 py-4 text-center">
              <p
                className="text-white text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t('轻触开启学习之旅', 'Tap to Begin Your Journey')}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {t('无需注册 — 立即开始学习', 'No enrollment needed — start learning now')}
              </p>
            </div>
          </motion.div>

          {/* 左右手势导航区域 — 无按钮 */}
          <div className="mt-6 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-1 cursor-pointer group/nav"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
            >
              <ChevronLeft className="w-3 h-3 text-white/20 group-hover/nav:text-white/50 transition-colors" />
              <span className="text-[10px] text-white/20 group-hover/nav:text-white/40 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {t('上一个', 'Previous')}
              </span>
            </motion.div>

            {/* 课程索引指示器 */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalCourses }).map((_, i) => (
                <div
                  key={i}
                  className="h-px transition-all duration-300"
                  style={{
                    width: i === courseIndex ? 16 : 6,
                    background:
                      i === courseIndex
                        ? 'linear-gradient(90deg, #7c3aed, #06b6d4)'
                        : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>

            <motion.div
              className="flex items-center gap-1 cursor-pointer group/nav"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
            >
              <span className="text-[10px] text-white/20 group-hover/nav:text-white/40 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {t('下一个', 'Next')}
              </span>
              <ChevronRight className="w-3 h-3 text-white/20 group-hover/nav:text-white/50 transition-colors" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModuleItem({ title, index, color }: { title: string; index: number; color: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center gap-3 px-4 py-3 cursor-pointer group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.3 }}
      whileHover={{ x: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background — 渐变替代边框 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative flex items-center gap-3 w-full">
        <div
          className={`w-6 h-6 flex items-center justify-center text-xs bg-gradient-to-br ${color} text-white/80`}
        >
          {index + 1}
        </div>
        <span
          className="text-white/70 text-sm flex-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {title}
        </span>
        <motion.div animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}>
          <ChevronRight className="w-3 h-3 text-white/40" />
        </motion.div>
      </div>
    </motion.div>
  );
}