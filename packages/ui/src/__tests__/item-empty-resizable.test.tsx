// ============================================================
// YYC³ · @yyc3/ui item + empty + resizable 渲染冒烟（批次 5 · 2026-11-27）
// Item 组合件（variant/asChild/media）；Empty 组合件（media icon）；
// Resizable 面板组 + handle
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
} from '../item'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '../empty'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../resizable'
import { stubResizeObserver } from './helpers'

beforeAll(() => {
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Item · 组合条目', () => {
  it('Group/Item/Content/Title/Description/Actions 渲染', () => {
    render(
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <span data-testid="it-icon">A</span>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>条目标题</ItemTitle>
            <ItemDescription>条目描述</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button type="button">编辑</button>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item variant="outline" asChild>
          <a href="#lnk">链接条目</a>
        </Item>
      </ItemGroup>,
    )
    expect(screen.getByText('条目标题')).toBeInTheDocument()
    expect(screen.getByText('条目描述')).toBeInTheDocument()
    expect(screen.getByTestId('it-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '编辑' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '链接条目' })).toBeInTheDocument()
  })

  it('Header/Footer/variant=muted + media image', () => {
    render(
      <Item variant="muted" size="sm">
        <ItemHeader>
          <ItemTitle>头部标题</ItemTitle>
        </ItemHeader>
        <ItemMedia>
          <img src="i.png" alt="媒体图" />
        </ItemMedia>
        <ItemFooter>页脚</ItemFooter>
      </Item>,
    )
    expect(screen.getByText('头部标题')).toBeInTheDocument()
    expect(screen.getByAltText('媒体图')).toBeInTheDocument()
    expect(screen.getByText('页脚')).toBeInTheDocument()
  })
})

describe('Empty · 空状态', () => {
  it('Header/Title/Description/Media(icon)/Content 全渲染', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <span data-testid="empty-svg">icon</span>
          </EmptyMedia>
          <EmptyTitle>暂无数据</EmptyTitle>
          <EmptyDescription>去创建第一条记录吧</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button">新建</button>
        </EmptyContent>
      </Empty>,
    )
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
    expect(screen.getByText('去创建第一条记录吧')).toBeInTheDocument()
    expect(screen.getByTestId('empty-svg')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新建' })).toBeInTheDocument()
  })
})

describe('Resizable · 面板组', () => {
  it('双面板 + handle 渲染', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div>左面板</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div>右面板</div>
        </ResizablePanel>
      </ResizablePanelGroup>,
    )
    expect(screen.getByText('左面板')).toBeInTheDocument()
    expect(screen.getByText('右面板')).toBeInTheDocument()
    expect(document.querySelector('[data-panel-resize-handle-id]')).toBeInTheDocument()
    expect(document.querySelector('[data-resize-handle-state]')).toBeInTheDocument()
  })
})
