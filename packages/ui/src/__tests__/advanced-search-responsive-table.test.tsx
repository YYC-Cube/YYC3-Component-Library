// ============================================================
// YYC³ · @yyc3/ui advanced-search + responsive-table 补测（批次 6+ · 2026-11-27）
// 最后两块 0% 大件：385 行搜索复合组件（关键词/历史/高级筛选/快捷按钮/
// 筛选 chips 移除/清空）+ 199 行响应式表格（排序三态/行点击/CSV 导出/
// 移动端卡片视图）
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AdvancedSearch } from '../advanced-search'
import { ResponsiveTable } from '../responsive-table'
import { stubMatchMedia, stubPointerCapture, stubResizeObserver, stubIntersectionObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  stubIntersectionObserver()
  stubMatchMedia(false)
  // jsdom 无 Blob URL
  URL.createObjectURL = URL.createObjectURL ?? vi.fn(() => 'blob:mock-url')
  URL.revokeObjectURL = URL.revokeObjectURL ?? vi.fn()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
})

describe('AdvancedSearch · 高级搜索', () => {
  it('关键词搜索提交 + 历史记录写入', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<AdvancedSearch onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('搜索...')
    await user.type(input, '患者张三')
    await user.click(document.querySelector('button[type="submit"]') as HTMLElement)
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch.mock.calls[0][0]).toMatchObject({ keyword: '患者张三' })
  })

  it('清空关键词后显示搜索历史并回填', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch onSearch={vi.fn()} />)
    const input = screen.getByPlaceholderText('搜索...')
    await user.type(input, '历史关键词')
    await user.click(document.querySelector('button[type="submit"]') as HTMLElement)
    await user.clear(input)
    expect(screen.getByText('搜索历史')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /历史关键词/ }))
    expect(input).toHaveValue('历史关键词')
  })

  it('快捷按钮：紧急患者/高风险/今日就诊 → onSearch + chips', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<AdvancedSearch onSearch={onSearch} />)
    await user.click(screen.getByRole('button', { name: '紧急患者' }))
    expect(onSearch).toHaveBeenCalled()
    expect(screen.getByText('状态:')).toBeInTheDocument()
    expect(screen.getByText('紧急')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '高风险患者' }))
    expect(screen.getByText('风险:')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '今日就诊' }))
    expect(screen.getByText('就诊自:')).toBeInTheDocument()
  })

  it('筛选 chip 的 X 可移除单项（清空须在高级面板内）', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch onSearch={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: '紧急患者' }))
    await user.click(screen.getByRole('button', { name: '高风险患者' }))
    expect(screen.getByText('风险:')).toBeInTheDocument()
    // chip 内移除按钮（chip 容器内的 icon button）逐个移除
    const chip = screen.getByText('风险:').closest('div') as HTMLElement
    await user.click(chip.querySelector('button') as HTMLElement)
    await waitFor(() => expect(screen.queryByText('风险:')).toBeNull())
    expect(screen.getByText('状态:')).toBeInTheDocument()
    const chipStatus = screen.getByText('状态:').closest('div') as HTMLElement
    await user.click(chipStatus.querySelector('button') as HTMLElement)
    await waitFor(() => expect(screen.queryByText('状态:')).toBeNull())
  })

  it('高级筛选面板：打开→勾选高风险→应用筛选回调', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<AdvancedSearch onSearch={onSearch} />)
    // Filter 图标按钮（无文案）经 lucide 类名定位
    const filterBtn = document.querySelector('.lucide-filter')?.closest('button') as HTMLElement
    expect(filterBtn).not.toBeNull()
    await user.click(filterBtn)
    expect(await screen.findByText('高级筛选')).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: '高风险' }))
    // 勾选后 chip 已出现（面板仍开着）
    expect(screen.getByText('风险:')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '应用筛选' }))
    expect(onSearch).toHaveBeenCalled()
    expect(onSearch.mock.calls.at(-1)?.[0]?.filters?.riskHigh).toBe(true)
  })
})

describe('ResponsiveTable · 响应式表格', () => {
  type Row = { name: string; age: number }
  const columns = [
    { header: '姓名', accessorKey: 'name' as const, sortable: true },
    { header: '年龄', accessorKey: 'age' as const, sortable: true },
  ]
  const data: Row[] = [
    { name: '乙', age: 30 },
    { name: '甲', age: 25 },
  ]

  it('桌面视图渲染表头/行 + sortable 排序三态', async () => {
    const user = userEvent.setup()
    render(<ResponsiveTable data={data} columns={columns} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('乙')).toBeInTheDocument()
    // 数值列升序：25 行在前（cell 顺序 = 行内列顺序：姓名在前）
    await user.click(screen.getByText('年龄'))
    const cells = screen.getAllByRole('cell').map((c) => c.textContent)
    expect(cells[0]).toBe('甲')
    expect(cells[1]).toBe('25')
    // 再点降序：30 行在前
    await user.click(screen.getByText('年龄'))
    const desc = screen.getAllByRole('cell').map((c) => c.textContent)
    expect(desc[0]).toBe('乙')
    expect(desc[1]).toBe('30')
    // 三次点回未排序
    await user.click(screen.getByText('年龄'))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('行点击回调 + cell 自定义渲染', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    const cols = [
      { header: '姓名', accessorKey: 'name' as const, cell: (r: Row) => <b>名-{r.name}</b> },
    ]
    render(<ResponsiveTable data={data} columns={cols} onRowClick={onRowClick} />)
    await user.click(screen.getByText('名-乙'))
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('enableExport → 导出 CSV（Blob URL 桩）', async () => {
    const user = userEvent.setup()
    const createSpy = vi.fn(() => 'blob:csv')
    URL.createObjectURL = createSpy as unknown as typeof URL.createObjectURL
    const clickSpy = vi.fn()
    const linkSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(clickSpy)
    render(<ResponsiveTable data={data} columns={columns} enableExport exportFileName="报表" />)
    await user.click(screen.getByRole('button', { name: /导出CSV/ }))
    expect(createSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    linkSpy.mockRestore()
  })

  it('移动端视图（innerWidth<768）渲染 Card3d 列表', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<ResponsiveTable data={data} columns={columns} onRowClick={onRowClick} />)
    // effect 后切换为移动卡片视图（每张卡片都含列头“姓名”——直接点唯一值）
    await waitFor(() => expect(screen.queryByRole('table')).toBeNull())
    await user.click(screen.getByText('乙'))
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })
})
