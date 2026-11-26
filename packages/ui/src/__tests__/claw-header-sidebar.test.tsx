// ============================================================
// YYC³ · @yyc3/ui Claw Header/Sidebar 分支补强（batch2 · 2026-11-27）
// Header：href/禁用/键盘/悬浮/滚动收缩/移动端汉堡菜单/ESC/双主题
// Sidebar：树形子菜单/受控双模/折叠/分隔线/徽章/双 placement/双主题
// 基线：claw/header.tsx 50.38%B + claw/sidebar.tsx 71.05%B
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClawHeader, ClawSidebar } from '../index'
import type { ClawNavItem, YYC3Theme } from '../index'
import { silenceConsole } from './helpers'

beforeEach(() => {
  silenceConsole()
})

const baseNav: ClawNavItem[] = [
  { key: 'home', label: '首页' },
  { key: 'docs', label: '文档', href: '/docs' },
  { key: 'admin', label: '管理', disabled: true },
  { key: 'me', label: '我的', icon: <span data-testid="nav-icon">◉</span> },
]

describe('ClawHeader · 导航项（桌面）', () => {
  it('基础渲染：logo/actions/激活态/aria-current', () => {
    const onNavClick = vi.fn()
    render(
      <ClawHeader
        logo={<span>YYC³</span>}
        nav={baseNav}
        activeKey="home"
        onNavClick={onNavClick}
        actions={<button type="button">登录</button>}
      />,
    )
    expect(screen.getByText('YYC³')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '首页' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '文档' })).toHaveAttribute('href', '/docs')
    // 禁用项：tabIndex -1 + aria-disabled
    const disabled = screen.getByRole('button', { name: '管理' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled.getAttribute('tabindex')).toBe('-1')
    // 图标渲染
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument()
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })

  it('点击导航项回调 onNavClick；点击禁用项不回调', async () => {
    const user = userEvent.setup()
    const onNavClick = vi.fn()
    render(<ClawHeader nav={baseNav} onNavClick={onNavClick} />)
    await user.click(screen.getByRole('button', { name: '首页' }))
    expect(onNavClick).toHaveBeenCalledWith('home', baseNav[0])
    await user.click(screen.getByRole('button', { name: '管理' }))
    expect(onNavClick).toHaveBeenCalledTimes(1)
  })

  it('键盘 Enter/Space 触发导航（非链接项）；链接项键盘直穿', async () => {
    const onNavClick = vi.fn()
    render(<ClawHeader nav={baseNav} onNavClick={onNavClick} />)
    const home = screen.getByRole('button', { name: '首页' })
    fireEvent.keyDown(home, { key: 'Enter' })
    fireEvent.keyDown(home, { key: ' ' })
    expect(onNavClick).toHaveBeenCalledTimes(2)
    const docs = screen.getByRole('link', { name: '文档' })
    fireEvent.keyDown(docs, { key: 'Enter' })
    expect(onNavClick).toHaveBeenCalledTimes(2)
  })

  it('悬浮态切换 hovered 样式分支（非激活项）', () => {
    render(<ClawHeader nav={baseNav} activeKey="home" />)
    const me = screen.getByRole('button', { name: '我的' })
    const before = me.style.background
    fireEvent.mouseEnter(me)
    const hoveredBg = me.style.background
    fireEvent.mouseLeave(me)
    expect(hoveredBg).not.toBe(before)
    expect(me.style.background).toBe(before)
  })

  it('sticky=false → position:relative；无 nav → 占位 spacer、无汉堡钮', () => {
    render(<ClawHeader sticky={false} />)
    const header = screen.getByRole('banner')
    expect(header.style.position).toBe('relative')
    expect(screen.queryByRole('navigation')).toBeNull()
    expect(screen.queryByRole('button', { name: '打开导航菜单' })).toBeNull()
  })
})

describe('ClawHeader · 滚动收缩', () => {
  it('shrinkOnScroll：初始不收缩，滚动后高度降低 + scrolled 样式分支', () => {
    render(<ClawHeader nav={baseNav} shrinkOnScroll height={60} />)
    const header = screen.getByRole('banner')
    expect(header.style.height).toBe('60px')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })
    fireEvent.scroll(window)
    expect(header.style.height).toBe('46px')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    fireEvent.scroll(window)
    expect(header.style.height).toBe('60px')
  })
})

describe('ClawHeader · 移动端汉堡菜单', () => {
  // 汉堡钮 inline display:none（由 CSS media query 接管），role 查询不可见 → 用 class 定位
  const burger = () => document.querySelector('.yyc3-header-hamburger') as HTMLButtonElement

  it('打开/ESC 关闭/点击项回调并收起', async () => {
    const user = userEvent.setup()
    const onNavClick = vi.fn()
    render(<ClawHeader nav={baseNav} onNavClick={onNavClick} activeKey="home" />)
    expect(burger().getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(burger())
    const menu = document.getElementById('yyc3-mobile-nav')
    expect(menu).not.toBeNull()
    expect(burger().getAttribute('aria-label')).toBe('关闭导航菜单')
    expect(burger().getAttribute('aria-expanded')).toBe('true')
    // 移动端禁用项渲染（桌面导航同样有"管理"，需在菜单内定位）
    const menuEl = document.getElementById('yyc3-mobile-nav') as HTMLElement
    expect(menuEl.textContent).toContain('管理')
    // 点击移动端项 → 回调 + 收起（菜单内含桌面项同名文本，限定菜单域查询）
    await user.click(within(menuEl).getByText('我的'))
    expect(onNavClick).toHaveBeenCalledWith('me', baseNav[3])
    expect(document.getElementById('yyc3-mobile-nav')).toBeNull()
  })

  it('ESC 关闭移动菜单（document keydown 分支）', () => {
    render(<ClawHeader nav={baseNav} />)
    fireEvent.click(burger())
    expect(document.getElementById('yyc3-mobile-nav')).not.toBeNull()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.getElementById('yyc3-mobile-nav')).toBeNull()
  })
})

describe('ClawHeader · 双主题', () => {
  it('liquid-glass 主题（非 Courier 字体族分支）', () => {
    render(<ClawHeader nav={baseNav} theme="liquid-glass" activeKey="home" />)
    const header = screen.getByRole('banner')
    expect(header.getAttribute('data-theme')).toBe('liquid-glass')
    const home = screen.getByRole('button', { name: '首页' })
    expect(home.style.borderRadius).toBe('6px')
  })

  it('cyberpunk 主题：Courier 圆角 + 发光线', () => {
    render(<ClawHeader nav={baseNav} theme="cyberpunk" />)
    const home = screen.getByRole('button', { name: '首页' })
    expect(home.style.borderRadius).toBe('4px')
  })
})

// ─────────────────────────────────────────────
// ClawSidebar
// ─────────────────────────────────────────────
const treeItems = [
  { key: 'dash', label: '仪表盘', icon: <span data-testid="sb-icon">▣</span>, badge: <span>3</span> },
  {
    key: 'settings',
    label: '设置',
    children: [
      { key: 'profile', label: '个人资料' },
      { key: 'security', label: '安全' },
    ],
  },
  { key: 'divider-1', label: '', divider: true },
  { key: 'locked', label: '受锁区', disabled: true },
]

describe('ClawSidebar · 树形导航', () => {
  it('基础：图标/徽章/禁用/分隔线', () => {
    const onItemClick = vi.fn()
    render(<ClawSidebar items={treeItems} activeKey="dash" onItemClick={onItemClick} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('sb-icon')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    const disabled = screen.getByRole('treeitem', { name: '受锁区' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
  })

  it('含子菜单项：点击展开/收起（非受控 openKeys），子项点击回调', async () => {
    const user = userEvent.setup()
    const onItemClick = vi.fn()
    render(<ClawSidebar items={treeItems} onItemClick={onItemClick} />)
    const settings = screen.getByRole('treeitem', { name: '设置' })
    expect(settings).toHaveAttribute('aria-expanded', 'false')
    await user.click(settings)
    expect(settings).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('group', { name: '设置 子菜单' })).toBeInTheDocument()
    await user.click(screen.getByText('个人资料'))
    expect(onItemClick).toHaveBeenCalledWith('profile', expect.objectContaining({ key: 'profile' }))
    // 再点收起
    await user.click(settings)
    expect(settings).toHaveAttribute('aria-expanded', 'false')
  })

  it('受控 openKeys：点击父项不改变展开态（早退分支）', async () => {
    const user = userEvent.setup()
    render(<ClawSidebar items={treeItems} openKeys={['settings']} />)
    expect(screen.getByRole('group', { name: '设置 子菜单' })).toBeInTheDocument()
    await user.click(screen.getByRole('treeitem', { name: '设置' }))
    // 受控：展开态不变
    expect(screen.getByRole('group', { name: '设置 子菜单' })).toBeInTheDocument()
  })

  it('键盘 Enter/Space 触发点击行为', () => {
    const onItemClick = vi.fn()
    render(<ClawSidebar items={[{ key: 'k', label: '键盘项' }]} onItemClick={onItemClick} />)
    const item = screen.getByRole('treeitem', { name: '键盘项' })
    fireEvent.keyDown(item, { key: 'Enter' })
    fireEvent.keyDown(item, { key: ' ' })
    expect(onItemClick).toHaveBeenCalledTimes(2)
  })

  it('禁用项点击不触发回调', async () => {
    const user = userEvent.setup()
    const onItemClick = vi.fn()
    render(<ClawSidebar items={treeItems} onItemClick={onItemClick} />)
    await user.click(screen.getByRole('treeitem', { name: '受锁区' }))
    expect(onItemClick).not.toHaveBeenCalled()
  })

  it('悬浮样式分支', () => {
    render(<ClawSidebar items={[{ key: 'k', label: '悬浮项' }]} />)
    const item = screen.getByRole('treeitem', { name: '悬浮项' })
    const before = item.style.color
    fireEvent.mouseEnter(item)
    expect(item.style.color).not.toBe(before)
    fireEvent.mouseLeave(item)
  })

  it('激活 + 折叠态 boxShadow 指示条分支（collapsed 时不渲染指示）', () => {
    render(<ClawSidebar items={[{ key: 'k', label: '长标签项内容' }]} activeKey="k" defaultCollapsed />)
    const item = screen.getByRole('treeitem', { name: '长标签项内容' })
    expect(item.style.boxShadow).toBe('none')
    expect(item.getAttribute('title')).toBe('长标签项内容')
  })
})

describe('ClawSidebar · 折叠与布局', () => {
  it('非受控折叠：点按钮切换 + onCollapsedChange', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<ClawSidebar items={treeItems} onCollapsedChange={onCollapsedChange} />)
    const aside = screen.getByRole('navigation')
    expect(aside.getAttribute('data-collapsed')).toBe('false')
    await user.click(screen.getByRole('button', { name: '折叠侧边栏' }))
    expect(aside.getAttribute('data-collapsed')).toBe('true')
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    await user.click(screen.getByRole('button', { name: '展开侧边栏' }))
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false)
  })

  it('受控 collapsed：点击只回调不落地', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<ClawSidebar items={treeItems} collapsed={false} onCollapsedChange={onCollapsedChange} />)
    await user.click(screen.getByRole('button', { name: '折叠侧边栏' }))
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('navigation').getAttribute('data-collapsed')).toBe('false')
  })

  it('collapsible=false：无折叠按钮', () => {
    render(<ClawSidebar items={treeItems} collapsible={false} />)
    expect(screen.queryByRole('button', { name: '折叠侧边栏' })).toBeNull()
  })

  it('placement=right：左边框 + 发光边缘镜像 + 折叠箭头方向', async () => {
    const user = userEvent.setup()
    render(<ClawSidebar items={treeItems} placement="right" width={260} collapsedWidth={64} />)
    const aside = screen.getByRole('navigation')
    expect(aside.style.borderLeft).toContain('1px solid')
    expect(aside.style.width).toBe('260px')
    await user.click(screen.getByRole('button', { name: '折叠侧边栏' }))
    expect(aside.style.width).toBe('64px')
  })

  it('logo + footer：展开/折叠两档样式分支', () => {
    const { rerender } = render(
      <ClawSidebar items={treeItems} logo={<span>SITE</span>} footer={<span>v1.0</span>} />,
    )
    expect(screen.getByText('SITE')).toBeInTheDocument()
    expect(screen.getByText('v1.0')).toBeInTheDocument()
    rerender(
      <ClawSidebar items={treeItems} logo={<span>SITE</span>} footer={<span>v1.0</span>} defaultCollapsed />,
    )
    expect(screen.getByText('SITE')).toBeInTheDocument()
  })

  it('sections 分组模式：分组标题渲染', () => {
    render(
      <ClawSidebar
        sections={[
          { title: '总览', items: [{ key: 'a', label: '总览项' }] },
          { title: '运营', items: [{ key: 'b', label: '运营项' }] },
        ]}
      />,
    )
    expect(screen.getByText('总览')).toBeInTheDocument()
    expect(screen.getByText('运营')).toBeInTheDocument()
    expect(screen.getByText('总览项')).toBeInTheDocument()
  })

  it('liquid-glass 主题 token 分支', () => {
    render(<ClawSidebar items={treeItems} theme="liquid-glass" activeKey="dash" />)
    expect(screen.getByRole('navigation').getAttribute('data-theme')).toBe('liquid-glass')
  })
})
