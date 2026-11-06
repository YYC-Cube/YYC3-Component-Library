// ============================================================
// YYC³ · @yyc3/lib services 轻量桩层（桩 3/4）
// 可视化服务类型：图表数据系列/选项/类型定义
// ============================================================

export interface DataPoint {
  x: string | number | Date
  y: number
  label?: string
}

export interface DataSeries {
  id: string
  name: string
  color?: string
  data: DataPoint[]
}

export interface ChartOptions {
  type?: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'scatter'
  title?: string
  legend?: boolean
  grid?: boolean
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
  interactions?: string[]
  animation?: boolean
  responsive?: boolean
  annotations?: Array<{ type: 'line' | 'rect'; [key: string]: unknown }>

}

export type ChartType = NonNullable<ChartOptions['type']>

export interface ChartAnnotation {
  type: 'line' | 'rect'
  [key: string]: unknown
}
