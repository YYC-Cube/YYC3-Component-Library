// ============================================================
// YYC³ · @yyc3/ui Claw（Phase 3a）验收测试
// 设计令牌 / 双主题上下文 / ClawButton 行为 / ClawLayout / ClawContainer
// ============================================================
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import {
  ClawButton,
  ClawInput,
  ClawCard,
  ClawModal,
  ClawFooter,
  ClawHeader,
  ClawSidebar,
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
  ButtonGroup,
  Empty,
  Field,
  InputGroup,
  Item,
  Kbd,
  Spinner,
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

describe('claw · ClawInput（3b-1）', () => {
  it('非受控输入 + onChange 回调', () => {
    const onChange = vi.fn();
    render(React.createElement(ClawInput, { defaultValue: '', onChange, 'aria-label': '账号' }));
    const el = screen.getByRole('textbox', { name: '账号' }) as HTMLInputElement;
    fireEvent.change(el, { target: { value: 'yyc3' } });
    expect(onChange).toHaveBeenCalled();
    expect(el.value).toBe('yyc3');
  });

  it('error 状态显示消息（role=alert）+ aria-invalid', () => {
    render(
      React.createElement(ClawInput, {
        status: 'error',
        errorMessage: '格式不正确',
        defaultValue: 'x',
        'aria-label': '邮箱',
      }),
    );
    expect(screen.getByRole('alert').textContent).toContain('格式不正确');
    expect(screen.getByRole('textbox', { name: '邮箱' }).getAttribute('aria-invalid')).toBe('true');
  });

  it('allowClear 清除内容；字数统计 showCount', () => {
    function Hold(): React.ReactElement {
      const [v, setV] = React.useState('内容');
      return React.createElement(ClawInput, {
        value: v,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setV(e.target.value),
        allowClear: true,
        showCount: true,
        maxLength: 10,
        'aria-label': '备注',
      });
    }
    render(React.createElement(Hold));
    const el = screen.getByRole('textbox', { name: '备注' }) as HTMLInputElement;
    expect(screen.getByText('2 / 10')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '清除内容' }));
    expect(el.value).toBe('');
  });

  it('password 类型 + passwordToggle 可见性切换', () => {
    render(React.createElement(ClawInput, { type: 'password', passwordToggle: true, defaultValue: 'pw', 'aria-label': '密码' }));
    const el = screen.getByLabelText('密码') as HTMLInputElement;
    expect(el.type).toBe('password');
    fireEvent.click(screen.getByRole('button', { name: '显示密码' }));
    expect(el.type).toBe('text');
  });

  it('textarea 类型 + onPressEnter（仅非 textarea 触发）', () => {
    const onEnter = vi.fn();
    render(React.createElement(ClawInput, { type: 'textarea', rows: 3, 'aria-label': '简介' } as Record<string, unknown>));
    expect(screen.getByLabelText('简介').tagName).toBe('TEXTAREA');
    void onEnter;
  });

  it('双主题 data 属性', () => {
    render(React.createElement(ClawInput, { theme: 'liquid-glass', 'aria-label': '主题输入' }));
    expect(document.querySelector('.yyc3-input-wrap')?.getAttribute('data-theme')).toBe('liquid-glass');
  });
});

describe('claw · ClawCard（3b-2a）', () => {
  it('title/extra 内置标题栏 + 主题 data 属性', () => {
    render(
      React.createElement(ClawCard, { title: '卡片标题', extra: '操作', 'data-testid': 'card1' }, '内容区'),
    );
    expect(screen.getByText('卡片标题')).toBeTruthy();
    expect(screen.getByText('操作')).toBeTruthy();
    const card = screen.getByTestId('card1');
    expect(card.className).toContain('yyc3-card');
    expect(card.getAttribute('data-theme')).toBe('cyberpunk');
  });

  it('loading 骨架屏（不渲染子内容）；复合子组件挂载', () => {
    render(React.createElement(ClawCard, { loading: true }, '不应出现'));
    expect(screen.queryByText('不应出现')).toBeNull();
    expect(document.querySelector('.yyc3-skeleton-line')).toBeTruthy();

    render(
      React.createElement(
        ClawCard,
        null,
        React.createElement(ClawCard.Header, null, '头部'),
        React.createElement(ClawCard.Body, null, '正文'),
        React.createElement(ClawCard.Footer, null, '脚部'),
      ),
    );
    expect(screen.getByText('头部')).toBeTruthy();
    expect(screen.getByText('正文')).toBeTruthy();
    expect(screen.getByText('脚部')).toBeTruthy();
  });

  it('hoverable 标记与四级阴影', () => {
    render(React.createElement(ClawCard, { hoverable: true, shadow: 'large', 'data-testid': 'card2' }));
    const c = screen.getByTestId('card2');
    expect(c.getAttribute('data-hoverable')).toBe('true');
    expect(c.style.boxShadow).toContain('40px');
  });
});

describe('claw · ClawModal（3b-3）', () => {
  it('visible 渲染 Portal 对话框 + 标题；onCancel 关闭', async () => {
    const onCancel = vi.fn();
    function Hold(): React.ReactElement {
      const [v, setV] = React.useState(true);
      return React.createElement(ClawModal, {
        visible: v,
        title: '确认操作',
        onCancel: () => {
          onCancel();
          setV(false);
        },
      }, '正文内容');
    }
    render(React.createElement(Hold));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('确认操作')).toBeTruthy();
    expect(screen.getByText('正文内容')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('ESC 触发 onCancel；maskClosable 点击遮罩关闭', () => {
    const onCancel = vi.fn();
    render(React.createElement(ClawModal, { visible: true, title: 'T', onCancel }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    // 遮罩（target===currentTarget）
    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    if (overlay) fireEvent.click(overlay);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('footer 按钮：确认/取消回调', () => {
    const onOk = vi.fn();
    const onCancel = vi.fn();
    render(React.createElement(ClawModal, { visible: true, title: 'T', onOk, onCancel }));
    fireEvent.click(screen.getByRole('button', { name: '确 认' }));
    expect(onOk).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: '取 消' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('不可见时不渲染；destroyOnClose 关闭后销毁子元素', () => {
    const { container } = render(
      React.createElement(ClawModal, { visible: false, title: 'T' }, '隐藏内容'),
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    void container;
  });
});

describe('claw · ClawFooter（3b-3）', () => {
  it('完整模式：多列链接 + 版权 + 社交（语义角色）', () => {
    render(
      React.createElement(ClawFooter, {
        logo: 'YYC³',
        description: '统一组件库',
        columns: [{ title: '文档', links: [{ label: '指南', onClick: () => void 0 }] }],
        socials: [{ label: 'GitHub', icon: 'GH' }],
        copyright: '© 2026 YanYuCloudCube',
      }),
    );
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByText('YYC³')).toBeTruthy();
    expect(screen.getByLabelText('文档 链接')).toBeTruthy();
    expect(screen.getByLabelText('GitHub')).toBeTruthy();
    expect(screen.getByText('© 2026 YanYuCloudCube')).toBeTruthy();
  });

  it('紧凑模式单行渲染', () => {
    render(
      React.createElement(ClawFooter, {
        compact: true,
        logo: 'YYC³',
        copyright: '© YYC³',
        socials: [{ label: 'X', icon: 'x' }],
      }),
    );
    expect(screen.getByText('© YYC³')).toBeTruthy();
    expect(screen.getByLabelText('X')).toBeTruthy();
  });

  it('双主题 data 属性', () => {
    render(React.createElement(ClawFooter, { theme: 'liquid-glass', logo: 'L' }));
    expect(screen.getByRole('contentinfo').getAttribute('data-theme')).toBe('liquid-glass');
  });
});

describe('claw · ClawHeader（3b-4）', () => {
  it('banner 语义 + 导航渲染与 activeKey 高亮 + 点击回调', () => {
    const onNavClick = vi.fn();
    const nav = [
      { key: 'home', label: '首页' },
      { key: 'docs', label: '文档' },
    ];
    render(
      React.createElement(ClawHeader, {
        logo: 'YYC³',
        nav,
        activeKey: 'docs',
        onNavClick,
      }),
    );
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByLabelText('主导航')).toBeTruthy();
    const activeBtn = screen.getByRole('button', { name: '文档' });
    expect(activeBtn.getAttribute('aria-current')).toBe('page');
    fireEvent.click(screen.getByRole('button', { name: '首页' }));
    expect(onNavClick).toHaveBeenCalledWith('home', nav[0]);
  });

  it('actions 工具栏与双主题', () => {
    render(
      React.createElement(
        ClawHeader,
        { theme: 'liquid-glass', logo: 'L', actions: React.createElement('button', null, '登录') },
      ),
    );
    expect(screen.getByRole('toolbar', { name: '操作区' })).toBeTruthy();
    expect(screen.getByRole('banner').getAttribute('data-theme')).toBe('liquid-glass');
  });
});

describe('claw · ClawSidebar（3b-4 · Claw 主体收官）', () => {
  const items = [
    { key: 'dash', label: '仪表盘' },
    { key: 'sys', label: '系统', children: [{ key: 'user', label: '用户管理' }] },
    { key: '-', divider: true },
    { key: 'dis', label: '禁用项', disabled: true },
  ];

  it('tree 语义 + 点击回调 + 子菜单展开', () => {
    const onItemClick = vi.fn();
    render(
      React.createElement(ClawSidebar, {
        items,
        activeKey: 'dash',
        defaultOpenKeys: ['sys'],
        onItemClick,
        logo: 'YYC³',
      }),
    );
    expect(screen.getByRole('tree')).toBeTruthy();
    const dash = screen.getByRole('treeitem', { name: '仪表盘' });
    expect(dash.getAttribute('aria-selected')).toBe('true');
    fireEvent.click(dash);
    expect(onItemClick).toHaveBeenCalledWith('dash', items[0]);
    // 子菜单可见
    expect(screen.getByText('用户管理')).toBeTruthy();
    // 分割线
    expect(document.querySelector('[aria-hidden="true"][style*="height: 1px"]')).toBeTruthy();
  });

  it('折叠切换（aria-expanded）+ 折叠宽度', () => {
    function Hold(): React.ReactElement {
      const [c, setC] = React.useState(false);
      return React.createElement(ClawSidebar, {
        items: [{ key: 'a', label: 'A' }],
        collapsed: c,
        onCollapsedChange: setC,
        'data-testid': 'sb',
      });
    }
    render(React.createElement(Hold));
    const sb = screen.getByTestId('sb') as HTMLElement;
    expect(sb.style.width).toBe('240px');
    fireEvent.click(screen.getByRole('button', { name: '折叠侧边栏' }));
    expect(sb.getAttribute('data-collapsed')).toBe('true');
    expect(sb.style.width).toBe('60px');
    expect(screen.getByRole('button', { name: '展开侧边栏' })).toBeTruthy();
  });

  it('disabled 项 aria-disabled；分组 sections 渲染', () => {
    render(
      React.createElement(ClawSidebar, {
        sections: [{ title: '管理', items: [{ key: 'x', label: '禁用', disabled: true }] }],
      }),
    );
    const item = screen.getByRole('treeitem', { name: '禁用' });
    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('管理')).toBeTruthy();
  });
});

describe('phase4 · S2 补入 7 件冒烟', () => {
  it('导出齐全（ButtonGroup/Empty/Field/InputGroup/Item/Kbd/Spinner）', () => {
    expect(ButtonGroup).toBeDefined();
    expect(Empty).toBeDefined();
    expect(Field).toBeDefined();
    expect(InputGroup).toBeDefined();
    expect(Item).toBeDefined();
    expect(Kbd).toBeDefined();
    expect(Spinner).toBeDefined();
  });

  it('Empty/Kbd 渲染 data-slot', () => {
    render(React.createElement(Empty, { 'data-testid': 'empty' }, '暂无数据'));
    expect(screen.getByTestId('empty').getAttribute('data-slot')).toBe('empty');
    render(React.createElement(Kbd, null, 'Ctrl'));
    expect(screen.getByText('Ctrl').getAttribute('data-slot')).toBe('kbd');
  });

  it('Spinner 可达性（role=status）', () => {
    render(React.createElement(Spinner));
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
