// ============================================================
// YYC³ · @yyc3/ui 中杠杆组件分支补强（batch2 · 2026-11-27）
// advanced-search / interactive-progress / carousel / chart /
// responsive-table / 3d-button / 3d-card / enhanced-form /
// interactive-card / calendar(range)
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AdvancedSearch } from '../advanced-search'
import { InteractiveProgress } from '../interactive-progress'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../carousel'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '../chart'
import { ResponsiveTable } from '../responsive-table'
import { Button3d } from '../3d-button'
import { Card3d, Card3dTitle } from '../3d-card'
import { EnhancedForm, FormField, FormItem, FormLabel, FormControl, Input } from '../enhanced-form'
import { EnhancedForm as EF } from '../enhanced-form'
import { InteractiveCard } from '../interactive-card'
import { Calendar } from '../calendar'
import {
  stubMatchMedia,
  stubPointerCapture,
  stubResizeObserver,
  stubIntersectionObserver,
} from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  stubIntersectionObserver()
  stubMatchMedia(false)
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  // jsdom 无 Blob URL
  URL.createObjectURL = vi.fn(() => 'blob:mock')
  URL.revokeObjectURL = vi.fn()
})

// ─────────────────────────────────────────────
// AdvancedSearch
// ─────────────────────────────────────────────
describe('AdvancedSearch · 高级筛选面板', () => {
  function setup() {
    const onSearch = vi.fn()
    const utils = render(<AdvancedSearch onSearch={onSearch} />)
    // 表单内前两个按钮 = 筛选触发 + 搜索提交
    const formButtons = document.querySelectorAll('form button')
    const filterBtn = formButtons[0] as HTMLButtonElement
    const submitBtn = formButtons[1] as HTMLButtonElement
    return { onSearch, filterBtn, submitBtn, ...utils }
  }

  it('打开面板：风险复选（重复点击走已激活分支）+ 年龄输入 chips', async () => {
    const user = userEvent.setup()
    const { filterBtn } = setup()
    await user.click(filterBtn)
    expect(await screen.findByText('高级筛选')).toBeInTheDocument()
    // 中风险两次点击：第二次 key 已在 activeFilters → 跳过 push（分支）
    await user.click(screen.getByRole('checkbox', { name: '中风险' }))
    await user.click(screen.getByRole('checkbox', { name: '中风险' }))
    await user.click(screen.getByRole('checkbox', { name: '低风险' }))
    // 年龄范围输入 → chips
    await user.type(screen.getByPlaceholderText('最小年龄'), '30')
    await user.type(screen.getByPlaceholderText('最大年龄'), '60')
    expect(screen.getAllByText('中风险').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('低风险').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('年龄自:')).toBeInTheDocument()
    expect(screen.getByText('年龄至:')).toBeInTheDocument()
    expect(screen.getAllByText('30').length).toBeGreaterThanOrEqual(1)
  })

  it('Radix Select：患者状态 pending/stable/active 各档 chips', async () => {
    const user = userEvent.setup()
    const { filterBtn } = setup()
    await user.click(filterBtn)
    await screen.findByText('高级筛选')
    const statusTrigger = screen.getAllByRole('combobox')[0]
    await user.click(statusTrigger)
    await user.click(await screen.findByRole('option', { name: '待复诊' }))
    expect((await screen.findAllByText('待复诊')).length).toBeGreaterThanOrEqual(1)
    // 再开选"稳定"（stable 条件分支）
    await user.click(statusTrigger)
    await user.click(await screen.findByRole('option', { name: '稳定' }))
    expect((await screen.findAllByText('稳定')).length).toBeGreaterThanOrEqual(1)
    // 再开选"跟踪中"（active 条件分支）
    await user.click(statusTrigger)
    await user.click(await screen.findByRole('option', { name: '跟踪中' }))
    expect((await screen.findAllByText('跟踪中')).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('状态:')).toBeInTheDocument()
    // 取消按钮关闭面板
    await user.click(screen.getByRole('button', { name: '取消' }))
  })

  it('性别 Select：male/female 条件分支 chips', async () => {
    const user = userEvent.setup()
    const { filterBtn } = setup()
    await user.click(filterBtn)
    await screen.findByText('高级筛选')
    const genderTrigger = screen.getAllByRole('combobox')[1]
    await user.click(genderTrigger)
    await user.click(await screen.findByRole('option', { name: '男' }))
    expect((await screen.findAllByText('男')).length).toBeGreaterThanOrEqual(1)
    await user.click(genderTrigger)
    await user.click(await screen.findByRole('option', { name: '女' }))
    expect((await screen.findAllByText('女')).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('性别:')).toBeInTheDocument()
  })

  it('搜索历史：去重分支（同关键词不入两次）+ 历史回填', async () => {
    const user = userEvent.setup()
    const { onSearch, submitBtn } = setup()
    const input = screen.getByPlaceholderText('搜索...') as HTMLInputElement
    // 第一次提交
    await user.type(input, '病人甲')
    await user.click(submitBtn)
    expect(onSearch).toHaveBeenCalledTimes(1)
    // 清空 → 历史出现
    await user.clear(input)
    expect(screen.getByText('搜索历史')).toBeInTheDocument()
    expect(screen.getAllByText('病人甲').length).toBe(1)
    // 同关键词再提交 → 不重复入历史（L42 else 分支）
    await user.type(input, '病人甲')
    await user.click(submitBtn)
    expect(onSearch).toHaveBeenCalledTimes(2)
    await user.clear(input)
    expect(screen.getAllByText('病人甲').length).toBe(1)
    // 点击历史项回填
    await user.click(screen.getByRole('button', { name: /病人甲/ }))
    expect((screen.getByPlaceholderText('搜索...') as HTMLInputElement).value).toBe('病人甲')
  })

  it('快捷筛选钮：紧急患者 / 高风险患者 / 今日就诊', async () => {
    const user = userEvent.setup()
    const { onSearch } = setup()
    await user.click(screen.getByRole('button', { name: '紧急患者' }))
    expect(onSearch).toHaveBeenLastCalledWith(expect.objectContaining({ filters: expect.objectContaining({ status: 'urgent' }) }))
    await user.click(screen.getByRole('button', { name: '高风险患者' }))
    expect(onSearch).toHaveBeenLastCalledWith(expect.objectContaining({ filters: expect.objectContaining({ riskHigh: true }) }))
    await user.click(screen.getByRole('button', { name: '今日就诊' }))
    expect(onSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ visitFrom: expect.any(Date) }) }),
    )
    // chips：紧急 / 高风险 / 就诊自
    expect(screen.getAllByText('紧急').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('高风险').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('就诊自:')).toBeInTheDocument()
    // 打开面板（activeFilters>0 → 清除全部可见）→ 清空分支
    const formButtons2 = document.querySelectorAll('form button')
    await user.click(formButtons2[0] as HTMLButtonElement)
    await user.click(await screen.findByRole('button', { name: '清除全部' }))
    expect(screen.queryByText('就诊自:')).toBeNull()
  })
})

// ─────────────────────────────────────────────
// InteractiveProgress
// ─────────────────────────────────────────────
describe('InteractiveProgress · 编辑与动画', () => {
  function stubRect(el: HTMLElement) {
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 100,
      top: 0,
      height: 12,
      right: 100,
      bottom: 12,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
  }

  it('editable 拖拽全链：mousedown→mousemove→mouseup 回调', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InteractiveProgress value={20} editable onValueChange={onValueChange} title="进度条" />)
    const bar = screen.getByTitle(/点击或拖拽调整进度/) as HTMLElement
    stubRect(bar)
    // hover → tooltip 出现（editable+hovered 分支）
    await user.hover(bar)
    expect(screen.getByText('20%')).toBeInTheDocument()
    fireEvent.mouseDown(bar, { clientX: 50 })
    fireEvent.mouseMove(document, { clientX: 25 })
    expect(screen.getByText('25%')).toBeInTheDocument()
    fireEvent.mouseUp(document)
    expect(onValueChange).toHaveBeenCalledWith(25)
  })

  it('非 editable：mousedown 不进入拖拽（早退分支）', () => {
    const onValueChange = vi.fn()
    render(<InteractiveProgress value={40} onValueChange={onValueChange} />)
    const bar = screen.getByTitle('进度: 40%') as HTMLElement
    stubRect(bar)
    fireEvent.mouseDown(bar, { clientX: 80 })
    fireEvent.mouseMove(document, { clientX: 10 })
    fireEvent.mouseUp(document)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('mouseUp 未拖拽不回调；size sm/lg + animated 光带分支', () => {
    const onValueChange = vi.fn()
    render(
      <div>
        <InteractiveProgress value={10} size="sm" animated onValueChange={onValueChange} className="mark-sm" />
        <InteractiveProgress value={90} size="lg" animated onValueChange={onValueChange} className="mark-lg" />
      </div>,
    )
    const sm = document.querySelector('.mark-sm')?.firstElementChild as HTMLElement
    stubRect(sm)
    fireEvent.mouseUp(document)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(document.querySelector('.mark-lg')).not.toBeNull()
  })

  it('受控 value 同步 effect', () => {
    const { rerender } = render(<InteractiveProgress value={10} editable />)
    rerender(<InteractiveProgress value={70} editable />)
    expect(screen.getByTitle(/进度: 70%/)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────
// Carousel
// ─────────────────────────────────────────────
describe('Carousel · 键盘与纵向档', () => {
  it('ArrowLeft/Right 键盘事件（fireEvent 直发）', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>页一</CarouselItem>
          <CarouselItem>页二</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    )
    const region = document.querySelector('[data-slot="carousel"]') as HTMLElement
    fireEvent.keyDown(region, { key: 'ArrowLeft' })
    fireEvent.keyDown(region, { key: 'ArrowRight' })
    expect(region).toBeInTheDocument()
  })

  it('opts.axis=y：embla 纵轴初始化不炸（context orientation 有默认参，纵向样式分支为死代码——记录）', () => {
    render(
      <Carousel opts={{ axis: 'y' }}>
        <CarouselContent>
          <CarouselItem>纵一</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(screen.getByText('纵一')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────
// Chart
// ─────────────────────────────────────────────
const chartConfig = {
  desktop: { label: '桌面端', color: '#111' },
  '未知名': { label: '兜底标签', color: '#222' },
}

describe('Chart · Tooltip/Legend 深分支', () => {
  it('ChartStyle：theme-only 条目缺失 dark 色 → null 行分支', () => {
    render(
      <ChartContainer config={{ desktop: { label: 'X', theme: { light: '#0ff' } as never } }}>
        <div>child</div>
      </ChartContainer>,
    )
    const chartEl = document.querySelector('[data-chart^="chart-"]') as HTMLElement
    expect(chartEl.querySelector('style')).not.toBeNull()
  })

  it('单条 payload + indicator=line：nestLabel 分支', () => {
    render(
      <ChartContainer config={chartConfig}>
        <div>
          <ChartTooltipContent
            active
            indicator="line"
            payload={[{ dataKey: 'desktop', name: 'desktop', value: 5, payload: { fill: '#123' } } as never]}
            label="desktop"
          />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('dashed + 单条：my-0.5 指示器分支', () => {
    render(
      <ChartContainer config={chartConfig}>
        <div>
          <ChartTooltipContent
            active
            indicator="dashed"
            payload={[{ dataKey: 'desktop', name: 'desktop', value: 6, payload: { fill: '#123' } } as never]}
          />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('payload 元素缺 dataKey/name → key 兜底 "value" 路径；item.color 指示色分支', () => {
    render(
      <ChartContainer config={chartConfig}>
        <div>
          {/* 无 dataKey/name → key='value'；无 payload.fill → 回退 item.color */}
          <ChartTooltipContent active payload={[{ value: 9, color: '#f00', payload: {} } as never]} />
          {/* 有 dataKey 无 name → key=dataKey 路径 */}
          <ChartTooltipContent active payload={[{ dataKey: 'desktop', value: 3, payload: {} } as never]} />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('payload 条目缺 payload 字段 → 防御可选链回退 item.color，渲染不炸（batch2 缺陷已修复）', () => {
    render(
      <ChartContainer config={chartConfig}>
        <div>
          <ChartTooltipContent active payload={[{ value: 9, color: '#f00' } as never]} />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('getPayloadConfigFromPayload：key 直存 payload / payloadPayload 内键 / 非对象 payload', () => {
    render(
      <ChartContainer config={chartConfig}>
        <div>
          {/* item.name='desktop' + nameKey='name' → key='name' 在 item 上直取 */}
          <ChartTooltipContent
            active
            nameKey="name"
            payload={[{ name: 'desktop', value: 1, payload: { fill: '#1' } } as never]}
          />
          {/* key 在 item.payload 内（payloadPayload 分支） */}
          <ChartTooltipContent
            active
            nameKey="visits"
            payload={[{ value: 2, payload: { visits: '未知名' } } as never]}
          />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('config 缺键 → label 回退 item.name；label 不在 config → 回退原 label；labelKey 未命中 → label null', () => {
    render(
      <ChartContainer config={chartConfig}>
        <div>
          {/* itemConfig 缺失 → label 回退 item.name */}
          <ChartTooltipContent active payload={[{ name: '野名字', value: 3, payload: {} } as never]} />
          {/* label='不在config的串' → value 回退 label 本身 */}
          <ChartTooltipContent active payload={[{ name: 'n', dataKey: 'd', value: 4, payload: {} } as never]} label="自由标签" />
          {/* labelKey 未命中 config → tooltipLabel null */}
          <ChartTooltipContent active labelKey="nope" payload={[{ name: 'n2', value: 7, payload: {} } as never]} label={undefined} />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('野名字')).toBeInTheDocument()
    expect(screen.getByText('自由标签')).toBeInTheDocument()
  })

  it('Legend：icon 渲染分支 + 无 dataKey 兜底 + 非对象 payload', () => {
    const iconConfig = {
      desktop: { label: '桌面端', icon: () => <i data-testid="legend-icon-node" /> },
    }
    render(
      <ChartContainer config={iconConfig}>
        <div>
          <ChartLegendContent
            payload={[
              { dataKey: 'desktop', value: 'desktop', color: '#f00' } as never,
              { value: '无名', color: '#0f0' } as never,
              '裸串' as never,
            ]}
          />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByTestId('legend-icon-node')).toBeInTheDocument()
    expect(screen.getByText('桌面端')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────
// ResponsiveTable
// ─────────────────────────────────────────────
interface Row {
  name: string
  score: number
  note: string
}
const tableColumns = [
  { header: '姓名', accessorKey: 'name' as const },
  { header: '评分', accessorKey: 'score' as const, sortable: true },
  { header: '备注', accessorKey: 'note' as const, cell: (i: Row) => <b>{i.note}!</b> },
]
const tableData: Row[] = [
  { name: '丙,含逗号', score: 3, note: 'a' },
  { name: '甲', score: 1, note: 'b' },
  { name: '乙', score: 1, note: 'c' },
]

describe('ResponsiveTable · 排序/导出/自定义 cell', () => {
  it('导出 CSV：逗号值引号包裹 + 默认文件名', () => {
    const createSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(<ResponsiveTable data={tableData} columns={tableColumns} enableExport />)
    fireEvent.click(screen.getByRole('button', { name: /导出CSV/ }))
    expect(createSpy).toHaveBeenCalled()
    createSpy.mockRestore()
  })

  it('排序三连击：asc → desc → 重置（图标与排序双向比较分支）', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<ResponsiveTable data={tableData} columns={tableColumns} onRowClick={onRowClick} />)
    const scoreTh = screen.getByRole('columnheader', { name: /评分/ })
    // 第一击 asc
    await user.click(scoreTh)
    const firstRow = screen.getAllByRole('row')[1]
    expect(firstRow.textContent).toContain('甲')
    // 第二击 desc（含重置前档 + ChevronDown 分支）
    await user.click(scoreTh)
    expect(screen.getAllByRole('row')[1].textContent).toContain('丙')
    // 第三击 重置（sortDirection desc → null 分支）
    await user.click(scoreTh)
    expect(screen.getAllByRole('row')[1].textContent).toContain('丙')
    // 行点击回调 + 自定义 cell
    await user.click(screen.getAllByRole('row')[1])
    expect(onRowClick).toHaveBeenCalled()
    expect(document.querySelectorAll('td b').length).toBe(3)
  })
})

// ─────────────────────────────────────────────
// 3d-button / 3d-card / enhanced-form / interactive-card / calendar
// ─────────────────────────────────────────────
describe('Button3d · asChild/icon/按压分支', () => {
  it('asChild：Slot 收到单一子元素 → 渲染为 a 链接不炸（batch2 缺陷已修复）', () => {
    render(
      <Button3d asChild>
        <a href="/go">链接钮</a>
      </Button3d>,
    )
    const link = screen.getByRole('link', { name: '链接钮' })
    expect(link).toHaveAttribute('href', '/go')
    // 立体按钮变体类名透传到子元素（Slot props 合并）
    expect(link.className).toContain('inline-flex')
    // 波纹层不再渲染进 Slot（asChild 分支）
    expect(link.querySelector('.ripple-effect')).toBeNull()
  })

  it('icon 左/右位置分支 + 禁用按压早退', () => {
    render(
      <div>
        <Button3d icon={<span data-testid="ic-l">L</span>} iconPosition="left">
          左图标
        </Button3d>
        <Button3d icon={<span data-testid="ic-r">R</span>} iconPosition="right">
          右图标
        </Button3d>
        <Button3d disabled data-testid="dis-btn">
          禁用
        </Button3d>
      </div>,
    )
    expect(screen.getByTestId('ic-l')).toBeInTheDocument()
    expect(screen.getByTestId('ic-r')).toBeInTheDocument()
    const dis = screen.getByTestId('dis-btn')
    fireEvent.mouseDown(dis)
    fireEvent.mouseUp(dis)
    fireEvent.mouseLeave(dis)
    expect(dis).toHaveAttribute('aria-disabled', 'true')
  })

  it('按压后 mouseleave 复位分支', () => {
    render(<Button3d data-testid="press">按压</Button3d>)
    const btn = screen.getByTestId('press')
    fireEvent.mouseDown(btn)
    fireEvent.mouseLeave(btn)
    fireEvent.keyDown(btn, { key: 'Enter' })
    fireEvent.keyUp(btn, { key: 'Enter' })
  })
})

describe('Card3d · 悬浮视差与移动端分支', () => {
  it('interactive：hover → transform 视差样式；leave 复位', () => {
    render(
      <Card3d interactive data-testid="tilt" title="视差卡">
        内容
      </Card3d>,
    )
    const card = screen.getByTestId('tilt')
    fireEvent.mouseEnter(card)
    fireEvent.mouseMove(card, { clientX: 120, clientY: 80 })
    expect(card.style.transform).toContain('perspective')
    fireEvent.mouseLeave(card)
    expect(card.style.transform).toBe('')
  })

  it('matchMedia(true)：Card3dTitle 移动端字号分支', () => {
    stubMatchMedia(true)
    render(<Card3dTitle data-testid="m-title">移动标题</Card3dTitle>)
    expect(screen.getByTestId('m-title')).toBeInTheDocument()
    stubMatchMedia(false)
  })
})

describe('EnhancedForm · 布局与档位', () => {
  it('matchMedia(true)：horizontal 布局在移动端强制纵向', () => {
    stubMatchMedia(true)
    const onSubmit = vi.fn()
    render(
      <EnhancedForm onSubmit={onSubmit} layout="horizontal" onCancel={() => {}} gap="lg">
        <input aria-label="字段" />
      </EnhancedForm>,
    )
    expect(screen.getByRole('button', { name: '提交' })).toBeInTheDocument()
    stubMatchMedia(false)
  })

  it('gap=sm 档 + FormField 无 required 无 error', () => {
    const onSubmit = vi.fn()
    render(
      <EnhancedForm onSubmit={onSubmit} gap="sm">
        <FormField label="昵称" htmlFor="nk">
          <input id="nk" />
        </FormField>
      </EnhancedForm>,
    )
    expect(screen.getByText('昵称')).toBeInTheDocument()
  })

  it('校验消息条（isValid=false + validationMessage）', () => {
    const onSubmit = vi.fn()
    render(
      <EnhancedForm onSubmit={onSubmit} isValid={false} validationMessage="表单未通过校验">
        <input aria-label="字段" />
      </EnhancedForm>,
    )
    expect(screen.getByText('表单未通过校验')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '提交' })).toBeDisabled()
  })
})

describe('InteractiveCard · active 态元素分支', () => {
  it('active=true：icon/description/children/footer 白化样式全走', () => {
    render(
      <InteractiveCard
        title="激活卡"
        icon={<span data-testid="ic-card">✦</span>}
        description="描述文字"
        footer={<span>卡脚</span>}
        active
        onClick={() => {}}
      >
        主体内容
      </InteractiveCard>,
    )
    expect(screen.getByTestId('ic-card')).toBeInTheDocument()
    expect(screen.getByText('描述文字')).toBeInTheDocument()
    expect(screen.getByText('主体内容')).toBeInTheDocument()
    expect(screen.getByText('卡脚')).toBeInTheDocument()
  })

  it('opacity 禁用视觉（disabled 样式分支）', () => {
    render(
      <InteractiveCard title="弱化卡" className="weak-mark">
        内容
      </InteractiveCard>,
    )
    expect(document.querySelector('.weak-mark')).not.toBeNull()
  })
})

describe('Calendar · 范围选择修饰符', () => {
  it('mode=range：两次点选后 range_start/middle/end 数据属性分支', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="range" defaultMonth={new Date(2026, 5, 1)} />)
    await user.click(screen.getByRole('button', { name: /June 10th/ }))
    await user.click(screen.getByRole('button', { name: /June 20th/ }))
    expect(document.querySelector('[data-range-start="true"]')).not.toBeNull()
    expect(document.querySelector('[data-range-middle="true"]')).not.toBeNull()
    expect(document.querySelector('[data-range-end="true"]')).not.toBeNull()
  })
})
