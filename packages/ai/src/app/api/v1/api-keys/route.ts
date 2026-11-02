/**
 * @file API密钥管理路由 (v1)
 * @description 提供API密钥的创建、查询、更新和删除功能 (v1版本)
 * @module api/v1/api-keys
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { apiKeyService } from '@/lib/apiKeyService';
import { withApiAuth, ApiAuthResult } from '@/lib/apiAuthMiddleware';
import { withApiVersion } from '@/lib/apiVersionMiddleware';

/**
 * API密钥路由认证配置
 * 使用withApiAuth中间件确保只有认证用户才能访问
 */
const withAuth = withApiAuth({
  requireAuthentication: true,
});

/**
 * 版本控制中间件配置
 */
const withVersion = withApiVersion({
  supportedVersions: ['v1'],
  defaultVersion: 'v1',
});

/**
 * GET /api/v1/api-keys
 * 获取当前用户的API密钥列表 (v1)
 */
export const GET = withVersion(withAuth(async function GET(request: NextRequest) {
  try {
    // 获取当前认证用户的信息
    const authResult = request.auth as ApiAuthResult;
    if (!authResult?.authenticated || !authResult.ownerId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '未授权访问',
        message: '请提供有效的认证信息',
        data: null,
      }, { status: 401 });
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '参数错误',
        message: '分页参数无效',
        data: null,
      }, { status: 400 });
    }

    // 获取API密钥列表
    const { apiKeys, total } = await apiKeyService.getApiKeysByOwner(
      authResult.ownerId,
      { activeOnly, page, limit }
    );

    // 返回成功响应
    return NextResponse.json<ApiResponse<{ keys: any[], total: number }>>({
      success: true,
      data: {
        keys: apiKeys,
        total,
      },
      message: '获取API密钥列表成功',
    });
  } catch (error) {
    console.error('获取API密钥列表错误:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: '服务器内部错误',
      message: '获取API密钥列表失败',
      data: null,
    }, { status: 500 });
  }
}));

/**
 * POST /api/v1/api-keys
 * 创建新的API密钥 (v1)
 */
export const POST = withVersion(withAuth(async function POST(request: NextRequest) {
  try {
    // 获取当前认证用户的信息
    const authResult = request.auth as ApiAuthResult;
    if (!authResult?.authenticated || !authResult.ownerId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '未授权访问',
        message: '请提供有效的认证信息',
        data: null,
      }, { status: 401 });
    }

    // 解析请求体
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '请求体格式错误',
        message: '请提供有效的JSON格式数据',
        data: null,
      }, { status: 400 });
    }

    // 验证请求数据
    const { name, permissions = [], expiresAt } = requestBody;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '参数错误',
        message: 'API密钥名称不能为空',
        data: null,
      }, { status: 400 });
    }

    // 验证权限列表
    if (!Array.isArray(permissions)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '参数错误',
        message: '权限列表必须是数组格式',
        data: null,
      }, { status: 400 });
    }

    // 创建API密钥
    const newApiKey = await apiKeyService.createApiKey({
      ownerId: authResult.ownerId,
      name: name.trim(),
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    // 返回成功响应
    return NextResponse.json<ApiResponse<{ key: string, apiKey: any }>>({
      success: true,
      data: {
        key: newApiKey.rawKey, // 仅在创建时返回完整密钥
        apiKey: {
          id: newApiKey.id,
          name: newApiKey.name,
          ownerId: newApiKey.ownerId,
          createdAt: newApiKey.createdAt,
          expiresAt: newApiKey.expiresAt,
          permissions: newApiKey.permissions,
          active: newApiKey.active,
          lastUsedAt: newApiKey.lastUsedAt,
          usageCount: newApiKey.usageCount,
        },
      },
      message: 'API密钥创建成功',
    }, { status: 201 });
  } catch (error) {
    console.error('创建API密钥错误:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: '服务器内部错误',
      message: '创建API密钥失败',
      data: null,
    }, { status: 500 });
  }
}));

/**
 * DELETE /api/v1/api-keys/{id}
 * 删除指定的API密钥 (v1)
 */
export const DELETE = withVersion(withAuth(async function DELETE(request: NextRequest) {
  try {
    // 获取当前认证用户的信息
    const authResult = request.auth as ApiAuthResult;
    if (!authResult?.authenticated || !authResult.ownerId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '未授权访问',
        message: '请提供有效的认证信息',
        data: null,
      }, { status: 401 });
    }

    // 从URL路径中提取密钥ID
    const pathParts = request.nextUrl.pathname.split('/');
    const keyId = pathParts[pathParts.length - 1];
    
    if (!keyId || keyId === 'api-keys') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '参数错误',
        message: '请提供有效的API密钥ID',
        data: null,
      }, { status: 400 });
    }

    // 吊销API密钥
    const result = await apiKeyService.revokeApiKey(keyId, authResult.ownerId);
    
    if (!result) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'API密钥不存在',
        message: '指定的API密钥不存在或不属于当前用户',
        data: null,
      }, { status: 404 });
    }

    // 返回成功响应
    return NextResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
      message: 'API密钥删除成功',
    });
  } catch (error) {
    console.error('删除API密钥错误:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: '服务器内部错误',
      message: '删除API密钥失败',
      data: null,
    }, { status: 500 });
  }
}));

/**
 * PUT /api/v1/api-keys/{id}/activate
 * 激活已吊销的API密钥 (v1)
 */
export const PUT = withVersion(withAuth(async function PUT(request: NextRequest) {
  try {
    // 获取当前认证用户的信息
    const authResult = request.auth as ApiAuthResult;
    if (!authResult?.authenticated || !authResult.ownerId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '未授权访问',
        message: '请提供有效的认证信息',
        data: null,
      }, { status: 401 });
    }

    // 从URL路径中提取密钥ID和操作
    const pathParts = request.nextUrl.pathname.split('/');
    const keyId = pathParts[pathParts.length - 2];
    const action = pathParts[pathParts.length - 1];
    
    if (!keyId || keyId === 'api-keys') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '参数错误',
        message: '请提供有效的API密钥ID',
        data: null,
      }, { status: 400 });
    }

    let result;
    
    // 根据操作类型执行不同的操作
    if (action === 'activate') {
      // 激活API密钥
      result = await apiKeyService.activateApiKey(keyId, authResult.ownerId);
    } else if (action === 'deactivate') {
      // 停用API密钥
      result = await apiKeyService.deactivateApiKey(keyId, authResult.ownerId);
    } else {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: '不支持的操作',
        message: '不支持的API密钥操作',
        data: null,
      }, { status: 400 });
    }
    
    if (!result) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'API密钥不存在',
        message: '指定的API密钥不存在或不属于当前用户',
        data: null,
      }, { status: 404 });
    }

    // 返回成功响应
    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: result,
      message: `API密钥${action === 'activate' ? '激活' : '停用'}成功`,
    });
  } catch (error) {
    console.error('更新API密钥状态错误:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: '服务器内部错误',
      message: '更新API密钥状态失败',
      data: null,
    }, { status: 500 });
  }
}));

/**
 * OPTIONS方法，用于处理CORS预检请求 (v1)
 */
export const OPTIONS = withVersion(async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-API-Version',
    },
  });
});
