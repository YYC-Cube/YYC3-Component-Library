// ============================================================
// YYC³ · @yyc3/ui 测试共享桩（批次 1 · 2026-11-27）
// jsdom 缺口补齐：Pointer Capture（Radix viewport/vaul）、matchMedia
// ============================================================
import { vi } from 'vitest'

/** Radix Toast viewport / vaul 指针事件依赖 Pointer Capture；cmdk 依赖 scrollIntoView */
export function stubPointerCapture() {
  Element.prototype.hasPointerCapture =
    Element.prototype.hasPointerCapture ?? (() => false)
  Element.prototype.setPointerCapture =
    Element.prototype.setPointerCapture ?? (() => {})
  Element.prototype.releasePointerCapture =
    Element.prototype.releasePointerCapture ?? (() => {})
  Element.prototype.scrollIntoView =
    Element.prototype.scrollIntoView ?? (() => {})
}

/** useIsMobile / next-themes / vaul 等依赖 matchMedia */
export function stubMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

/** Radix floating-ui（PopperContent）/ recharts ResponsiveContainer 依赖 */
export function stubResizeObserver() {
  class RO {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  Object.defineProperty(window, 'ResizeObserver', { writable: true, value: RO })
  Object.defineProperty(global, 'ResizeObserver', { writable: true, value: RO })
}

/** embla carousel / 懒加载组件依赖 */
export function stubIntersectionObserver() {
  class IO {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])
  }
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IO })
  Object.defineProperty(global, 'IntersectionObserver', { writable: true, value: IO })
}

/** jsdom 未实现 hit-testing——Radix Toggle/Radio 指针路径使用 */
export function stubElementFromPoint() {
  if (!document.elementFromPoint) {
    Object.defineProperty(document, 'elementFromPoint', {
      writable: true,
      value: () => null,
    })
  }
  if (!document.caretRangeFromPoint) {
    Object.defineProperty(document, 'caretRangeFromPoint', {
      writable: true,
      value: () => null,
    })
  }
}

/** 静音 React 18/19 act 警告与 Radix 可达性噪音（只读断言不受影响） */
export function silenceConsole() {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
}
