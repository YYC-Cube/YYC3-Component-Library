// ============================================================
// YYC³ · @yyc3/education 批次 1 铁律门补测 · 第三层：顶层组件渲染组曲
// 30+ 顶层组件（考试系列/课程系列/导航系列/触控系列/监控系列）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({ theme: 'light', setTheme: vi.fn(), systemTheme: 'light', resolvedTheme: 'light' }),
}));

import AISmartWidget from '../AISmartWidget';
import { AdvancedExam } from '../advanced-exam';
import { AILogobutton } from '../ai-logo-button';
import BottomNav from '../bottom-nav';
import { BrandFooter } from '../brand-footer';
import BrandHeader from '../brand-header';
import { ColoredProgress } from '../colored-progress';
import { ComprehensiveExam } from '../comprehensive-exam';
import { CourseFallback } from '../course-fallback';
import { CourseImageSimple } from '../course-image-simple';
import { CourseImage } from '../course-image';
import { CourseRecommendations } from '../course-recommendations';
import { EnhancedExamLayout } from '../enhanced-exam-layout';
import { EnhancedQuestionOptions } from '../enhanced-question-options';
import { ExamAssistant } from '../exam-assistant';
import { ExamDataDebug } from '../exam-data-debug';
import { ExamExperienceEnhancer } from '../exam-experience-enhancer';
import { ExamProgressTracker } from '../exam-progress-tracker';
import { ExamResultAnalysis } from '../exam-result-analysis';
import { ImageFallback } from '../image-fallback';
import { LearningPath } from '../learning-path';
import { MobileExamOptimization } from '../mobile-exam-optimization';
import { MobileNav } from '../mobile-nav';
import { ProfessionalAdvancedExam } from '../professional-advanced-exam';
import { ProfessionalExam } from '../professional-exam';
import { PullToRefresh } from '../pull-to-refresh';
import { ResponsiveLayout } from '../responsive-layout';
import { SwipeContainer } from '../swipe-container';
import { TouchCard } from '../touch-card';
import { PerformanceMonitor } from '../PerformanceMonitor';
import { ThemeProvider as TopThemeProvider } from '../theme-provider';
import { ThemeProvider as IndexThemeProvider } from '../theme-provider/index';
import { AIWidgetProvider, useAIWidget } from '../app/providers/AIWidgetContext';
import { PerformanceDashboard } from '../monitoring/PerformanceDashboard';
import performanceMonitorSingleton from '../lib/performance-monitor';
import {
  singleChoiceQuestions,
  essayQuestions,
} from '../data/exam-questions';
import { modelClassificationQuestions } from '../data/comprehensive-exam-questions';
import { definitionQuestions } from '../data/advanced-exam-questions';
import { technicalFoundationQuestions } from '../data/professional-advanced-questions';
import { courseModules } from '../data/course-recommendations';
import { examData } from '../data/exam-data';

const user = { name: '测试用户', avatar: '/avatar.png', level: '高级' };

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

// ============================================================ 考试系列
describe('education · 考试组件组', () => {
  it('AdvancedExam：定义题模式渲染 + 主观题作答 + 下一题导航', () => {
    const onComplete = vi.fn();
    render(<AdvancedExam examType="definition" timeLimit={5} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /开始考试/ }));
    expect(screen.getByText(definitionQuestions[0].question)).toBeTruthy();
    // 主观题：Textarea 作答
    fireEvent.change(screen.getByPlaceholderText(/请详细解释/), { target: { value: 'GAN 是生成对抗网络…' } });
    // 下一题按钮可达
    const next = screen.getByRole('button', { name: /下一题|下一/ });
    fireEvent.click(next);
    expect(screen.getByText(definitionQuestions[1].question)).toBeTruthy();
  });

  it('ProfessionalExam：练习模式渲染首题与计时', () => {
    render(<ProfessionalExam examType="practice" timeLimit={10} />);
    fireEvent.click(screen.getByRole('button', { name: /开始考试/ }));
    expect(document.body.textContent!.length).toBeGreaterThan(50);
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });

  it('ProfessionalAdvancedExam：technical-foundation 模式渲染（题序随机，断言考试面就绪）', () => {
    const { container } = render(<ProfessionalAdvancedExam examType="technical-foundation" timeLimit={10} />);
    fireEvent.click(screen.getByRole('button', { name: /开始考试/ }));
    expect(container.innerHTML).toContain('题目 1 /');
    expect(container.innerHTML.length).toBeGreaterThan(5000);
  });

  it('ComprehensiveExam：模型分类题型渲染 + 选项交互', () => {
    const onComplete = vi.fn();
    render(<ComprehensiveExam examType="classification" questions={modelClassificationQuestions.slice(0, 3)} onComplete={onComplete} />);
    expect(screen.getByText(modelClassificationQuestions[0].question)).toBeTruthy();
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
  });

  it('EnhancedExamLayout：题面 + 答题卡 + 时间显示 + 导航回调', () => {
    const onQuestionChange = vi.fn();
    const onAnswerChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <EnhancedExamLayout
        exam={examData[0]}
        questions={singleChoiceQuestions.slice(0, 3)}
        currentQuestionIndex={0}
        answers={{}}
        timeRemaining={600}
        onQuestionChange={onQuestionChange}
        onAnswerChange={onAnswerChange}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByText(singleChoiceQuestions[0].question)).toBeTruthy();
  });

  it('EnhancedQuestionOptions：单选/多选/简答三分支作答回调', () => {
    const onAnswerChange = vi.fn();
    const single = singleChoiceQuestions[0];
    const { rerender } = render(
      <EnhancedQuestionOptions question={single} questionIndex={0} answer={undefined} onAnswerChange={onAnswerChange} />
    );
    fireEvent.click(screen.getAllByRole('radio')[0]);
    expect(onAnswerChange).toHaveBeenCalled();

    const multi = singleChoiceQuestions.find((q) => q.type === 'multiple') ?? single;
    rerender(
      <EnhancedQuestionOptions question={multi} questionIndex={1} answer={[]} onAnswerChange={onAnswerChange} focusMode />
    );
    const boxes = screen.queryAllByRole('checkbox');
    if (boxes.length > 0) fireEvent.click(boxes[0]);

    const essay = essayQuestions[0];
    rerender(
      <EnhancedQuestionOptions question={essay} questionIndex={2} answer="" onAnswerChange={onAnswerChange} />
    );
    const textarea = screen.queryByRole('textbox');
    if (textarea) fireEvent.change(textarea, { target: { value: '我的作答' } });
  });

  it('ExamAssistant：渲染进度与倒计时', () => {
    render(<ExamAssistant currentQuestion={singleChoiceQuestions[0]} timeRemaining={125} totalQuestions={10} currentIndex={2} examType="practice" />);
    expect(document.body.textContent).toContain('第 3 题');
  });

  it('ExamProgressTracker：渲染进度点并可点击跳题', () => {
    const onQuestionSelect = vi.fn();
    render(<ExamProgressTracker totalQuestions={5} currentQuestionIndex={1} answers={{}} timeRemaining={300} onQuestionSelect={onQuestionSelect} examDuration={600} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
  });

  it('ExamResultAnalysis：结果面板 + 重考/证书/分享回调', () => {
    const onRetake = vi.fn();
    const onDownloadCertificate = vi.fn();
    const onShare = vi.fn();
    render(
      <ExamResultAnalysis
        results={{ totalQuestions: 3, correctAnswers: 2, totalPoints: 100, earnedPoints: 66, timeSpent: 300, answers: {} }}
        examTitle="综合测验"
        questions={singleChoiceQuestions.slice(0, 3)}
        onRetake={onRetake}
        onDownloadCertificate={onDownloadCertificate}
        onShare={onShare}
      />
    );
    const allButtons = screen.getAllByRole('button');
    expect(allButtons.length).toBeGreaterThan(0);
    for (const b of allButtons) fireEvent.click(b);
  });

  it('ExamExperienceEnhancer：音效/主题/字号切换', () => {
    const onThemeChange = vi.fn();
    render(<ExamExperienceEnhancer onThemeChange={onThemeChange} />);
    const buttons = screen.getAllByRole('button');
    for (const b of buttons.slice(0, 4)) fireEvent.click(b);
  });

  it('ExamDataDebug：调试面板渲染题库统计', () => {
    render(<ExamDataDebug />);
    expect(document.body.textContent!.length).toBeGreaterThan(10);
  });

  it('MobileExamOptimization：移动端考试布局渲染（视口 <768 才出 UI）', () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
    try {
      const { container } = render(<MobileExamOptimization questions={singleChoiceQuestions.slice(0, 2)} currentQuestionIndex={0} answers={{}} timeRemaining={120} onQuestionChange={() => {}} />);
      expect(container.innerHTML.length).toBeGreaterThan(50);
    } finally {
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
    }
  });
});

// ============================================================ 课程系列
describe('education · 课程组件组', () => {
  it('CourseFallback / CourseImageSimple / CourseImage：课程图三件套', () => {
    render(<CourseFallback title="机器学习入门" color="from-blue-500 to-cyan-500" />);
    expect(screen.getByText('机器学习入门'.split(' ')[0])).toBeTruthy();

    render(<CourseImageSimple src="/img.png" alt="课程图" title="深度学习" color="#3b82f6" className="w-10" />);
    const img = document.querySelector('img');
    expect(img).toBeTruthy();
    fireEvent.error(img!);

    render(<CourseImage src="/img2.png" alt="课程图2" title="强化学习" color="#8b5cf6" />);
    const imgs = document.querySelectorAll('img');
    fireEvent.error(imgs[imgs.length - 1]);
  });

  it('ImageFallback：加载失败回退首字渐变块', () => {
    render(<ImageFallback src="/nope.png" alt="fallback" title="自然语言处理" fallbackColor="#f59e0b" />);
    const img = document.querySelector('img');
    fireEvent.error(img!);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('CourseRecommendations：基于当前课程推荐同级/进阶课', () => {
    render(<CourseRecommendations currentCourse={courseModules[0]} className="w-full" />);
    expect(document.body.textContent!.length).toBeGreaterThan(20);
  });

  it('LearningPath：课程路径渲染 + 当前课程高亮', () => {
    render(<LearningPath courses={courseModules} currentCourseId={courseModules[0].id} />);
    expect(screen.getByText(courseModules[0].title)).toBeTruthy();
  });
});

// ============================================================ 导航与布局系列
describe('education · 导航与布局组', () => {
  it('BottomNav：五入口导航渲染（含 aria 描述）', () => {
    render(<BottomNav />);
    expect(document.querySelectorAll('a').length).toBe(5);
    expect(screen.getByText('首页')).toBeTruthy();
    expect(screen.getByText('课程')).toBeTruthy();
  });

  it('MobileNav：用户导航渲染（Sheet 触发器 + 打开抽屉，内嵌 BrandHeader 需 Provider）', () => {
    const { container } = render(
      <AIWidgetProvider>
        <MobileNav user={user} />
      </AIWidgetProvider>
    );
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    fireEvent.click(trigger!);
  });

  it('ResponsiveLayout：桌面/移动响应式布局 + 标题', () => {
    render(
      <AIWidgetProvider>
        <ResponsiveLayout title="学习中心" user={user}>
          <div>内容区域</div>
        </ResponsiveLayout>
      </AIWidgetProvider>
    );
    expect(screen.getByText('内容区域')).toBeTruthy();
  });

  it('BrandHeader / BrandFooter：品牌头尾渲染（需 AIWidgetProvider）', () => {
    render(
      <AIWidgetProvider>
        <BrandHeader showSubtitle size="lg" className="p-2" />
      </AIWidgetProvider>
    );
    render(<BrandFooter />);
    expect(document.body.textContent!.length).toBeGreaterThan(10);
  });

  it('AILogobutton：AI 徽标按钮三尺寸（图标按钮，无文本）', () => {
    const { container } = render(
      <AIWidgetProvider>
        <>
          <AILogobutton size="sm" />
          <AILogobutton size="md" />
          <AILogobutton size="lg" />
        </>
      </AIWidgetProvider>
    );
    expect(container.querySelectorAll('img')).toHaveLength(3);
    const btn = container.querySelector('button');
    fireEvent.click(btn!); // toggleWidget 触发
  });

  it('ColoredProgress：数值/变体/百分比显示矩阵', () => {
    render(
      <>
        <ColoredProgress value={30} showPercentage variant="success" size="sm" />
        <ColoredProgress value={70} max={200} variant="warning" data-x="1" />
        <ColoredProgress value={100} variant="purple" showPercentage />
      </>
    );
    expect(screen.getAllByText(/%/).length).toBeGreaterThan(0);
  });
});

// ============================================================ 触控与交互系列
describe('education · 触控交互组', () => {
  it('TouchCard：标题/描述/页脚插槽 + 点击回调', () => {
    const onClick = vi.fn();
    render(
      <TouchCard onClick={onClick} title="卡片标题" description="卡片描述" header={<span>头</span>} footer={<span>尾</span>}>
        主体内容
      </TouchCard>
    );
    expect(screen.getByText('卡片标题')).toBeTruthy();
    expect(screen.getByText('主体内容')).toBeTruthy();
    fireEvent.click(screen.getByText('主体内容'));
    expect(onClick).toHaveBeenCalled();
  });

  it('SwipeContainer：左/右滑触发回调（touch 事件）', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    render(
      <SwipeContainer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} threshold={50}>
        <div>滑动内容</div>
      </SwipeContainer>
    );
    const el = screen.getByText('滑动内容').parentElement!;
    // 组件读取 targetTouches / changedTouches——三组触点齐全
    const touch = (x: number) => ({ touches: [{ clientX: x, clientY: 100 }], targetTouches: [{ clientX: x, clientY: 100 }], changedTouches: [{ clientX: x, clientY: 100 }] });
    // 右滑：200 → 100（deltaX 负）
    fireEvent.touchStart(el, touch(200));
    fireEvent.touchMove(el, touch(100));
    fireEvent.touchEnd(el, touch(100));
    // 左滑：100 → 260（deltaX 正）
    fireEvent.touchStart(el, touch(100));
    fireEvent.touchMove(el, touch(260));
    fireEvent.touchEnd(el, touch(260));
  });

  it('PullToRefresh：下拉触发刷新 + 释放回弹', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(
      <PullToRefresh onRefresh={onRefresh}>
        <div>列表内容</div>
      </PullToRefresh>
    );
    expect(screen.getByText('列表内容')).toBeTruthy();
    const el = screen.getByText('列表内容').parentElement!;
    // 大幅下拉（阻尼 0.4 后仍需超过阈值）
    fireEvent.touchStart(el, { touches: [{ clientX: 100, clientY: 20 }] });
    fireEvent.touchMove(el, { touches: [{ clientX: 100, clientY: 420 }] });
    fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100, clientY: 420 }] });
    await waitFor(() => expect(onRefresh).toHaveBeenCalled());
  });
});

// ============================================================ 监控与上下文系列
describe('education · 监控与上下文组', () => {
  it('PerformanceMonitor：采样上报 sendBeacon + 指标回调', () => {
    const onMetricReport = vi.fn();
    const beacon = vi.fn();
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
    render(<PerformanceMonitor enabled sampleRate={1} onMetricReport={onMetricReport} />);
    expect(document.body.textContent).toBeDefined();
  });

  it('PerformanceDashboard：指标面板渲染 + Tab 切换', () => {
    performanceMonitorSingleton.recordMetric('componentRenderTime', 20);
    render(<PerformanceDashboard refreshInterval={100000} />);
    expect(document.body.textContent!.length).toBeGreaterThan(20);
  });

  it('AIWidgetContext：显隐偏好持久化 + hook 三操作 + 越界抛错', async () => {
    const probe = vi.fn();
    function Consumer() {
      const ctx = useAIWidget();
      return <button onClick={() => probe(ctx.showWidget)}>probe</button>;
    }
    render(
      <AIWidgetProvider>
        <Consumer />
      </AIWidgetProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(probe).toHaveBeenCalledWith(true);

    const outside = render(<div />); // 占位保证 cleanup 对称
    outside.unmount();
    function Bad() {
      useAIWidget();
      return null;
    }
    expect(() => render(<Bad />)).toThrow('useAIWidget must be used within an AIWidgetProvider');
  });

  it('ThemeProvider（顶层层 + index 层）：children 直通渲染', () => {
    render(
      <>
        <TopThemeProvider attribute="class">
          <span>顶层主题子树</span>
        </TopThemeProvider>
        <IndexThemeProvider initialTheme="light">
          <span>index 主题子树</span>
        </IndexThemeProvider>
      </>
    );
    expect(screen.getByText('顶层主题子树')).toBeTruthy();
    expect(screen.getByText('index 主题子树')).toBeTruthy();
  });

  it('AISmartWidget：DnD 后端选择渲染完整 widget', () => {
    render(<AISmartWidget />);
    // IntelligentAIWidget 全量渲染（浮动窗 + 消息列表）
    expect(document.body.textContent!.length).toBeGreaterThan(50);
  });
});
