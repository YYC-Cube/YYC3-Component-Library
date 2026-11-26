// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/theme ThemeProvider 补测
// 薄壳透传（next-themes）· 子渲染 / 默认主题上 html / setTheme 切换 /
// localStorage 持久化（写 + 读覆盖 defaultTheme）
// ============================================================
import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTheme } from 'next-themes'
import { ThemeProvider } from '../theme-provider'

const STORAGE_KEY = 'yyc3-test-theme'

// jsdom 未实现 matchMedia，next-themes 系统主题 hook 初始化即调用——给最小桩
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

/** 透传探针：暴露当前 theme + 切换按钮 */
function ThemeProbe() {
  const { theme, setTheme } = useTheme()
  return (
    <button type="button" onClick={() => setTheme('light')}>
      theme:{theme}
    </button>
  )
}

function htmlClasses(): string {
  return Array.from(document.documentElement.classList)
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
})

afterEach(cleanup)

describe('ThemeProvider · 薄壳透传 next-themes', () => {
  it('无 props 裸渲染：children 应透传渲染', () => {
    render(
      <ThemeProvider>
        <p>yyc3-provider-child</p>
      </ThemeProvider>,
    )
    expect(screen.getByText('yyc3-provider-child')).toBeInTheDocument()
  })

  it('defaultTheme=dark + attribute=class：html 根元素挂 dark', async () => {
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey={STORAGE_KEY}
        disableTransitionOnChange
      >
        <span>dark-shell</span>
      </ThemeProvider>,
    )
    await waitFor(() => {
      expect(htmlClasses()).toContain('dark')
    })
    expect(screen.getByText('dark-shell')).toBeInTheDocument()
  })

  it('setTheme 切换：html class 联动 + localStorage 写入持久化', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey={STORAGE_KEY}
      >
        <ThemeProbe />
      </ThemeProvider>,
    )
    const btn = screen.getByRole('button')
    await waitFor(() => {
      expect(btn).toHaveTextContent('theme:dark')
    })

    await user.click(btn)

    await waitFor(() => {
      expect(btn).toHaveTextContent('theme:light')
    })
    await waitFor(() => {
      expect(htmlClasses()).toContain('light')
    })
    expect(htmlClasses()).not.toContain('dark')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light')
  })

  it('持久化读：已存储主题优先于 defaultTheme（刷新恢复语义）', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'light')
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey={STORAGE_KEY}
      >
        <ThemeProbe />
      </ThemeProvider>,
    )
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('theme:light')
    })
    await waitFor(() => {
      expect(htmlClasses()).toContain('light')
    })
    expect(htmlClasses()).not.toContain('dark')
  })
})
