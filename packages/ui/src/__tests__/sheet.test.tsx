// ============================================================
// YYC³ · @yyc3/ui sheet 渲染冒烟（批次 2 · 2026-11-27）
// 四向 side 变体 + Trigger/Close 开合 + Header/Footer/Title/Description
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../sheet'
import { stubPointerCapture } from './helpers'

beforeAll(stubPointerCapture)

describe('Sheet · 四向变体与开合', () => {
  it('side=right（默认）开合链路', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>开抽屉</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>侧栏标题</SheetTitle>
            <SheetDescription>侧栏说明</SheetDescription>
          </SheetHeader>
          主体内容
          <SheetFooter>
            <span>底部</span>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    )
    await user.click(screen.getByText('开抽屉'))
    expect(await screen.findByText('侧栏标题')).toBeInTheDocument()
    expect(screen.getByText('侧栏说明')).toBeInTheDocument()
    expect(screen.getByText('主体内容')).toBeInTheDocument()
    expect(screen.getByText('底部')).toBeInTheDocument()
    // 内置 X 关闭
    await user.click(screen.getByText('Close'))
    await waitFor(() => expect(screen.queryByText('侧栏标题')).toBeNull())
  })

  it('top/left/bottom 变体 + SheetClose 组件', async () => {
    const user = userEvent.setup()
    for (const side of ['top', 'left', 'bottom'] as const) {
      render(
        <Sheet>
          <SheetTrigger>{side}-开</SheetTrigger>
          <SheetContent side={side}>
            <SheetTitle>{side}标题</SheetTitle>
            <SheetClose>{side}-关</SheetClose>
          </SheetContent>
        </Sheet>,
      )
      await user.click(screen.getByText(`${side}-开`))
      expect(await screen.findByText(`${side}标题`)).toBeInTheDocument()
      await user.click(screen.getByText(`${side}-关`))
      await waitFor(() => expect(screen.queryByText(`${side}标题`)).toBeNull())
    }
  })
})
