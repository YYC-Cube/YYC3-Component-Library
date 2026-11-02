/**
 * @file 工具功能路由
 * @description 提供工具功能查询和管理接口（兼容层）
 * @module api/tools
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersion } from '@/lib/apiVersionMiddleware';

/**
 * 版本控制中间件配置（兼容层）
 */
const withVersion = withApiVersion({
  supportedVersions: ['v1'],
  defaultVersion: 'v1',
  redirectToVersionedPath: true,
});

/**
 * GET /api/tools
 * 获取工具列表或单个工具详情，重定向到版本化路由
 */
export const GET = withVersion(async function GET(request: NextRequest) {
  // 保留查询参数并添加到版本化路径
  const url = new URL(request.url);
  const versionedPath = `/api/v1/tools${url.search}`;
  
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 301,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/tools instead.',
    },
  });
});

/**
 * POST /api/tools
 * 执行工具，重定向到版本化路由
 */
export const POST = withVersion(async function POST(request: NextRequest) {
  // 对于POST请求，我们需要转发请求体到版本化路由
  // 这里使用308重定向来保持请求方法和请求体
  const url = new URL(request.url);
  const versionedPath = `/api/v1/tools${url.search}`;
  
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 308,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/tools instead.',
    },
  });
});

/**
 * OPTIONS 方法，处理CORS预检请求
 */
export const OPTIONS = withVersion(async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-API-Version',
    },
  });
});