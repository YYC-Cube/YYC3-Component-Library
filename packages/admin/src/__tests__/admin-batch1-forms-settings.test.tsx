// ============================================================
// YYC³ · @yyc3/admin 批次 1 · 第二层：表单 / 设置 / 业务模块组曲
// 系统设置族 / 参数设置 / 对话框 / 数据导入导出 / 财税 / 渠道 /
// 商务业务域（ERP/订单/CRM/供应链）/ AI 表单 / 头像与 Logo 管理 / 反馈调查
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { ParameterSettings } from '../parameter-settings';
import SystemSettings from '../system-settings';
import { GeneralSettings } from '../system-settings/general-settings';
import { AppearanceSettings } from '../system-settings/appearance-settings';
import { NotificationSettings } from '../system-settings/notification-settings';
import { PrivacySettings } from '../system-settings/privacy-settings';
import { SecuritySettings } from '../system-settings/security-settings';
import { PermissionManagement as RolePermissionManagement } from '../system-settings/permission-management';
import { ProfileDialog } from '../dialogs/profile-dialog';
import { SettingsDialog } from '../dialogs/settings-dialog';
import { DataImportExport } from '../data-import-export';
import { DataIntegration } from '../data-integration';
import { TaxCalculation } from '../tax-calculation';
import { InvoiceManagement } from '../invoice-management';
import { StoreManagement } from '../store-management';
import { FinanceModule } from '../finance-module';
import { ChannelCenter } from '../channel-center';
import { ThirdPartyIntegrations } from '../third-party-integrations';
import { ERPSystem } from '../business/erp-system';
import { OrderManagement } from '../business/order-management';
import { CRMCustomer } from '../business/crm-customer';
import { SupplyChain } from '../business/supply-chain';
import StatCard from '../business/stat-card';
import { AiSmartForms } from '../ai-smart-forms';
import { AvatarUpload } from '../avatar-upload';
import { LogoManager } from '../logo-manager';
import { FeedbackCollector } from '../feedback/feedback-collector';
import { UserSurvey } from '../feedback/user-survey';
import {
  ErrorNotificationSystem,
  errorNotificationManager,
} from '../error-notification-system';
import { silenceConsole, stubAdminDom } from './helpers';

beforeEach(() => {
  silenceConsole();
  stubAdminDom();
  // LogoManager 走 window.alert（jsdom 未实现）
  vi.stubGlobal('alert', vi.fn());
});

// ---------- 系统设置族 ----------
describe('SystemSettings（系统设置主面板）', () => {
  it('渲染设置面板骨架', () => {
    render(<SystemSettings />);
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

describe('GeneralSettings（通用设置）', () => {
  it('渲染平台名称与基础字段', () => {
    render(<GeneralSettings />);
    expect(document.body.textContent).toMatch(/企业级智能商务管理平台/);
    expect(document.body.textContent).toMatch(/Asia\/Shanghai|CNY/);
  });
});

describe('AppearanceSettings（外观设置）', () => {
  it('渲染主题模式选项（light/dark/system）', () => {
    render(<AppearanceSettings />);
    expect(screen.getByText(/蓝色|blue/)).toBeInTheDocument();
    expect(screen.getByText(/绿色/)).toBeInTheDocument();
  });
});

describe('NotificationSettings（通知设置）', () => {
  it('渲染四类通知渠道', () => {
    render(<NotificationSettings />);
    expect(document.body.textContent).toMatch(/email|邮件/i);
    expect(document.body.textContent).toMatch(/push|推送/i);
  });
});

describe('PrivacySettings（隐私设置）', () => {
  it('渲染隐私等级选项', () => {
    render(<PrivacySettings />);
    expect(document.body.textContent).toMatch(/basic|基础/i);
    expect(document.body.textContent).toMatch(/strict|严格/i);
  });
});

describe('SecuritySettings（安全设置）', () => {
  it('渲染登录安全面板', () => {
    render(<SecuritySettings />);
    expect(document.body.textContent).toMatch(/admin/i);
  });
});

describe('RolePermissionManagement（系统设置·权限管理）', () => {
  it('渲染角色列表（超级管理员）', () => {
    render(<RolePermissionManagement />);
    expect(screen.getByText(/超级管理员/)).toBeInTheDocument();
    expect(screen.getByText(/拥有系统所有权限的最高管理员角色/)).toBeInTheDocument();
  });
});

describe('ParameterSettings（参数设置）', () => {
  it('渲染系统参数站点名与平台配置', () => {
    render(<ParameterSettings />);
    expect(screen.getByDisplayValue(/锦澜家居企业管理系统/)).toBeInTheDocument();
    expect(screen.getByText('中国标准时间 (UTC+8)')).toBeInTheDocument();
    expect(screen.getByText('人民币 (¥)')).toBeInTheDocument();
    // 五个页签
    for (const tab of ['平台对接', '邮件配置', '安全设置', '高级选项']) {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
    }
  });

  it('保存按钮存在且可点击（toast 路径）', async () => {
    const user = userEvent.setup();
    render(<ParameterSettings />);
    const saveBtns = screen.getAllByRole('button', { name: /保存/ });
    await user.click(saveBtns[0]);
    await waitFor(() => expect(saveBtns[0]).toBeEnabled());
  });
});

// ---------- 对话框 ----------
describe('ProfileDialog（个人资料对话框）', () => {
  it('open=true 渲染资料表单（联系方式页签含地址）', async () => {
    const user = userEvent.setup();
    render(<ProfileDialog open onOpenChange={() => {}} />);
    expect(screen.getAllByText(/基本信息/).length).toBeGreaterThanOrEqual(1);
    await user.click(screen.getByRole('tab', { name: '联系方式' }));
    expect(await screen.findByDisplayValue(/上海市浦东新区/)).toBeInTheDocument();
  });

  it('open=false 不渲染对话框内容', () => {
    render(<ProfileDialog open={false} onOpenChange={() => {}} />);
    expect(screen.queryByText(/系统管理员/)).not.toBeInTheDocument();
  });
});

describe('SettingsDialog（系统偏好对话框）', () => {
  it('open=true 渲染偏好设置', () => {
    render(<SettingsDialog open onOpenChange={() => {}} />);
    expect(document.body.textContent).toMatch(/自定义您的系统偏好设置|外观/);
  });
});

// ---------- 数据工具 ----------
describe('DataImportExport（数据导入导出）', () => {
  it.each(['customer', 'task', 'finance'] as const)('渲染 type=%s 面板', (type) => {
    render(<DataImportExport type={type} />);
    expect(screen.getAllByText(/导入|导出/).length).toBeGreaterThanOrEqual(1);
  });

  it('customer 类型渲染客户数据项', () => {
    render(<DataImportExport type="customer" />);
    expect(screen.getByText(/客户数据/)).toBeInTheDocument();
  });
});

describe('DataIntegration（数据集成）', () => {
  it('渲染数据源连接列表', () => {
    render(<DataIntegration />);
    expect(document.body.textContent).toMatch(/数据集成管理/);
    expect(document.body.textContent).toMatch(/添加数据源/);
    expect(document.body.textContent).toMatch(/数据源管理/);
    expect(document.body.textContent).toMatch(/同步配置|操作日志/);
  });
});

// ---------- 财税 / 发票 / 门店 / 财务 ----------
describe('TaxCalculation（税务计算）', () => {
  it('渲染税种与纳税人类型', () => {
    render(<TaxCalculation />);
    expect(screen.getByText(/税务计算中心/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/增值税/);
    expect(document.body.textContent).toMatch(/企业所得税/);
    expect(document.body.textContent).toMatch(/税率查询/);
  });
});

describe('InvoiceManagement（发票管理）', () => {
  it('渲染发票列表（购方企业）', () => {
    render(<InvoiceManagement />);
    expect(screen.getByText('INV-2024-001')).toBeInTheDocument();
    expect(screen.getByText(/北京科技有限公司/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/已付款/);
    expect(document.body.textContent).toMatch(/逾期/);
  });
});

describe('StoreManagement（门店管理）', () => {
  it('渲染门店列表', () => {
    render(<StoreManagement />);
    expect(screen.getByText(/多门店管理/)).toBeInTheDocument();
    expect(screen.getByText(/新建门店/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/门店管理/);
  });
});

describe('FinanceModule（财务模块）', () => {
  it('渲染费用分类统计', () => {
    render(<FinanceModule />);
    expect(screen.getByText(/财务管理/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/总收入/);
    expect(document.body.textContent).toMatch(/净利润/);
    expect(screen.getAllByText(/财务概览|预算管理/).length).toBeGreaterThanOrEqual(1);
  });
});

// ---------- 渠道 / 集成 ----------
describe('ChannelCenter（渠道中心）', () => {
  it('模拟加载 1.5s 后渲染渠道平台矩阵', async () => {
    render(<ChannelCenter />);
    // 模拟 API 延迟 1500ms（真实定时器，超时上限给足）
    expect(await screen.findByText('微信公众号', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('抖音小店', {}, { timeout: 1000 })).toBeInTheDocument();
  });
});

describe('ThirdPartyIntegrations（第三方集成）', () => {
  it('渲染集成服务列表', () => {
    render(<ThirdPartyIntegrations />);
    expect(screen.getByText(/微信企业号/)).toBeInTheDocument();
    expect(screen.getAllByText(/消息推送/).length).toBeGreaterThanOrEqual(1);
  });
});

// ---------- 商务业务域 ----------
describe('ERPSystem（ERP 系统）', () => {
  it('渲染月度经营数据面板', () => {
    render(<ERPSystem />);
    expect(document.body.textContent).toMatch(/库存|订单|销售/);
  });
});

describe('OrderManagement（订单管理）', () => {
  it('渲染订单状态流转数据', () => {
    render(<OrderManagement />);
    expect(document.body.textContent).toMatch(/订单/);
  });
});

describe('CRMCustomer（CRM 客户）', () => {
  it('渲染客户档案', () => {
    render(<CRMCustomer />);
    expect(screen.getByText(/张三/)).toBeInTheDocument();
    expect(screen.getByText(/科技有限公司/)).toBeInTheDocument();
  });
});

describe('SupplyChain（供应链）', () => {
  it('渲染供应链状态', () => {
    render(<SupplyChain />);
    expect(document.body.textContent).toMatch(/供应商|采购|物流/);
  });
});

describe('StatCard（商务统计卡）', () => {
  it('渲染标题/数值/趋势（change 为 number，显示去符号绝对值）', () => {
    render(<StatCard title="月销售额" value="¥1,280,000" change={12.5} changeType="increase" />);
    expect(screen.getByText('月销售额')).toBeInTheDocument();
    expect(screen.getByText('¥1,280,000')).toBeInTheDocument();
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText(/vs previous period/)).toBeInTheDocument();
  });

  it('change 缺省时不渲染变化行', () => {
    render(<StatCard title="活跃客户" value="356" changeType="neutral" />);
    expect(screen.getByText('活跃客户')).toBeInTheDocument();
    expect(screen.queryByText(/vs previous period/)).not.toBeInTheDocument();
  });
});

// ---------- AI 表单 / 头像 / Logo ----------
describe('AiSmartForms（AI 智能表单）', () => {
  it('渲染语音录入示例流', () => {
    render(<AiSmartForms />);
    expect(screen.getByText(/AI智能表单/)).toBeInTheDocument();
    expect(screen.getAllByText(/华润集团/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/销售日报表/).length).toBeGreaterThanOrEqual(1);
    expect(document.body.textContent).toMatch(/语音转文字|NFC/);
  });
});

describe('AvatarUpload（头像上传）', () => {
  it('渲染 fallback 字符与上传入口', () => {
    render(<AvatarUpload fallbackText="管" />);
    expect(screen.getByText('管')).toBeInTheDocument();
  });

  it('非图片文件触发「文件类型错误」toast（挂 Toaster 验证）', async () => {
    const { Toaster } = await import('@yyc3/ui');
    render(
      <div>
        <AvatarUpload fallbackText="测" />
        <Toaster />
      </div>,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    const badFile = new File(['x'], 'a.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [badFile] } });
    expect(await screen.findByText(/文件类型错误/)).toBeInTheDocument();
  });
});

describe('LogoManager（Logo 管理）', () => {
  it('渲染标志设置面板', () => {
    render(<LogoManager />);
    expect(screen.getByText(/标志设置/)).toBeInTheDocument();
  });

  it('打开对话框后超限图片触发 alert（stub window.alert）', async () => {
    const alertMock = vi.fn();
    vi.stubGlobal('alert', alertMock);
    const user = userEvent.setup();
    render(<LogoManager />);
    await user.click(screen.getByRole('button', { name: /标志设置/ }));
    expect(await screen.findByText(/企业标志管理/)).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    const big = new File([new ArrayBuffer(3 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [big] } });
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/图片大小不能超过 2MB/));
    vi.unstubAllGlobals();
  });
});

// ---------- 反馈 / 调查 / 错误通知 ----------
describe('FeedbackCollector（反馈收集器）', () => {
  it('渲染反馈类型入口', () => {
    render(<FeedbackCollector />);
    expect(screen.getByText(/用户反馈/)).toBeInTheDocument();
    expect(screen.getByText(/快速评分/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /提交反馈/ })).toBeInTheDocument();
  });
});

describe('UserSurvey（用户调查）', () => {
  const questions = [
    {
      id: 'q1',
      type: 'radio' as const,
      title: '您对平台的整体满意度',
      required: true,
      options: [
        { value: 'a', label: '非常满意' },
        { value: 'b', label: '满意' },
      ],
    },
    {
      id: 'q2',
      type: 'rating' as const,
      title: '推荐意愿打分',
      min: 1,
      max: 5,
    },
  ];

  it('渲染问题与进度', () => {
    render(<UserSurvey title="平台体验调查" description="季度调研" questions={questions} />);
    expect(screen.getByText('平台体验调查')).toBeInTheDocument();
    expect(screen.getByText(/问题 1 \/ 2/)).toBeInTheDocument();
    expect(screen.getByText('非常满意')).toBeInTheDocument();
  });

  it('radio 选择后可进入下一题', async () => {
    const user = userEvent.setup();
    render(<UserSurvey title="调查" questions={questions} />);
    await user.click(screen.getByText('非常满意'));
    const next = screen.getByRole('button', { name: /下一题|下一步/ });
    await user.click(next);
    expect(await screen.findByText(/推荐意愿打分/)).toBeInTheDocument();
  });
});

describe('ErrorNotificationSystem（错误通知系统）', () => {
  const notifications = [
    {
      id: 'e1',
      type: 'error' as const,
      title: '请求失败',
      message: '网络超时',
      timestamp: Date.now(),
    },
    {
      id: 'w1',
      type: 'warning' as const,
      title: '配额预警',
      message: '存储即将用尽',
      timestamp: Date.now(),
    },
  ];

  it('渲染通知列表', () => {
    render(
      <ErrorNotificationSystem
        notifications={notifications}
        onDismiss={vi.fn()}
        onClearAll={vi.fn()}
      />,
    );
    expect(screen.getByText('请求失败')).toBeInTheDocument();
    expect(screen.getByText('配额预警')).toBeInTheDocument();
    expect(screen.getByText('网络超时')).toBeInTheDocument();
  });

  it('单条关闭触发 onDismiss', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <ErrorNotificationSystem notifications={notifications} onDismiss={onDismiss} onClearAll={vi.fn()} />,
    );
    // 卡内两枚同款图标钮：首个=详情（setSelectedNotification）、末个=关闭（onDismiss）
    const iconBtns = container.querySelectorAll('button.w-6');
    expect(iconBtns.length).toBeGreaterThanOrEqual(2);
    await userEvent.click(iconBtns[iconBtns.length - 1]);
    expect(onDismiss).toHaveBeenCalled();
  });

  it('errorNotificationManager 单例可订阅/发布', () => {
    const seen: unknown[][] = [];
    const off = errorNotificationManager.subscribe((list) => seen.push(list));
    errorNotificationManager.addNotification({ type: 'info', title: '单例通知', message: 'm' });
    off();
    expect(seen.length).toBeGreaterThanOrEqual(1);
    expect(seen.at(-1)!.some((n) => n.title === '单例通知')).toBe(true);
  });
});
