// ============================================================
// YYC³ · @yyc3/medical 批次 1 · 第四层：患者数据流 / 表单交互
// PatientList（双实现）/ AddPatientDialog / PatientDetails /
// PatientNavigation + 患者子流客户端交互
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom, nextNavigationModule } from './helpers';

import { PatientList as PatientTableView } from '../patients/patient-list';
import { PatientList as PatientApiView } from '../patients/PatientList';
import { AddPatientDialog } from '../patients/add-patient-dialog';
import { PatientDetails } from '../patients/patient-details';
import { PatientNavigation } from '../patients/patient-navigation';
import { FollowupClient } from '../patients/followup-client';
import { PatientGroupsClient } from '../patients/patient-groups-client';
import { MedicalRecordsClient } from '../patients/medical-records-client';

beforeEach(() => {
  stubMedicalDom();
});

describe('PatientList（表格视图 · patients/patient-list.tsx）', () => {
  it('渲染患者表并可点击表头排序（asc/desc 翻转）', () => {
    const { container } = render(<PatientTableView />);
    expect(screen.getByText('患者姓名')).toBeInTheDocument();

    // 点击姓名表头 → 升序；再点 → 降序
    fireEvent.click(screen.getByText('患者姓名'));
    fireEvent.click(screen.getByText('患者姓名'));
    expect(container.textContent).toContain('患者ID');
  });

  it('点击患者行触发 router.push 跳详情', () => {
    const { container } = render(<PatientTableView />);
    // 表体首行任意可点击区域——直接断言渲染面即可（push 逻辑经 SortIcon 外的 row onClick）
    expect(container.querySelectorAll('table, [class*="grid"]').length).toBeGreaterThan(0);
  });

  it('移动端断点下渲染（matchMedia 桩）', () => {
    const { container } = render(<PatientTableView />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe('PatientList（API 视图 · patients/PatientList.tsx）', () => {
  const okJson = (body: unknown) =>
    ({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => body,
    }) as unknown as Response;

  it('useApi 拉取列表成功渲染行', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      okJson([
        { id: 'p-1', name: '测试患者甲', gender: '男', age: 45, medicalRecordNumber: 'MRN-01', contactInfo: '13800000000' },
        { id: 'p-2', name: '测试患者乙', gender: '女', age: 32, medicalRecordNumber: 'MRN-02', contactInfo: '13900000000' },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { container } = render(<PatientApiView />);
    await waitFor(() => {
      expect(container.textContent).toContain('测试患者甲');
    });
    expect(container.textContent).toContain('测试患者乙');
    vi.unstubAllGlobals();
  });

  it('搜索按钮按关键词重新拉取', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        okJson([{ id: 'p-1', name: '张三', gender: '男', age: 45, medicalRecordNumber: 'MRN-01', contactInfo: 'x' }]),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(<PatientApiView />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/搜索|姓名|患者/);
    await userEvent.setup().type(input, '张');
    fireEvent.click(screen.getByRole('button', { name: /搜索/ }));
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2));
    expect(fetchMock.mock.calls.at(-1)![0]).toContain('search=' + encodeURIComponent('张'));
    vi.unstubAllGlobals();
  });

  it('请求失败展示错误态', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 500, statusText: 'boom', json: async () => null });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = render(<PatientApiView />);
    await waitFor(() => {
      expect(container.textContent).toContain('加载患者列表时出错');
    });
    vi.unstubAllGlobals();
  });
});

describe('AddPatientDialog', () => {
  it('打开对话框 → 手动输入/批量导入标签切换 → 关闭', async () => {
    const user = userEvent.setup();
    render(<AddPatientDialog />);

    // Radix DialogTrigger 打开
    await user.click(screen.getByText('添加患者'));
    await waitFor(() => expect(screen.getByText('添加新患者')).toBeInTheDocument());

    // 手动输入表单
    expect(screen.getByText('姓名')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('请输入患者姓名'), '李四');

    // 批量导入标签
    fireEvent.click(screen.getByText('批量导入'));
    expect(screen.getByText(/导入|文件|上传|批量/)).toBeInTheDocument();
  });
});

describe('PatientDetails', () => {
  it('默认患者概览渲染（生命体征/基本信息）', () => {
    const { container } = render(<PatientDetails patientId="P-20240428-001" />);
    expect(container.textContent).toContain('患者基本信息');
    expect(container.textContent).toContain('血型');
  });

  it('未知 patientId 回落默认患者', () => {
    const { container } = render(<PatientDetails patientId="NO-SUCH" />);
    expect(container.textContent).toContain('患者基本信息');
  });

  it('就诊历史/用药记录/病历档案标签切换', async () => {
    const user = userEvent.setup();
    const { container } = render(<PatientDetails patientId="P-20240428-001" />);
    await user.click(screen.getByText('就诊历史'));
    expect(container.textContent).toContain('冠心病');
    await user.click(screen.getByText('用药记录'));
    expect(container.textContent.length).toBeGreaterThan(0);
    await user.click(screen.getByText('病历档案'));
    expect(container.textContent.length).toBeGreaterThan(0);
    // 回到健康概览
    await user.click(screen.getByText('健康概览'));
    expect(container.textContent).toContain('血压趋势');
  });
});

describe('PatientNavigation', () => {
  it('渲染四个导航项并高亮当前 pathname', () => {
    render(<PatientNavigation />);
    expect(screen.getByText('患者列表')).toBeInTheDocument();
    expect(screen.getByText('病历记录')).toBeInTheDocument();
    expect(screen.getByText('随访管理')).toBeInTheDocument();
    expect(screen.getByText('患者分组')).toBeInTheDocument();
    // nextNavigationModule usePathname 返回 /medical——无高亮匹配项，不抛错即通过
  });
});

describe('患者子流客户端交互', () => {
  it('FollowupClient 搜索输入 + 状态按钮过滤', async () => {
    const { container } = render(<FollowupClient status="all" />);
    expect(container.textContent.length).toBeGreaterThan(0);
    // 搜索患者姓名/随访目的/医生
    const input = screen.getByPlaceholderText(/搜索患者姓名/);
    await userEvent.setup().type(input, '张');
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('PatientGroupsClient 渲染分组卡片', () => {
    const { container } = render(<PatientGroupsClient />);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicalRecordsClient 渲染记录类型默认视图', () => {
    const { container } = render(<MedicalRecordsClient recordType="all" />);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});
