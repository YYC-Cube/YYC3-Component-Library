// ============================================================
// YYC³ · @yyc3/ui accordion 渲染冒烟（批次 5 · 2026-11-27）
// single/multiple 展开、collapsible 收起、defaultValue 预展开
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../accordion'
import { stubPointerCapture } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Accordion', () => {
  it('single：点击展开 → 再点收起（collapsible 默认）', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="a">
          <AccordionTrigger>什么是 YYC³？</AccordionTrigger>
          <AccordionContent>三源四区舰队</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>如何部署？</AccordionTrigger>
          <AccordionContent>pnpm build</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    await user.click(screen.getByRole('button', { name: /什么是 YYC³/ }))
    expect(await screen.findByText('三源四区舰队')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /什么是 YYC³/ }))
    await user.click(screen.getByRole('button', { name: /如何部署/ }))
    expect(await screen.findByText('pnpm build')).toBeInTheDocument()
  })

  it('defaultValue 预展开', () => {
    render(
      <Accordion type="single" defaultValue="pre">
        <AccordionItem value="pre">
          <AccordionTrigger>预展开</AccordionTrigger>
          <AccordionContent>默认内容</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByText('默认内容')).toBeInTheDocument()
  })

  it('multiple：多项同时展开', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="multiple">
        <AccordionItem value="m1">
          <AccordionTrigger>第一项</AccordionTrigger>
          <AccordionContent>内容一</AccordionContent>
        </AccordionItem>
        <AccordionItem value="m2">
          <AccordionTrigger>第二项</AccordionTrigger>
          <AccordionContent>内容二</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    await user.click(screen.getByRole('button', { name: '第一项' }))
    await user.click(screen.getByRole('button', { name: '第二项' }))
    expect(screen.getByText('内容一')).toBeInTheDocument()
    expect(screen.getByText('内容二')).toBeInTheDocument()
  })
})
