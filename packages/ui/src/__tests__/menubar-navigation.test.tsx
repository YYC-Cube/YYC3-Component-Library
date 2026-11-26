// ============================================================
// YYC³ · @yyc3/ui menubar + navigation-menu 渲染冒烟（批次 3 · 2026-11-27）
// menubar 触发开合 + navigation 触发/视口内容/link
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
} from '../menubar'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from '../navigation-menu'
import { stubPointerCapture, stubResizeObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Menubar · 菜单栏', () => {
  it('点击 Trigger 展开 → Item 回调 + 附属件渲染', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>文件</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>文件操作</MenubarLabel>
            <MenubarItem onSelect={onSelect}>新建</MenubarItem>
            <MenubarItem disabled>导出</MenubarItem>
            <MenubarSeparator />
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>编辑</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>撤销</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    await user.click(screen.getByText('文件'))
    expect(await screen.findByText('新建')).toBeInTheDocument()
    expect(screen.getByText('文件操作')).toBeInTheDocument()
    expect(screen.getByText('⌘N')).toBeInTheDocument()
    await user.click(screen.getByText('新建'))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})

describe('NavigationMenu · 导航菜单', () => {
  it('List + Link 直渲染（无触发面板）', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#docs">文档</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#components">组件</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>,
    )
    expect(screen.getByText('文档')).toBeInTheDocument()
    expect(screen.getByText('组件')).toBeInTheDocument()
  })

  it('Trigger 点击 → Viewport 内渲染面板内容', async () => {
    const user = userEvent.setup()
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>学习</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#guide">入门指南</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
      </NavigationMenu>,
    )
    await user.click(screen.getByText('学习'))
    // Radix NavigationMenu 内容在 jsdom 中可能同时出现在内联与视口位置
    expect((await screen.findAllByText('入门指南')).length).toBeGreaterThanOrEqual(1)
  })
})
