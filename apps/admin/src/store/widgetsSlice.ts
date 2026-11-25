import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

export type WidgetType = "chart" | "stats" | "table" | "text" | "list" | "map" | "calendar" | "weather"

export interface ChartConfig {
  chartType: "line" | "bar" | "pie" | "area" | "scatter"
  dataSource: string
  showLegend: boolean
  title: string
  xAxisKey: string
  yAxisKeys: string[]
  colors: string[]
}

export interface StatsConfig {
  title: string
  dataSource: string
  format: string
  icon?: string
  showTrend: boolean
}

export interface TableConfig {
  title: string
  dataSource: string
  columns: {
    key: string
    title: string
    width?: number
  }[]
  pageSize: number
}

export interface TextConfig {
  title: string
  content: string
  textAlign: "left" | "center" | "right"
}

export interface ListConfig {
  title: string
  dataSource: string
  itemTemplate: string
  maxItems: number
}

export interface MapConfig {
  title: string
  latitude: number
  longitude: number
  zoom: number
}

export interface CalendarConfig {
  title: string
  dataSource: string
}

export interface WeatherConfig {
  title: string
  location: string
  units: "metric" | "imperial"
}

export type WidgetConfig =
  | ChartConfig
  | StatsConfig
  | TableConfig
  | TextConfig
  | ListConfig
  | MapConfig
  | CalendarConfig
  | WeatherConfig

export interface Widget {
  id: string
  type: WidgetType
  title: string
  config: WidgetConfig
}

export interface WidgetsState {
  widgets: Record<string, Widget>
  availableWidgetTemplates: Widget[]
}

const initialState: WidgetsState = {
  widgets: {},
  availableWidgetTemplates: [
    {
      id: "template-chart-line",
      type: "chart",
      title: "Line Chart",
      config: {
        chartType: "line",
        dataSource: "salesData",
        showLegend: true,
        title: "Sales Trend",
        xAxisKey: "date",
        yAxisKeys: ["value"],
        colors: ["#3b82f6", "#10b981", "#f59e0b"],
      } as ChartConfig,
    },
    {
      id: "template-chart-bar",
      type: "chart",
      title: "Bar Chart",
      config: {
        chartType: "bar",
        dataSource: "categoryData",
        showLegend: true,
        title: "Sales by Category",
        xAxisKey: "category",
        yAxisKeys: ["value"],
        colors: ["#3b82f6"],
      } as ChartConfig,
    },
    {
      id: "template-chart-pie",
      type: "chart",
      title: "Pie Chart",
      config: {
        chartType: "pie",
        dataSource: "categoryData",
        showLegend: true,
        title: "Sales Distribution",
        xAxisKey: "category",
        yAxisKeys: ["value"],
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"],
      } as ChartConfig,
    },
    {
      id: "template-stats",
      type: "stats",
      title: "Stats Card",
      config: {
        title: "Total Sales",
        dataSource: "totalSales",
        format: "currency",
        showTrend: true,
      } as StatsConfig,
    },
    {
      id: "template-table",
      type: "table",
      title: "Data Table",
      config: {
        title: "Recent Orders",
        dataSource: "ordersData",
        columns: [
          { key: "id", title: "ID" },
          { key: "customer", title: "Customer" },
          { key: "amount", title: "Amount" },
          { key: "status", title: "Status" },
        ],
        pageSize: 5,
      } as TableConfig,
    },
    {
      id: "template-text",
      type: "text",
      title: "Text Widget",
      config: {
        title: "Notes",
        content: "Add your notes here...",
        textAlign: "left",
      } as TextConfig,
    },
    {
      id: "template-list",
      type: "list",
      title: "List Widget",
      config: {
        title: "Top Products",
        dataSource: "productsData",
        itemTemplate: "{{name}} - {{sales}}",
        maxItems: 5,
      } as ListConfig,
    },
    {
      id: "template-map",
      type: "map",
      title: "Map Widget",
      config: {
        title: "Store Location",
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 12,
      } as MapConfig,
    },
    {
      id: "template-calendar",
      type: "calendar",
      title: "Calendar Widget",
      config: {
        title: "Events Calendar",
        dataSource: "eventsData",
      } as CalendarConfig,
    },
    {
      id: "template-weather",
      type: "weather",
      title: "Weather Widget",
      config: {
        title: "Weather Forecast",
        location: "New York",
        units: "metric",
      } as WeatherConfig,
    },
  ],
}

export const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidgetFromTemplate: (state, action: PayloadAction<string>) => {
      const templateId = action.payload
      const template = state.availableWidgetTemplates.find((t) => t.id === templateId)

      if (template) {
        const widgetId = `widget-${uuidv4()}`
        state.widgets[widgetId] = {
          ...template,
          id: widgetId,
        }
      }
    },
    updateWidgetConfig: (state, action: PayloadAction<{ widgetId: string; config: Partial<WidgetConfig> }>) => {
      const { widgetId, config } = action.payload
      if (state.widgets[widgetId]) {
        state.widgets[widgetId].config = {
          ...state.widgets[widgetId].config,
          ...config,
        }
      }
    },
    updateWidgetTitle: (state, action: PayloadAction<{ widgetId: string; title: string }>) => {
      const { widgetId, title } = action.payload
      if (state.widgets[widgetId]) {
        state.widgets[widgetId].title = title
      }
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      const widgetId = action.payload
      if (state.widgets[widgetId]) {
        delete state.widgets[widgetId]
      }
    },
  },
})

export const { addWidgetFromTemplate, updateWidgetConfig, updateWidgetTitle, removeWidget } = widgetsSlice.actions

export default widgetsSlice.reducer
