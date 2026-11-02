import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Brain,
  Code,
  Cpu,
  Database,
  Globe,
  Layers,
  Clock,
  Users,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

/**
 * 课程搜索/筛选面板
 * Ctrl+K / Cmd+K 全局唤出
 * 悬停触发区（顶部中央）
 * 大数据风格：实时匹配、高亮命中、智能推荐
 * 无按钮设计 — 打字即搜、点击即跳、ESC 即退
 */

interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration: string;
  students: string;
  rating: number;
  modules: string[];
  category: string;
}

function useCourseDatabase(): CourseData[] {
  const { t } = useLanguage();
  return useMemo(
    () => [
      {
        id: 'ai-fundamentals',
        title: t('AI 基础', 'AI Fundamentals'),
        subtitle: t('掌握人工智能的核心基础', 'Master the foundations of artificial intelligence'),
        icon: Brain,
        color: '#7c3aed',
        duration: t('12 周', '12 weeks'),
        students: '2,847',
        rating: 4.9,
        modules: [
          t('神经网络与深度学习', 'Neural Networks & Deep Learning'),
          t('自然语言处理', 'Natural Language Processing'),
          t('计算机视觉基础', 'Computer Vision Basics'),
          t('强化学习', 'Reinforcement Learning'),
        ],
        category: t('人工智能', 'Artificial Intelligence'),
      },
      {
        id: 'full-stack-dev',
        title: t('全栈开发', 'Full-Stack Development'),
        subtitle: t('从零构建现代 Web 应用', 'Build modern web applications from scratch'),
        icon: Code,
        color: '#06b6d4',
        duration: t('16 周', '16 weeks'),
        students: '3,512',
        rating: 4.8,
        modules: [
          t('React 与 TypeScript 精通', 'React & TypeScript Mastery'),
          t('Node.js 与 Express 后端', 'Node.js & Express Backend'),
          t('数据库设计与 SQL', 'Database Design & SQL'),
          t('云部署与 CI/CD', 'Cloud Deployment & CI/CD'),
        ],
        category: t('软件工程', 'Software Engineering'),
      },
      {
        id: 'machine-learning',
        title: t('机器学习', 'Machine Learning'),
        subtitle: t('从理论到生产级模型', 'From theory to production-ready models'),
        icon: Cpu,
        color: '#10b981',
        duration: t('14 周', '14 weeks'),
        students: '1,923',
        rating: 4.9,
        modules: [
          t('监督与无监督学习', 'Supervised & Unsupervised Learning'),
          t('特征工程', 'Feature Engineering'),
          t('模型优化', 'Model Optimization'),
          t('MLOps 与部署', 'MLOps & Deployment'),
        ],
        category: t('人工智能', 'Artificial Intelligence'),
      },
      {
        id: 'data-engineering',
        title: t('数据工程', 'Data Engineering'),
        subtitle: t('设计可扩展的数据流水线', 'Design scalable data pipelines'),
        icon: Database,
        color: '#f59e0b',
        duration: t('10 周', '10 weeks'),
        students: '1,456',
        rating: 4.7,
        modules: [
          t('ETL 流水线架构', 'ETL Pipeline Architecture'),
          'Apache Spark & Hadoop',
          t('实时数据流处理', 'Real-time Data Streaming'),
          t('数据仓库设计', 'Data Warehouse Design'),
        ],
        category: t('数据科学', 'Data Science'),
      },
      {
        id: 'robotics',
        title: t('机器人与物联网', 'Robotics & IoT'),
        subtitle: t('构建智能自主系统', 'Build intelligent autonomous systems'),
        icon: Layers,
        color: '#ef4444',
        duration: t('18 周', '18 weeks'),
        students: '987',
        rating: 4.8,
        modules: [
          t('传感器集成', 'Sensor Integration'),
          t('运动规划', 'Motion Planning'),
          t('嵌入式系统', 'Embedded Systems'),
          t('机器人视觉', 'Computer Vision for Robotics'),
        ],
        category: t('硬件工程', 'Hardware Engineering'),
      },
      {
        id: 'cloud-native',
        title: t('云原生', 'Cloud Native'),
        subtitle: t('掌握现代云架构', 'Master modern cloud architecture'),
        icon: Globe,
        color: '#6366f1',
        duration: t('12 周', '12 weeks'),
        students: '2,134',
        rating: 4.7,
        modules: [
          'Kubernetes & Docker',
          t('微服务架构', 'Microservices Architecture'),
          t('无服务器计算', 'Serverless Computing'),
          t('基础设施即代码', 'Infrastructure as Code'),
        ],
        category: t('软件工程', 'Software Engineering'),
      },
    ],
    [t]
  );
}

export function SearchPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();
  const courses = useCourseDatabase();

  /** 全局键盘快捷键 Ctrl+K / Cmd+K */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /** 打开时聚焦输入框 */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setActiveCategory(null);
    }
  }, [isOpen]);

  /** 分类提取 */
  const categories = useMemo(() => {
    const cats = new Set(courses.map((c) => c.category));
    return Array.from(cats);
  }, [courses]);

  /** 搜索匹配 — 全字段模糊匹配 */
  const results = useMemo(() => {
    let filtered = courses;

    if (activeCategory) {
      filtered = filtered.filter((c) => c.category === activeCategory);
    }

    if (!query.trim()) return filtered;

    const lowerQuery = query.toLowerCase();
    return filtered.filter((c) => {
      const searchable = [
        c.title,
        c.subtitle,
        c.category,
        c.duration,
        ...c.modules,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(lowerQuery);
    });
  }, [courses, query, activeCategory]);

  /** 高亮匹配文本 */
  const highlightMatch = useCallback(
    (text: string): React.ReactNode => {
      if (!query.trim()) return text;
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerText.indexOf(lowerQuery);
      if (index === -1) return text;

      return (
        <>
          {text.slice(0, index)}
          <span style={{ color: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.15)' }}>
            {text.slice(index, index + query.length)}
          </span>
          {text.slice(index + query.length)}
        </>
      );
    },
    [query]
  );

  /** 热门搜索词 */
  const trendingTerms = [
    t('深度学习', 'Deep Learning'),
    t('React', 'React'),
    t('机器学习', 'Machine Learning'),
    t('Kubernetes', 'Kubernetes'),
    t('数据流', 'Data Pipeline'),
  ];

  return (
    <>
      {/* 顶部触发区 — 悬停激活 */}
      <motion.div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        onHoverStart={() => setIsOpen(true)}
        onTap={() => setIsOpen(true)}
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl"
          style={{ background: colors.glassPanel }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: colors.glassEdge }} />
          <Search className="w-3.5 h-3.5 relative" style={{ color: colors.textMuted }} />
          <span
            className="text-xs relative"
            style={{
              color: colors.textMuted,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {t('搜索课程...', 'Search courses...')}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 relative"
            style={{
              color: colors.textFaint,
              background: colors.inputBg,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ⌘K
          </span>
        </motion.div>
      </motion.div>

      {/* 搜索面板叠加层 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* 背景 */}
            <motion.div
              className="absolute inset-0 backdrop-blur-md"
              style={{ backgroundColor: colors.backdropBg }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* 搜索面板主体 */}
            <motion.div
              className="relative w-full max-w-xl backdrop-blur-2xl overflow-hidden"
              style={{ background: colors.panelBg }}
              initial={{ scale: 0.95, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 面板边缘光晕 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: colors.glassEdge }}
              />

              {/* 搜索输入 */}
              <div className="relative flex items-center gap-3 px-6 py-4">
                <Search className="w-5 h-5 flex-shrink-0" style={{ color: colors.textMuted }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('输入关键词搜索课程、模块、技能...', 'Search courses, modules, skills...')}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                />
                {query && (
                  <motion.span
                    className="text-[10px] px-2 py-0.5 cursor-pointer"
                    style={{
                      color: colors.textMuted,
                      background: colors.inputBg,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuery('')}
                  >
                    {t('清除', 'Clear')}
                  </motion.span>
                )}
              </div>

              {/* 分隔线 */}
              <div className="h-px mx-4" style={{ background: colors.separator }} />

              {/* 分类筛选 */}
              <div className="px-6 py-3 flex items-center gap-2 overflow-x-auto">
                <span
                  className="text-[10px] flex-shrink-0 uppercase tracking-wider"
                  style={{
                    color: colors.textFaint,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {t('分类', 'Category')}
                </span>
                {categories.map((cat) => (
                  <motion.span
                    key={cat}
                    className="text-[11px] px-3 py-1 cursor-pointer whitespace-nowrap"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color:
                        activeCategory === cat ? '#7c3aed' : colors.textMuted,
                      background:
                        activeCategory === cat
                          ? 'rgba(124,58,237,0.12)'
                          : colors.inputBg,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat ? null : cat)
                    }
                  >
                    {cat}
                  </motion.span>
                ))}
              </div>

              {/* 分隔线 */}
              <div className="h-px mx-4" style={{ background: colors.separator }} />

              {/* 结果列表 */}
              <div className="max-h-[45vh] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="py-2">
                    {/* 结果计数 */}
                    <div className="px-6 py-1">
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{
                          color: colors.textFaint,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {results.length} {t('个结果', 'results')}
                      </span>
                    </div>

                    {results.map((course, i) => {
                      const Icon = course.icon;
                      return (
                        <motion.div
                          key={course.id}
                          className="px-6 py-3 cursor-pointer group flex items-start gap-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ backgroundColor: colors.glassHover, x: 2 }}
                          onClick={() => {
                            setIsOpen(false);
                            const el = document.getElementById('courses');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {/* 图标 */}
                          <div
                            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${course.color}20, ${course.color}08)`,
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: course.color }} />
                          </div>

                          {/* 信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p
                                className="text-sm truncate"
                                style={{
                                  color: colors.textPrimary,
                                  fontFamily: "'Space Grotesk', sans-serif",
                                }}
                              >
                                {highlightMatch(course.title)}
                              </p>
                              <span
                                className="text-[9px] px-1.5 py-0.5 flex-shrink-0"
                                style={{
                                  color: colors.textFaint,
                                  background: colors.inputBg,
                                }}
                              >
                                {course.category}
                              </span>
                            </div>
                            <p
                              className="text-xs truncate mb-1"
                              style={{
                                color: colors.textMuted,
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {highlightMatch(course.subtitle)}
                            </p>

                            {/* 元数据 */}
                            <div className="flex items-center gap-3 text-[10px]" style={{ color: colors.textFaint }}>
                              <span className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {course.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" /> {course.students}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5" style={{ color: '#f59e0b' }} /> {course.rating}
                              </span>
                            </div>

                            {/* 匹配的模块高亮 */}
                            {query.trim() &&
                              course.modules
                                .filter((m) => m.toLowerCase().includes(query.toLowerCase()))
                                .slice(0, 2)
                                .map((mod, mi) => (
                                  <div
                                    key={mi}
                                    className="mt-1 text-[10px] flex items-center gap-1"
                                    style={{ color: colors.textMuted }}
                                  >
                                    <span style={{ color: '#7c3aed' }}>→</span>
                                    {highlightMatch(mod)}
                                  </div>
                                ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p
                      className="text-sm mb-1"
                      style={{
                        color: colors.textMuted,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {t('未找到匹配课程', 'No matching courses found')}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: colors.textFaint,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {t('尝试其他关键词或调整分类筛选', 'Try different keywords or adjust category filters')}
                    </p>
                  </div>
                )}
              </div>

              {/* 底部热门搜索 */}
              <div className="px-6 py-3" style={{ borderTop: `1px solid ${colors.separator}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-3 h-3" style={{ color: colors.textFaint }} />
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{
                      color: colors.textFaint,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {t('热门搜索', 'Trending')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trendingTerms.map((term) => (
                    <motion.span
                      key={term}
                      className="text-[10px] px-2 py-1 cursor-pointer"
                      style={{
                        color: colors.textMuted,
                        background: colors.inputBg,
                        fontFamily: "'Inter', sans-serif",
                      }}
                      whileHover={{
                        color: '#7c3aed',
                        background: 'rgba(124,58,237,0.1)',
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuery(term)}
                    >
                      {term}
                    </motion.span>
                  ))}
                </div>

                {/* 快捷键提示 */}
                <p
                  className="text-[8px] mt-3 text-center"
                  style={{
                    color: colors.textFaint,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  ESC {t('关闭', 'close')} · ⌘K {t('唤出', 'toggle')} · {t('输入即搜', 'type to search')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
