/**
 * @file 工具服务模块
 * @description 提供工具相关的业务逻辑和数据管理
 * @module lib/toolService
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import { Tool, ToolCategory } from '@/types';

// 模拟工具数据
const mockTools: Tool[] = [
  {
    id: '1',
    name: '智能代码审查',
    category: '开发工具',
    description: '使用AI对代码进行自动化审查，提供代码质量改进建议和最佳实践推荐。',
    icon: '🔍',
    priority: 'high',
    complexity: 'complex',
    isImplemented: true,
    isAIEnhanced: true,
  },
  {
    id: '2',
    name: '文档自动生成',
    category: '文档工具',
    description: '根据代码自动生成技术文档，支持多种文档格式和语言。',
    icon: '📄',
    priority: 'medium',
    complexity: 'medium',
    isImplemented: true,
    isAIEnhanced: true,
  },
  {
    id: '3',
    name: '多语言翻译助手',
    category: '翻译工具',
    description: '提供高质量的多语言互译功能，支持专业术语和上下文理解。',
    icon: '🌐',
    priority: 'high',
    complexity: 'medium',
    isImplemented: true,
    isAIEnhanced: true,
  },
  {
    id: '4',
    name: '数据分析工具',
    category: '数据工具',
    description: '对复杂数据集进行智能分析，生成可视化报告和洞察。',
    icon: '📊',
    priority: 'medium',
    complexity: 'complex',
    isImplemented: false,
    isAIEnhanced: true,
  },
  {
    id: '5',
    name: '营销文案生成',
    category: '营销工具',
    description: '根据产品特点和目标受众，自动生成吸引人的营销文案。',
    icon: '📝',
    priority: 'medium',
    complexity: 'simple',
    isImplemented: true,
    isAIEnhanced: true,
  },
  {
    id: '6',
    name: 'AI聊天助手',
    category: '智能助手',
    description: '提供通用的AI聊天功能，可以回答问题、提供建议和执行简单任务。',
    icon: '💬',
    priority: 'high',
    complexity: 'medium',
    isImplemented: true,
    isAIEnhanced: true,
  },
];

/**
 * 工具服务类
 */
export class ToolService {
  /**
   * 获取所有工具列表
   * @returns 工具列表
   */
  async getAllTools(): Promise<Tool[]> {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTools;
  }

  /**
   * 根据ID获取工具详情
   * @param id 工具ID
   * @returns 工具详情或null
   */
  async getToolById(id: string): Promise<Tool | null> {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTools.find(tool => tool.id === id) || null;
  }

  /**
   * 获取工具分类列表
   * @returns 工具分类列表
   */
  async getToolCategories(): Promise<ToolCategory[]> {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 按分类分组并创建分类对象
    const categoryMap = new Map<string, Tool[]>();
    
    mockTools.forEach(tool => {
      const category = tool.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)?.push(tool);
    });
    
    // 转换为数组格式
    return Array.from(categoryMap.entries()).map(([name, tools], index) => ({
      id: `category-${index + 1}`,
      name,
      description: `${name}工具集合`,
      count: tools.length,
      tools,
    }));
  }

  /**
   * 根据分类获取工具
   * @param category 分类名称
   * @returns 该分类下的工具列表
   */
  async getToolsByCategory(category: string): Promise<Tool[]> {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTools.filter(tool => tool.category === category);
  }

  /**
   * 搜索工具
   * @param keyword 搜索关键词
   * @returns 匹配的工具列表
   */
  async searchTools(keyword: string): Promise<Tool[]> {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lowerKeyword = keyword.toLowerCase();
    return mockTools.filter(tool => 
      tool.name.toLowerCase().includes(lowerKeyword) ||
      tool.description.toLowerCase().includes(lowerKeyword) ||
      tool.category.toLowerCase().includes(lowerKeyword)
    );
  }
}

// 导出单例实例
export const toolService = new ToolService();
export default toolService;