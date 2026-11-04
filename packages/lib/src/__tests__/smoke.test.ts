// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/lib 首批抽取验收测试
// 覆盖手册 P0 场景的适用子集（纯函数：CS-001/002 + 行为断言）
// ============================================================
import { describe, it, expect } from 'vitest'
import {
  formatDate,
  getRelativeTime,
  isToday,
  truncate,
  capitalize,
  camelToKebab,
  kebabToCamel,
  slugify,
  interpolate,
  escapeHtml,
  unescapeHtml,
  isBlank,
  isString,
  isNumber,
  isObject,
  isEmail,
  isURL,
  deepMerge,
  cleanObject,
  deepClone,
  unique,
  groupBy,
  chunk,
} from '../index'

describe('@yyc3/lib · date', () => {
  it('formatDate 默认 YYYY-MM-DD', () => {
    expect(formatDate(new Date(2026, 10, 4))).toBe('2026-11-04')
  })
  it('getRelativeTime 刚刚（当前时刻）', () => {
    expect(getRelativeTime(Date.now())).toBe('刚刚')
  })
  it('isToday 当天为真', () => {
    expect(isToday(new Date())).toBe(true)
  })
})

describe('@yyc3/lib · string', () => {
  it('truncate 超长截断加后缀', () => {
    expect(truncate('abcdefghij', 8)).toBe('abcde...')
  })
  it('capitalize 首字母大写', () => {
    expect(capitalize('yyc3')).toBe('Yyc3')
  })
  it('camelToKebab / kebabToCamel 互转', () => {
    expect(camelToKebab('getYyc3Family')).toBe('get-yyc3-family')
    expect(kebabToCamel('get-yyc3-family')).toBe('getYyc3Family')
  })
  it('slugify 生成 URL 友好串', () => {
    expect(slugify('Hello YYC³ World!')).toBe('hello-yyc-world')
  })
  it('interpolate 模板替换且保留未命中占位', () => {
    expect(interpolate('Hi {name}, {missing}', { name: 'YYC³' })).toBe('Hi YYC³, {missing}')
  })
  it('escapeHtml / unescapeHtml 往返', () => {
    expect(unescapeHtml(escapeHtml('<a href="x">&</a>'))).toBe('<a href="x">&</a>')
  })
  it('isBlank 空白判定', () => {
    expect(isBlank('   ')).toBe(true)
    expect(isBlank(null)).toBe(true)
    expect(isBlank('x')).toBe(false)
  })
})

describe('@yyc3/lib · validation', () => {
  it('类型保护基础断言', () => {
    expect(isString('a')).toBe(true)
    expect(isNumber(NaN)).toBe(false)
    expect(isObject([])).toBe(false)
  })
  it('isEmail / isURL', () => {
    expect(isEmail('admin@0379.email')).toBe(true)
    expect(isEmail('bad@@x')).toBe(false)
    expect(isURL('https://github.com')).toBe(true)
    expect(isURL('not url')).toBe(false)
  })
  it('deepMerge 深合并且忽略 undefined', () => {
    const r = deepMerge({ a: 1, b: { c: 2 } } as Record<string, unknown>, { b: { c: 3 }, a: undefined })
    expect(r).toEqual({ a: 1, b: { c: 3 } })
  })
  it('cleanObject 移除 undefined', () => {
    expect(cleanObject({ a: 1, b: undefined })).toEqual({ a: 1 })
  })
})

describe('@yyc3/lib · data', () => {
  it('deepClone 深拷贝日期与数组', () => {
    const src = { d: new Date(0), list: [1, { x: 2 }] }
    const c = deepClone(src)
    expect(c).not.toBe(src)
    expect(c.d.getTime()).toBe(0)
    expect(c.list[1]).not.toBe(src.list[1])
  })
  it('unique 按 key 去重', () => {
    expect(unique([{ id: 'a' }, { id: 'a' }, { id: 'b' }], 'id')).toHaveLength(2)
  })
  it('groupBy 分组', () => {
    const g = groupBy([{ t: 'x' }, { t: 'y' }, { t: 'x' }], 't')
    expect(g.x).toHaveLength(2)
  })
  it('chunk 分块', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })
})
