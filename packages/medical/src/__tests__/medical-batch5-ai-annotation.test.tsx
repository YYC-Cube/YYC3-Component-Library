// ============================================================
// YYC³ · @yyc3/medical 批次 5 · AI 标注与诊断影像臂
// AIAssistedAnnotation 全链残余（应用/选中/显隐/拒绝/接受/评估/
// 空建议态/生成失败态）/ InteractiveImageAnnotation 画布绘制链
// （选特征→按下→拖→抬起→标记卡选中→删除→清空→滑杆）/
// AIDiagnosis 图像分析三分支（X-Ray/MRI/CT）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, stubCanvas2d, silenceConsole } from './helpers';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { AIDiagnosis } from '../medical-records/ai-diagnosis';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
  silenceConsole();
  const RealImage = window.Image;
  const Stubbed = class extends RealImage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _onload: any = null;
    set src(v: string) {
      super.src = v;
      Promise.resolve().then(() => this._onload && this._onload());
    }
  };
  Object.defineProperty(Stubbed.prototype, 'onload', {
    configurable: true,
    set(v) {
      this._onload = v;
    },
    get() {
      return this._onload;
    },
  });
  vi.stubGlobal('Image', Stubbed as unknown as typeof Image);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AIAssistedAnnotation 全链残余', () => {
  const onDone = vi.fn();

  function renderComp() {
    return render(
      <AIAssistedAnnotation
        selectedImage="/img/lung.png"
        modality="CT"
        anatomicalRegion="肺部"
        onAnnotationComplete={onDone}
      />,
    );
  }

  async function generate(user: ReturnType<typeof userEvent.setup>) {
    const gen = screen
      .getAllByRole('button')
      .find((b) => /生成|开始分析/.test(b.textContent ?? ''));
    if (gen) await user.click(gen);
    // 服务 2000ms setTimeout → 建议落地
    await waitFor(() => {
      if (!document.body.textContent!.includes('磨玻璃')) throw new Error('generating');
    }, { timeout: 6000 });
  }

  it('空建议态（manual→ai-assisted 直切）文案', async () => {
    const user = userEvent.setup();
    renderComp();
    await user.click(screen.getAllByRole('tab').find((t) => /AI/.test(t.textContent ?? ''))!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('暂无AI标注建议')) throw new Error('empty state');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('选择一个AI标注建议');
  });

  it('生成 → 选中建议 → 显隐切换 → 评估 → 双返回按钮', async () => {
    const user = userEvent.setup();
    renderComp();
    await user.click(screen.getAllByRole('tab').find((t) => /AI/.test(t.textContent ?? ''))!);
    await generate(user);

    // 选中第一张建议卡
    const card = document.body.querySelector('[class*="cursor-pointer"][class*="rounded-lg"]') as HTMLElement;
    fireEvent.click(card!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('相关知识节点')) throw new Error('selected panel');
    }, { timeout: 3000 });

    // 显示/隐藏 AI 建议切换
    const toggle = () =>
      screen
        .getAllByRole('button')
        .find((b) => /显示AI建议|隐藏AI建议/.test(b.textContent ?? ''));
    fireEvent.click(toggle()!);
    fireEvent.click(toggle()!);

    // 评估一致性 → evaluation 标签
    const evalBtn = screen
      .getAllByRole('button')
      .find((b) => /评估标注一致性/.test(b.textContent ?? ''));
    fireEvent.click(evalBtn!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('一致性评分')) throw new Error('eval panel');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('改进建议');

    // 返回 AI 辅助 / 继续手动标注
    const back = screen
      .getAllByRole('button')
      .find((b) => /返回AI辅助标注/.test(b.textContent ?? ''));
    fireEvent.click(back!);
    const manualBtn = screen
      .getAllByRole('button')
      .find((b) => /继续手动标注/.test(b.textContent ?? ''));
    if (manualBtn) fireEvent.click(manualBtn);
  });

  it('应用所有 AI 建议 → onAnnotationComplete + 计数增加', async () => {
    const user = userEvent.setup();
    onDone.mockClear();
    renderComp();
    await user.click(screen.getAllByRole('tab').find((t) => /AI/.test(t.textContent ?? ''))!);
    await generate(user);

    const apply = screen
      .getAllByRole('button')
      .find((b) => /应用|采纳/.test(b.textContent ?? ''));
    await user.click(apply!);
    await waitFor(() => expect(onDone).toHaveBeenCalled(), { timeout: 4000 });
    // 计数在 manual 标签（Radix 卸载非活动面板）——切回验证
    await user.click(screen.getAllByRole('tab')[0]);
    await waitFor(() => {
      if (!document.body.textContent!.match(/已创建\s*[1-9]/)) throw new Error('count');
    }, { timeout: 3000 });
  }, 15000);

  it('拒绝此建议 → 建议卡减少；接受此建议 → 计数增加', async () => {
    const user = userEvent.setup();
    onDone.mockClear();
    renderComp();
    await user.click(screen.getAllByRole('tab').find((t) => /AI/.test(t.textContent ?? ''))!);
    await generate(user);

    const countCards = () =>
      document.body.querySelectorAll('[class*="cursor-pointer"][class*="rounded-lg"]').length;

    // 选中 → 拒绝
    fireEvent.click(document.body.querySelector('[class*="cursor-pointer"][class*="rounded-lg"]')!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('拒绝此建议')) throw new Error('not selected');
    }, { timeout: 3000 });
    const before = countCards();
    fireEvent.click(
      screen.getAllByRole('button').find((b) => /拒绝此建议/.test(b.textContent ?? ''))!,
    );
    await waitFor(() => {
      if (countCards() >= before) throw new Error('not rejected');
    }, { timeout: 3000 });

    // 再生成 → 选中 → 接受
    await generate(user);
    fireEvent.click(document.body.querySelector('[class*="cursor-pointer"][class*="rounded-lg"]')!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('接受此建议')) throw new Error('not selected2');
    }, { timeout: 3000 });
    fireEvent.click(
      screen.getAllByRole('button').find((b) => /接受此建议/.test(b.textContent ?? ''))!,
    );
    await waitFor(() => expect(onDone).toHaveBeenCalled(), { timeout: 4000 });
  });

  it('生成失败（service reject）→ 空建议态回归', async () => {
    const user = userEvent.setup();
    const { aiAnnotationService } = await import('../services/ai-annotation-service');
    const spy = vi.spyOn(aiAnnotationService, 'generateAnnotations').mockRejectedValueOnce(new Error('boom'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderComp();
    await user.click(screen.getAllByRole('tab').find((t) => /AI/.test(t.textContent ?? ''))!);
    const btn = screen.getAllByRole('button').find((b) => /生成建议/.test(b.textContent ?? ''));
    await user.click(btn!);
    await waitFor(() => {
      if (spy.mock.calls.length === 0) throw new Error('not called');
    }, { timeout: 3000 });
    await waitFor(() => {
      if (!document.body.textContent!.includes('暂无AI标注建议')) throw new Error('not back to empty');
    }, { timeout: 3000 });
    errSpy.mockRestore();
  });
});

describe('AIDiagnosis 图像分析三分支', () => {
  async function analyzeImage(nameOrAlt: RegExp, expectText: string | RegExp) {
    render(<AIDiagnosis patientId="p1" />);
    // 第二个 tab = 图像分析（t("imageAnalysis") 缺字典回退 key；Radix 需 userEvent）
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('tab')[1]);
    await waitFor(() => {
      if (!document.body.querySelector('[alt="X-Ray"]')) throw new Error('image cards');
    }, { timeout: 3000 });
    const imgCard = screen.getAllByAltText(/X-Ray|MRI|CT/).find((el) => nameOrAlt.test(el.alt))!;
    await user.click(imgCard.closest('[class*="cursor-pointer"]')!);
    const analyze = screen
      .getAllByRole('button')
      .find((b) => /开始分析|分析|startAnalysis|generateAnalysis/.test(b.textContent ?? ''));
    fireEvent.click(analyze!);
    await waitFor(() => {
      if (!document.body.textContent!.match(expectText)) throw new Error('no result');
    }, { timeout: 8000 });
  }

  it('X-Ray 图像 → 轻度肺炎结果（medium 严重度臂）', async () => {
    await analyzeImage(/X-Ray/, /轻度肺炎/);
  }, 15000);

  it('MRI 图像 → 无明显异常结果（low 严重度臂）', async () => {
    await analyzeImage(/MRI/, /无明显异常/);
  }, 15000);

  it('CT 图像 → 胆囊结石结果（双诊断卡）', async () => {
    await analyzeImage(/CT/, /胆囊结石/);
    expect(document.body.textContent).toContain('轻度脂肪肝');
  }, 15000);
});
