import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"
import GridLayout from "react-grid-layout"

// Define layout types
interface Layout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
  isDraggable?: boolean
  isResizable?: boolean
}

type Layouts = {
  [key: string]: Layout[]
}

export interface DashboardState {
  layouts: Layouts
  currentBreakpoint: string
  editMode: boolean
  dashboardName: string
  savedDashboards: {
    id: string
    name: string
    layouts: Layouts
    widgets: string[]
  }[]
  activeWidgets: string[]
}

const initialState: DashboardState = {
  layouts: {
    lg: [],
    md: [],
    sm: [],
    xs: [],
  },
  currentBreakpoint: "lg",
  editMode: false,
  dashboardName: "My Dashboard",
  savedDashboards: [],
  activeWidgets: [],
}

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLayouts: (state, action: PayloadAction<Layouts>) => {
      state.layouts = action.payload
    },
    updateLayout: (state, action: PayloadAction<{ breakpoint: string; layout: Layout[] }>) => {
      const { breakpoint, layout } = action.payload
      state.layouts[breakpoint] = layout
    },
    setCurrentBreakpoint: (state, action: PayloadAction<string>) => {
      state.currentBreakpoint = action.payload
    },
    toggleEditMode: (state) => {
      state.editMode = !state.editMode
    },
    setDashboardName: (state, action: PayloadAction<string>) => {
      state.dashboardName = action.payload
    },
    addWidget: (state, action: PayloadAction<{ widgetId: string; layout: Layout }>) => {
      const { widgetId, layout } = action.payload
      state.activeWidgets.push(widgetId)

      // Add layout to all breakpoints
      Object.keys(state.layouts).forEach((breakpoint) => {
        const breakpointLayout = { ...layout }

        // Adjust size for different breakpoints
        if (breakpoint === "md") {
          breakpointLayout.w = Math.min(layout.w, 6)
        } else if (breakpoint === "sm") {
          breakpointLayout.w = Math.min(layout.w, 4)
          breakpointLayout.x = 0
        } else if (breakpoint === "xs") {
          breakpointLayout.w = 2
          breakpointLayout.x = 0
        }

        state.layouts[breakpoint].push(breakpointLayout)
      })
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      const widgetId = action.payload
      state.activeWidgets = state.activeWidgets.filter((id) => id !== widgetId)

      // Remove from all layouts
      Object.keys(state.layouts).forEach((breakpoint) => {
        state.layouts[breakpoint] = state.layouts[breakpoint].filter((item: Layout) => item.i !== widgetId)
      })
    },
    saveDashboard: (state) => {
      const dashboardId = uuidv4()
      state.savedDashboards.push({
        id: dashboardId,
        name: state.dashboardName,
        layouts: state.layouts,
        widgets: [...state.activeWidgets],
      })
    },
    loadDashboard: (state, action: PayloadAction<string>) => {
      const dashboardId = action.payload
      const dashboard = state.savedDashboards.find((d) => d.id === dashboardId)

      if (dashboard) {
        state.dashboardName = dashboard.name
        state.layouts = dashboard.layouts
        state.activeWidgets = [...dashboard.widgets]
      }
    },
    resetDashboard: (state) => {
      state.layouts = initialState.layouts
      state.activeWidgets = []
      state.dashboardName = "New Dashboard"
    },
  },
})

export const {
  setLayouts,
  updateLayout,
  setCurrentBreakpoint,
  toggleEditMode,
  setDashboardName,
  addWidget,
  removeWidget,
  saveDashboard,
  loadDashboard,
  resetDashboard,
} = dashboardSlice.actions

export default dashboardSlice.reducer
