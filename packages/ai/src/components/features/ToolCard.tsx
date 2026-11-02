/**
 * @file 工具卡片组件
 * @description 展示单个AI工具的卡片组件
 * @component
 * @module components/features/ToolCard
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import React from 'react';
import { Tool } from '@/types';
import Button from '../Button';

interface ToolCardProps {
  /** 工具数据 */
  tool: Tool;
  /** 点击卡片事件 */
  onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  // 复杂度标签颜色映射
  const complexityColors = {
    simple: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    complex: 'bg-red-100 text-red-800',
  };

  // 优先级标签颜色映射
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      {/* 工具头部 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center text-primary">
            <span className="text-lg font-bold">{tool.icon || 'AI'}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
        </div>
        {tool.isAIEnhanced && (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            AI增强
          </span>
        )}
      </div>

      {/* 工具内容 */}
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* 标签区域 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${complexityColors[tool.complexity]}`}>
            复杂度: {tool.complexity === 'simple' ? '简单' : tool.complexity === 'medium' ? '中等' : '复杂'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[tool.priority]}`}>
            优先级: {tool.priority === 'high' ? '高' : tool.priority === 'medium' ? '中' : '低'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${tool.isImplemented ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {tool.isImplemented ? '已实现' : '开发中'}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end">
          <Button 
            size="sm" 
            variant="primary" 
            disabled={!tool.isImplemented}
          >
            {tool.isImplemented ? '立即使用' : '即将上线'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;