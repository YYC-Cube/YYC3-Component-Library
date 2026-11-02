/**
 * @file 健康检查路由 (v1)
 * @description 提供API服务健康状态检查功能 (v1版本)
 * @module api/v1/health
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
 * 检查系统组件健康状态
 */
async function checkSystemHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: Record<string, {
    status: 'up' | 'down' | 'degraded';
    message?: string;
    responseTime?: number;
  }>;
  timestamp: string;
}> {
  const components: Record<string, any> = {};
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  try {
    // 检查数据库连接
    const dbStart = Date.now();
    // 这里应该添加实际的数据库连接检查逻辑
    components.database = {
      status: 'up' as const,
      responseTime: Date.now() - dbStart,
    };
  } catch (error) {
    components.database = {
      status: 'down' as const,
      message: '数据库连接失败',
    };
    overallStatus = 'unhealthy';
  }

  try {
    // 检查缓存服务
    const cacheStart = Date.now();
    // 这里应该添加实际的缓存服务检查逻辑
    components.cache = {
      status: 'up' as const,
      responseTime: Date.now() - cacheStart,
    };
  } catch (error) {
    components.cache = {
      status: 'down' as const,
      message: '缓存服务连接失败',
    };
    overallStatus = overallStatus !== 'unhealthy' ? 'degraded' : 'unhealthy';
  }

  try {
    // 检查API服务本身
    components.api = {
      status: 'up' as const,
    };
  } catch (error) {
    components.api = {
      status: 'down' as const,
      message: 'API服务异常',
    };
    overallStatus = 'unhealthy';
  }

  return {
    status: overallStatus,
    components,
    timestamp: new Date().toISOString(),
  };
}

/**
 * GET /api/v1/health
 * 获取服务健康状态 (v1)
 */
export const GET = withVersion(async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const detailed = searchParams.get('detailed') === 'true';

    // 检查系统健康状态
    const healthInfo = await checkSystemHealth();

    // 构建响应数据
    const responseData = detailed
      ? healthInfo
      : {
          status: healthInfo.status,
          timestamp: healthInfo.timestamp,
        };

    // 根据健康状态设置HTTP状态码
    let statusCode = 200;
    if (healthInfo.status === 'degraded') {
      statusCode = 503;
    } else if (healthInfo.status === 'unhealthy') {
      statusCode = 500;
    }

    return NextResponse.json<ApiResponse<any>>({
      success: healthInfo.status === 'healthy',
      data: responseData,
      message: `服务状态: ${healthInfo.status}`,
      error: healthInfo.status !== 'healthy' ? '服务状态异常' : undefined,
    }, {
      status: statusCode,
      headers: {
        ...getSecurityHeaders(),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('健康检查错误:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: '服务器内部错误',
      message: '健康检查失败',
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
