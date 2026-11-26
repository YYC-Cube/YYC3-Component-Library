// ============================================================
// YYC³ · @yyc3/ui dialog + alert-dialog 渲染冒烟（批次 2 · 2026-11-27）
// 触发开→内容挂载（portal/baseElement 查询）→关闭链路 +
// showCloseButton 双分支 + AlertDialog Action/Cancel
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../alert-dialog'
import { stubPointerCapture } from './helpers'

beforeAll(stubPointerCapture)

describe('Dialog · 开合链路', () => {
  it('Trigger 点击 → portal 渲染 Title/Description/Footer + 默认 Close 按钮', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>打开</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>对话框标题</DialogTitle>
            <DialogDescription>对话框说明</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button">自定义按钮</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByText('打开'))
    expect(await screen.findByText('对话框标题')).toBeInTheDocument()
    expect(screen.getByText('对话框说明')).toBeInTheDocument()
    expect(screen.getByText('自定义按钮')).toBeInTheDocument()
    // 默认 showCloseButton=true → sr-only Close
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('showCloseButton=false → 无内置 Close', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>开</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>无关闭钮</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByText('开'))
    expect(await screen.findByText('无关闭钮')).toBeInTheDocument()
    expect(screen.queryByText('Close')).toBeNull()
  })

  it('Escape 关闭 + DialogClose 组件关闭', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>触发器</DialogTrigger>
        <DialogContent>
          <DialogTitle>可关</DialogTitle>
          <DialogClose>关闭钮</DialogClose>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByText('触发器'))
    expect(await screen.findByText('可关')).toBeInTheDocument()
    await user.click(screen.getByText('关闭钮'))
    await waitFor(() => expect(screen.queryByText('可关')).toBeNull())
    // 复开再测 Escape
    await user.click(screen.getByText('触发器'))
    expect(await screen.findByText('可关')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('可关')).toBeNull())
  })
})

describe('AlertDialog · 确认框', () => {
  it('Trigger → Content + Action/Cancel 点击关闭', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <AlertDialog>
        <AlertDialogTrigger>删除</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>此操作不可撤销</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )
    await user.click(screen.getByText('删除'))
    expect(await screen.findByText('确认删除？')).toBeInTheDocument()
    expect(screen.getByText('此操作不可撤销')).toBeInTheDocument()
    await user.click(screen.getByText('取消'))
    await waitFor(() => expect(screen.queryByText('确认删除？')).toBeNull())
    await user.click(screen.getByText('删除'))
    expect(await screen.findByText('确认')).toBeInTheDocument()
    await user.click(screen.getByText('确认'))
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})
