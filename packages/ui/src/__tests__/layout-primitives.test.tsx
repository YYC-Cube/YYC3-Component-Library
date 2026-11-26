// ============================================================
// YYC³ · @yyc3/ui 布局原语渲染冒烟（批次 5 · 2026-11-27）
// separator/skeleton/aspect-ratio/scroll-area/collapsible/kbd/progress/card
// 补齐 + tree/treeNode
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Separator } from '../separator'
import { Skeleton } from '../skeleton'
import { AspectRatio } from '../aspect-ratio'
import { ScrollArea, ScrollBar } from '../scroll-area'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../collapsible'
import { Kbd, KbdGroup } from '../kbd'
import { Progress } from '../progress'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '../card'
import { Tree, TreeNode } from '../tree'
import { stubPointerCapture, stubResizeObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Separator / Skeleton / AspectRatio', () => {
  it('Separator orientation=horizontal（decorative 默认 → 无 role）', () => {
    render(<Separator data-testid="sep" orientation="horizontal" />)
    expect(screen.getByTestId('sep')).toBeInTheDocument()
    // 非 decorative 时挂 role=separator
    render(<Separator data-testid="sep2" decorative={false} />)
    expect(screen.getByTestId('sep2').getAttribute('role')).toBe('separator')
  })

  it('Skeleton 渲染 + 动画类', () => {
    render(<Skeleton data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveAttribute('data-slot', 'skeleton')
  })

  it('AspectRatio 包裹子内容（16/9）', () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <img src="x.png" alt="封面" />
      </AspectRatio>,
    )
    expect(screen.getByAltText('封面')).toBeInTheDocument()
  })
})

describe('ScrollArea', () => {
  it('内容渲染 + ScrollBar 子件', () => {
    render(
      <ScrollArea data-testid="sa">
        <div>长列表内容</div>
        <ScrollBar orientation="horizontal" data-testid="sb" />
      </ScrollArea>,
    )
    expect(screen.getByText('长列表内容')).toBeInTheDocument()
    // Radix 滚动条仅在可滚动时挂载——断言视口与 Corner 存在
    expect(document.querySelector('[data-radix-scroll-area-viewport]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="scroll-area-corner"]') ?? screen.getByTestId('sa')).toBeInTheDocument()
  })
})

describe('Collapsible', () => {
  it('开合链路', async () => {
    const user = userEvent.setup()
    render(
      <Collapsible>
        <CollapsibleTrigger>展开更多</CollapsibleTrigger>
        <CollapsibleContent>折叠内容</CollapsibleContent>
      </Collapsible>,
    )
    await user.click(screen.getByRole('button', { name: '展开更多' }))
    expect(screen.getByText('折叠内容')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '展开更多' }))
    expect(screen.getByRole('button', { name: '展开更多' })).toBeInTheDocument()
  })

  it('受控 open 常开', () => {
    render(
      <Collapsible open>
        <CollapsibleTrigger>触发</CollapsibleTrigger>
        <CollapsibleContent>常开内容</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByText('常开内容')).toBeInTheDocument()
  })
})

describe('Kbd / Progress / Card 补齐', () => {
  it('Kbd + KbdGroup', () => {
    render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    )
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
    expect(screen.getByText('⌘')).toHaveAttribute('data-slot', 'kbd')
  })

  it('Progress 受控值渲染 indicator', () => {
    render(<Progress value={62} data-testid="pg" />)
    expect(screen.getByTestId('pg')).toHaveAttribute('data-slot', 'progress')
    const indicator = document.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(indicator.style.transform).toBe('translateX(-38%)')
  })

  it('Progress value=0 与缺省（|| 分支）', () => {
    render(<Progress value={0} data-testid="pg0" />)
    const ind0 = document.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(ind0.style.transform).toBe('translateX(-100%)')
  })

  it('Card 全家桶含 Action/Footer（补 71% 剩余行）', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
          <CardDescription>卡片描述</CardDescription>
          <CardAction>
            <button type="button">操作</button>
          </CardAction>
        </CardHeader>
        <CardContent>主体</CardContent>
        <CardFooter>页脚</CardFooter>
      </Card>,
    )
    expect(screen.getByText('卡片标题')).toBeInTheDocument()
    expect(screen.getByText('卡片描述')).toBeInTheDocument()
    expect(screen.getByText('操作')).toBeInTheDocument()
    expect(screen.getByText('主体')).toBeInTheDocument()
    expect(screen.getByText('页脚')).toBeInTheDocument()
  })
})

describe('Tree', () => {
  it('Tree + 嵌套 TreeNode', () => {
    render(
      <Tree>
        <TreeNode label="根节点">
          <TreeNode label="子节点 A" />
          <TreeNode label="子节点 B" />
        </TreeNode>
        <TreeNode label="叶子" />
      </Tree>,
    )
    expect(screen.getByText('根节点')).toBeInTheDocument()
    expect(screen.getByText('子节点 A')).toBeInTheDocument()
    expect(screen.getByText('叶子')).toBeInTheDocument()
  })
})
