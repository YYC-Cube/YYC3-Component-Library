import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();
  const { colors } = useTheme();

  const links = [
    { zh: '课程', en: 'Courses' },
    { zh: '学习路径', en: 'Learning Path' },
    { zh: '社区', en: 'Community' },
    { zh: '研究', en: 'Research' },
    { zh: '关于', en: 'About' },
  ];

  return (
    <footer ref={ref} className="relative py-20 px-6">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="inline-flex items-center gap-2 mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span
            className="text-xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: colors.textPrimary }}
          >
            YYC<span className="text-purple-400">³</span>
          </span>
        </motion.div>

        <p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ fontFamily: "'Inter', sans-serif", color: colors.textMuted }}
        >
          {t(
            '无边界教育体验。每一次交互都有意义，每一个手势都揭示新的可能。',
            'A borderless education experience. Every interaction is intentional. Every gesture reveals something new.'
          )}
        </p>

        {/* Interactive links */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {links.map((link) => (
            <motion.span
              key={link.en}
              className="text-sm cursor-pointer relative group"
              style={{ fontFamily: "'Inter', sans-serif", color: colors.textMuted }}
              whileHover={{ color: colors.textPrimary }}
              whileTap={{ scale: 0.95 }}
            >
              {t(link.zh, link.en)}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-500 group-hover:w-full transition-all duration-300" />
            </motion.span>
          ))}
        </div>

        <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: colors.textFaint }}>
          &copy; 2026 YYC³ {t('AI 智能教育中心。无界设计。', 'AI Intelligent Education Center. Designed without boundaries.')}
        </p>
      </motion.div>
    </footer>
  );
}