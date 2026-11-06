// src/store/app-store.test.ts
// 对齐现 store 基线：ModuleId 由 UI Slice 导出（仅 AUDIT/OTHER_MODULES），
// 不存在 bootstrap 时代的 @/src/core/module-system 枚举
import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';

import { useAppStore } from './app-store';
import { ModuleId } from './slices/createUISlice';

describe('AppStore Zustand Store', () => {
  it('should have correct initial state', () => {
    const { activeModule, accessibility } = useAppStore.getState();

    // 验证 UI Slice 的初始状态
    expect(activeModule).toBe(ModuleId.AUDIT);

    // 验证 Accessibility Slice 的初始状态
    expect(accessibility.fontSize).toBe(16);
    expect(accessibility.highContrast).toBe(false);
  });

  it('should correctly update the active module', () => {
    // 使用 act 来包装状态更新
    act(() => {
      useAppStore.getState().setActiveModule(ModuleId.OTHER_MODULES);
    });

    expect(useAppStore.getState().activeModule).toBe(ModuleId.OTHER_MODULES);
  });

  it('should correctly update accessibility settings', () => {
    act(() => {
      useAppStore.getState().updateAccessibility({ fontSize: 20, highContrast: true });
    });

    const { accessibility } = useAppStore.getState();
    expect(accessibility.fontSize).toBe(20);
    expect(accessibility.highContrast).toBe(true);
  });
});