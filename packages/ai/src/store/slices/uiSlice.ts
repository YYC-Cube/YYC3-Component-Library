import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccessibilityState } from './createAccessibilitySlice'

// UI状态接口定义
interface UIState {
  // 主题设置
  theme: 'light' | 'dark' | 'auto'
  // 当前语言
  language: string
  // 无障碍设置
  accessibility: AccessibilityState
  // 加载状态
  isLoading: boolean
  // 页面标题
  pageTitle: string
  // 侧边栏状态
  sidebarOpen: boolean
}

// 初始状态
const initialState: UIState = {
  theme: 'auto',
  language: 'zh-CN',
  accessibility: {
    highContrast: false,
    fontSize: 'normal',
    reducedMotion: false,
  },
  isLoading: false,
  pageTitle: 'YanYu LLM',
  sidebarOpen: true,
}

// 创建UI状态管理slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 设置主题
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
    },
    
    // 切换主题
    toggleTheme: (state) => {
      if (state.theme === 'light') {
        state.theme = 'dark'
      } else if (state.theme === 'dark') {
        state.theme = 'light'
      } else {
        // 如果是auto，则切换到light
        state.theme = 'light'
      }
    },
    
    // 设置语言
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    
    // 更新无障碍设置
    updateAccessibility: (state, action: PayloadAction<Partial<AccessibilityState>>) => {
      state.accessibility = { ...state.accessibility, ...action.payload }
    },
    
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    // 设置页面标题
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload
    },
    
    // 切换侧边栏
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    // 设置侧边栏状态
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
  },
})

// 导出actions
export const { 
  setTheme, 
  toggleTheme, 
  setLanguage, 
  updateAccessibility, 
  setLoading, 
  setPageTitle,
  toggleSidebar,
  setSidebarOpen
} = uiSlice.actions

// 导出reducer
export default uiSlice.reducer

/**
 * @file UI状态管理
 * @description 处理主题、语言、无障碍设置等UI相关状态
 * @module store/slices/uiSlice
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */
