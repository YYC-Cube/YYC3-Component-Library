// ============================================================
// YYC³ · @yyc3/ui Claw Modal 分支补强（batch2 · 2026-11-27）
// 双主题渲染 / 命令式预设 API / Focus Trap / ESC / 遮罩 / 异步 OK /
// 关闭过渡（afterClose+destroyOnClose+焦点还原）/ 自定义 footer / ref 双态
// 基线：modal.tsx 43.24%B（126 miss，全包最大单文件杠杆）
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClawModal, ClawButton } from '../index'
import type { YYC3Theme } from '../index'
import { silenceConsole } from './helpers'

const wait = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)))

beforeEach(() => {
  silenceConsole()
  document.body.style.overflow = ''
})
// 注意：命令式预设 API 的容器在各用例内显式 destroy()（root.unmount 正常移除 portal），
// 这里不能 body.innerHTML=''——会把 RTL 尚未卸载的 portal 节点抽走导致 unmount 报错

describe('ClawModal · 双主题渲染路径', () => {
  it('cyberpunk 默认主题：遮罩/标题/关闭钮/底部双钮/角饰齐备', () => {
    render(
      <ClawModal visible title="删除确认" onClose={() => {}}>
        <p>确认删除该档案？</p>
      </ClawModal>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('删除确认')).toBeInTheDocument()
    expect(screen.getByText('确认删除该档案？')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '确 认' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '取 消' })).toBeInTheDocument()
    expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull()
    // 滚动锁定
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('liquid-glass 主题：玻璃高光分支 + blur 遮罩', () => {
    render(
      <ClawModal visible title="玻璃弹窗" theme="liquid-glass">
        玻璃内容
      </ClawModal>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('玻璃弹窗')).toBeInTheDocument()
  })

  it('width/top 传字符串 + centered 居中分支', () => {
    render(
      <ClawModal visible width="80%" top="10%" centered title="居中">
        居中内容
      </ClawModal>,
    )
    expect(screen.getByRole('dialog').style.width).toBe('80%')
    expect(screen.getByText('居中内容')).toBeInTheDocument()
  })

  it('ref 函数式与对象式都能拿到 dialog 节点', () => {
    const fnRef = vi.fn()
    const { rerender } = render(
      <ClawModal visible ref={fnRef} title="ref 函数">
        r1
      </ClawModal>,
    )
    expect(fnRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    const objRef = React.createRef<HTMLDivElement>()
    rerender(
      <ClawModal visible ref={objRef} title="ref 对象">
        r2
      </ClawModal>,
    )
    expect(objRef.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('ClawModal · 交互分支', () => {
  it('ESC 触发 onCancel；遮罩点击（maskClosable 默认）触发 onCancel', async () => {
    const onCancel = vi.fn()
    render(
      <ClawModal visible onCancel={onCancel} title="esc">
        内容
      </ClawModal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
    // 遮罩本体点击（e.target === e.currentTarget）
    const mask = document.querySelector('[aria-hidden="true"]') as HTMLElement
    fireEvent.click(mask)
    expect(onCancel).toHaveBeenCalledTimes(2)
  })

  it('maskClosable=false：遮罩点击不关闭', () => {
    const onCancel = vi.fn()
    render(
      <ClawModal visible onCancel={onCancel} maskClosable={false} title="锁定遮罩">
        内容
      </ClawModal>,
    )
    const mask = document.querySelector('[aria-hidden="true"]') as HTMLElement
    fireEvent.click(mask)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('mask=false：无遮罩层', () => {
    render(
      <ClawModal visible mask={false} title="无遮罩">
        内容
      </ClawModal>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('同步 onOk / onOk 缺省直点确认都不抛错', async () => {
    const user = userEvent.setup()
    const onOk = vi.fn()
    const { rerender } = render(
      <ClawModal visible onOk={onOk} onCancel={() => {}} title="ok 同步">
        内容
      </ClawModal>,
    )
    await user.click(screen.getByRole('button', { name: '确 认' }))
    expect(onOk).toHaveBeenCalledTimes(1)
    // 无 onOk：点击确认走 handleOk 早退分支
    rerender(
      <ClawModal visible title="ok 缺省">
        内容
      </ClawModal>,
    )
    await user.click(screen.getByRole('button', { name: '确 认' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('异步 onOk：确认钮进入 loading（disabled+spinner）后恢复', async () => {
    const user = userEvent.setup()
    let resolveOk: () => void = () => {}
    const onOk = vi.fn(
      () =>
        new Promise<void>((res) => {
          resolveOk = res
        }),
    )
    render(
      <ClawModal visible onOk={onOk} onCancel={() => {}} title="异步确认">
        内容
      </ClawModal>,
    )
    const okBtn = screen.getByRole('button', { name: '确 认' }) as HTMLButtonElement
    await user.click(okBtn)
    expect(onOk).toHaveBeenCalledTimes(1)
    expect(okBtn.disabled).toBe(true)
    await act(async () => {
      resolveOk()
      await Promise.resolve()
    })
    await waitFor(() => expect(okBtn.disabled).toBe(false))
  })

  it('点击取消钮触发 onCancel', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ClawModal visible onCancel={onCancel} title="取消钮">
        内容
      </ClawModal>,
    )
    await user.click(screen.getByRole('button', { name: '取 消' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('关闭右上角按钮触发 onCancel', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ClawModal visible onCancel={onCancel} title="关闭钮">
        内容
      </ClawModal>,
    )
    await user.click(screen.getByRole('button', { name: '关闭' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('Focus Trap：Tab 尾→首循环、Shift+Tab 首→尾循环', async () => {
    render(
      <ClawModal visible title="焦点陷阱">
        内容
      </ClawModal>,
    )
    const close = screen.getByRole('button', { name: '关闭' })
    const ok = screen.getByRole('button', { name: '确 认' })
    // 打开后首个可聚焦元素（DOM 序第一：右上角关闭钮）获得焦点
    await waitFor(() => expect(document.activeElement).toBe(close))
    // 聚焦最后一个，Tab → 回到第一个
    ok.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(close)
    // 在第一个上 Shift+Tab → 跳到最后一个
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(ok)
  })
})

describe('ClawModal · 开关过渡与生命周期', () => {
  it('visible false 首渲染返回 null；打开后 afterOpen 触发', async () => {
    const afterOpen = vi.fn()
    const { rerender } = render(<ClawModal visible={false} afterOpen={afterOpen}>x</ClawModal>)
    expect(screen.queryByRole('dialog')).toBeNull()
    rerender(
      <ClawModal visible afterOpen={afterOpen} title="打开回调">
        内容
      </ClawModal>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // rendered 经双 rAF 置真 → 310ms 定时 → afterOpen；waitFor 轮询为 act 提供刷新窗口
    await waitFor(() => expect(afterOpen).toHaveBeenCalledTimes(1), { timeout: 2000 })
  })

  it('关闭过渡：afterClose 触发、焦点还原；destroyOnClose=false 时节点保留', async () => {
    const afterClose = vi.fn()
    const trigger = document.createElement('button')
    trigger.textContent = 'opener'
    document.body.appendChild(trigger)
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const { rerender } = render(
      <ClawModal visible afterClose={afterClose} title="关闭过渡" destroyOnClose={false}>
        残留内容
      </ClawModal>,
    )
    rerender(
      <ClawModal visible={false} afterClose={afterClose} title="关闭过渡" destroyOnClose={false}>
        残留内容
      </ClawModal>,
    )
    await wait(360)
    expect(afterClose).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(trigger)
    // destroyOnClose=false：关闭后 mounted 仍 true（children 保留在树中）
    expect(screen.getByText('残留内容')).toBeInTheDocument()
    trigger.remove()
  })

  it('destroyOnClose=true：关闭后完全卸载', async () => {
    const { rerender } = render(
      <ClawModal visible destroyOnClose title="销毁关闭">
        会被销毁
      </ClawModal>,
    )
    rerender(
      <ClawModal visible={false} destroyOnClose title="销毁关闭">
        会被销毁
      </ClawModal>,
    )
    await wait(360)
    expect(screen.queryByText('会被销毁')).toBeNull()
  })

  it('destroyOnClose=true + visible=false 首渲染：直接 null', async () => {
    const { rerender } = render(
      <ClawModal visible={false} destroyOnClose title="初始关闭">
        x
      </ClawModal>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    rerender(
      <ClawModal visible destroyOnClose title="再开">
        y
      </ClawModal>,
    )
    await wait(700)
    expect(screen.getByText('y')).toBeInTheDocument()
  })

  it('zIndex/style/bodyStyle/className 透传', () => {
    render(
      <ClawModal
        visible
        zIndex={2001}
        title="透传"
        className="custom-x"
        bodyStyle={{ padding: 40 }}
        style={{ border: '2px solid red' }}
      >
        内容
      </ClawModal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.style.border).toContain('2px solid red')
    expect(screen.getByText('内容').style.padding).toBe('40px')
  })
})

describe('ClawModal · footer 定制', () => {
  it('自定义 footer 节点渲染（默认双钮消失）', () => {
    render(
      <ClawModal visible title="自定义页脚" footer={<div>自定义页脚内容</div>}>
        内容
      </ClawModal>,
    )
    expect(screen.getByText('自定义页脚内容')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '确 认' })).toBeNull()
  })

  it('footer=null 隐藏整个底部', () => {
    render(
      <ClawModal visible title="无页脚" footer={null}>
        内容
      </ClawModal>,
    )
    expect(screen.queryByRole('button', { name: '确 认' })).toBeNull()
    expect(screen.queryByRole('button', { name: '取 消' })).toBeNull()
  })
})

describe('ClawModal · 标题/关闭开关组合', () => {
  it('closable=false + title：标题无关闭钮', () => {
    render(
      <ClawModal visible title="仅标题" closable={false}>
        内容
      </ClawModal>,
    )
    expect(screen.getByText('仅标题')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '关闭' })).toBeNull()
  })

  it('无 title + closable：仅渲染关闭钮（titleId 省略分支）', () => {
    render(<ClawModal visible>无标题内容</ClawModal>)
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('closable=false + 无 title：整个标题栏不渲染', () => {
    render(
      <ClawModal visible closable={false}>
        纯内容
      </ClawModal>,
    )
    expect(screen.getByText('纯内容')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '关闭' })).toBeNull()
  })
})

describe('ClawModal · 命令式预设 API（五档）', () => {
  it('confirm（cyberpunk）：确认/取消双钮，取消回调后销毁容器', async () => {
    let api: { destroy: () => void } | undefined
    const onCancel = vi.fn()
    act(() => {
      api = ClawModal.confirm({ title: '确认操作', content: '要继续吗？', onCancel })
    })
    await waitFor(() => expect(screen.getByText('确认操作')).toBeInTheDocument())
    expect(screen.getByText('要继续吗？')).toBeInTheDocument()
    // confirm 档独有取消钮
    const cancelBtn = screen.getByRole('button', { name: '取 消' })
    await act(async () => {
      fireEvent.click(cancelBtn)
      await Promise.resolve()
    })
    expect(onCancel).toHaveBeenCalledTimes(1)
    // 关闭过渡后 afterClose → destroy 移除容器
    await wait(400)
    expect(screen.queryByText('确认操作')).toBeNull()
    api?.destroy() // 幂等
  })

  it('info（liquid-glass）：单确认钮，确认回调后关闭', async () => {
    const onOk = vi.fn()
    act(() => {
      ClawModal.info({ title: '信息提示', content: '一切正常', theme: 'liquid-glass', onOk })
    })
    await waitFor(() => expect(screen.getByText('信息提示')).toBeInTheDocument())
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '确 认' }))
      await Promise.resolve()
    })
    expect(onOk).toHaveBeenCalledTimes(1)
    await wait(400)
    expect(screen.queryByText('信息提示')).toBeNull()
  })

  it('success / error / warning 三档图标渲染', async () => {
    const apis: Array<{ destroy: () => void } | undefined> = []
    act(() => {
      apis.push(ClawModal.success({ title: '成功' }))
    })
    await waitFor(() => expect(screen.getByText('成功')).toBeInTheDocument())
    act(() => {
      apis.push(ClawModal.error({ title: '失败', okText: '知道了' }))
    })
    await waitFor(() => expect(screen.getByText('失败')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: '知道了' })).toBeInTheDocument()
    act(() => {
      apis.push(ClawModal.warning({ title: '警告' }))
    })
    await waitFor(() => expect(screen.getByText('警告')).toBeInTheDocument())
    // 三个实例都在文档里（各自容器）
    expect(document.querySelectorAll('.yyc3-modal-dialog').length).toBe(3)
    apis.forEach((a) => a?.destroy())
  })

  it('异步 onOk 预设：确认后等 Promise 再关闭', async () => {
    let resolveOk: () => void = () => {}
    act(() => {
      ClawModal.confirm({
        title: '异步预设',
        onOk: () =>
          new Promise<void>((res) => {
            resolveOk = res
          }),
      })
    })
    await waitFor(() => expect(screen.getByText('异步预设')).toBeInTheDocument())
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '确 认' }))
      await Promise.resolve()
    })
    await act(async () => {
      resolveOk()
      await Promise.resolve()
    })
    await wait(400)
    expect(screen.queryByText('异步预设')).toBeNull()
  })

  it('destroy() 直接卸载预设实例', async () => {
    let api: { destroy: () => void } | undefined
    act(() => {
      api = ClawModal.warning({ title: '直接销毁' })
    })
    await waitFor(() => expect(screen.getByText('直接销毁')).toBeInTheDocument())
    act(() => {
      api?.destroy()
    })
    expect(screen.queryByText('直接销毁')).toBeNull()
  })
})

describe('ClawModal · 与 ClawButton 组合渲染（回归）', () => {
  it('按钮触发受控开关全流程', async () => {
    const user = userEvent.setup()
    function Demo() {
      const [visible, setVisible] = React.useState(false)
      return (
        <>
          <ClawButton onClick={() => setVisible(true)}>打开弹窗</ClawButton>
          <ClawModal visible={visible} onCancel={() => setVisible(false)} title="受控弹窗">
            受控内容
          </ClawModal>
        </>
      )
    }
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: '打开弹窗' }))
    expect(screen.getByText('受控内容')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '取 消' }))
    await wait(360)
    // destroyOnClose 默认 false：children 保留在树中（关闭过渡后仍渲染），仅弹层退场
    expect(screen.getByText('受控内容')).toBeInTheDocument()
  })
})
