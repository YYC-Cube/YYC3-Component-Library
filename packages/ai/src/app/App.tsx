import { LanguageProvider } from './components/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { SearchPanel } from './components/SearchPanel';
import { ParticleField } from './components/ParticleField';
import { HolographicHUD } from './components/HolographicHUD';
import { GestureNavigator } from './components/GestureNavigator';
import { AIAssistantOrb } from './components/AIAssistantOrb';
import { HeroSection } from './components/HeroSection';
import { CourseGrid } from './components/CourseGrid';
import { LearningPath } from './components/LearningPath';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { StatsSection } from './components/StatsSection';
import { FloatingNav } from './components/FloatingNav';
import { Footer } from './components/Footer';

/**
 * 主题感知容器 — 根据当前主题动态设置页面背景
 */
function ThemedApp() {
  const { colors } = useTheme();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden transition-colors duration-700"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: colors.pageBg,
      }}
    >
      {/* Interactive particle background */}
      <ParticleField />

      {/* 全息 HUD 视觉层 */}
      <HolographicHUD />

      {/* 主题切换器 — 手势驱动 */}
      <ThemeSwitcher />

      {/* Language switcher — hover/tap to toggle */}
      <LanguageSwitcher />

      {/* 全局搜索面板 — ⌘K 唤出 */}
      <SearchPanel />

      {/* 上下文感知导航 — 手势/键盘 */}
      <GestureNavigator />

      {/* AI 助手浮窗 */}
      <AIAssistantOrb />

      {/* Floating navigation dots */}
      <FloatingNav />

      {/* Hero Section */}
      <div id="hero">
        <HeroSection />
      </div>

      {/* Stats */}
      <StatsSection />

      {/* Courses Section */}
      <div id="courses">
        <CourseGrid />
      </div>

      {/* Learning Path */}
      <div id="path">
        <LearningPath />
      </div>

      {/* Interactive Showcase */}
      <div id="interactions">
        <InteractiveShowcase />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ThemedApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
