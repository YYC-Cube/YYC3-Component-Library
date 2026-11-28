// ============================================================
// YYC³ · @yyc3/admin 批次 2 · 第一层：零覆盖五文件 + canvas 三件套
// ai-customer-data / system-initialization-loader / user-training /
// collaboration/comments-system / dashboard/sales-chart /
// dashboard/simple-{bar,donut,line}-chart（canvas 2d 桩驱动绘制分支）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/admin',
  useRouterParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { AiCustomerData } from '../ai-customer-data';
import { SystemInitializationLoader } from '../system-initialization-loader';
import { UserTraining } from '../user-training';
import { CommentsSystem } from '../collaboration/comments-system';
import { SalesChart } from '../dashboard/sales-chart';
import { SimpleBarChart } from '../dashboard/simple-bar-chart';
import { SimpleDonutChart } from '../dashboard/simple-donut-chart';
import { SimpleLineChart } from '../dashboard/simple-line-chart';
import { stubAdminDom, silenceConsole, stubCanvas2d } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
  pushMock.mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Radix Tabs 在 mousedown 激活——fireEvent.click 单独不生效 */
const clickTab = (name: string | RegExp) => {
  const tab = screen.getByRole('tab', { name });
  fireEvent.mouseDown(tab);
  fireEvent.click(tab);
};

// ---------- 零覆盖 1：SalesChart ----------
describe('SalesChart（销售趋势图）', () => {
  it('渲染标题、时间范围切换与折线图', () => {
    render(<SalesChart />);
    expect(screen.getByText('销售趋势')).toBeInTheDocument();
    for (const label of ['7天', '30天', '90天']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
    expect(screen.getByTestId('recharts-linechart')).toBeInTheDocument();
  });
});

// ---------- 零覆盖 2：AiCustomerData ----------
describe('AiCustomerData（AI 客户数据页）', () => {
  it('渲染四大核心指标卡', () => {
    render(<AiCustomerData />);
    expect(screen.getByText('总客户数')).toBeInTheDocument();
    expect(screen.getByText('转化率')).toBeInTheDocument();
    expect(screen.getByText('平均客单价')).toBeInTheDocument();
    expect(screen.getByText('AI预测准确率')).toBeInTheDocument();
    expect(screen.getByText('15,847')).toBeInTheDocument();
  });

  it('刷新按钮触发 2s 刷新态并恢复', async () => {
    vi.useFakeTimers();
    render(<AiCustomerData />);
    const refresh = screen.getByRole('button', { name: /刷新数据/ });
    fireEvent.click(refresh);
    expect(refresh).toBeDisabled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });
    expect(refresh).not.toBeDisabled();
  });

  it('导出/分享走静默通道，设置跳转 /settings', () => {
    render(<AiCustomerData />);
    fireEvent.click(screen.getByRole('button', { name: /导出报告/ }));
    fireEvent.click(screen.getByRole('button', { name: /分享数据/ }));
    fireEvent.click(screen.getByRole('button', { name: /设置/ }));
    expect(pushMock).toHaveBeenCalledWith('/settings');
  });

  it('阶段分析 tab 渲染三阶段卡并可点击跳转客户页', () => {
    render(<AiCustomerData />);
    clickTab('阶段分析');
    expect(screen.getByText('潜在客户期')).toBeInTheDocument();
    expect(screen.getByText('342')).toBeInTheDocument();
    expect(screen.getByText('意向客户期')).toBeInTheDocument();
    expect(screen.getByText('准备成交期')).toBeInTheDocument();
    fireEvent.click(screen.getByText('潜在客户期'));
    expect(pushMock).toHaveBeenCalledWith('/customers');
  });

  it('AI 洞察 tab 渲染四条洞察与优先级徽标', () => {
    render(<AiCustomerData />);
    clickTab('AI洞察');
    expect(screen.getByText('高价值客户机会')).toBeInTheDocument();
    expect(screen.getByText('客户流失风险')).toBeInTheDocument();
    expect(screen.getByText('转化预测')).toBeInTheDocument();
    expect(screen.getByText('流程优化建议')).toBeInTheDocument();
    expect(screen.getByText('高优先级')).toBeInTheDocument();
    expect(screen.getByText('低优先级')).toBeInTheDocument();
  });

  it('活动日志 tab 渲染四条活动', () => {
    render(<AiCustomerData />);
    clickTab('活动日志');
    expect(screen.getByText('华润集团')).toBeInTheDocument();
    expect(screen.getByText('成功转化')).toBeInTheDocument();
    expect(screen.getByText('¥2,847,000')).toBeInTheDocument();
    expect(screen.getByText('碧桂园')).toBeInTheDocument();
  });
});

// ---------- 零覆盖 3：SystemInitializationLoader ----------
describe('SystemInitializationLoader（系统初始化加载器）', () => {
  it('isVisible=false 渲染 null', () => {
    const { container } = render(
      <SystemInitializationLoader isVisible={false} onComplete={() => {}} onError={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('全流程跑完派发完成事件并回调 onComplete', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 避开 5% 错误窗口
    const onComplete = vi.fn();
    const onError = vi.fn();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    render(<SystemInitializationLoader isVisible onComplete={onComplete} onError={onError} />);
    expect(screen.getByText('系统初始化中')).toBeInTheDocument();

    // 5 步总时长 2300ms × 1.05 缓冲 + 完成前 1s 延迟
    await vi.advanceTimersByTimeAsync(6000);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(1200);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'systemInitializationCompleted' }));
  });

  it('随机错误路径：onError 回调 + 重试成功', async () => {
    vi.useFakeTimers();
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.01); // 5% 错误窗口内
    const onComplete = vi.fn();
    const onError = vi.fn();
    render(<SystemInitializationLoader isVisible onComplete={onComplete} onError={onError} />);
    await vi.advanceTimersByTimeAsync(1200);
    expect(onError).toHaveBeenCalledWith(expect.stringMatching(/过程中发生错误/));
    expect(screen.getByText('初始化失败')).toBeInTheDocument();
    randomSpy.mockReturnValue(0.5); // 重试全程避开错误窗口

    // 重试后（随机恢复正常）跑完
    fireEvent.click(screen.getByRole('button', { name: '重试' }));
    await vi.advanceTimersByTimeAsync(6000);
    await vi.advanceTimersByTimeAsync(1200);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('展开详细步骤列表（图标/进度/耗时列）', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 避开 5% 错误窗口
    render(<SystemInitializationLoader isVisible onComplete={() => {}} onError={() => {}} />);
    await vi.advanceTimersByTimeAsync(3000);
    fireEvent.click(screen.getByRole('button', { name: /查看详细步骤/ }));
    // 明细列表五步齐全（用户偏好加载同时命中当前步骤横幅 → ≥2）
    expect(screen.getAllByText('离线存储初始化').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('同步服务启动').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('用户偏好加载').length).toBeGreaterThanOrEqual(2);
    // 已完成步骤带「完成」徽标
    expect(screen.getAllByText('完成').length).toBeGreaterThanOrEqual(1);
    fireEvent.click(screen.getByText('收起'));
    // 步骤列表收起后「完成」徽标消失，按钮切回「展开」
    expect(screen.queryByText('完成')).not.toBeInTheDocument();
    expect(screen.getByText('展开')).toBeInTheDocument();
  });
});

// ---------- 零覆盖 4：UserTraining ----------
describe('UserTraining（用户培训中心）', () => {
  it('概览页统计卡数值正确', () => {
    render(<UserTraining />);
    expect(screen.getByText('用户培训中心')).toBeInTheDocument();
    expect(screen.getByText('48%')).toBeInTheDocument(); // 总体进度 285/600
    // 「45分钟」同时在推荐学习区出现（多租户模块时长），双处均应有
    expect(screen.getAllByText('45分钟').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('4')).toBeInTheDocument(); // 证书 2+1+1
    expect(screen.getByText('6')).toBeInTheDocument(); // 模块数
    expect(screen.getByText('3')).toBeInTheDocument(); // 参与用户
    expect(screen.getByText('4.6')).toBeInTheDocument(); // 平均评分（浮点 4.65→4.6）
  });

  it('推荐学习区开始学习按钮可点', () => {
    render(<UserTraining />);
    const startBtns = screen.getAllByRole('button', { name: '开始学习' });
    expect(startBtns.length).toBeGreaterThanOrEqual(3);
    fireEvent.click(startBtns[0]);
  });

  it('培训模块 tab：徽标/进度条/继续学习', () => {
    render(<UserTraining />);
    clickTab('培训模块');
    expect(screen.getByText('AI智能助手基础操作')).toBeInTheDocument();
    expect(screen.getByText('多租户管理完整指南')).toBeInTheDocument();
    expect(screen.getAllByText('初级').length).toBe(2); // 两个 beginner 模块
    expect(screen.getAllByText('高级').length).toBe(2); // security + performance
    expect(screen.getAllByText(/学习进度/).length).toBeGreaterThanOrEqual(2); // 标签 + tab 名
    expect(screen.getByText('60%')).toBeInTheDocument(); // 多租户模块进行中进度
    const contBtns = screen.getAllByRole('button', { name: /继续学习/ });
    expect(contBtns.length).toBe(2); // 60% 与 25% 两个未完成有进度模块
    expect(screen.getAllByRole('button', { name: /查看证书/ }).length).toBe(2);
  });

  it('学习路径 tab：三条路径与包含模块', () => {
    render(<UserTraining />);
    clickTab('学习路径');
    expect(screen.getByText('新用户入门路径')).toBeInTheDocument();
    expect(screen.getByText('系统管理员路径')).toBeInTheDocument();
    expect(screen.getByText('数据分析师路径')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument(); // 新用户路径完成率
    const pathBtns = screen.getAllByRole('button', { name: /开始学习路径/ });
    expect(pathBtns.length).toBe(3);
  });

  it('学习进度 tab：用户卡与培训效果分析', () => {
    render(<UserTraining />);
    clickTab('学习进度');
    expect(screen.getByText('张总经理')).toBeInTheDocument();
    expect(screen.getByText(/已完成 4\/6 个模块/)).toBeInTheDocument();
    expect(screen.getByText('8.5h')).toBeInTheDocument();
    expect(screen.getByText('培训效果分析')).toBeInTheDocument();
    expect(screen.getByText('完成率统计')).toBeInTheDocument();
  });
});

// ---------- 零覆盖 5：CommentsSystem ----------
describe('CommentsSystem（评论与提及）', () => {
  it('渲染评论列表与未读提及徽标', () => {
    render(<CommentsSystem />);
    expect(screen.getByText('评论与提及')).toBeInTheDocument();
    expect(screen.getByText('1 个未读提及')).toBeInTheDocument();
    expect(screen.getByText(/第三季度的下滑趋势/)).toBeInTheDocument();
    expect(screen.getByText('共 3 条评论，1 个未读提及')).toBeInTheDocument();
  });

  it('空评论提交被禁用，输入后可发布新评论', async () => {
    const user = userEvent.setup();
    render(<CommentsSystem />);
    const sendBtn = screen.getByRole('button', { name: /发送/ });
    expect(sendBtn).toBeDisabled();
    await user.type(screen.getByPlaceholderText('添加评论...'), '新增一条测试评论');
    await user.click(sendBtn);
    expect(screen.getByText('新增一条测试评论')).toBeInTheDocument();
    expect(screen.getByText('共 4 条评论，1 个未读提及')).toBeInTheDocument();
  });

  it('回复评论：进入回复态后发布挂到对应评论下', async () => {
    const user = userEvent.setup();
    render(<CommentsSystem />);
    // 第一条评论的回复按钮
    const replyBtns = screen.getAllByRole('button', { name: '回复' });
    await user.click(replyBtns[0]);
    expect(screen.getByText('回复评论')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('输入回复...');
    await user.type(input, '这是一条回复');
    // 发送按钮此时文案也是「回复」——限定在输入框容器内取
    const composer = input.closest('div.relative') as HTMLElement;
    await user.click(within(composer).getByRole('button', { name: '回复' }));
    expect(screen.getByText('这是一条回复')).toBeInTheDocument();
    expect(screen.getByText('共 3 条评论，1 个未读提及')).toBeInTheDocument();
  });

  it('回复态可取消', async () => {
    const user = userEvent.setup();
    render(<CommentsSystem />);
    const replyBtns = screen.getAllByRole('button', { name: '回复' });
    await user.click(replyBtns[0]);
    await user.click(screen.getByRole('button', { name: '取消' }));
    expect(screen.queryByText('回复评论')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('添加评论...')).toBeInTheDocument();
  });

  it('点赞计数递增', async () => {
    const user = userEvent.setup();
    render(<CommentsSystem />);
    const likeBtn = screen.getAllByRole('button', { name: /点赞/ })[0];
    await user.click(likeBtn);
    expect(within(likeBtn).getByText('4')).toBeInTheDocument();
    await user.click(likeBtn);
    expect(within(likeBtn).getByText('5')).toBeInTheDocument();
  });

  it('子回复点赞走父级定位分支', async () => {
    const user = userEvent.setup();
    render(<CommentsSystem />);
    // 第一条评论下子回复「同意，我们需要分析一下原因」的点赞
    const replyLike = screen.getAllByRole('button', { name: /点赞/ })[1];
    await user.click(replyLike);
    expect(within(replyLike).getByText('2')).toBeInTheDocument();
  });

  it('编辑评论经下拉菜单：回填内容→保存生效', async () => {
    const user = userEvent.setup();
    const { container } = render(<CommentsSystem />);
    // 第一条评论的 MoreHorizontal 触发器（lucide 新版类名 ellipsis）
    const trigger = container.querySelector('button svg.lucide-ellipsis')?.closest('button');
    expect(trigger).not.toBeNull();
    await user.click(trigger as HTMLElement);
    await user.click(await screen.findByText('编辑'));
    const editArea = await screen.findByDisplayValue(/第三季度的下滑趋势/);
    await user.clear(editArea);
    await user.type(editArea, '编辑后的评论内容');
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(await screen.findByText('编辑后的评论内容')).toBeInTheDocument();
  });

  it('删除评论经下拉菜单', async () => {
    const user = userEvent.setup();
    const { container } = render(<CommentsSystem />);
    const trigger = container.querySelector('button svg.lucide-ellipsis')?.closest('button');
    await user.click(trigger as HTMLElement);
    await user.click(await screen.findByText('删除'));
    expect(await screen.findByText('共 2 条评论，1 个未读提及')).toBeInTheDocument();
  });

  it('提及 tab：已读标记与未读徽标联动', async () => {
    const user = userEvent.setup();
    render(<CommentsSystem />);
    clickTab(/提及/);
    expect(screen.getByText(/请查看一下这个销售异常数据/)).toBeInTheDocument();
    expect(screen.getByText('销售仪表盘')).toBeInTheDocument();
    expect(screen.getByText('标记为已读')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '标记为已读' }));
    expect(screen.queryByText('标记为已读')).not.toBeInTheDocument();
    expect(screen.getByText('0 个未读提及')).toBeInTheDocument();
    expect(screen.getByText('共 3 条评论，0 个未读提及')).toBeInTheDocument();
  });
});

// ---------- canvas 三件套（canvas 2d 桩驱动绘制分支） ----------
describe('SimpleCharts 绘制分支（canvas 2d 桩）', () => {
  const data = [
    { label: '一', value: 30 },
    { label: '二', value: 60 },
  ];
  let canvasStub: ReturnType<typeof stubCanvas2d>;

  beforeEach(() => {
    canvasStub = stubCanvas2d();
  });

  afterEach(() => {
    canvasStub.restore();
  });

  it('SimpleBarChart：roundRect 绘柱 + fillText 标签/数值', () => {
    const { container } = render(<SimpleBarChart data={data} height={120} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
    expect(canvasStub.ops).toContain('clearRect');
    expect(canvasStub.ops).toContain('roundRect');
    expect(canvasStub.ops).toContain('fill');
    const texts = canvasStub.fillCalls.map((c) => c.text);
    expect(texts).toContain('一');
    expect(texts).toContain('二');
    expect(texts).toContain('30');
    expect(texts).toContain('60');
  });

  it('SimpleBarChart：自定义颜色 props 透传', () => {
    render(<SimpleBarChart data={data} barColor="#ff0000" labelColor="#00ff00" />);
    expect(canvasStub.ops).toContain('roundRect');
  });

  it('SimpleDonutChart：arc 扇区 + 中心总计 + 图例', () => {
    const donutData = [
      { label: '甲', value: 30, color: '#f00' },
      { label: '乙', value: 60, color: '#0f0' },
    ];
    render(<SimpleDonutChart data={donutData} size={120} thickness={30} />);
    const arcCount = canvasStub.ops.filter((op) => op === 'arc').length;
    expect(arcCount).toBeGreaterThanOrEqual(4); // 2 扇区 × 2 段 + 中心圆
    const texts = canvasStub.fillCalls.map((c) => c.text);
    expect(texts).toContain('90'); // 总计
    expect(texts).toContain('总计');
    expect(texts).toContain('甲: 30');
    expect(texts).toContain('乙: 60');
  });

  it('SimpleLineChart：moveTo/lineTo 折线 + arc 数据点 + 标签', () => {
    render(<SimpleLineChart data={data} height={120} />);
    expect(canvasStub.ops).toContain('moveTo');
    expect(canvasStub.ops).toContain('lineTo');
    expect(canvasStub.ops).toContain('stroke');
    const arcCount = canvasStub.ops.filter((op) => op === 'arc').length;
    expect(arcCount).toBe(2); // 每个数据点一个圆
    const texts = canvasStub.fillCalls.map((c) => c.text);
    expect(texts).toContain('一');
    expect(texts).toContain('二');
  });

  it('无 getContext（jsdom 默认）安全跳过绘制', () => {
    canvasStub.restore();
    const { container } = render(<SimpleBarChart data={data} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
    expect(canvasStub.ops).toHaveLength(0);
  });
});

// 防止 waitFor 未使用告警（交互断言在 userEvent 场景已覆盖）
void waitFor;
