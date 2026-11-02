/**
 * @file 工具管理路由 (v1)
 * @description 提供工具列表和详情查询功能 (v1版本)
 * @module api/v1/tools
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-16
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { withApiVersion } from '@/lib/apiVersionMiddleware';
import { getSecurityHeaders } from '@/lib/apiAuthMiddleware';

/**
 * 版本控制中间件配置
 */
const withVersion = withApiVersion({
  supportedVersions: ['v1'],
  defaultVersion: 'v1',
});

/**
 * 工具数据接口
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
  isPremium: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 排序字段类型
 */
type SortField = 'usageCount' | 'createdAt' | 'name';

/**
 * 排序顺序类型
 */
type SortOrder = 'asc' | 'desc';

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
    currentPage: number;
  };
}

/**
 * 获取工具列表数据
 * @param category 可选的分类过滤
 * @returns Promise<Tool[]> 工具列表
 */
async function getTools(category?: string): Promise<Tool[]> {
  try {
    // 模拟工具数据 - 在实际应用中应从数据库获取
    const mockTools: Tool[] = [
      {
        id: 'chat-completion',
        name: '聊天完成',
        description: '提供AI聊天交互功能',
        category: 'ai',
        icon: '💬',
        features: ['文本生成', '多轮对话', '上下文理解'],
        isPremium: false,
        usageCount: 15234,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-03-20T00:00:00Z',
      },
      {
        id: 'image-generation',
        name: '图像生成',
        description: '根据文本描述生成图像',
        category: 'ai',
        icon: '🖼️',
        features: ['文本到图像', '风格转换', '分辨率调整'],
        isPremium: true,
        usageCount: 8976,
        createdAt: '2024-02-10T00:00:00Z',
        updatedAt: '2024-04-05T00:00:00Z',
      },
      {
        id: 'text-summarization',
        name: '文本摘要',
        description: '生成长文本的摘要内容',
        category: 'ai',
        icon: '📝',
        features: ['长文本摘要', '关键点提取', '多语言支持'],
        isPremium: false,
        usageCount: 12345,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-03-15T00:00:00Z',
      },
      {
        id: 'code-generation',
        name: '代码生成',
        description: '根据描述生成代码',
        category: 'development',
        icon: '💻',
        features: ['多语言支持', '代码解释', '错误修复'],
        isPremium: true,
        usageCount: 9876,
        createdAt: '2024-02-05T00:00:00Z',
        updatedAt: '2024-04-10T00:00:00Z',
      },
      {
        id: 'translation',
        name: '翻译服务',
        description: '多语言翻译功能',
        category: 'ai',
        icon: '🌐',
        features: ['文本翻译', '语音翻译', '批量翻译'],
        isPremium: false,
        usageCount: 18765,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-03-05T00:00:00Z',
      },
    ];

    // 如果指定了分类，则过滤结果
    if (category) {
      return mockTools.filter(tool => tool.category === category);
    }

    return mockTools;
  } catch (error) {
    console.error('获取工具数据错误:', error);
    throw new Error('获取工具数据失败');
  }
}

/**
 * 验证查询参数
 * @param sortBy 排序字段
 * @param sortOrder 排序顺序
 * @param limit 每页数量
 * @param offset 偏移量
 * @returns 验证后的值
 */
function validateQueryParams(
  sortBy: string | null,
  sortOrder: string | null,
  limit: string | null,
  offset: string | null
) {
  // 验证排序字段
  const validSortFields: SortField[] = ['usageCount', 'createdAt', 'name'];
  const validatedSortBy = validSortFields.includes(sortBy as SortField)
    ? (sortBy as SortField)
    : 'usageCount';

  // 验证排序顺序
  const validatedSortOrder = (sortOrder === 'asc') ? 'asc' : 'desc';

  // 验证分页参数
  const validatedLimit = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
  const validatedOffset = Math.max(0, parseInt(offset || '0', 10) || 0);

  return {
    sortBy: validatedSortBy,
    sortOrder: validatedSortOrder,
    limit: validatedLimit,
    offset: validatedOffset,
  };
}

/**
 * 排序工具列表
 * @param tools 工具列表
 * @param sortBy 排序字段
 * @param sortOrder 排序顺序
 * @returns 排序后的工具列表
 */
function sortTools(tools: Tool[], sortBy: SortField, sortOrder: SortOrder): Tool[] {
  return [...tools].sort((a, b) => {
    if (sortBy === 'usageCount') {
      return sortOrder === 'desc' 
        ? b.usageCount - a.usageCount 
        : a.usageCount - b.usageCount;
    } else if (sortBy === 'createdAt') {
      return sortOrder === 'desc'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'name') {
      return sortOrder === 'desc'
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
    return 0;
  });
}

/**
 * 生成标准的CORS响应头
 * @returns CORS响应头对象
 */
function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Version, Authorization',
    'Access-Control-Max-Age': '86400', // 24小时
  };
}

/**
 * GET /api/v1/tools
 * 获取工具列表 (v1)
 */
export const GET = withVersion(async function GET(
  request: NextRequest,
  { params }: { params?: { id?: string } }
) {
  try {
    // 合并安全头和CORS头
    const headers = {
      ...getSecurityHeaders(),
      ...getCorsHeaders(),
      'Content-Type': 'application/json',
    };

    // 处理单个工具详情请求
    if (params?.id) {
      if (!params.id || typeof params.id !== 'string' || params.id.trim() === '') {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: '无效的请求参数',
          message: '工具ID不能为空或无效',
          data: null,
        }, { 
          status: 400,
          headers 
        });
      }

      const tools = await getTools();
      const tool = tools.find(t => t.id === params.id);

      if (!tool) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: '资源不存在',
          message: `ID为${params.id}的工具不存在`,
          data: null,
        }, { 
          status: 404,
          headers 
        });
      }

      return NextResponse.json<ApiResponse<Tool>>({
        success: true,
        data: tool,
        message: '获取工具详情成功',
      }, { headers });
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    // 验证查询参数
    const { sortBy, sortOrder, limit, offset } = validateQueryParams(
      searchParams.get('sortBy'),
      searchParams.get('sortOrder'),
      searchParams.get('limit'),
      searchParams.get('offset')
    );

    // 获取工具列表
    let tools = await getTools(category || undefined);

    // 排序工具
    const sortedTools = sortTools(tools, sortBy, sortOrder);

    // 分页
    const total = sortedTools.length;
    const paginatedTools = sortedTools.slice(offset, offset + limit);

    // 构建分页响应
    const responseData: PaginatedResponse<Tool> = {
      items: paginatedTools,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };

    return NextResponse.json<ApiResponse<PaginatedResponse<Tool>>>({
      success: true,
      data: responseData,
      message: '获取工具列表成功',
    }, { headers });
  } catch (error) {
    console.error('获取工具列表错误:', error);
    
    // 准备错误响应头
    const errorHeaders = {
      ...getSecurityHeaders(),
      ...getCorsHeaders(),
      'Content-Type': 'application/json',
    };

    // 根据错误类型返回不同的状态码
    let statusCode = 500;
    let errorMessage = '服务器内部错误';
    
    if (error instanceof Error) {
      // 可以根据错误类型进一步分类处理
      if (error.message.includes('参数') || error.message.includes('格式')) {
        statusCode = 400;
        errorMessage = '请求参数错误';
      }
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: errorMessage,
      message: '获取工具列表失败',
      data: null,
    }, { 
      status: statusCode,
      headers: errorHeaders
    });
  }
});

/**
 * OPTIONS方法，用于处理CORS预检请求 (v1)
 */
export const OPTIONS = withVersion(async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      ...getSecurityHeaders(),
      ...getCorsHeaders(),
    },
  });
});