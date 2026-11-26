// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/theme claw-tokens 补隙测试
// 覆盖 ui 包验收测试未触及的缺口：mq 媒体查询助手、
// injectThemeCSSVars 的 `typeof document === 'undefined'` 守卫分支、
// cssVarInjected 单次注入双分支（theme 包自测自足）
// ============================================================
import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  breakpoints,
  mq,
  getThemeTokens,
  injectThemeCSSVars,
  cx,
  mergeStyles,
  isCyberpunk,
} from '../claw-tokens'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('mq · 媒体查询助手', () => {
  it('按断点生成 min-width 媒体查询（xs 不可用，语义为基底）', () => {
    expect(mq('sm')).toBe('@media (min-width: 576px)')
    expect(mq('md')).toBe('@media (min-width: 768px)')
    expect(mq('lg')).toBe('@media (min-width: 992px)')
    expect(mq('xl')).toBe('@media (min-width: 1200px)')
    expect(mq('xxl')).toBe('@media (min-width: 1600px)')
    expect(breakpoints.xs).toBe('0px')
  })
})

describe('injectThemeCSSVars · SSR 守卫与单次注入', () => {
  it('document 不可用（SSR）时应安全早退，不抛错不注入', () => {
    vi.stubGlobal('document', undefined)
    expect(() => injectThemeCSSVars('cyberpunk')).not.toThrow()
    vi.unstubAllGlobals()
    expect(document.getElementById('yyc3-css-vars')).toBeNull()
  })

  it('连续注入两次：CSS 变量写入 html，style 基座仅创建一次', () => {
    injectThemeCSSVars('liquid-glass')
    injectThemeCSSVars('liquid-glass')

    const root = document.documentElement
    expect(root.getAttribute('data-yyc3-theme')).toBe('liquid-glass')
    expect(root.style.getPropertyValue('--yyc3-color-primary')).toBe(
      'rgba(59,130,246,1)',
    )
    expect(root.style.getPropertyValue('--yyc3-spacing-lg')).toBe('24px')
    expect(root.style.getPropertyValue('--yyc3-transition-fast')).toBe(
      '150ms ease-in-out',
    )

    const bases = document.querySelectorAll('style#yyc3-css-vars')
    expect(bases.length).toBe(1)
    expect(bases[0].textContent).toContain('box-sizing: border-box')
  })

  it('cyberpunk 注入切换 data-yyc3-theme 与对应令牌', () => {
    injectThemeCSSVars('cyberpunk')
    expect(document.documentElement.getAttribute('data-yyc3-theme')).toBe(
      'cyberpunk',
    )
    expect(
      document.documentElement.style.getPropertyValue('--yyc3-color-primary'),
    ).toBe('#00e5ff')
  })
})

describe('工具函数 · 边界输入', () => {
  it('cx 过滤 falsy 片段', () => {
    expect(cx('a', undefined, 'b', null, false, 'c')).toBe('a b c')
    expect(cx()).toBe('')
    expect(cx(false, undefined, null)).toBe('')
  })

  it('mergeStyles 过滤 falsy 并后写覆盖', () => {
    expect(mergeStyles({ color: 'red' }, null, false, { color: 'blue' })).toEqual({
      color: 'blue',
    })
    expect(mergeStyles(undefined, null, false)).toEqual({})
  })

  it('getThemeTokens 双主题与 isCyberpunk 判定', () => {
    expect(getThemeTokens('cyberpunk').glowColor).toBe('#00e5ff')
    expect(getThemeTokens('liquid-glass').glowColor).toBe('rgba(59,130,246,0.6)')
    expect(isCyberpunk('cyberpunk')).toBe(true)
    expect(isCyberpunk('liquid-glass')).toBe(false)
  })
})
