// ============================================================
// YYC³ · @yyc3/ui Claw Button/Card/Footer/Container/Layout 分支补强
// （batch2 · 2026-11-27）
// Button：五变体 × 双主题 × active/loading/iconOnly/ripple
// Card：玻璃主题/骨架屏/无边框/阴影档/Image/Header 复合
// Footer：紧凑/完整/链接 href 双态/社交钮/双主题
// Container：尺寸档/section/centered/fullHeight/responsive
// Layout：Header/Sider/Content/Footer/fullScreen/hasSider
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClawButton, ClawCard, ClawFooter, ClawContainer, ClawLayout } from '../index'
import { silenceConsole } from './helpers'

beforeEach(() => {
  silenceConsole()
})

describe('ClawButton · 变体 × 主题矩阵', () => {
  it('cyberpunk 五变体（active 双态）', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const
    render(
      <div>
        {variants.map((v) => (
          <ClawButton key={v} variant={v} theme="cyberpunk">
            {v}
          </ClawButton>
        ))}
        {variants.map((v) => (
          <ClawButton key={`a-${v}`} variant={v} theme="cyberpunk" active>
            {v}-active
          </ClawButton>
        ))}
      </div>,
    )
    expect(screen.getByRole('button', { name: 'primary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'danger-active' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('liquid-glass 五变体（active 双态）', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const
    render(
      <div>
        {variants.map((v) => (
          <ClawButton key={v} variant={v} theme="liquid-glass">
            {v}
          </ClawButton>
        ))}
        {variants.map((v) => (
          <ClawButton key={`a-${v}`} variant={v} theme="liquid-glass" active>
            {v}-active
          </ClawButton>
        ))}
      </div>,
    )
    expect(screen.getByRole('button', { name: 'outline-active' })).toBeInTheDocument()
  })

  it('尺寸三档 + iconOnly（字符串/非字符串 children）', () => {
    render(
      <div>
        <ClawButton size="small" iconOnly theme="cyberpunk">
          搜
        </ClawButton>
        <ClawButton size="large">大按钮</ClawButton>
        <ClawButton size="medium" iconOnly aria-label="icon-med">
          <span data-testid="icon-node">✚</span>
        </ClawButton>
      </div>,
    )
    expect(screen.getByRole('button', { name: '搜' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '大按钮' })).toBeInTheDocument()
    // 非字符串 children iconOnly：aria-label 推断为 'button'
    expect(screen.getByRole('button', { name: 'icon-med' })).toBeInTheDocument()
    expect(screen.getByTestId('icon-node')).toBeInTheDocument()
  })

  it('loading：spinner 渲染 + aria-busy；各变体 spinner 配色分支', () => {
    render(
      <div>
        <ClawButton loading theme="liquid-glass">
          存空中
        </ClawButton>
        <ClawButton loading variant="danger" theme="cyberpunk">
          危险中
        </ClawButton>
        <ClawButton loading variant="secondary" theme="liquid-glass">
          次要中
        </ClawButton>
        <ClawButton loading variant="outline" theme="cyberpunk">
          描边中
        </ClawButton>
      </div>,
    )
    expect(screen.getByRole('button', { name: /存空中/ })).toHaveAttribute('aria-busy', 'true')
    expect(document.querySelectorAll('svg[aria-hidden="true"]').length).toBeGreaterThanOrEqual(4)
  })

  it('leftIcon/rightIcon 常规渲染 + loading 时右图标隐藏', () => {
    render(
      <div>
        <ClawButton leftIcon={<span>L</span>} rightIcon={<span>R</span>}>
          前后缀
        </ClawButton>
        <ClawButton loading rightIcon={<span>R2</span>}>
          加载中
        </ClawButton>
      </div>,
    )
    expect(screen.getByRole('button', { name: /前后缀/ })).toBeInTheDocument()
    // loading 时 rightIcon 不渲染（分支）
    expect(screen.queryByText('R2')).toBeNull()
  })

  it('点击 ripple：span 注入 + onClick 回调；禁用点击直接短路', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <div>
        <ClawButton onClick={onClick} theme="liquid-glass">
          点我
        </ClawButton>
        <ClawButton disabled onClick={onClick}>
          禁用
        </ClawButton>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: '点我' }))
    expect(document.querySelector('.yyc3-ripple')).not.toBeNull()
    expect(onClick).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: '禁用' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('ClawCard · 复合与状态', () => {
  it('liquid-glass 主题 + 无边框 + hoverable + 各阴影档', () => {
    render(
      <div>
        <ClawCard theme="liquid-glass" bordered={false} hoverable shadow="none" data-testid="c-none">
          无阴影
        </ClawCard>
        <ClawCard theme="liquid-glass" shadow="small" data-testid="c-small">
          小阴影
        </ClawCard>
        <ClawCard shadow="large" data-testid="c-large">
          大阴影
        </ClawCard>
        <ClawCard shadow="medium" data-testid="c-med">
          中阴影
        </ClawCard>
      </div>,
    )
    expect(screen.getByText('无阴影')).toBeInTheDocument()
    expect(screen.getByTestId('c-none').style.cursor).toBe('pointer')
    expect(screen.getByTestId('c-none').style.border).toContain('transparent')
  })

  it('loading 骨架屏（不渲染 children/标题栏）', () => {
    render(
      <ClawCard loading title="加载卡">
        隐藏内容
      </ClawCard>,
    )
    expect(screen.queryByText('隐藏内容')).toBeNull()
    expect(document.querySelector('.yyc3-skeleton-circle')).not.toBeNull()
    expect(document.querySelectorAll('.yyc3-skeleton-line').length).toBeGreaterThanOrEqual(4)
  })

  it('title/extra 标题栏 + Card.Header children 兜底 + Body noPadding', () => {
    render(
      <ClawCard title="标题" extra={<button type="button">操作</button>}>
        <ClawCard.Body noPadding>
          <span>无内边距正文</span>
        </ClawCard.Body>
        <ClawCard.Footer>
          <span>卡脚</span>
        </ClawCard.Footer>
      </ClawCard>,
    )
    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '操作' })).toBeInTheDocument()
    expect(screen.getByText('无内边距正文')).toBeInTheDocument()
    expect(screen.getByText('卡脚')).toBeInTheDocument()
  })

  it('Card.Header 仅 children（无 title）分支', () => {
    render(
      <ClawCard>
        <ClawCard.Header>仅子内容标题</ClawCard.Header>
      </ClawCard>,
    )
    expect(screen.getByText('仅子内容标题')).toBeInTheDocument()
  })

  it('Card.Image：数字高度/字符串高度/自定义 objectFit + cyber 扫描线', () => {
    render(
      <div>
        <ClawCard.Image src="https://example.com/a.png" alt="图A" />
        <ClawCard.Image src="https://example.com/b.png" alt="图B" height="50%" objectFit="contain" />
      </div>,
    )
    expect(screen.getByAltText('图A')).toBeInTheDocument()
    expect(screen.getByAltText('图B').style.objectFit).toBe('contain')
  })
})

describe('ClawFooter · 双模式', () => {
  it('完整模式：logo/description/多列链接（href 与按钮双态）/extra/socials', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ClawFooter
        logo={<span>FOOT-LOGO</span>}
        description="站点描述文字"
        columns={[
          {
            title: '产品',
            links: [
              { label: '官网', href: 'https://yyc3.top' },
              { label: '按钮链', onClick },
            ],
          },
        ]}
        socials={[
          { label: 'GitHub', icon: <span>GH</span>, href: 'https://github.com/YYC-Cube' },
          { label: '微信', icon: <span>WX</span>, onClick },
        ]}
        copyright="© 2026 YYC³"
        extra={<span>备案号</span>}
      />,
    )
    expect(screen.getByText('FOOT-LOGO')).toBeInTheDocument()
    expect(screen.getByText('站点描述文字')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: '官网' })
    expect(link).toHaveAttribute('href', 'https://yyc3.top')
    // 无 href 链接渲染为 button
    await user.click(screen.getByRole('button', { name: '按钮链' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    // 社交：无 href → button + onClick
    await user.click(screen.getByRole('button', { name: '微信' }))
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByText('备案号')).toBeInTheDocument()
  })

  it('bordered=false + compact 模式（logo/copyright/socials 单行）', () => {
    render(
      <ClawFooter
        compact
        bordered={false}
        logo={<span>C-LOGO</span>}
        copyright="© 紧凑"
        socials={[{ label: 'X', icon: <span>X</span>, href: 'https://x.com' }]}
      />,
    )
    expect(screen.getByText('C-LOGO')).toBeInTheDocument()
    expect(screen.getByText('© 紧凑')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'X' })).toBeInTheDocument()
  })

  it('liquid-glass 主题（非 cyber 字距分支）', () => {
    render(
      <ClawFooter
        theme="liquid-glass"
        columns={[{ title: '列', links: [{ label: '链接', href: '/x' }] }]}
      />,
    )
    expect(screen.getByRole('contentinfo').getAttribute('data-theme')).toBe('liquid-glass')
  })
})

describe('ClawContainer · 档位与开关', () => {
  it('全默认档（无 props）', () => {
    render(<ClawContainer data-testid="def">默认容器</ClawContainer>)
    const el = screen.getByTestId('def')
    expect(el.style.maxWidth).toBe('1280px')
    expect(el.style.margin).toBe('0px auto')
    expect(el.getAttribute('data-responsive')).toBe('true')
  })

  it('size 各档：fluid 无 maxWidth、2xl/_sm 值映射', () => {
    render(
      <div>
        <ClawContainer size="fluid" data-testid="fluid">
          流式
        </ClawContainer>
        <ClawContainer size="2xl" data-testid="xxl">
          超大
        </ClawContainer>
        <ClawContainer size="sm" data-testid="smc">
          小
        </ClawContainer>
      </div>,
    )
    expect(screen.getByTestId('fluid').style.maxWidth).toBe('')
    expect(screen.getByTestId('xxl').style.maxWidth).toBe('1536px')
    expect(screen.getByTestId('smc').style.maxWidth).toBe('768px')
  })

  it('section + centered=false + fullHeight + responsive=false', () => {
    render(
      <ClawContainer
        section
        centered={false}
        fullHeight
        responsive={false}
        theme="cyberpunk"
        data-testid="sec"
      >
        分区容器
      </ClawContainer>,
    )
    const el = screen.getByTestId('sec')
    expect(el.style.background).not.toBe('')
    expect(el.style.margin).toBe('')
    expect(el.style.height).toBe('100%')
    expect(el.getAttribute('data-responsive')).toBe('false')
    // cyberpunk section 顶部霓虹线
    expect(el.style.borderTop).toContain('solid')
  })

  it('padding 各档', () => {
    render(
      <div>
        <ClawContainer padding="none" data-testid="p0">
          a
        </ClawContainer>
        <ClawContainer padding="lg" data-testid="p3">
          b
        </ClawContainer>
      </div>,
    )
    expect(screen.getByTestId('p0').style.padding).toBe('0px')
    expect(screen.getByTestId('p3').style.padding).toBe('0px 40px')
  })
})

describe('ClawLayout · 复合布局', () => {
  it('Header/Sider/Content/Footer 全家桶 + width 字符串/数字 + flex=false', () => {
    render(
      <ClawLayout hasSider data-testid="layout">
        <ClawLayout.Header>顶栏</ClawLayout.Header>
        <ClawLayout.Sider width="200px">侧栏</ClawLayout.Sider>
        <ClawLayout.Content flex={false}>主区</ClawLayout.Content>
        <ClawLayout.Footer>底栏</ClawLayout.Footer>
      </ClawLayout>,
    )
    expect(screen.getByRole('banner').textContent).toBe('顶栏')
    expect(screen.getByRole('main').textContent).toBe('主区')
    expect(screen.getByRole('contentinfo').textContent).toBe('底栏')
    const layout = screen.getByTestId('layout')
    expect(layout.style.flexDirection).toBe('row')
    expect(layout.style.height).toBe('100%')
  })

  it('fullScreen 100vh + 数字 width + 默认档', () => {
    render(
      <ClawLayout fullScreen theme="liquid-glass" data-testid="fs">
        <ClawLayout.Sider width={220}>侧</ClawLayout.Sider>
        <ClawLayout.Content>内容</ClawLayout.Content>
      </ClawLayout>,
    )
    const layout = screen.getByTestId('fs')
    expect(layout.style.height).toBe('100vh')
    expect(layout.style.flexDirection).toBe('column') // 未传 hasSider → 默认纵向
    expect(layout.getAttribute('data-theme')).toBe('liquid-glass')
    expect(layout.style.backgroundImage).toContain('linear-gradient')
  })
})
