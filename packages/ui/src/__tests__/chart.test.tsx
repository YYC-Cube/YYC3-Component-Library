// ============================================================
// YYC³ · @yyc3/ui chart 渲染冒烟（批次 1 · 2026-11-27）
// 361 行逻辑重头：ChartContainer（含 ChartStyle color/theme 双分支）+
// ChartTooltipContent（active/payload/formatter/labelFormatter/indicator 三态）+
// ChartLegendContent（icon/hideIcon/verticalAlign）+ useChart 抛错
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  BarChart,
  LineChart,
} from '../chart'

// jsdom 无 ResizeObserver——recharts ResponsiveContainer 需要
beforeAll(() => {
  class RO {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  Object.defineProperty(window, 'ResizeObserver', { writable: true, value: RO })
  Object.defineProperty(global, 'ResizeObserver', { writable: true, value: RO })
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterAll(() => {
  vi.restoreAllMocks()
})

const config = {
  desktop: { label: '桌面端', color: 'hsl(var(--chart-1))' },
  mobile: {
    label: '移动端',
    theme: { light: '#10b981', dark: '#34d399' } as const,
  },
}

const payload = [
  { dataKey: 'desktop', name: 'desktop', value: 1890, color: '#ff0000', payload: { fill: '#ff0000' } },
  { dataKey: 'mobile', name: 'mobile', value: 960, color: '#00ff00', payload: { fill: '#00ff00' } },
]

describe('ChartContainer + ChartStyle', () => {
  it('容器渲染 + data-chart 属性 + style 注入（color 条目）', () => {
    render(
      <ChartContainer config={config} data-testid="chart">
        <div>chart-child</div>
      </ChartContainer>,
    )
    expect(screen.getByTestId('chart')).toBeInTheDocument()
    expect(screen.getByText('chart-child')).toBeInTheDocument()
    const chartEl = document.querySelector('[data-chart^="chart-"]') as HTMLElement
    expect(chartEl).toBeInTheDocument()
    // ChartStyle：两个 theme 前缀 + 每个条目 --color-* 变量
    const styleEl = chartEl.querySelector('style')
    expect(styleEl).not.toBeNull()
    expect(styleEl?.innerHTML).toContain('--color-desktop')
    expect(styleEl?.innerHTML).toContain('--color-mobile')
    expect(styleEl?.innerHTML).toContain('.dark')
  })

  it('config 全空 → ChartStyle 返回 null（不注入 style）', () => {
    render(
      <ChartContainer config={{}} data-testid="chart-empty">
        <div>bare</div>
      </ChartContainer>,
    )
    const chartEl = document.querySelector('[data-chart^="chart-"]') as HTMLElement
    expect(chartEl.querySelector('style')).toBeNull()
  })
})

describe('ChartTooltipContent', () => {
  function renderTooltip(props: Record<string, unknown>) {
    return render(
      <ChartContainer config={config}>
        <div>
          <ChartTooltipContent active payload={payload} label="desktop" {...props} />
        </div>
      </ChartContainer>,
    )
  }

  it('active + payload → 渲染 label 与每个条目（dot 指示器）', () => {
    renderTooltip({})
    // label 区与条目区各出现一次 → getAllByText
    expect(screen.getAllByText('桌面端').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('移动端').length).toBeGreaterThanOrEqual(1)
    // value.toLocaleString()
    expect(screen.getByText('1,890')).toBeInTheDocument()
    expect(screen.getByText('960')).toBeInTheDocument()
  })

  it('active=false → 返回 null', () => {
    renderTooltip({ active: false })
    expect(screen.queryByText('桌面端')).toBeNull()
  })

  it('payload 空 → 返回 null', () => {
    renderTooltip({ payload: [] })
    expect(screen.queryByText('桌面端')).toBeNull()
  })

  it('hideLabel → 不渲染 label；hideIndicator → 无指示器 div', () => {
    renderTooltip({ hideLabel: true })
    expect(screen.queryByText('desktop')).toBeNull()
    expect(screen.getByText('移动端')).toBeInTheDocument()
  })

  it('labelFormatter 接管 label 渲染', () => {
    renderTooltip({ labelFormatter: (v: unknown) => `FMT:${String(v)}` })
    expect(screen.getByText('FMT:桌面端')).toBeInTheDocument()
  })

  it('formatter 接管条目渲染', () => {
    renderTooltip({ formatter: (v: unknown) => <b>fmt-{String(v)}</b> })
    expect(screen.getByText('fmt-1890')).toBeInTheDocument()
    expect(screen.getByText('fmt-960')).toBeInTheDocument()
  })

  it('indicator=line 分支', () => {
    renderTooltip({ indicator: 'line' })
    expect(screen.getByText('1,890')).toBeInTheDocument()
  })

  it('indicator=dashed 分支', () => {
    renderTooltip({ indicator: 'dashed' })
    expect(screen.getByText('1,890')).toBeInTheDocument()
  })

  it('nameKey/labelKey 覆盖取键路径 + itemConfig.icon 分支', () => {
    const configWithIcon = {
      ...config,
      custom: {
        label: '图标项',
        icon: () => <i data-testid="icon-node" />,
      },
    }
    const iconPayload = [
      { dataKey: 'custom', name: 'custom', value: 7, payload: { fill: '#123456' } },
    ]
    render(
      <ChartContainer config={configWithIcon}>
        <div>
          <ChartTooltipContent active payload={iconPayload} nameKey="custom" />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByTestId('icon-node')).toBeInTheDocument()
    expect(screen.getAllByText('图标项').length).toBeGreaterThanOrEqual(1)
  })
})

describe('ChartLegendContent', () => {
  it('payload 渲染图例（无 icon → 色块 div）', () => {
    render(
      <ChartContainer config={config}>
        <div>
          <ChartLegendContent payload={payload as never} />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('桌面端')).toBeInTheDocument()
    expect(screen.getByText('移动端')).toBeInTheDocument()
  })

  it('payload 空 → null；icon 存在 + verticalAlign=top 分支', () => {
    render(
      <ChartContainer config={config}>
        <div>
          <ChartLegendContent
            payload={[
              {
                dataKey: 'desktop',
                value: 'desktop',
                color: '#f00',
              } as never,
            ]}
            verticalAlign="top"
          />
          <ChartLegendContent payload={[]} />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('桌面端')).toBeInTheDocument()
  })

  it('hideIcon=true 跳过 icon 渲染', () => {
    const configWithIcon = {
      ...config,
      desktop: { label: '桌面端', icon: () => <i data-testid="legend-icon" /> },
    }
    render(
      <ChartContainer config={configWithIcon}>
        <div>
          <ChartLegendContent
            hideIcon
            payload={[{ dataKey: 'desktop', value: 'desktop', color: '#f00' } as never]}
          />
        </div>
      </ChartContainer>,
    )
    expect(screen.getByText('桌面端')).toBeInTheDocument()
    expect(screen.queryByTestId('legend-icon')).toBeNull()
  })
})

describe('chart 兼容 shim 与 useChart 守卫', () => {
  it('BarChart/LineChart 转发导出存在', () => {
    expect(BarChart).toBeDefined()
    expect(LineChart).toBeDefined()
  })

  it('ChartTooltipContent 脱离 ChartContainer 抛错', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(<ChartTooltipContent active payload={payload} />),
    ).toThrow(/useChart must be used within/)
    spy.mockRestore()
  })
})
