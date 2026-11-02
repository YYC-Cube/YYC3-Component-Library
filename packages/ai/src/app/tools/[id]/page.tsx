/**
 * @file 工具详情页面
 * @description 展示单个AI工具的详细信息和使用界面
 * @page tools/[id]
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tool } from '@/types';
import { toolService } from '@/lib/toolService';
import Layout from '@/components/Layout';
import Button from '@/components/Button';

export default function ToolDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取工具详情
  useEffect(() => {
    const fetchToolDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const toolData = await toolService.getToolById(params.id);
        
        if (!toolData) {
          setError('工具不存在');
          return;
        }
        
        setTool(toolData);
      } catch (err) {
        setError('获取工具详情失败，请稍后重试');
        console.error('获取工具详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchToolDetail();
  }, [params.id]);

  // 返回工具列表
  const handleBack = () => {
    router.back();
  };

  // 使用工具
  const handleUseTool = () => {
    if (tool && tool.isImplemented) {
      // 这里可以实现工具使用的逻辑
      console.log('使用工具:', tool.name);
      // 后续可以跳转到工具使用界面或打开工具模态框
    }
  };

  // 复杂度标签配置
  const complexityConfig = {
    simple: { label: '简单', color: 'bg-green-100 text-green-800', description: '易于使用，上手快速' },
    medium: { label: '中等', color: 'bg-yellow-100 text-yellow-800', description: '具有一定功能，需要基本学习' },
    complex: { label: '复杂', color: 'bg-red-100 text-red-800', description: '功能强大，建议先阅读文档' },
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="space-y-4 flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
              </div>
            </div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tool) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <Button onClick={() => router.push('/tools')} className="mt-4">
            查看所有工具
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={tool.name}>
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleBack} 
          className="mb-6"
        >
          ← 返回工具列表
        </Button>

        {/* 工具头部信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* 工具图标和基本信息 */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center text-primary text-3xl">
                {tool.icon || 'AI'}
              </div>
            </div>
            
            {/* 工具详细信息 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tool.name}
                </h1>
                {tool.isAIEnhanced && (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                    AI增强
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-600 dark:text-gray-400">
                  分类: {tool.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${complexityConfig[tool.complexity].color}`}>
                  复杂度: {complexityConfig[tool.complexity].label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${tool.isImplemented ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {tool.isImplemented ? '已实现' : '开发中'}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {tool.description}
              </p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleUseTool}
                  disabled={!tool.isImplemented}
                >
                  {tool.isImplemented ? '立即使用' : '即将上线'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 工具详情内容 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧: 工具说明 */}
          <div className="md:col-span-2 space-y-6">
            {/* 工具介绍 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                工具介绍
              </h2>
              <div className="prose dark:prose-invert">
                <p>
                  这是{tool.name}的详细介绍。该工具属于{tool.category}类别，
                  具有{complexityConfig[tool.complexity].description}等特点。
                </p>
                <p>
                  通过{tool.name}，您可以高效地完成相关任务，提升工作效率。
                  {tool.isAIEnhanced && '借助AI技术，该工具能够提供更智能、更精准的服务。'}
                </p>
              </div>
            </div>

            {/* 使用指南 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                使用指南
              </h2>
              <div className="prose dark:prose-invert">
                <ol>
                  <li>点击"立即使用"按钮开始使用</li>
                  <li>按照界面提示输入必要的参数</li>
                  <li>等待AI处理完成并查看结果</li>
                  <li>可以根据需要调整参数并重新生成结果</li>
                </ol>
                {tool.complexity === 'complex' && (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    提示：由于该工具功能较为复杂，建议先阅读完整文档后再使用。
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 右侧: 相关信息 */}
          <div className="space-y-6">
            {/* 工具信息卡 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                工具信息
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between">
                  <span>分类</span>
                  <span className="font-medium">{tool.category}</span>
                </li>
                <li className="flex justify-between">
                  <span>复杂度</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${complexityConfig[tool.complexity].color}`}>
                    {complexityConfig[tool.complexity].label}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>优先级</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${tool.priority === 'high' ? 'bg-red-100 text-red-800' : tool.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {tool.priority === 'high' ? '高' : tool.priority === 'medium' ? '中' : '低'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>AI增强</span>
                  <span className={tool.isAIEnhanced ? 'text-green-600' : 'text-gray-500'}>
                    {tool.isAIEnhanced ? '是' : '否'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>状态</span>
                  <span className={tool.isImplemented ? 'text-green-600' : 'text-yellow-600'}>
                    {tool.isImplemented ? '已实现' : '开发中'}
                  </span>
                </li>
              </ul>
            </div>

            {/* 相关工具 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                相关工具
              </h3>
              <div className="space-y-3">
                {/* 这里可以添加相关工具的推荐 */}
                <div className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
                  相关工具推荐正在生成中...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}