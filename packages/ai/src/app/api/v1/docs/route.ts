/**
 * @file API文档路由 (v1)
 * @description 提供API文档访问功能 (v1版本)
 * @module api/v1/docs
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
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
 * GET /api/v1/docs
 * 获取API文档信息 (v1)
 */
export const GET = withVersion(async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const category = searchParams.get('category');

    // 构建文档信息
    const docsInfo = {
      version: 'v1',
      title: 'YYC³ API 文档',
      description: 'YYC³ Easy❤️AI 平台的API文档',
      basePath: '/api/v1',
      categories: [
        {
          id: 'api-keys',
          name: 'API密钥管理',
          description: '管理API访问密钥',
          endpoints: [
            {
              path: '/api-keys',
              method: 'GET',
              description: '获取API密钥列表',
              requiresAuth: true,
            },
            {
              path: '/api-keys',
              method: 'POST',
              description: '创建新的API密钥',
              requiresAuth: true,
            },
            {
              path: '/api-keys/{id}',
              method: 'DELETE',
              description: '删除指定的API密钥',
              requiresAuth: true,
            },
            {
              path: '/api-keys/{id}/activate',
              method: 'PUT',
              description: '激活API密钥',
              requiresAuth: true,
            },
            {
              path: '/api-keys/{id}/deactivate',
              method: 'PUT',
              description: '停用API密钥',
              requiresAuth: true,
            },
          ],
        },
        {
          id: 'tools',
          name: '工具管理',
          description: '管理平台提供的工具',
          endpoints: [
            {
              path: '/tools',
              method: 'GET',
              description: '获取工具列表',
              requiresAuth: false,
            },
            {
              path: '/tools/{id}',
              method: 'GET',
              description: '获取工具详情',
              requiresAuth: false,
            },
          ],
        },
        {
          id: 'health',
          name: '健康检查',
          description: '检查API服务状态',
          endpoints: [
            {
              path: '/health',
              method: 'GET',
              description: '获取服务健康状态',
              requiresAuth: false,
            },
          ],
        },
      ],
      authentication: {
        method: 'API Key',
        header: 'X-API-Key',
        description: '使用API密钥进行认证',
      },
      rateLimits: {
        authenticated: '300 requests/minute',
        unauthenticated: '60 requests/minute',
      },
    };

    // 如果指定了分类，则过滤结果
    let responseData = docsInfo;
    if (category) {
      responseData = {
        ...docsInfo,
        categories: docsInfo.categories.filter(cat => cat.id === category),
      };
    }

    // 根据格式返回不同的响应
    if (format === 'yaml') {
      // 这里可以实现YAML格式的转换
      return NextResponse.json<ApiResponse<{ error: string }>>({
        success: false,
        error: '不支持的格式',
        message: 'YAML格式暂未实现',
        data: null,
      }, { status: 501 });
    }

    // 返回JSON格式的文档
    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: responseData,
      message: '获取API文档成功',
    }, {
      headers: {
        ...getSecurityHeaders(),
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('获取API文档错误:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: '服务器内部错误',
      message: '获取API文档失败',
      data: null,
    }, { status: 500 });
  }
});

/**
 * OPTIONS方法，用于处理CORS预检请求 (v1)
 */
export const OPTIONS = withVersion(async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Version',
    },
  });
});
