/**
 * @file Redux Store 配置
 * @description 统一管理应用状态，集成各功能模块的状态管理
 * @module store
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// 导入各功能模块的reducer
import visualEditorReducer from '../visual-editor/store/visualEditorSlice'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'
import projectsReducer from './slices/projectsReducer'

// 配置持久化
const persistConfig = {
  key: 'root',
  storage,
  // 指定需要持久化的reducer
  whitelist: ['ui', 'auth'],
}

// 应用持久化到需要的reducer
const persistedReducer = {
  visualEditor: visualEditorReducer,
  ui: persistReducer(persistConfig, uiReducer),
  auth: persistReducer(persistConfig, authReducer),
  projects: projectsReducer,
}

// 创建统一的Redux存储
const store = configureStore({
  reducer: persistedReducer,
  // 配置中间件
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略的action类型
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// 创建persistor
export const persistor = persistStore(store)

// 导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 导出自定义hooks以使用正确的类型
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 默认导出store
export default store
