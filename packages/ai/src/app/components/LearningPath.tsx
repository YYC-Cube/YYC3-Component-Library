import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Sparkles, CheckCircle2, Lock, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface PathNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  skills: string[];
  duration: string;
  progress?: number;
}

function usePathNodes(): PathNode[] {
  const { t } = useLanguage();
  return [
    {
      id: 'foundations',
      title: t('基础入门', 'Foundations'),
      description: t(
        '掌握编程基础、数据结构与算法',
        'Master programming basics, data structures, and algorithms'
      ),
      status: 'completed',
      skills: ['Python', t('数据结构', 'Data Structures'), t('算法', 'Algorithms'), 'Git'],
      duration: t('4 周', '4 weeks'),
      progress: 100,
    },
    {
      id: 'mathematics',
      title: t('AI 数学', 'Mathematics for AI'),
      description: t(
        '线性代数、微积分、概率与统计',
        'Linear algebra, calculus, probability and statistics'
      ),
      status: 'completed',
      skills: [
        t('线性代数', 'Linear Algebra'),
        t('微积分', 'Calculus'),
        t('概率论', 'Probability'),
        t('统计学', 'Statistics'),
      ],
      duration: t('6 周', '6 weeks'),
      progress: 100,
    },
    {
      id: 'ml-basics',
      title: t('机器学习基础', 'Machine Learning Basics'),
      description: t(
        '监督学习、模型评估、特征工程',
        'Supervised learning, model evaluation, feature engineering'
      ),
      status: 'current',
      skills: [
        t('回归', 'Regression'),
        t('分类', 'Classification'),
        t('聚类', 'Clustering'),
        t('评估', 'Evaluation'),
      ],
      duration: t('8 周', '8 weeks'),
      progress: 65,
    },
    {
      id: 'deep-learning',
      title: t('深度学习', 'Deep Learning'),
      description: t(
        '神经网络、CNN、RNN、Transformer 架构',
        'Neural networks, CNNs, RNNs, transformers architecture'
      ),
      status: 'locked',
      skills: [t('神经网络', 'Neural Networks'), 'CNN', 'RNN', 'Transformers'],
      duration: t('10 周', '10 weeks'),
      progress: 0,
    },
    {
      id: 'nlp',
      title: t('自然语言处理', 'Natural Language Processing'),
      description: t(
        '文本处理、情感分析、语言模型',
        'Text processing, sentiment analysis, language models'
      ),
      status: 'locked',
      skills: [
        t('分词', 'Tokenization'),
        t('词嵌入', 'Embeddings'),
        t('注意力机制', 'Attention'),
        t('微调', 'Fine-tuning'),
      ],
      duration: t('8 周', '8 weeks'),
      progress: 0,
    },
    {
      id: 'production',
      title: t('生产级 ML', 'Production ML'),
      description: t(
        '部署模型、监控、扩展、MLOps 实践',
        'Deploy models, monitoring, scaling, MLOps practices'
      ),
      status: 'locked',
      skills: ['Docker', 'Kubernetes', 'CI/CD', t('监控', 'Monitoring')],
      duration: t('6 周', '6 weeks'),
      progress: 0,
    },
  ];
}

export function LearningPath() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { t } = useLanguage();
  const pathNodes = usePathNodes();

  /** 总体进度计算 */
  const totalProgress = Math.round(
    pathNodes.reduce((sum, n) => sum + (n.progress || 0), 0) / pathNodes.length
  );

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent pointer-events-none" />

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <p
            className="text-sm text-cyan-400 mb-3 tracking-widest uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t('你的旅程', 'Your Journey')}
          </p>
          <h2
            className="text-3xl md:text-5xl text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}
          >
            {t('学习', 'Learning')}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {' '}
              {t('路径', 'Path')}
            </span>
          </h2>
          <p
            className="text-white/40 max-w-lg mx-auto mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t(
              '点击节点探索。你的进度随每个阶段的完成自然展开。',
              'Tap any node to explore. Your progress unfolds naturally as you complete each stage.'
            )}
          </p>

          {/* 总进度条 */}
          <motion.div
            className="max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] text-white/30 uppercase tracking-wider"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t('总体进度', 'Overall Progress')}
              </span>
              <span
                className="text-xs text-cyan-400"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {totalProgress}%
              </span>
            </div>
            <div
              className="h-px w-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                }}
                initial={{ width: '0%' }}
                animate={isInView ? { width: `${totalProgress}%` } : {}}
                transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Path timeline */}
        <div className="relative">
          {/* Vertical line — 渐变进度线 */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px overflow-hidden">
            {/* 背景线 */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-white/5 to-white/3" />

            {/* 进度线 — 已完成区段发光 */}
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{
                background: 'linear-gradient(180deg, #7c3aed, #06b6d4)',
              }}
              initial={{ height: '0%' }}
              animate={isInView ? { height: '44%' } : {}}
              transition={{ duration: 2, delay: 0.3 }}
            />

            {/* 进度线发光 */}
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{
                background: 'linear-gradient(180deg, #7c3aed, #06b6d4)',
                filter: 'blur(3px)',
                width: 3,
                marginLeft: -1,
              }}
              initial={{ height: '0%' }}
              animate={isInView ? { height: '44%' } : {}}
              transition={{ duration: 2, delay: 0.3 }}
            />
          </div>

          {/* 流动粒子（完成区段） */}
          <TimelineParticles isInView={isInView} />

          {pathNodes.map((node, index) => (
            <PathNodeCard
              key={node.id}
              node={node}
              index={index}
              isInView={isInView}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/**
 * 时间线上流动的微粒
 */
function TimelineParticles({ isInView }: { isInView: boolean }) {
  if (!isInView) return null;

  return (
    <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 pointer-events-none" style={{ height: '44%' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 -translate-x-1/2 w-1 h-1"
          style={{
            background: 'linear-gradient(180deg, #7c3aed, #06b6d4)',
          }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function PathNodeCard({
  node,
  index,
  isInView,
  isLeft,
}: {
  node: PathNode;
  index: number;
  isInView: boolean;
  isLeft: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      textColor: 'text-emerald-400',
      label: t('已完成', 'Completed'),
    },
    current: {
      icon: Zap,
      dotColor: 'bg-purple-500',
      glowColor: 'rgba(124, 58, 237, 0.4)',
      textColor: 'text-purple-400',
      label: t('进行中', 'In Progress'),
    },
    locked: {
      icon: Lock,
      dotColor: 'bg-white/20',
      glowColor: 'transparent',
      textColor: 'text-white/30',
      label: t('未解锁', 'Locked'),
    },
  };

  const config = statusConfig[node.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      className={`relative flex items-start mb-12 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-row`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Timeline dot */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className={`w-12 h-12 ${config.dotColor} flex items-center justify-center cursor-pointer relative`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(!expanded)}
        >
          {/* 光晕动画 */}
          {node.status !== 'locked' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
              }}
              animate={
                node.status === 'current'
                  ? { scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }
                  : {}
              }
              transition={
                node.status === 'current' ? { duration: 2, repeat: Infinity } : {}
              }
            />
          )}
          <StatusIcon className="w-5 h-5 text-white relative" />
        </motion.div>
      </div>

      {/* Content card */}
      <div
        className={`ml-20 md:ml-0 ${
          isLeft ? 'md:mr-[calc(50%+2rem)] md:pr-8' : 'md:ml-[calc(50%+2rem)] md:pl-8'
        } flex-1`}
      >
        <motion.div
          className={`relative backdrop-blur-xl p-6 cursor-pointer group ${
            node.status === 'locked' ? 'opacity-50' : ''
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
          }}
          whileHover={node.status !== 'locked' ? { y: -2 } : {}}
          whileTap={node.status !== 'locked' ? { scale: 0.98 } : {}}
          onClick={() => node.status !== 'locked' && setExpanded(!expanded)}
        >
          {/* 边缘光晕 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
            }}
          />

          {/* Glow for current */}
          {node.status === 'current' && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 pointer-events-none" />
          )}

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs ${config.textColor} uppercase tracking-wider`}>
                  {config.label}
                </span>
                {node.status === 'current' && (
                  <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                )}
              </div>
              <span className="text-xs text-white/20">{node.duration}</span>
            </div>

            <h3
              className="text-white text-lg mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {node.title}
            </h3>
            <p className="text-white/40 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              {node.description}
            </p>

            {/* 节点进度条 */}
            {node.status !== 'locked' && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/20">{t('进度', 'Progress')}</span>
                  <span
                    className="text-[10px]"
                    style={{ color: node.status === 'completed' ? '#10b981' : '#7c3aed' }}
                  >
                    {node.progress}%
                  </span>
                </div>
                <div
                  className="h-px w-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    className="h-full"
                    style={{
                      background:
                        node.status === 'completed'
                          ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                          : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                    }}
                    initial={{ width: '0%' }}
                    animate={isInView ? { width: `${node.progress}%` } : {}}
                    transition={{ duration: 1.5, delay: index * 0.2 + 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Expand indicator */}
            {node.status !== 'locked' && (
              <motion.div
                className="mt-3 flex items-center gap-1 text-xs text-white/20 group-hover:text-white/40 transition-colors"
                animate={{ y: expanded ? 0 : [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: expanded ? 0 : Infinity }}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> {t('收起', 'Collapse')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> {t('轻触查看技能', 'Tap to see skills')}
                  </>
                )}
              </motion.div>
            )}

            {/* Expanded skills */}
            <motion.div
              initial={false}
              animate={{
                height: expanded ? 'auto' : 0,
                opacity: expanded ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-wrap gap-2">
                {node.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1 text-xs text-white/60"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={expanded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{
                      backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
