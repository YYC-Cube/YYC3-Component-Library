"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useDashboardStats, useSalesTrend, useCategoryDistribution } from '@/hooks/use-data'

export const CustomizableDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [widgets, setWidgets] = useState([
    { id: '1', type: 'sales', title: '销售概览', size: 'medium' },
    { id: '2', type: 'visitors', title: '访客统计', size: 'medium' },
    { id: '3', type: 'performance', title: '性能指标', size: 'large' },
    { id: '4', type: 'trend', title: '趋势分析', size: 'large' },
  ])
  
  const { data: dashboardStats, isLoading: isLoadingStats } = useDashboardStats()
  const { data: salesTrend } = useSalesTrend({ period: 'month' })
  const { data: categoryDistribution } = useCategoryDistribution({})

  const renderWidget = (widget: { id: string; type: string; title: string; size: string }) => {
    // 模拟Widget组件渲染
    const widgetData = {
      dashboardStats,
      salesTrend,
      categoryDistribution
    };
    
    return (
      <div 
        key={widget.id} 
        className={`bg-white rounded-lg shadow-md p-4 ${widget.size === 'large' ? 'col-span-2' : ''}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{widget.title}</h3>
          <button className="text-blue-600 hover:text-blue-800">刷新</button>
        </div>
        {isLoadingStats ? (
          <div className="h-40 flex items-center justify-center">加载中...</div>
        ) : (
          <div className="h-40 bg-gray-50 rounded">{widget.type} 数据可视化区域</div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {widgets.map(renderWidget)}
    </div>
  )
}

export default CustomizableDashboard
