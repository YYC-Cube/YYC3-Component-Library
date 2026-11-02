import { StateCreator } from 'zustand';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AllSlices } from '../app-store';

// 无障碍设置状态接口 - 与Redux兼容的类型定义
export interface AccessibilityState {
  fontSize: number | string; // 兼容Redux和Zustand
  highContrast: boolean;
  reducedMotion: boolean;
}

// Zustand接口定义（向后兼容）
export interface AccessibilitySlice {
  accessibility: AccessibilityState;
  updateAccessibility: (newSettings: Partial<AccessibilityState>) => void;
}

// Redux slice定义
export const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState: {
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
  },
  reducers: {
    updateAccessibility: (state, action: PayloadAction<Partial<AccessibilityState>>) => {
      state = { ...state, ...action.payload };
    },
  },
});

// 导出Redux actions
export const { updateAccessibility } = accessibilitySlice.actions;

// Zustand slice creator（向后兼容）
export const createAccessibilitySlice: StateCreator<AllSlices, [], [], AccessibilitySlice> = (set, get) => ({
  accessibility: {
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
  },
  updateAccessibility: (newSettings) => {
    set((state) => ({
      accessibility: { ...state.accessibility, ...newSettings },
    }));
  },
});

/**
 * @file 无障碍设置状态管理
 * @description 支持Redux和Zustand的无障碍功能设置管理
 * @module store/slices/createAccessibilitySlice
 * @author YYC
 * @version 1.0.1
 * @created 2024-10-15
 * @updated 2024-10-15
 */