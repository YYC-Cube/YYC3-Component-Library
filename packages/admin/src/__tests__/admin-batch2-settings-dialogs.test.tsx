// ============================================================
// YYC³ · @yyc3/admin 批次 2 · 第二层：设置族 / 对话框 / 数据进出
// system-settings 主页 + notification/privacy/appearance 子件 /
// settings-dialog / profile-dialog / global-search-dialog /
// data-import-export / avatar-upload / logo-manager / ai-smart-forms
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
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());

import SystemSettings from '../system-settings';
import { NotificationSettings } from '../system-settings/notification-settings';
import { PrivacySettings } from '../system-settings/privacy-settings';
import { AppearanceSettings } from '../system-settings/appearance-settings';
import { SettingsDialog } from '../dialogs/settings-dialog';
import { ProfileDialog } from '../dialogs/profile-dialog';
import { GlobalSearchDialog } from '../global-search-dialog';
import { DataImportExport } from '../data-import-export';
import { AvatarUpload } from '../avatar-upload';
import { LogoManager } from '../logo-manager';
import { AiSmartForms } from '../ai-smart-forms';
import { stubAdminDom, silenceConsole, stubObjectURL } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
  pushMock.mockClear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Radix Tabs 在 mousedown 激活 */
const clickTab = (name: string | RegExp) => {
  const tab = screen.getByRole('tab', { name });
  fireEvent.mouseDown(tab);
  fireEvent.click(tab);
};

/** 取与 label 同一 flex 行内的 switch（行容器类名 flex items-center justify-between） */
const rowSwitch = (label: string): HTMLElement => {
  const el = screen.getByText(label);
  const row = el.closest('div.flex.items-center.justify-between') as HTMLElement;
  expect(row).not.toBeNull();
  return within(row).getByRole('switch');
};

/** 取卡片内第 index 个 switch（标题行 Switch 场景：CardTitle 与 Switch 不同行） */
const cardSwitch = (cardTitle: string, index = 0): HTMLElement => {
  const card = screen.getByText(cardTitle).closest('[data-slot="card"]') as HTMLElement;
  expect(card).not.toBeNull();
  return within(card).getAllByRole('switch')[index];
};

// ---------- SystemSettings 主页 ----------
describe('SystemSettings（系统设置主页）', () => {
  it('渲染页面骨架与系统状态卡；保存初始禁用', () => {
    render(<SystemSettings />);
    expect(screen.getByText('系统设置')).toBeInTheDocument();
    expect(screen.getByText('系统状态')).toBeInTheDocument();
    expect(screen.getByText('CPU使用率')).toBeInTheDocument();
    expect(screen.getByText('15天 8小时 32分钟')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /保存配置/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /导入配置/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /导出配置/ })).toBeInTheDocument();
  });

  it('导出配置→下载 JSON→回灌导入（roundtrip）后保存解锁', async () => {
    const { blobs } = stubObjectURL();
    render(<SystemSettings />);
    fireEvent.click(screen.getByRole('button', { name: /导出配置/ }));
    expect(blobs.length).toBe(1);
    const json = await blobs[0].text();
    expect(json).toContain('金兰企业管理系统');

    // 导入回灌
    const file = new File([json], 'config.json', { type: 'application/json' });
    const input = document.getElementById('import-config') as HTMLInputElement;
    expect(input).not.toBeNull();
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByRole('button', { name: /保存配置/ })).toBeEnabled());
  });

  it('非法 JSON 导入触发失败提示', async () => {
    const { Toaster } = await import('@yyc3/ui');
    render(
      <div>
        <SystemSettings />
        <Toaster />
      </div>,
    );
    const file = new File(['{invalid'], 'broken.json', { type: 'application/json' });
    const input = document.getElementById('import-config') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText(/导入失败/)).toBeInTheDocument();
  });

  it('修改站点名→变更提醒→保存后复位', async () => {
    vi.useFakeTimers();
    render(<SystemSettings />);
    const siteName = screen.getByLabelText('站点名称') as HTMLInputElement;
    fireEvent.change(siteName, { target: { value: '测试站点' } });
    expect(screen.getByText(/您有未保存的配置更改/)).toBeInTheDocument();
    const save = screen.getByRole('button', { name: /保存配置/ });
    expect(save).toBeEnabled();
    fireEvent.click(save);
    expect(screen.getByRole('button', { name: /保存中/ })).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });
    expect(save).toBeDisabled();
    expect(screen.queryByText(/您有未保存的配置更改/)).not.toBeInTheDocument();
  });

  it('数据库 tab：密码可见切换', () => {
    render(<SystemSettings />);
    clickTab('数据库');
    const pwd = document.getElementById('dbPassword') as HTMLInputElement;
    expect(pwd.type).toBe('password');
    // 密码行的眼睛按钮（ghost icon，含 Eye 图标）
    const eyeBtn = pwd.closest('div.relative')?.querySelector('button');
    fireEvent.click(eyeBtn as HTMLElement);
    expect((document.getElementById('dbPassword') as HTMLInputElement).type).toBe('text');
  });

  it('数据库 tab：测试连接成功 toast（真实计时 2s）', async () => {
    const { Toaster } = await import('@yyc3/ui');
    render(
      <div>
        <SystemSettings />
        <Toaster />
      </div>,
    );
    clickTab('数据库');
    fireEvent.click(screen.getAllByRole('button', { name: /测试连接/ })[0]);
    expect(await screen.findByText(/连接测试成功/, {}, { timeout: 3000 })).toBeInTheDocument();
  }, 10000);

  it('数据库 tab：备份开关联动备份间隔选择器', () => {
    render(<SystemSettings />);
    clickTab('数据库');
    // 备份默认开 → 间隔选择器在
    expect(screen.getByText('备份间隔 (小时)')).toBeInTheDocument();
    fireEvent.click(rowSwitch('自动备份'));
    expect(screen.queryByText('备份间隔 (小时)')).not.toBeInTheDocument();
    fireEvent.click(rowSwitch('自动备份'));
    expect(screen.getByText('备份间隔 (小时)')).toBeInTheDocument();
  });

  it('缓存 tab：关闭缓存隐藏配置区', () => {
    render(<SystemSettings />);
    clickTab('缓存');
    expect(screen.getByText('缓存类型')).toBeInTheDocument();
    fireEvent.click(rowSwitch('启用缓存'));
    expect(screen.queryByText('缓存类型')).not.toBeInTheDocument();
    expect(screen.getByText('已禁用')).toBeInTheDocument();
  });

  it('安全 tab：双因素开关联动', () => {
    render(<SystemSettings />);
    clickTab('安全');
    expect(screen.getByText('IP白名单')).toBeInTheDocument();
    fireEvent.click(rowSwitch('双因素认证'));
    fireEvent.click(rowSwitch('密码复杂度要求'));
  });

  it('通知 tab：邮件开关隐藏 SMTP 字段；短信开启出现 API 密钥', () => {
    render(<SystemSettings />);
    clickTab('通知');
    expect(screen.getByText('SMTP主机')).toBeInTheDocument();
    fireEvent.click(cardSwitch('邮件通知'));
    expect(screen.queryByText('SMTP主机')).not.toBeInTheDocument();
    expect(screen.queryByText('短信服务商')).not.toBeInTheDocument();
    fireEvent.click(rowSwitch('短信通知'));
    expect(screen.getByText('短信服务商')).toBeInTheDocument();
    // 推送默认开 → 原有 1 枚 API密钥，短信开启后 2 枚
    expect(screen.getAllByText('API密钥').length).toBe(2);
  });

  it('外观 tab：主题/主色调/Logo 输入渲染', () => {
    render(<SystemSettings />);
    clickTab('外观');
    expect(screen.getByText('主题设置')).toBeInTheDocument();
    expect((document.getElementById('logoUrl') as HTMLInputElement).value).toBe(
      '/images/jinlan-logo-main.png',
    );
    expect((document.getElementById('primaryColor') as HTMLInputElement).value).toBe('#3b82f6');
  });
});

// ---------- NotificationSettings 子件 ----------
describe('NotificationSettings（通知设置子件）', () => {
  it('渲染全局设置与四渠道卡', () => {
    render(<NotificationSettings />);
    expect(screen.getByText('通知设置')).toBeInTheDocument();
    expect(screen.getByText('全局通知设置')).toBeInTheDocument();
    expect(screen.getByText('邮件通知')).toBeInTheDocument();
    expect(screen.getByText('桌面通知')).toBeInTheDocument();
    expect(screen.getByText(/音量: 70%/)).toBeInTheDocument();
  });

  it('全局开关切换不抛错', () => {
    render(<NotificationSettings />);
    fireEvent.click(rowSwitch('免打扰模式'));
    fireEvent.click(rowSwitch('批量通知'));
    fireEvent.click(rowSwitch('通知预览'));
    fireEvent.click(rowSwitch('分组相似通知'));
  });

  it('渠道开关：短信开启出现频率选择', () => {
    render(<NotificationSettings />);
    // 短信渠道默认关 → 其卡内无「发送频率」
    const smsCard = screen.getByText('短信通知').closest('[data-slot="card"]') as HTMLElement;
    expect(within(smsCard).queryByText('发送频率')).not.toBeInTheDocument();
    fireEvent.click(rowSwitch('短信通知'));
    expect(within(smsCard).getByText('发送频率')).toBeInTheDocument();
  });

  it('桌面通知声音开关隐藏音量滑杆', () => {
    render(<NotificationSettings />);
    const desktopCard = screen.getByText('桌面通知').closest('[data-slot="card"]') as HTMLElement;
    expect(within(desktopCard).getByText(/音量: 70%/)).toBeInTheDocument();
    // 卡内 switch[0]=头部启用开关，[1]=声音提醒
    fireEvent.click(within(desktopCard).getAllByRole('switch')[1]);
    expect(within(desktopCard).queryByText(/音量:/)).not.toBeInTheDocument();
  });

  it('规则 tab：优先级/渠道/时间范围徽标与规则开关', () => {
    render(<NotificationSettings />);
    clickTab('通知规则');
    expect(screen.getByText('系统安全警报')).toBeInTheDocument();
    expect(screen.getByText('紧急')).toBeInTheDocument();
    expect(screen.getByText('09:00 - 18:00')).toBeInTheDocument();
    expect(screen.getAllByText('邮件').length).toBeGreaterThanOrEqual(1);
    // 规则开关切换
    const ruleRow = screen.getByText('系统安全警报').closest('div.border') as HTMLElement;
    fireEvent.click(within(ruleRow).getByRole('switch'));
  });

  it('分类 tab：七分类卡与默认开关', () => {
    render(<NotificationSettings />);
    clickTab('分类设置');
    for (const cat of ['安全', '任务', '消息', '会议', '系统', '维护', '更新']) {
      expect(screen.getAllByText(cat).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getAllByRole('switch').length).toBeGreaterThanOrEqual(21); // 7 × 3 开关
  });

  it('测试通知四按钮', () => {
    render(<NotificationSettings />);
    for (const name of [/测试邮件/, /测试短信/, /测试推送/, /测试桌面/]) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });
});

// ---------- PrivacySettings 子件 ----------
describe('PrivacySettings（隐私设置子件）', () => {
  it('隐私概览初始评分 50%', () => {
    render(<PrivacySettings />);
    expect(screen.getByText('管理您的数据隐私和个人信息保护设置')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('严格保护项')).toBeInTheDocument();
    expect(screen.getByText('有效授权')).toBeInTheDocument();
  });

  it('快速级别：基础保护 → 仅 basic 级启用（63%）', () => {
    render(<PrivacySettings />);
    fireEvent.click(screen.getByRole('button', { name: /基础保护/ }));
    expect(screen.getByText('63%')).toBeInTheDocument();
  });

  it('单项开关切换提升评分', () => {
    render(<PrivacySettings />);
    fireEvent.click(rowSwitch('使用情况分析'));
    expect(screen.getByText('63%')).toBeInTheDocument();
    fireEvent.click(rowSwitch('营销邮件'));
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('数据保留 tab：自动删除切换', () => {
    render(<PrivacySettings />);
    clickTab('数据保留');
    expect(screen.getByText('数据保留策略')).toBeInTheDocument();
    expect(screen.getAllByText('启用自动删除').length).toBe(3);
    fireEvent.click(rowSwitch('用户活动日志'));
    expect(screen.getAllByText('启用自动删除').length).toBe(2);
    expect(screen.getAllByText('需要手动删除').length).toBe(2);
  });

  it('授权管理 tab：撤回授权', () => {
    render(<PrivacySettings />);
    clickTab('授权管理');
    expect(screen.getAllByText('有效').length).toBe(2);
    fireEvent.click(screen.getAllByRole('button', { name: '撤回授权' })[0]);
    // 首条撤回 + 初始已撤回的分析授权 = 2
    expect(screen.getAllByText('已撤回').length).toBe(2);
    expect(screen.getAllByText('有效').length).toBe(1);
  });

  it('合规监控 tab：三法规清单', () => {
    render(<PrivacySettings />);
    clickTab('合规监控');
    expect(screen.getByText(/GDPR/)).toBeInTheDocument();
    expect(screen.getByText(/CCPA/)).toBeInTheDocument();
    expect(screen.getByText('中国网络安全法')).toBeInTheDocument();
    expect(screen.getByText('数据可携带权')).toBeInTheDocument();
  });

  it('数据管理区渲染', () => {
    render(<PrivacySettings />);
    expect(screen.getByText('导出我的数据')).toBeInTheDocument();
    expect(screen.getByText('删除我的账户')).toBeInTheDocument();
    expect(screen.getByText('重要提醒')).toBeInTheDocument();
  });
});

// ---------- AppearanceSettings 子件 ----------
describe('AppearanceSettings（外观设置子件）', () => {
  it('渲染与默认值', () => {
    render(<AppearanceSettings />);
    expect(screen.getByText('外观设置')).toBeInTheDocument();
    expect(screen.getByText('14px')).toBeInTheDocument();
    expect(screen.getByText('6px')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /保存设置/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /重置/ })).toBeInTheDocument();
  });

  it('主题与主色调切换', () => {
    render(<AppearanceSettings />);
    fireEvent.click(screen.getByRole('button', { name: '深色' }));
    fireEvent.click(screen.getByRole('button', { name: '浅色' }));
    fireEvent.click(screen.getByRole('button', { name: '跟随系统' }));
    fireEvent.click(screen.getByRole('button', { name: '绿色' }));
  });

  it('保存成功态出现（真实计时 1s）', async () => {
    render(<AppearanceSettings />);
    fireEvent.click(screen.getByRole('button', { name: /保存设置/ }));
    expect(await screen.findByText('保存成功', {}, { timeout: 3000 })).toBeInTheDocument();
  }, 10000);

  it('辅助功能开关', () => {
    render(<AppearanceSettings />);
    fireEvent.click(rowSwitch('动画效果'));
    fireEvent.click(rowSwitch('高对比度'));
    fireEvent.click(rowSwitch('减少动效'));
  });

  it('布局开关与预览区', () => {
    render(<AppearanceSettings />);
    fireEvent.click(rowSwitch('紧凑模式'));
    fireEvent.click(rowSwitch('显示侧边栏'));
    fireEvent.click(rowSwitch('固定头部'));
    fireEvent.click(rowSwitch('显示页脚'));
    expect(screen.getByText('示例标题')).toBeInTheDocument();
    expect(screen.getByText('响应式设计')).toBeInTheDocument();
  });
});

// ---------- SettingsDialog ----------
describe('SettingsDialog（系统设置对话框）', () => {
  it('open 渲染四 tab，保存/取消回调 onOpenChange(false)', () => {
    const onOpenChange = vi.fn();
    render(<SettingsDialog open onOpenChange={onOpenChange} />);
    expect(screen.getByText('系统设置')).toBeInTheDocument();
    expect(screen.getByText('外观设置')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '保存设置' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('取消回调', () => {
    const onOpenChange = vi.fn();
    render(<SettingsDialog open onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('外观开关联动 + 通知/隐私/高级 tab 内容', () => {
    render(<SettingsDialog open onOpenChange={() => {}} />);
    fireEvent.click(rowSwitch('紧凑模式'));
    fireEvent.click(rowSwitch('动画效果'));
    clickTab('通知');
    expect(screen.getByText('邮件通知')).toBeInTheDocument();
    fireEvent.click(rowSwitch('桌面通知'));
    clickTab('隐私');
    expect(screen.getByText('公开个人资料')).toBeInTheDocument();
    fireEvent.click(rowSwitch('数据收集'));
    clickTab('高级');
    expect(screen.getByText('清除缓存数据')).toBeInTheDocument();
    expect(screen.getByText('导出系统日志')).toBeInTheDocument();
  });
});

// ---------- ProfileDialog ----------
describe('ProfileDialog（个人资料对话框）', () => {
  it('open 渲染基本信息并可编辑', () => {
    render(<ProfileDialog open onOpenChange={() => {}} />);
    expect(screen.getByText('个人资料')).toBeInTheDocument();
    const name = document.getElementById('name') as HTMLInputElement;
    expect(name.value).toBe('系统管理员');
    fireEvent.change(name, { target: { value: '新管理员' } });
    expect((document.getElementById('name') as HTMLInputElement).value).toBe('新管理员');
    expect(screen.getByText('信息技术部')).toBeInTheDocument();
  });

  it('相机按钮触发头像上传 toast', async () => {
    const { Toaster } = await import('@yyc3/ui');
    render(
      <div>
        <ProfileDialog open onOpenChange={() => {}} />
        <Toaster />
      </div>,
    );
    const cameraBtn = document.querySelector('button.rounded-full');
    expect(cameraBtn).not.toBeNull();
    fireEvent.click(cameraBtn as HTMLElement);
    expect(await screen.findByText('头像上传功能开发中...')).toBeInTheDocument();
  });

  it('保存流程：loading → 1s 后回调关闭', async () => {
    const onOpenChange = vi.fn();
    render(<ProfileDialog open onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: /保存更改/ }));
    expect(screen.getByText(/保存中/)).toBeInTheDocument();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false), { timeout: 3000 });
  }, 10000);

  it('联系方式 tab 与安全设置 tab', () => {
    render(<ProfileDialog open onOpenChange={() => {}} />);
    clickTab('联系方式');
    expect((document.getElementById('email') as HTMLInputElement).value).toBe('admin@jinlan.com');
    clickTab('安全设置');
    expect(screen.getByText('更改密码')).toBeInTheDocument();
    expect(document.getElementById('currentPassword')).not.toBeNull();
  });
});

// ---------- GlobalSearchDialog ----------
describe('GlobalSearchDialog（全局搜索对话框）', () => {
  const setup = () => {
    const onOpenChange = vi.fn();
    const onSearch = vi.fn(async () => {});
    render(
      <GlobalSearchDialog open onOpenChange={onOpenChange} onSearch={onSearch} isLoading={false} />,
    );
    return { onOpenChange, onSearch };
  };

  it('空查询显示最近搜索', () => {
    setup();
    expect(screen.getByText('全局搜索')).toBeInTheDocument();
    expect(screen.getByText('最近搜索')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '客户管理' })).toBeInTheDocument();
  });

  it('搜索命中并展示类型徽标，点击结果关闭', async () => {
    const { onOpenChange, onSearch } = setup();
    const input = screen.getByPlaceholderText('搜索客户、任务、文档...');
    fireEvent.change(input, { target: { value: '张三' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(await screen.findByText('张三 - 重要客户')).toBeInTheDocument();
    expect(screen.getByText('客户')).toBeInTheDocument();
    expect(onSearch).toHaveBeenCalledWith('张三');
    fireEvent.click(screen.getByText('张三 - 重要客户'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('按钮搜索与空态', async () => {
    setup();
    const input = screen.getByPlaceholderText('搜索客户、任务、文档...');
    fireEvent.change(input, { target: { value: '不存在的关键词xyz' } });
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    expect(await screen.findByText('未找到相关结果')).toBeInTheDocument();
  });

  it('最近搜索词点击直接搜索', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: '客户管理' }));
    expect(await screen.findByText('未找到相关结果')).toBeInTheDocument();
  });
});

// ---------- DataImportExport ----------
describe('DataImportExport（数据导入导出）', () => {
  it('导入默认态：选文件后出现开始导入', () => {
    render(<DataImportExport type="customer" />);
    expect(screen.getByText('导入客户数据')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /开始导入/ })).not.toBeInTheDocument();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['a,b'], '客户.csv', { type: 'text/csv' });
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('客户.csv')).toBeInTheDocument();
    expect(screen.getByText('2.00 MB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /开始导入/ })).toBeInTheDocument();
  });

  it('导入全流程：四步进度→结果网格与错误行', async () => {
    vi.useFakeTimers();
    const onImport = vi.fn();
    render(<DataImportExport type="customer" onImport={onImport} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'data.csv', { type: 'text/csv' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: /开始导入/ }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('第15行')).toBeInTheDocument();
    expect(screen.getByText('手机号格式不正确')).toBeInTheDocument();
    expect(onImport).toHaveBeenCalledWith([]);
  });

  it('导出流程：CSV 格式选择→下载→回调', async () => {
    vi.useFakeTimers();
    stubObjectURL();
    const onExport = vi.fn();
    render(<DataImportExport type="customer" onExport={onExport} />);
    clickTab('数据导出');
    expect(screen.getByText('导出客户数据')).toBeInTheDocument();
    expect(screen.getByText('客户等级')).toBeInTheDocument();
    fireEvent.click(screen.getByText('CSV (.csv)'));
    fireEvent.click(screen.getByRole('button', { name: /开始导出/ }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(onExport).toHaveBeenCalledWith('csv', {});
  });

  it('task 类型显示任务状态筛选', () => {
    render(<DataImportExport type="task" />);
    clickTab('数据导出');
    expect(screen.getByText('任务状态')).toBeInTheDocument();
    expect(screen.queryByText('客户等级')).not.toBeInTheDocument();
  });
});

// ---------- AvatarUpload 深链路 ----------
describe('AvatarUpload（上传全流程）', () => {
  it('选有效图片→预览对话框与缩放控件', () => {
    stubObjectURL();
    const onAvatarChange = vi.fn();
    render(<AvatarUpload fallbackText="测" onAvatarChange={onAvatarChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['img'], 'avatar.png', { type: 'image/png' })] },
    });
    expect(screen.getByText('上传头像')).toBeInTheDocument();
    expect(screen.getByText('预览')).toBeInTheDocument();
    expect(screen.getByText('缩放: 100%')).toBeInTheDocument();
    // 放大/缩小（图标按钮）
    fireEvent.click(document.querySelector('svg.lucide-zoom-in')?.closest('button') as HTMLElement);
    expect(screen.getByText('缩放: 110%')).toBeInTheDocument();
    fireEvent.click(document.querySelector('svg.lucide-zoom-out')?.closest('button') as HTMLElement);
    expect(screen.getByText('缩放: 100%')).toBeInTheDocument();
    fireEvent.click(document.querySelector('svg.lucide-rotate-ccw')?.closest('button') as HTMLElement);
  });

  it('确认上传全流程：进度→回调→关闭', async () => {
    vi.useFakeTimers();
    stubObjectURL();
    const onAvatarChange = vi.fn();
    render(<AvatarUpload fallbackText="测" onAvatarChange={onAvatarChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['img'], 'avatar.png', { type: 'image/png' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: /确认上传/ }));
    expect(screen.getByText(/上传中/)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2800);
    });
    expect(onAvatarChange).toHaveBeenCalledWith('blob:mock-2');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(screen.queryByText('上传头像')).not.toBeInTheDocument();
  });

  it('超大图片触发文件过大 toast', async () => {
    const { Toaster } = await import('@yyc3/ui');
    render(
      <div>
        <AvatarUpload fallbackText="测" onAvatarChange={() => {}} />
        <Toaster />
      </div>,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const big = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [big] } });
    expect(await screen.findByText(/文件过大/)).toBeInTheDocument();
  }, 10000);
});

// ---------- LogoManager 深链路 ----------
describe('LogoManager（Logo 管理深链路）', () => {
  it('打开对话框→模板切换→保存回调与事件', async () => {
    const user = userEvent.setup();
    const onLogoChange = vi.fn();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    render(<LogoManager onLogoChange={onLogoChange} />);
    await user.click(screen.getByRole('button', { name: /标志设置/ }));
    expect(await screen.findByText('企业标志管理')).toBeInTheDocument();
    // 左右科技模板
    fireEvent.click(screen.getByText('左右科技'));
    const title = document.getElementById('company-title') as HTMLInputElement;
    expect(title.value).toBe('左右科技有限公司');
    fireEvent.click(screen.getByRole('button', { name: /保存设置/ }));
    expect(onLogoChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: '左右科技有限公司', type: 'default' }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'logoUpdated' }),
    );
    expect(localStorage.getItem('companyLogo')).toContain('左右科技');
    expect(screen.queryByText('企业标志管理')).not.toBeInTheDocument();
  });

  it('编辑标题→恢复默认', async () => {
    const user = userEvent.setup();
    render(<LogoManager />);
    await user.click(screen.getByRole('button', { name: /标志设置/ }));
    await screen.findByText('企业标志管理');
    const title = document.getElementById('company-title') as HTMLInputElement;
    fireEvent.change(title, { target: { value: '自定义企业' } });
    expect(title.value).toBe('自定义企业');
    fireEvent.click(screen.getByRole('button', { name: /恢复默认/ }));
    expect((document.getElementById('company-title') as HTMLInputElement).value).toBe(
      '言语云企业管理系统',
    );
    expect(localStorage.getItem('companyLogo')).toBeNull();
  });
});

// ---------- AiSmartForms 深链路 ----------
describe('AiSmartForms（智能表单深链路）', () => {
  it('NFC 触发自动填充', () => {
    render(<AiSmartForms />);
    fireEvent.click(screen.getByRole('button', { name: /NFC触发/ }));
    expect((screen.getByPlaceholderText('输入客户名称') as HTMLInputElement).value).toBe('万科地产');
    expect((screen.getByPlaceholderText('输入联系人') as HTMLInputElement).value).toBe('李经理');
    expect((screen.getByPlaceholderText('输入联系电话') as HTMLInputElement).value).toBe(
      '13900139000',
    );
    expect((screen.getByPlaceholderText('输入邮箱地址') as HTMLInputElement).value).toBe(
      'li.manager@vanke.com',
    );
  });

  it('语音输入全流程（3s 识别）', async () => {
    vi.useFakeTimers();
    render(<AiSmartForms />);
    fireEvent.click(screen.getByRole('button', { name: /语音输入/ }));
    expect(screen.getByText('录音中...')).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3200);
    });
    expect((screen.getByPlaceholderText('输入客户名称') as HTMLInputElement).value).toBe('华润集团');
    expect((screen.getByPlaceholderText('输入联系人') as HTMLInputElement).value).toBe('张总');
    expect(screen.getByRole('button', { name: /语音输入/ })).toBeInTheDocument(); // 恢复态
  });

  it('AI 智能填充（2s 分析）', async () => {
    vi.useFakeTimers();
    render(<AiSmartForms />);
    const aiBtn = screen.getByRole('button', { name: /AI智能填充/ });
    fireEvent.click(aiBtn);
    expect(aiBtn).toBeDisabled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2200);
    });
    expect((screen.getByPlaceholderText('输入跟进内容') as HTMLTextAreaElement).value).toContain(
      '基于客户历史数据分析',
    );
    expect((screen.getByPlaceholderText('输入下步行动') as HTMLTextAreaElement).value).toBe(
      '发送3D设计方案',
    );
  });

  it('空必填提交被拦（destructive toast）', async () => {
    const { Toaster } = await import('@yyc3/ui');
    render(
      <div>
        <AiSmartForms />
        <Toaster />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: '提交表单' }));
    expect(await screen.findByText(/提交失败/)).toBeInTheDocument();
  }, 10000);

  it('填写必填后提交成功并跳转', async () => {
    vi.useFakeTimers();
    render(<AiSmartForms />);
    fireEvent.change(screen.getByPlaceholderText('输入客户名称'), {
      target: { value: '测试客户' },
    });
    fireEvent.change(screen.getByPlaceholderText('输入联系人'), { target: { value: '王先生' } });
    fireEvent.click(screen.getByRole('button', { name: '提交表单' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(pushMock).toHaveBeenCalledWith('/customers');
  });

  it('重置表单清空', () => {
    render(<AiSmartForms />);
    fireEvent.click(screen.getByRole('button', { name: /NFC触发/ }));
    fireEvent.click(screen.getByRole('button', { name: '重置表单' }));
    expect((screen.getByPlaceholderText('输入客户名称') as HTMLInputElement).value).toBe('');
  });

  it('模板选择切换表单标题', () => {
    render(<AiSmartForms />);
    // 模板网格中的会议记录表（最近表单区也有同名 → 取首个）
    fireEvent.click(screen.getAllByText('会议记录表')[0]);
    // 表单头 h3 由「销售日报表」切为「会议记录表」
    const h3 = screen.getAllByText('会议记录表').find((el) => el.tagName === 'H3');
    expect(h3).not.toBeUndefined();
  });
});
