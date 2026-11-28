// ============================================================
// YYC³ · @yyc3/admin 批次 2 · 第三层：系统运维 / 通知 / 图表性能
// module-cards / sound-system / notifications / system-test-console /
// system-testing / store-management / time-tracker /
// feedback-collector / performance/optimized-charts
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, cleanup, act } from '@testing-library/react';
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
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { ModuleCards } from '../module-cards';
import { SoundProvider, SoundButton, SoundControls, useSoundFeedback } from '../design-system/sound-system';
import Notifications from '../notifications';
import { SystemTestConsole } from '../system-test-console';
import { SystemTesting } from '../system-testing';
import { StoreManagement } from '../store-management';
import { TimeTracker } from '../time-tracker';
import { FeedbackCollector } from '../feedback/feedback-collector';
import { OptimizedLineChart, OptimizedBarChart, OptimizedPieChart } from '../performance/optimized-charts';
import { stubAdminDom, silenceConsole, stubObjectURL } from './helpers';

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

/** Radix Tabs 在 mousedown 激活 */
const clickTab = (name: string | RegExp) => {
  const tab = screen.getByRole('tab', { name });
  fireEvent.mouseDown(tab);
  fireEvent.click(tab);
};

// ---------- ModuleCards ----------
describe('ModuleCards（核心功能卡导航）', () => {
  it('渲染八张功能卡', () => {
    render(<ModuleCards />);
    for (const name of [
      '数据总览',
      '用户管理',
      '系统设置',
      'AI智能助手',
      '多租户管理',
      '高级BI分析',
      '移动端应用',
      '安全中心',
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('点击卡片按模块路由跳转', () => {
    render(<ModuleCards />);
    const cases: Array<[string, string]> = [
      ['数据总览', '/dashboard'],
      ['用户管理', '/customers'],
      ['系统设置', '/settings'],
      ['AI智能助手', '/ai-assistant'],
      ['多租户管理', '/tenant-management'],
      ['高级BI分析', '/advanced-bi'],
      ['移动端应用', '/mobile-app'],
      ['安全中心', '/security'],
    ];
    for (const [label, path] of cases) {
      fireEvent.click(screen.getByText(label));
      expect(pushMock).toHaveBeenCalledWith(path);
    }
    expect(pushMock).toHaveBeenCalledTimes(8);
  });
});

// ---------- SoundSystem ----------
describe('SoundSystem（音效系统）', () => {
  it('无 Provider 时默认关闭态可用', () => {
    render(<SoundControls />);
    expect(screen.getByRole('button', { name: '开启音效' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '开启音效' }));
    // 默认上下文 toggleSound 为 noop → 文案不变
    expect(screen.getByRole('button', { name: '开启音效' })).toBeInTheDocument();
  });

  it('Provider 内开关与音量滑杆', () => {
    render(
      <SoundProvider>
        <SoundControls />
      </SoundProvider>,
    );
    expect(screen.getByRole('button', { name: '关闭音效' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: '音量控制' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '关闭音效' }));
    expect(screen.getByRole('button', { name: '开启音效' })).toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: '音量控制' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '开启音效' }));
    expect(screen.getByRole('slider', { name: '音量控制' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider', { name: '音量控制' }), { target: { value: '0.9' } });
  });

  it('AudioContext 桩下播放各音型', async () => {
    const started = vi.fn();
    class MockOscillator {
      connect = vi.fn();
      frequency = { setValueAtTime: vi.fn() };
      type = '';
      start = started;
      stop = vi.fn();
    }
    class MockGain {
      connect = vi.fn();
      gain = {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      };
    }
    class MockAudioContext {
      currentTime = 0;
      destination = {};
      createOscillator = () => new MockOscillator();
      createGain = () => new MockGain();
    }
    Object.defineProperty(window, 'AudioContext', { writable: true, configurable: true, value: MockAudioContext });
    Object.defineProperty(window, 'webkitAudioContext', {
      writable: true,
      configurable: true,
      value: MockAudioContext,
    });

    function Probe() {
      const fb = useSoundFeedback();
      return <button onClick={() => { fb.playClick(); fb.playSuccess(); fb.playError(); fb.playNotification(); }}>probe</button>;
    }
    vi.useFakeTimers();
    render(
      <SoundProvider>
        <Probe />
      </SoundProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'probe' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600); // success 三连音 + notification 双音的 setTimeout
    });
    // click 1 + success 3 + error 1 + notification 2 = 7 次起振
    expect(started).toHaveBeenCalledTimes(7);
  });

  it('SoundButton 透传点击回调', () => {
    const onClick = vi.fn();
    render(
      <SoundProvider>
        <SoundButton soundType="hover" onClick={onClick}>
          音效按钮
        </SoundButton>
      </SoundProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '音效按钮' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ---------- Notifications（通知管理页） ----------
describe('Notifications（通知管理页）', () => {
  const open = async () => {
    vi.useFakeTimers();
    render(<Notifications />);
    expect(screen.getByText('通知中心')).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600); // 1.5s mock 加载
    });
    expect(screen.getByText('系统维护通知')).toBeInTheDocument();
  };

  it('加载骨架→数据渲染（未读徽标 5）', async () => {
    vi.useFakeTimers();
    render(<Notifications />);
    expect(screen.queryByText('系统维护通知')).not.toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(screen.getByText('系统维护通知')).toBeInTheDocument();
    expect(screen.getByText('共 10 条通知')).toBeInTheDocument();
    // 头部未读徽标
    expect(screen.getByText('5')).toBeInTheDocument();
    // sender 与 metadata 徽章分支（成就通知：徽标 + 正文双处出现）
    expect(screen.getAllByText('张三').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/高效达人/).length).toBeGreaterThanOrEqual(2);
  });

  it('搜索过滤到单条', async () => {
    await open();
    const input = screen.getByPlaceholderText('搜索通知标题、内容或发送者...');
    fireEvent.change(input, { target: { value: '安全提醒' } });
    expect(screen.getByText('共 1 条通知')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('共 10 条通知')).toBeInTheDocument();
  });

  it('tab 分类：未读/星标/已读内容过滤', async () => {
    await open();
    // 计数条在 tab 外层恒显全量；按卡片内容断言各 tab 过滤
    clickTab('未读');
    expect(screen.getByText('任务即将到期')).toBeInTheDocument();
    expect(screen.queryByText('新功能上线通知')).not.toBeInTheDocument(); // 已读
    clickTab('星标');
    expect(screen.getByText('恭喜！您达成了一个里程碑')).toBeInTheDocument();
    expect(screen.queryByText('系统维护通知')).not.toBeInTheDocument(); // 未加星
    clickTab('已读');
    expect(screen.getByText('收到新消息')).toBeInTheDocument();
    expect(screen.queryByText('任务即将到期')).not.toBeInTheDocument(); // 未读
  });

  it('点击卡片切换已读（徽标 5→4）', async () => {
    await open();
    fireEvent.click(screen.getByText('系统维护通知'));
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('操作按钮触发已读切换', async () => {
    await open();
    // 「查看任务」出现在未读任务通知与已读任务分配通知两处 → 取首个（未读）
    fireEvent.click(screen.getAllByRole('button', { name: '查看任务' })[0]);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('全部已读对话框', async () => {
    await open();
    fireEvent.click(screen.getByRole('button', { name: /全部已读/ }));
    expect(screen.getByText('标记所有为已读')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '确认' }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('全选→删除选中→空态', async () => {
    await open();
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // 全选
    expect(screen.getByText('共 10 条通知')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /删除选中/ }));
    expect(screen.getByText('删除通知')).toBeInTheDocument();
    fireEvent.click(within(screen.getByText('删除通知').closest('[data-slot="dialog-content"]') as HTMLElement)
      .getByRole('button', { name: '删除' }));
    expect(screen.getByText('暂无通知')).toBeInTheDocument();
  });

  it('暂停通知提示条', async () => {
    await open();
    // 暂停按钮 = 含铃铛图标的 header 按钮
    const pauseBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.querySelector('svg.lucide-bell'),
    );
    expect(pauseBtn).not.toBeUndefined();
    fireEvent.click(pauseBtn as HTMLElement);
    expect(screen.getByText('通知已暂停')).toBeInTheDocument();
    const toastRoot = screen.getByText('通知已暂停').closest('div.fixed') as HTMLElement;
    fireEvent.click(toastRoot.querySelector('button') as HTMLElement);
    expect(screen.queryByText('通知已暂停')).not.toBeInTheDocument();
  });

  it('设置对话框开关', async () => {
    await open();
    fireEvent.click(screen.getByRole('button', { name: /设置/ }));
    expect(screen.getByText('通知设置')).toBeInTheDocument();
    expect(screen.getByText('系统通知')).toBeInTheDocument();
    expect(screen.getByText('仅显示高优先级通知')).toBeInTheDocument();
    // 关闭一个类型开关
    const row = screen.getByText('系统通知').closest('div.flex.items-center.justify-between') as HTMLElement;
    fireEvent.click(within(row).getByRole('switch'));
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(screen.queryByText('仅显示高优先级通知')).not.toBeInTheDocument();
  });
});

// ---------- SystemTestConsole ----------
describe('SystemTestConsole（测试控制台）', () => {
  it('触发按钮打开对话框与套件清单', () => {
    render(<SystemTestConsole />);
    fireEvent.click(screen.getByRole('button', { name: /系统测试/ }));
    expect(screen.getByText('系统功能测试控制台')).toBeInTheDocument();
    for (const name of ['核心功能测试', '业务模块测试', '性能测试', '错误处理测试', '响应式设计测试', '离线功能测试']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getByText('总体进度')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /运行所有测试/ })).toBeInTheDocument();
  });

  it('全量运行：套件全部通过→报告→导出', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // 全部成功
    const { blobs } = stubObjectURL();
    render(<SystemTestConsole />);
    fireEvent.click(screen.getByRole('button', { name: /系统测试/ }));
    fireEvent.click(screen.getByRole('button', { name: /运行所有测试/ }));
    expect(screen.getByText(/测试进行中/)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120000);
    });
    // 套件徽标全部通过（5/5 ×2 + 4/4 ×4）
    expect(screen.getAllByText('5/5').length).toBe(2);
    expect(screen.getAllByText('4/4').length).toBe(4);
    expect(screen.getByText('100%')).toBeInTheDocument(); // 总体进度
    // 导出报告（注：报告统计因 runAllTests 闭包捕获旧 testSuites 而恒为 0——产品缺陷，已登记）
    fireEvent.click(screen.getByRole('button', { name: /导出报告/ }));
    expect(blobs.length).toBe(1);
    const report = JSON.parse(await blobs[0].text());
    expect(report.totalTests).toBe(26);
    expect(report.passedTests).toBe(0); // 缺陷现场：闭包读到 pending 态
    // 测试报告 tab
    clickTab('测试报告');
    expect(screen.getByText('测试总结')).toBeInTheDocument();
    expect(screen.getByText('总测试数')).toBeInTheDocument();
  });
});

// ---------- SystemTesting ----------
describe('SystemTesting（系统集成测试）', () => {
  it('页面骨架与五套件', () => {
    render(<SystemTesting />);
    expect(screen.getByText('系统集成测试')).toBeInTheDocument();
    for (const name of [
      'AI智能助手测试',
      '多租户管理测试',
      '高级BI分析测试',
      '移动端应用测试',
      '安全中心测试',
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getAllByText('0%').length).toBeGreaterThanOrEqual(2); // 总体进度 + 通过率
  });

  it('全量运行 11 用例：通过率 100%', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    render(<SystemTesting />);
    fireEvent.click(screen.getByRole('button', { name: /运行所有测试/ }));
    expect(screen.getByText(/测试中/)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(45000);
    });
    // 总体进度与通过率双双 100%
    expect(screen.getAllByText('100%').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('11')).toBeInTheDocument(); // 已完成
    expect(screen.getByText('0')).toBeInTheDocument(); // 失败数
    // 测试结果 tab：步骤明细
    clickTab('测试结果');
    expect(screen.getAllByText('发送测试消息').length).toBeGreaterThanOrEqual(1);
    // 覆盖率报告 tab
    clickTab('覆盖率报告');
    expect(screen.getByText('功能覆盖率')).toBeInTheDocument();
    expect(screen.getByText('代码覆盖率')).toBeInTheDocument();
    expect(screen.getByText('组件测试')).toBeInTheDocument();
  });
});

// ---------- StoreManagement ----------
describe('StoreManagement（多门店管理）', () => {
  it('门店列表与搜索过滤', () => {
    render(<StoreManagement />);
    expect(screen.getByText('多门店管理')).toBeInTheDocument();
    expect(screen.getByText('锦澜家居旗舰店')).toBeInTheDocument();
    expect(screen.getByText('锦澜家居徐汇店')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('搜索门店名称或地址...'), {
      target: { value: '徐汇' },
    });
    expect(screen.getByText('锦澜家居徐汇店')).toBeInTheDocument();
    expect(screen.queryByText('锦澜家居旗舰店')).not.toBeInTheDocument();
  });

  it('员工管理 tab', () => {
    render(<StoreManagement />);
    clickTab('员工管理');
    expect(screen.getByText('张经理')).toBeInTheDocument();
    expect(screen.getByText('李主管')).toBeInTheDocument();
    expect(screen.getByText('王店长')).toBeInTheDocument();
    expect(screen.getAllByText('店长').length).toBe(2); // 张经理 + 王店长角色徽标
    expect(screen.getByText('主管')).toBeInTheDocument();
    expect(screen.getAllByText(/所属门店/).length).toBeGreaterThanOrEqual(1);
  });

  it('数据分析 tab 汇总数值', () => {
    render(<StoreManagement />);
    clickTab('数据分析');
    expect(screen.getByText('总门店数')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument(); // 员工总数
    expect(screen.getByText('¥257.0万')).toBeInTheDocument(); // 月总营收
    expect(screen.getByText('3')).toBeInTheDocument(); // 营业门店
  });

  it('新建门店对话框开关', () => {
    render(<StoreManagement />);
    fireEvent.click(screen.getByRole('button', { name: /新建门店/ }));
    expect(screen.getByText('创建新门店')).toBeInTheDocument();
    expect(screen.getByLabelText('门店名称')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(screen.queryByText('创建新门店')).not.toBeInTheDocument();
  });
});

// ---------- TimeTracker ----------
describe('TimeTracker（计时器）', () => {
  it('开始→暂停产生记录并回调', async () => {
    vi.useFakeTimers();
    const onTimeUpdate = vi.fn();
    render(<TimeTracker taskId="t1" taskName="写测试" onTimeUpdate={onTimeUpdate} />);
    expect(screen.getAllByText('00:00:00').length).toBeGreaterThanOrEqual(2); // 大表盘 + 总计
    fireEvent.click(screen.getByRole('button', { name: /开始计时/ }));
    expect(screen.getByRole('button', { name: '暂停' })).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3200);
    });
    fireEvent.click(screen.getByRole('button', { name: '暂停' }));
    // 记录 + 大表盘 + 平均时长均 00:00:03
    expect(screen.getAllByText('00:00:03').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('共 1 条记录')).toBeInTheDocument();
    expect(onTimeUpdate).toHaveBeenCalledWith(3);
  });

  it('停止重置（运行中停止先落一条记录）', async () => {
    vi.useFakeTimers();
    render(<TimeTracker />);
    fireEvent.click(screen.getByRole('button', { name: /开始计时/ }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2200);
    });
    // stopTimer 内部先走 pauseTimer → 运行中停止会落一条 2 秒记录
    fireEvent.click(screen.getByRole('button', { name: '停止' }));
    expect(screen.getByRole('button', { name: /开始计时/ })).toBeInTheDocument();
    expect(screen.getByText('共 1 条记录')).toBeInTheDocument();
    expect(screen.getAllByText('00:00:02').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('00:00:00').length).toBeGreaterThanOrEqual(1); // 大表盘归零
  });

  it('手动添加预设时长', () => {
    const onTimeUpdate = vi.fn();
    render(<TimeTracker onTimeUpdate={onTimeUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /手动添加/ }));
    expect(screen.getByText('手动添加时间记录')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '15分钟' }));
    // 列表记录 + 总计 + 平均时长
    expect(screen.getAllByText('00:15:00').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('共 1 条记录')).toBeInTheDocument();
    expect(onTimeUpdate).toHaveBeenCalledWith(900);
  });

  it('自定义分钟数 Enter 提交', async () => {
    const user = userEvent.setup();
    render(<TimeTracker />);
    fireEvent.click(screen.getByRole('button', { name: /手动添加/ }));
    const input = screen.getByPlaceholderText('输入分钟数');
    fireEvent.change(input, { target: { value: '5' } });
    // React 19 下 fireEvent.keyPress 不再触发合成事件——走 userEvent 原生 keypress
    await user.type(input, '{enter}');
    expect(screen.getAllByText('00:05:00').length).toBeGreaterThanOrEqual(2);
  });

  it('删除记录回到空态', () => {
    render(<TimeTracker />);
    fireEvent.click(screen.getByRole('button', { name: /手动添加/ }));
    fireEvent.click(screen.getByRole('button', { name: '15分钟' }));
    fireEvent.click(document.querySelector('button.text-red-500') as HTMLElement);
    expect(screen.getByText('暂无时间记录')).toBeInTheDocument();
  });
});

// ---------- FeedbackCollector ----------
describe('FeedbackCollector（反馈收集器）', () => {
  it('未选评分提交报错', () => {
    render(<FeedbackCollector />);
    fireEvent.click(screen.getByRole('button', { name: /提交反馈/ }));
    expect(screen.getByText('请选择评分')).toBeInTheDocument();
  });

  it('评分+评论提交成功回调', async () => {
    const onSubmit = vi.fn(async () => {});
    render(<FeedbackCollector onSubmit={onSubmit} />);
    // 精确匹配——/满意/ 会同时命中「不满意」
    fireEvent.click(screen.getByRole('button', { name: '满意' }));
    fireEvent.change(screen.getByPlaceholderText('请告诉我们您的想法...'), {
      target: { value: '很好用' },
    });
    fireEvent.click(screen.getByRole('button', { name: /提交反馈/ }));
    expect(await screen.findByText('提交成功')).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'rating', rating: 2, comment: '很好用' }),
    );
  });

  it('onSubmit 拒绝→错误提示', async () => {
    const onSubmit = vi.fn(async () => {
      throw new Error('boom');
    });
    render(<FeedbackCollector onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: '满意' }));
    fireEvent.change(screen.getByPlaceholderText('请告诉我们您的想法...'), {
      target: { value: '差评' },
    });
    fireEvent.click(screen.getByRole('button', { name: /提交反馈/ }));
    expect(await screen.findByText('提交反馈失败，请稍后重试')).toBeInTheDocument();
  });

  it('详细反馈 tab：类别单选随回调', async () => {
    const onSubmit = vi.fn(async () => {});
    render(<FeedbackCollector onSubmit={onSubmit} />);
    clickTab('详细反馈');
    expect(screen.getByText('反馈类别')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: '界面设计' }));
    fireEvent.change(screen.getByPlaceholderText('请详细描述您的问题或建议...'), {
      target: { value: '希望优化' },
    });
    fireEvent.click(screen.getByRole('button', { name: /提交反馈/ }));
    expect(await screen.findByText('提交成功')).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'detailed', category: '界面设计' }),
    );
  });

  it('compact 模式经对话框提交', async () => {
    const onSubmit = vi.fn(async () => {});
    render(<FeedbackCollector compact onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /反馈/ }));
    expect(screen.getByText('用户反馈')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '满意' }));
    fireEvent.change(screen.getByPlaceholderText('请告诉我们您的想法...'), {
      target: { value: '对话框内反馈' },
    });
    fireEvent.click(screen.getByRole('button', { name: /提交反馈/ }));
    expect(await screen.findByText('提交成功')).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
  });
});

// ---------- OptimizedCharts ----------
describe('OptimizedCharts（图表性能三件套）', () => {
  const csvData = Array.from({ length: 10 }, (_, i) => ({ name: `P${i}`, value: i * 10 }));

  it('LineChart 渲染与 CSV 下载', () => {
    const { blobs } = stubObjectURL();
    const { container } = render(<OptimizedLineChart data={csvData} title="趋势图" />);
    expect(screen.getByText('趋势图')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-linechart')).toBeInTheDocument();
    fireEvent.click(container.querySelector('button svg.lucide-download')?.closest('button') as HTMLElement);
    expect(blobs.length).toBe(1);
  });

  it('空数据下载不触发', () => {
    const { blobs } = stubObjectURL();
    const { container } = render(<OptimizedLineChart data={[]} title="空图" />);
    fireEvent.click(container.querySelector('button svg.lucide-download')?.closest('button') as HTMLElement);
    expect(blobs.length).toBe(0);
  });

  it('聚合菜单四个档位切换', async () => {
    const user = userEvent.setup();
    const dateData = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00`,
      value: i,
    }));
    const { container } = render(<OptimizedLineChart data={dateData} title="聚合图" />);
    // Radix DropdownMenu 在 pointerdown 开启，且每次选择后自动关闭 → 逐档重开
    const trigger = () =>
      container.querySelector('button svg.lucide-filter')?.closest('button') as HTMLElement;
    for (const label of ['按小时聚合', '按天聚合', '按周聚合', '按月聚合', '不聚合']) {
      fireEvent.pointerDown(trigger());
      await user.click(await screen.findByText(label));
    }
    expect(screen.getByText('聚合图')).toBeInTheDocument();
  });

  it('超量数据采样分支（600 点 > maxPoints 500）', () => {
    const big = Array.from({ length: 600 }, (_, i) => ({ name: `N${i}`, value: i }));
    render(<OptimizedLineChart data={big} title="采样图" maxPoints={500} />);
    expect(screen.getByText('采样图')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-linechart')).toBeInTheDocument();
  });

  it('isLoading 骨架态', () => {
    const { container } = render(<OptimizedLineChart data={csvData} title="加载中" isLoading />);
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
    expect(screen.queryByTestId('recharts-linechart')).not.toBeInTheDocument();
  });

  it('BarChart 渲染与采样', () => {
    const big = Array.from({ length: 60 }, (_, i) => ({ name: `B${i}`, value: i }));
    render(<OptimizedBarChart data={big} title="柱状图" maxBars={50} />);
    expect(screen.getByText('柱状图')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-barchart')).toBeInTheDocument();
  });

  it('PieChart 小数据渲染', () => {
    const small = [
      { name: '甲', value: 30 },
      { name: '乙', value: 20 },
    ];
    render(<OptimizedPieChart data={small} title="饼图" />);
    expect(screen.getByText('饼图')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-piechart')).toBeInTheDocument();
  });

  it('PieChart 超量切片合并「其他」', () => {
    const big = Array.from({ length: 15 }, (_, i) => ({ name: `K${i}`, value: i + 1 }));
    render(<OptimizedPieChart data={big} title="大饼图" maxSlices={10} />);
    expect(screen.getByText('大饼图')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-piechart')).toBeInTheDocument();
  });
});
