// ============================================================
// YYC³ · @yyc3/lib utils/color 覆盖率补测（batch1 弱区：0%）
// 覆盖对象：hexToRgb / hexToRgba / isDarkColor / getContrastColor
// 约定：import 一律走 '../index' 桶（顺带验证桶导出连通性）；纯字符串/数值函数直接调真身不打桩
// ============================================================
import { describe, it, expect } from 'vitest';
import { hexToRgb, hexToRgba, isDarkColor, getContrastColor } from '../index';

describe('utils/color · hexToRgb', () => {
  it('6 位十六进制（带 #）转 RGB 串', () => {
    expect(hexToRgb('#00d4ff')).toBe('0,212,255');
    expect(hexToRgb('#ff0000')).toBe('255,0,0');
  });

  it('不带 # 前缀同样解析', () => {
    expect(hexToRgb('00d4ff')).toBe('0,212,255');
  });

  it('大写字母（regex i 标志）正常解析', () => {
    expect(hexToRgb('#FF0000')).toBe('255,0,0');
    expect(hexToRgb('#ABCDEF')).toBe('171,205,239');
  });

  it('非法输入回退默认青色 "0,212,255"', () => {
    // 非 hex 字符
    expect(hexToRgb('#00d4fg')).toBe('0,212,255');
    // 3 位缩写形式不被 6 位 regex 接受
    expect(hexToRgb('#fff')).toBe('0,212,255');
    // 空串 / 7 位
    expect(hexToRgb('')).toBe('0,212,255');
    expect(hexToRgb('#00d4ff0')).toBe('0,212,255');
  });
});

describe('utils/color · hexToRgba', () => {
  it('拼接 alpha 生成 rgba() 串', () => {
    expect(hexToRgba('#00d4ff', 0.5)).toBe('rgba(0,212,255,0.5)');
    expect(hexToRgba('#ff0000', 1)).toBe('rgba(255,0,0,1)');
    expect(hexToRgba('#ff0000', 0)).toBe('rgba(255,0,0,0)');
  });

  it('非法 hex 经 hexToRgb 回退后同样生成默认色 rgba', () => {
    expect(hexToRgba('nope', 0.25)).toBe('rgba(0,212,255,0.25)');
  });
});

describe('utils/color · isDarkColor', () => {
  it('纯黑/深色为 true', () => {
    expect(isDarkColor('#000000')).toBe(true);
    expect(isDarkColor('#333333')).toBe(true);
  });

  it('纯白/浅色为 false', () => {
    expect(isDarkColor('#ffffff')).toBe(false);
    expect(isDarkColor('#eeeeee')).toBe(false);
  });

  it('亮度阈值边界：brightness=127 深色 / =128 浅色（<128 判据）', () => {
    // (127*299 + 127*587 + 127*114) / 1000 = 127 → true
    expect(isDarkColor('#7f7f7f')).toBe(true);
    // (128*299 + 128*587 + 128*114) / 1000 = 128 → false
    expect(isDarkColor('#808080')).toBe(false);
  });

  it('非法输入返回 false', () => {
    expect(isDarkColor('')).toBe(false);
    expect(isDarkColor('#12345')).toBe(false);
    expect(isDarkColor('xyzxyz')).toBe(false);
  });
});

describe('utils/color · getContrastColor', () => {
  it('深色背景返回白字', () => {
    expect(getContrastColor('#000000')).toBe('#ffffff');
    expect(getContrastColor('#1a1a2e')).toBe('#ffffff');
  });

  it('浅色背景返回黑字', () => {
    expect(getContrastColor('#ffffff')).toBe('#000000');
    expect(getContrastColor('#00d4ff')).toBe('#000000');
  });

  it('非法输入按浅色处理返回黑字', () => {
    expect(getContrastColor('')).toBe('#000000');
  });
});
