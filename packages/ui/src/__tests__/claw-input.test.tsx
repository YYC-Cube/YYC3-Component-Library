// ============================================================
// YYC³ · @yyc3/ui Claw Input 分支补强（batch2 · 2026-11-27）
// 六类型/三状态消息/前后缀/清除/密码切换/字数统计（含超限）/
// 受控双态/Enter 事件/textarea/禁用只读/双主题/尺寸档
// 基线：claw/input.tsx 65.38%B（81 miss）
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClawInput } from '../index'
import { silenceConsole } from './helpers'

beforeEach(() => {
  silenceConsole()
})

describe('ClawInput · 三状态与状态消息', () => {
  it('status=error：错误消息 role=alert + 边框/阴影分支', () => {
    render(<ClawInput status="error" errorMessage="姓名不能为空" data-testid="err-in" />)
    expect(screen.getByRole('alert')).toHaveTextContent('姓名不能为空')
    expect(screen.getByTestId('err-in')).toHaveAttribute('aria-invalid', 'true')
    // 焦点态错误阴影分支（getShadowForStatus error）
    fireEvent.focus(screen.getByTestId('err-in'))
  })

  it('status=warning / success：消息 role=status + 图标分支', () => {
    render(
      <div>
        <ClawInput status="warning" warningMessage="格式较特殊" />
        <ClawInput status="success" successMessage="校验通过" />
      </div>,
    )
    expect(screen.getByText('格式较特殊')).toBeInTheDocument()
    expect(screen.getByText('校验通过')).toBeInTheDocument()
    const statuses = screen.getAllByRole('status')
    expect(statuses.length).toBe(2) // warning 与 success 消息各一条
  })

  it('聚焦分支：focused 时 borderFocus/焦点阴影（default 状态）', () => {
    render(<ClawInput data-testid="focus-in" />)
    const el = screen.getByTestId('focus-in')
    fireEvent.focus(el)
    fireEvent.blur(el)
    expect(el).not.toHaveFocus()
  })
})

describe('ClawInput · 受控/非受控与事件', () => {
  it('非受控输入：defaultValue 起步、键入更新', async () => {
    const user = userEvent.setup()
    render(<ClawInput defaultValue="初始" data-testid="unctl" />)
    const el = screen.getByTestId('unctl') as HTMLInputElement
    expect(el.value).toBe('初始')
    await user.type(el, '!')
    expect(el.value).toBe('初始!')
  })

  it('受控输入：键入只回调 onChange、值保持受控', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    function Demo() {
      const [v, setV] = React.useState('固定值')
      return <ClawInput value={v} onChange={(e) => { onChange(e.target.value); setV('受控') }} data-testid="ctl" />
    }
    render(<Demo />)
    await user.type(screen.getByTestId('ctl'), 'x')
    expect(onChange).toHaveBeenCalled()
    // 受控分支：内部值不落地（handleChange 只透传事件）
    expect((screen.getByTestId('ctl') as HTMLInputElement).value).toBe('受控')
  })

  it('value=null 受控：按空串处理', () => {
    render(<ClawInput value={null as unknown as string} data-testid="null-v" />)
    expect((screen.getByTestId('null-v') as HTMLInputElement).value).toBe('')
  })

  it('Enter 触发 onPressEnter（单行）；textarea 回车不触发', async () => {
    const user = userEvent.setup()
    const onPressEnter = vi.fn()
    render(
      <div>
        <ClawInput onPressEnter={onPressEnter} data-testid="enter-in" />
        <ClawInput type="textarea" onPressEnter={onPressEnter} data-testid="enter-ta" />
      </div>,
    )
    await user.type(screen.getByTestId('enter-in'), '{Enter}')
    expect(onPressEnter).toHaveBeenCalledTimes(1)
    await user.type(screen.getByTestId('enter-ta'), '{Enter}')
    expect(onPressEnter).toHaveBeenCalledTimes(1) // textarea 分支不再触发
  })
})

describe('ClawInput · 清除与密码切换', () => {
  it('allowClear 非受控：原生清空 DOM 值 + 回焦（inputRef 已挂载，batch2 缺陷已修复）', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ClawInput allowClear defaultValue="待清除" onChange={onChange} data-testid="clr" />)
    const clearBtn = screen.getByRole('button', { name: '清除内容' })
    await user.click(clearBtn)
    // 修复后：原生 setter 清 DOM 值 + input 事件 → 真实 React onChange 单次派发（无合成双重派发）
    expect(onChange).toHaveBeenCalledTimes(1)
    const evt = onChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>
    expect(evt.target.value).toBe('')
    expect((screen.getByTestId('clr') as HTMLInputElement).value).toBe('')
    expect(screen.getByTestId('clr')).toHaveFocus()
  })

  it('allowClear 受控：原生 input 事件派发受控 onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    function Demo() {
      const [v, setV] = React.useState('内容')
      return <ClawInput allowClear value={v} onChange={(e) => { onChange(e.target.value); setV('') }} data-testid="clr2" />
    }
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: '清除内容' }))
    expect(onChange).toHaveBeenCalledWith('')
    expect((screen.getByTestId('clr2') as HTMLInputElement).value).toBe('')
  })

  it('disabled + allowClear：不渲染清除钮', () => {
    render(<ClawInput allowClear disabled value="abc" data-testid="dis" />)
    expect(screen.queryByRole('button', { name: '清除内容' })).toBeNull()
    expect(screen.getByTestId('dis')).toBeDisabled()
  })

  it('allowClear + type=textarea：DOM 值真清空（textarea 原型 setter 分支，batch2 缺陷已修复）', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ClawInput allowClear type="textarea" defaultValue="多行内容" onChange={onChange} data-testid="clr-ta" />)
    await user.click(screen.getByRole('button', { name: '清除内容' }))
    const lastCall = onChange.mock.calls.at(-1)?.[0] as React.ChangeEvent<HTMLTextAreaElement>
    expect(lastCall.target.value).toBe('')
    expect((screen.getByTestId('clr-ta') as HTMLTextAreaElement).value).toBe('')
    expect(screen.getByTestId('clr-ta')).toHaveFocus()
  })

  it('password + passwordToggle：切换明文/密文 + 切换后回焦（inputRef 回焦分支）', async () => {
    const user = userEvent.setup()
    render(<ClawInput type="password" passwordToggle defaultValue="s3cret" data-testid="pwd" />)
    const el = screen.getByTestId('pwd') as HTMLInputElement
    expect(el.getAttribute('type')).toBe('password')
    await user.click(screen.getByRole('button', { name: '显示密码' }))
    expect(el.getAttribute('type')).toBe('text')
    expect(el).toHaveFocus()
    await user.click(screen.getByRole('button', { name: '隐藏密码' }))
    expect(el.getAttribute('type')).toBe('password')
  })
})

describe('ClawInput · 类型与前缀/后缀', () => {
  it('type=search：默认搜索图标前缀', () => {
    render(<ClawInput type="search" data-testid="search" />)
    expect(screen.getByTestId('search')).toBeInTheDocument()
  })

  it('type=search + 自定义 prefix：不再渲染默认图标（双分支）', () => {
    render(<ClawInput type="search" prefix={<span>搜</span>} data-testid="search2" />)
    expect(screen.getByText('搜')).toBeInTheDocument()
  })

  it('prefix + suffix 小/大尺寸档（padding 偏移分支）', () => {
    render(
      <div>
        <ClawInput size="small" prefix={<span>P1</span>} suffix={<span>S1</span>} data-testid="ss" />
        <ClawInput size="large" prefix={<span>P2</span>} suffix={<span>S2</span>} data-testid="sl" />
        <ClawInput size="medium" suffix={<span>S3</span>} data-testid="sm" />
      </div>,
    )
    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.getByText('S2')).toBeInTheDocument()
    expect(screen.getByText('S3')).toBeInTheDocument()
  })

  it('suffix + status 图标共存：右饰偏移累加分支', () => {
    render(<ClawInput status="error" errorMessage="必填" suffix={<span>单位</span>} data-testid="combo" />)
    expect(screen.getByText('单位')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

describe('ClawInput · textarea', () => {
  it('rows/受控/状态图标偏移/resize 分支', async () => {
    const user = userEvent.setup()
    function Demo() {
      const [v, setV] = React.useState('受控多行')
      return (
        <ClawInput
          type="textarea"
          rows={6}
          status="error"
          errorMessage="多行错误"
          value={v}
          onChange={(e) => setV(e.target.value)}
          data-testid="ta"
        />
      )
    }
    render(<Demo />)
    const ta = screen.getByTestId('ta') as HTMLTextAreaElement
    expect(ta.rows).toBe(6)
    expect(ta).toHaveAttribute('aria-invalid', 'true')
    await user.type(ta, '!')
    expect(ta.value).toBe('受控多行!')
  })

  it('textarea 非受控 defaultValue 分支', () => {
    render(<ClawInput type="textarea" defaultValue="默认多行" data-testid="ta2" />)
    expect((screen.getByTestId('ta2') as HTMLTextAreaElement).value).toBe('默认多行')
  })
})

describe('ClawInput · 字数统计', () => {
  it('showCount + maxLength：计数与上限标注', async () => {
    const user = userEvent.setup()
    render(<ClawInput showCount maxLength={5} data-testid="cnt" />)
    await user.type(screen.getByTestId('cnt'), 'abc')
    expect(screen.getByText('3 / 5')).toBeInTheDocument()
  })

  it('showCount 无 maxLength：仅计数（aria 标注省略上限）', () => {
    render(<ClawInput showCount defaultValue="一二三" data-testid="cnt2" />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('受控超限：charCount > maxLength 走错误色分支', () => {
    render(<ClawInput showCount maxLength={3} value="abcdef" onChange={() => {}} data-testid="over" />)
    expect(screen.getByText('6 / 3')).toBeInTheDocument()
  })
})

describe('ClawInput · 禁用/只读/外观透传/双主题', () => {
  it('disabled 与 readOnly 的背景/数据属性分支', () => {
    render(
      <div>
        <ClawInput disabled value="锁定" data-testid="ro1" />
        <ClawInput readOnly value="只读" data-testid="ro2" />
      </div>,
    )
    expect(screen.getByTestId('ro1')).toBeDisabled()
    expect(screen.getByTestId('ro2')).toHaveAttribute('readonly')
  })

  it('wrapperClassName/wrapperStyle/id 透传', () => {
    render(
      <ClawInput
        id="my-input"
        wrapperClassName="wrap-x"
        wrapperStyle={{ marginTop: 10 }}
        data-testid="pass"
      />,
    )
    expect(document.getElementById('my-input')).toBeInTheDocument()
    expect(document.querySelector('.yyc3-input-wrap.wrap-x')).not.toBeNull()
  })

  it('liquid-glass 主题：非等宽字体/统计色分支', async () => {
    const user = userEvent.setup()
    render(
      <ClawInput theme="liquid-glass" showCount maxLength={4} status="warning" warningMessage="小心" data-testid="glass" />,
    )
    await user.type(screen.getByTestId('glass'), 'ab')
    expect(screen.getByText('2 / 4')).toBeInTheDocument()
    expect(screen.getByText('小心')).toBeInTheDocument()
    fireEvent.focus(screen.getByTestId('glass'))
  })
})
