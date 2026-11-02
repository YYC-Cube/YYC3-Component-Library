/**
 * @file API密钥管理路由
 * @description 处理API密钥的创建、查询、删除和状态管理（兼容层）
 * @module api/api-keys
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
 * 处理所有API密钥相关请求，重定向到版本化路由
 * 保持向后兼容性，同时引导客户端使用版本化API
 */
export const GET = withVersion(async function GET(request: NextRequest, { params }: { params?: any }) {
  // 这个函数实际上不会被执行，因为withApiVersion中间件会重定向请求
  // 但保留实现以防中间件配置更改
  const versionedPath = `/api/v1/api-keys${params?.id ? `/${params.id}` : ''}${request.nextUrl.search}`;
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 301,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/api-keys instead.',
    },
  });
});

export const POST = withVersion(async function POST(request: NextRequest) {
  // 重定向到v1版本
  const versionedPath = '/api/v1/api-keys';
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 301,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/api-keys instead.',
    },
  });
});

export const PUT = withVersion(async function PUT(request: NextRequest, { params }: { params?: any }) {
  // 处理activate和deactivate端点
  const path = request.nextUrl.pathname;
  let versionedPath = '/api/v1/api-keys';
  
  if (params?.id) {
    versionedPath = `/api/v1/api-keys/${params.id}`;
    if (path.includes('/activate')) {
      versionedPath += '/activate';
    } else if (path.includes('/deactivate')) {
      versionedPath += '/deactivate';
    }
  }
  
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 301,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/api-keys instead.',
    },
  });
});

export const DELETE = withVersion(async function DELETE(request: NextRequest, { params }: { params?: any }) {
  const versionedPath = params?.id ? `/api/v1/api-keys/${params.id}` : '/api/v1/api-keys';
  return NextResponse.redirect(new URL(versionedPath, request.url), {
    status: 301,
    headers: {
      'X-API-Deprecation-Warning': 'Direct API access without version is deprecated. Please use /api/v1/api-keys instead.',
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-API-Version',
    },
  });
});
