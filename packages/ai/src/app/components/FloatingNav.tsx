import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  const { colors } = useTheme();

  const sections = [
    { id: 'hero', label: t('首页', 'Home') },
    { id: 'courses', label: t('课程', 'Courses') },
    { id: 'path', label: t('路径', 'Path') },
    { id: 'interactions', label: t('交互', 'Interactions') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);

      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
        >
          {sections.map((section) => (
            <motion.div
              key={section.id}
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => scrollTo(section.id)}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Label */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="text-xs transition-colors whitespace-nowrap"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: colors.textMuted,
                    }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    {section.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Dot — 保留圆形（导航点是功能性的，非装饰性边界） */}
              <div className="relative">
                <div
                  className={`w-2 h-2 transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-purple-500 scale-125'
                      : 'bg-white/20 group-hover:bg-white/50'
                  }`}
                />
                {activeSection === section.id && (
                  <motion.div
                    className="absolute inset-0 bg-purple-500"
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}