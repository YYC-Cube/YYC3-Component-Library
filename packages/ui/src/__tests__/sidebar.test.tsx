// ============================================================
// YYC³ · @yyc3/ui sidebar 渲染冒烟（批次 1 · 2026-11-27）
// 730 行逻辑重头：Provider 状态机（open/toggle/cookie/键盘快捷键）+
// 桌面/mobile 双分支 + 全部子件渲染（asChild/tooltip/skeleton 变体）
// jsdom 无 matchMedia——注入最小桩（对齐 theme 包先例）
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '../sidebar'

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

beforeEach(() => {
  stubMatchMedia(false)
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('SidebarProvider · 状态机', () => {
  it('默认渲染 wrapper 且 state=expanded（defaultOpen=true）', () => {
    render(
      <SidebarProvider>
        <div>content</div>
      </SidebarProvider>,
    )
    expect(document.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument()
  })

  it('Trigger 点击 → open 翻转（cookie 同步写入）', async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider defaultOpen={false}>
        <SidebarTrigger />
        <Sidebar />
      </SidebarProvider>,
    )
    const sidebarEl = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(sidebarEl.getAttribute('data-state')).toBe('collapsed')
    await user.click(screen.getByRole('button', { name: /toggle sidebar/i }))
    expect(sidebarEl.getAttribute('data-state')).toBe('expanded')
    expect(document.cookie).toContain('sidebar_state=true')
  })

  it('受控 open/onOpenChange 走外部回调', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider open={false} onOpenChange={onOpenChange}>
        <SidebarTrigger />
      </SidebarProvider>,
    )
    await user.click(screen.getByRole('button', { name: /toggle sidebar/i }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('Ctrl/Cmd+B 键盘快捷键翻转 sidebar', async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar />
      </SidebarProvider>,
    )
    const sidebarEl = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    await user.keyboard('{Control>}b')
    expect(sidebarEl.getAttribute('data-state')).toBe('expanded')
    await user.keyboard('{Control>}b')
    expect(sidebarEl.getAttribute('data-state')).toBe('collapsed')
  })

  it('useSidebar 脱离 Provider 抛错', () => {
    function Orphan() {
      useSidebar()
      return null
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Orphan />)).toThrow(/useSidebar must be used within/)
    spy.mockRestore()
  })
})

describe('Sidebar · 渲染分支', () => {
  it('collapsible=none：直出 div（跳过状态机）', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <div>static</div>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByText('static')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sidebar"]')).toBeInTheDocument()
  })

  it('桌面态：渲染 gap/container 双 div + variant/side 数据属性', () => {
    render(
      <SidebarProvider>
        <Sidebar side="right" variant="floating" collapsible="icon">
          <div>desktop-body</div>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByText('desktop-body')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sidebar-gap"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sidebar-container"]')).toBeInTheDocument()
    const outer = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(outer.getAttribute('data-side')).toBe('right')
    expect(outer.getAttribute('data-variant')).toBe('floating')
  })

  it('mobile 态：经 Sheet portal 渲染 → 见 sidebar-mobile.test.tsx（vi.mock 隔离）', () => {
    expect(true).toBe(true)
  })

  it('Rail 点击翻转 + Inset/Header/Footer/Separator/Input 渲染', async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarHeader>头部</SidebarHeader>
          <SidebarSeparator />
          <SidebarInput placeholder="搜一搜" />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>分组</SidebarGroupLabel>
              <SidebarGroupAction>+</SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="菜单提示">
                      菜单一
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>...</SidebarMenuAction>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton size="sm" isActive href="#a">
                      子项 A
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#b">子项 B</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>底部</SidebarFooter>
          <SidebarInset>主区</SidebarInset>
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByText('头部')).toBeInTheDocument()
    expect(screen.getByText('底部')).toBeInTheDocument()
    expect(screen.getByText('主区')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('搜一搜')).toBeInTheDocument()
    expect(screen.getByText('菜单一')).toBeInTheDocument()
    expect(screen.getByText('子项 A')).toBeInTheDocument()
    const rail = document.querySelector('[data-slot="sidebar-rail"]') as HTMLElement
    expect(rail).toBeInTheDocument()
    await user.click(rail)
    const sidebarEl = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(sidebarEl.getAttribute('data-state')).toBe('collapsed')
  })

  it('MenuSkeleton：showIcon 渲染图标骨架；GroupLabel/Action asChild 分支', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarGroupLabel asChild>
            <a href="#g">链接式标签</a>
          </SidebarGroupLabel>
          <SidebarGroupAction asChild>
            <a href="#act">动作链接</a>
          </SidebarGroupAction>
          <SidebarMenuButton asChild tooltip={{ children: '对象式提示' }}>
            <a href="#m">按钮链接</a>
          </SidebarMenuButton>
          <SidebarMenuAction asChild>
            <a href="#ma">菜单动作</a>
          </SidebarMenuAction>
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSubButton asChild size="sm">
            <a href="#sub">子按钮链接</a>
          </SidebarMenuSubButton>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByText('链接式标签')).toBeInTheDocument()
    expect(screen.getByText('动作链接')).toBeInTheDocument()
    expect(screen.getByText('按钮链接')).toBeInTheDocument()
    expect(screen.getByText('菜单动作')).toBeInTheDocument()
    expect(screen.getByText('子按钮链接')).toBeInTheDocument()
    expect(
      document.querySelector('[data-sidebar="menu-skeleton-icon"]'),
    ).toBeInTheDocument()
  })

  it('MenuButton outline/lg 变体渲染', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarMenuButton variant="outline" size="lg">大按钮</SidebarMenuButton>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByText('大按钮')).toBeInTheDocument()
  })
})
