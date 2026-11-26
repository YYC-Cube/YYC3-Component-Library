// ============================================================
// YYC³ · @yyc3/ui sidebar mobile 分支（批次 1 · 2026-11-27）
// 独立文件 + vi.mock useIsMobile=true：避免桌面→mobile 热切换
// 在 jsdom 触发 Radix portal "node to be removed" 抖动；
// useIsMobile 本体逻辑另见 use-mobile.test.tsx
// ============================================================
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../use-mobile', () => ({ useIsMobile: () => true }))

import { Sidebar, SidebarProvider, SidebarTrigger } from '../sidebar'

describe('Sidebar · mobile 分支（isMobile=true）', () => {
  it('Trigger 点击 → openMobile 翻转 → Sheet portal 渲染侧栏内容', async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar>
          <div>mobile-body</div>
        </Sidebar>
      </SidebarProvider>,
    )
    await user.click(screen.getByRole('button', { name: /toggle sidebar/i }))
    expect(await screen.findByText('mobile-body')).toBeInTheDocument()
    expect(document.querySelector('[data-mobile="true"]')).toBeInTheDocument()
    // Sheet 内 sr-only 标题（a11y）
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Displays the mobile sidebar.')).toBeInTheDocument()
  })
})
