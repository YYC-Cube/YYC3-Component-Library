import { configureStore } from "@reduxjs/toolkit"
import dashboardReducer from "./dashboardSlice"
import widgetsReducer from "./widgetsSlice"
// 暂时移除缺失的dataSlice导入

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    widgets: widgetsReducer,
    // 移除不存在的data reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
