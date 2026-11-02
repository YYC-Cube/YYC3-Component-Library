'use client'

/**
 * @file 工具列表页面
 * @description 展示所有可用的AI工具
 * @page tools
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import { useState, useEffect } from 'react';
import { Tool, ToolCategory } from '@/types';
import { toolService } from '@/lib/toolService';
import ToolCard from '@/components/features/ToolCard';
import Layout from '@/components/Layout';
import Button from '@/components/Button';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取工具数据
  const fetchTools = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (category === 'all') {
        const allTools = await toolService.getAllTools();
        setTools(allTools);
      } else {
        const categoryTools = await toolService.getToolsByCategory(category);
        setTools(categoryTools);
      }
    } catch (err) {
      setError('获取工具数据失败，请稍后重试');
      console.error('获取工具失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      const allCategories = await toolService.getToolCategories();
      setCategories(allCategories);
    } catch (err) {
      console.error('获取分类失败:', err);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchCategories();
    fetchTools(selectedCategory);
  }, [selectedCategory]);

  // 处理工具点击
  const handleToolClick = (tool: Tool) => {
    // 这里可以实现工具点击后的逻辑，比如跳转到工具详情页
    console.log('工具点击:', tool.name);
    // 后续可以添加路由跳转
  };

  return (
    <Layout title="AI工具中心">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            AI智能工具中心
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            探索我们的AI工具集，提升工作效率和创造力。从开发辅助到内容创作，应有尽有。
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2 min-w-max">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="min-w-[100px]"
            >
              全部工具
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="min-w-[100px]"
              >
                {category.name}
                <span className="ml-2 text-xs bg-white/20 rounded-full px-2">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* 工具列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              加载失败
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {error}
            </p>
            <Button onClick={() => fetchTools(selectedCategory)}>
              重试
            </Button>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              暂无工具
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              当前分类下暂无可用的工具
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}