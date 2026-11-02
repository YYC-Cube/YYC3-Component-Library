/**
 * @file 健康检查路由
 * @description 提供API服务健康状态检查（兼容层）
 * @module api/health
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
 * GET /api/health
 * 获取API服务健康状态，重定向到版本化路由
 */
export const GET = withVersion(async function GET(request: NextRequest) {
  // 重定向到v1版本
  const versionedPath = '/api/v1/health';
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 301,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/health instead.',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-API-Version',
    },
  });
})