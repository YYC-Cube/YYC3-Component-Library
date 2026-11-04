// ============================================================
// YYC³ · @yyc3/ui Claw（Phase 3a）验收测试
// 设计令牌 / 双主题上下文 / ClawButton 行为 / ClawLayout / ClawContainer
// ============================================================
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import {
  ClawButton,
  ClawLayout,
  ClawContainer,
  YYC3ThemeProvider,
  useYYC3Theme,
  getThemeTokens,
  injectThemeCSSVars,
  clawBreakpoints,
  clawCx,
  clawMergeStyles,
  isCyberpunk,
} from '../index';
import type { YYC3Theme } from '../index';

afterEach(cleanup);

describe('claw · 设计令牌（@yyc3/theme 真身经薄壳）', () => {
  it('getThemeTokens 双主题返回不同令牌集', () => {
    const cyber = getThemeTokens('cyberpunk');
    const glass = getThemeTokens('liquid-glass');
    expect(cyber.colors.primary).toBe('#00e5ff');
    expect(glass.colors.primary).toBe('rgba(59,130,246,1)');
    expect(cyber.fontFamily).toContain('monospace');
    expect(glass.backdropFilter).toContain('blur');
    expect(cyber.scanline).not.toBe('none');
    expect(glass.scanline).toBe('none');
  });

  it('breakpoints/mq/cx/mergeStyles/isCyberpunk 工具', () => {
    expect(clawBreakpoints.md).toBe('768px');
    expect(clawCx('a', undefined, false, 'b')).toBe('a b');
    expect(clawMergeStyles({ color: 'red' }, undefined, { margin: 0 })).toEqual({ color: 'red', margin: 0 });
    expect(isCyberpunk('cyberpunk')).toBe(true);
    expect(isCyberpunk('liquid-glass')).toBe(false);
  });

  it('injectThemeCSSVars 注入 CSS 变量与主题属性', () => {
    injectThemeCSSVars('liquid-glass');
    expect(document.documentElement.getAttribute('data-yyc3-theme')).toBe('liquid-glass');
    expect(document.documentElement.style.getPropertyValue('--yyc3-color-primary')).toBe('rgba(59,130,246,1)');
  });
});

describe('claw · 主题上下文（统一自 layout）', () => {
  it('默认 cyberpunk；Provider 切换生效', () => {
    const { result } = renderHook(() => useYYC3Theme());
    expect(result.current.theme).toBe('cyberpunk');

    const Probe: React.FC = () => {
      const { theme } = useYYC3Theme();
      return React.createElement('span', null, theme);
    };
    const Switcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [t, setT] = React.useState<YYC3Theme>('cyberpunk');
      return React.createElement(
        YYC3ThemeProvider,
        { theme: t },
        children,
        React.createElement('button', { onClick: () => setT('liquid-glass') }, 'sw'),
      );
    };
    render(React.createElement(Switcher, null, React.createElement(Probe)));
    expect(screen.getByText('cyberpunk')).toBeTruthy();
    fireEvent.click(screen.getByText('sw'));
    expect(screen.getByText('liquid-glass')).toBeTruthy();
  });
});

describe('claw · ClawButton', () => {
  it('渲染文本与变体/尺寸/主题 data 属性', () => {
    render(
      React.createElement(
        YYC3ThemeProvider,
        { theme: 'liquid-glass' },
        React.createElement(ClawButton, { variant: 'danger', size: 'large' }, '删除'),
      ),
    );
    const btn = screen.getByRole('button', { name: '删除' }) as HTMLButtonElement;
    expect(btn.dataset.yyc3Theme).toBe('liquid-glass');
    expect(btn.dataset.variant).toBe('danger');
    expect(btn.style.minHeight).toBe('52px');
  });

  it('loading 态禁点 + aria-busy；disabled 禁点 + data-inert', () => {
    const onClick = vi.fn();
    render(React.createElement(ClawButton, { loading: true, onClick: onClick }, '加载'));
    const loadingBtn = screen.getByRole('button');
    expect(loadingBtn.getAttribute('aria-busy')).toBe('true');
    fireEvent.click(loadingBtn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('iconOnly 显式 aria-label；active 态 aria-pressed', () => {
    render(React.createElement(ClawButton, { iconOnly: true, leftIcon: '×', 'aria-label': '关闭' }));
    expect(screen.getByRole('button', { name: '关闭' })).toBeTruthy();
    render(React.createElement(ClawButton, { active: true }, '选中'));
    expect(screen.getByRole('button', { name: '选中' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('componentProp theme 优先于上下文', () => {
    render(
      React.createElement(
        YYC3ThemeProvider,
        { theme: 'cyberpunk' },
        React.createElement(ClawButton, { theme: 'liquid-glass' }, '覆盖'),
      ),
    );
    expect(screen.getByRole('button', { name: '覆盖' }).dataset.yyc3Theme).toBe('liquid-glass');
  });
});

describe('claw · ClawLayout 复合组件', () => {
  it('Header/Sider/Content/Footer 语义化渲染 + 主题背景', () => {
    render(
      React.createElement(
        ClawLayout,
        { hasSider: true, fullScreen: true },
        React.createElement(ClawLayout.Header, null, 'H'),
        React.createElement(ClawLayout.Sider, { width: 240 }, 'S'),
        React.createElement(ClawLayout.Content, null, 'C'),
        React.createElement(ClawLayout.Footer, null, 'F'),
      ),
    );
    expect(screen.getByText('H').getAttribute('role')).toBe('banner');
    expect(screen.getByText('C').getAttribute('role')).toBe('main');
    expect(screen.getByText('F').getAttribute('role')).toBe('contentinfo');
    const layout = document.querySelector('.yyc3-layout') as HTMLElement;
    expect(layout.dataset.theme).toBe('cyberpunk');
    expect(layout.style.flexDirection).toBe('row');
    expect((screen.getByText('S') as HTMLElement).closest('.yyc3-layout-sider')?.style.width).toBe('240px');
  });
});

describe('claw · ClawContainer', () => {
  it('档位/居中/section 模式', () => {
    render(
      React.createElement(
        ClawContainer,
        { size: 'md', padding: 'lg', centered: false, section: true, 'data-testid': 'box' },
        '内容',
      ),
    );
    const box = screen.getByTestId('box') as HTMLElement;
    expect(box.style.maxWidth).toBe('992px');
    expect(box.style.padding).toBe('24px');
    expect(box.style.margin).toBe('');
    expect(box.className).toContain('yyc3-container');
  });
});
