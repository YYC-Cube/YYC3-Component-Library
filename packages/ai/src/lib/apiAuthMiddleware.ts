/**
 * @file API认证中间件
 * @description 提供API请求的认证和授权功能
 * @module apiAuthMiddleware
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/apiKeyService';
import { Permission, permissionService } from '@/lib/permissionService';

/**
 * API认证结果
 */
export interface ApiAuthResult {
  authenticated: boolean;
  apiKeyId?: string;
  ownerId?: string;
  permissions?: string[];
  error?: string;
  apiKeyInfo?: {
    createdAt: Date;
    expiresAt?: Date;
    usageCount: number;
    active: boolean;
  };
}

/**
 * API认证中间件配置选项
 */
export interface ApiAuthOptions {
  requiredPermissions?: Permission[];
  requireAuthentication?: boolean;
  skipPaths?: string[];
  allowUserAuth?: boolean;
  auditEnabled?: boolean;
  enforceHTTPS?: boolean;
  allowedOrigins?: string[];
}

/**
 * 从请求中提取API密钥
 * @param request Next.js请求对象
 * @returns 提取出的API密钥，如果没有找到则返回null
 */
const extractApiKey = (request: NextRequest): string | null => {
  // 从Authorization头中提取
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 从查询参数中提取
  const apiKeyParam = request.nextUrl.searchParams.get('api_key');
  if (apiKeyParam) {
    return apiKeyParam;
  }
  
  // 从cookie中提取（可选）
  const apiKeyCookie = request.cookies.get('api_key')?.value;
  if (apiKeyCookie) {
    return apiKeyCookie;
  }
  
  return null;
};

/**
 * 验证API请求
 * @param request Next.js请求对象
 * @param options 认证选项
 * @returns 认证结果
 */
export const authenticateApiRequest = async (
  request: NextRequest,
  options: ApiAuthOptions = {}
): Promise<ApiAuthResult> => {
  const {
    requiredPermissions = [], 
    requireAuthentication = true, 
    skipPaths = [],
    enforceHTTPS = true,
    allowedOrigins = ['*'],
    auditEnabled = true
  } = options;
  
  // 检查是否需要跳过此路径
  const path = request.nextUrl.pathname;
  if (skipPaths.some(skipPath => path.startsWith(skipPath))) {
    return { authenticated: true };
  }

  // 强制HTTPS检查（生产环境）
  if (enforceHTTPS && 
      process.env.NODE_ENV === 'production' && 
      request.nextUrl.protocol !== 'https') {
    console.warn(`非HTTPS请求尝试访问API: ${path}`);
    // 注意：这里仅记录警告，不阻止请求，因为Next.js已经有HTTPS重定向机制
  }

  // 跨域检查
  const origin = request.headers.get('origin');
  if (origin && 
      allowedOrigins[0] !== '*' && 
      !allowedOrigins.includes(origin)) {
    console.warn(`来自不允许的源的请求: ${origin}`);
    // 注意：具体的CORS处理在路由的OPTIONS方法中
  }
  
  // 提取API密钥
  const apiKey = extractApiKey(request);
  
  if (!apiKey) {
    return requireAuthentication 
      ? { authenticated: false, error: '缺少API密钥' }
      : { authenticated: true };
  }
  
  try {
    // 验证API密钥
    const validationResult = await apiKeyService.validateApiKey(apiKey);
    
    if (!validationResult.valid) {
      // 记录无效密钥尝试
      console.warn(`无效API密钥尝试: ${apiKey.slice(0, 8)}...`);
      return { authenticated: false, error: validationResult.error || '无效的API密钥' };
    }
    
    // 限流检查
    if (validationResult.apiKey && permissionService.isRateLimited(validationResult.apiKey.id)) {
      console.warn(`API密钥 ${validationResult.apiKey.id.slice(0, 8)}... 超出速率限制`);
      return { 
        authenticated: false, 
        error: '请求过于频繁，请稍后再试',
        apiKeyId: validationResult.apiKey.id,
        ownerId: validationResult.apiKey.ownerId
      };
    }
    
    const { apiKey: validApiKey } = validationResult;
    if (!validApiKey) {
      return { authenticated: false, error: 'API密钥信息不完整' };
    }
    
    // 检查密钥是否过期
    if (validApiKey.expiresAt && new Date(validApiKey.expiresAt) < new Date()) {
      return { 
        authenticated: false, 
        error: 'API密钥已过期',
        apiKeyId: validApiKey.id,
        ownerId: validApiKey.ownerId,
      };
    }

    // 检查密钥是否被停用
    if (!validApiKey.active) {
      return { 
        authenticated: false, 
        error: 'API密钥已被停用',
        apiKeyId: validApiKey.id,
        ownerId: validApiKey.ownerId,
      };
    }
    
    // 检查权限
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        validApiKey.permissions.includes(permission)
      );
      
      if (!hasAllPermissions) {
        // 记录权限不足的尝试
        console.warn(`API密钥 ${validApiKey.id} 权限不足，尝试访问: ${path}`);
        return { 
          authenticated: false, 
          error: 'API密钥缺少必要的权限',
          apiKeyId: validApiKey.id,
          ownerId: validApiKey.ownerId,
        };
      }
    }
    
    // 更新使用统计
    await apiKeyService.recordUsage(
      validApiKey.id,
      path,
      200, // 这里只是预估状态码，实际应该在响应后更新
      0    // 响应时间将在请求完成后计算
    );
    
    return {
      authenticated: true,
      apiKeyId: validApiKey.id,
      ownerId: validApiKey.ownerId,
      permissions: validApiKey.permissions,
      apiKeyInfo: {
        createdAt: validApiKey.createdAt,
        expiresAt: validApiKey.expiresAt,
        usageCount: validApiKey.usageCount + 1, // +1 因为我们刚刚记录了使用
        active: validApiKey.active
      }
    };
  } catch (error) {
    console.error('API认证错误:', error);
    return { authenticated: false, error: '认证过程中发生错误' };
  }
};

/**
 * API认证中间件函数
 * @param options 认证选项
 * @returns 中间件处理函数
 */
export const withApiAuth = (
  options: ApiAuthOptions = {}
) => {
  return async (request: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> => {
    // 执行认证
    const authResult = await authenticateApiRequest(request, options);
    
    // 将认证结果附加到请求对象
    (request as any).auth = authResult;
    
    if (!authResult.authenticated) {
      // 认证失败，返回适当的响应状态码
      let statusCode = authResult.error?.includes('权限') ? 403 : 401;
      // 特殊处理速率限制错误
      if (authResult.error?.includes('请求过于频繁')) {
        statusCode = 429;
      }
      
      const errorResponse = NextResponse.json(
        { error: authResult.error || '认证失败' },
        { 
          status: statusCode,
          headers: {
            'WWW-Authenticate': 'Bearer',
            'X-Error-Code': authResult.error?.includes('权限') ? 'PERMISSION_DENIED' : 
                          (authResult.error?.includes('请求过于频繁') ? 'RATE_LIMIT_EXCEEDED' : 'AUTH_REQUIRED')
          }
        }
      );
      
      // 添加安全相关响应头
      addSecurityHeaders(errorResponse.headers);
      return errorResponse;
    }
    
    // 认证成功，将认证信息添加到请求头
    const headers = new Headers(request.headers);
    if (authResult.apiKeyId) {
      headers.set('X-Api-Key-Id', authResult.apiKeyId);
    }
    if (authResult.ownerId) {
      headers.set('X-Owner-Id', authResult.ownerId);
    }
    
    // 创建带有更新后头部的请求
    const authenticatedRequest = new NextRequest(request, { headers });
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 继续处理请求
    const response = await next();
    
    // 计算响应时间
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 在响应中添加API使用统计信息
    if (authResult.apiKeyId) {
      response.headers.set('X-Api-Key-Id', authResult.apiKeyId);
      
      // 异步记录API使用情况，用于速率限制
      try {
        permissionService.recordApiKeyUsage(
          authResult.apiKeyId,
          request.nextUrl.pathname,
          response.status,
          responseTime
        );
      } catch (usageError) {
        console.error('记录API使用情况失败:', usageError);
      }
      
      // 添加速率限制相关响应头
      try {
        const apiKeyInfo = await apiKeyService.getApiKeyById(authResult.apiKeyId);
        if (apiKeyInfo && apiKeyInfo.rateLimit) {
          response.headers.set('X-RateLimit-Limit', apiKeyInfo.rateLimit.requests.toString());
          
          // 获取当前使用情况
          const usage = permissionService.getApiKeyUsage(authResult.apiKeyId);
          if (usage && usage.requestHistory) {
            const now = new Date();
            let thresholdTime: Date;
            
            switch (apiKeyInfo.rateLimit.period) {
              case 'minute':
                thresholdTime = new Date(now.getTime() - 60 * 1000);
                break;
              case 'hour':
                thresholdTime = new Date(now.getTime() - 60 * 60 * 1000);
                break;
              case 'day':
                thresholdTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
              default:
                thresholdTime = new Date(now.getTime() - 60 * 1000);
            }
            
            const recentRequests = usage.requestHistory.filter(
              req => new Date(req.timestamp) > thresholdTime
            ).length;
            
            response.headers.set(
              'X-RateLimit-Remaining', 
              Math.max(0, apiKeyInfo.rateLimit.requests - recentRequests).toString()
            );
            response.headers.set('X-RateLimit-Reset', Math.ceil(thresholdTime.getTime() / 1000).toString());
          }
        }
      } catch (rateLimitError) {
        console.error('获取API密钥速率限制信息失败:', rateLimitError);
      }
    }
    
    // 添加安全相关响应头
    addSecurityHeaders(response.headers);
    
    // 如果启用了审计，记录请求
    if (options.auditEnabled && authResult.authenticated && authResult.apiKeyId) {
      try {
        await apiKeyService.logApiKeyUsage({
          apiKeyId: authResult.apiKeyId,
          ownerId: authResult.ownerId || '',
          path: request.nextUrl.pathname,
          method: request.method,
          ip: request.ip || '',
          userAgent: request.headers.get('user-agent') || '',
          responseTime: responseTime
        });
      } catch (error) {
        // 记录审计日志失败不影响请求处理
        console.error('记录API使用审计失败:', error);
      }
    }
    
    return response;
  };
};

/**
 * 添加安全相关的HTTP响应头
 * @param headers 响应头对象
 */
function addSecurityHeaders(headers: Headers) {
  // 防止XSS攻击
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // 防止点击劫持
  headers.set('X-Frame-Options', 'DENY');
  
  // 控制内容类型嗅探
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // 内容安全策略
  headers.set('Content-Security-Policy', "default-src 'self'");
  
  // 引用策略
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 特性策略
  headers.set('Feature-Policy', "geolocation 'none'; camera 'none'");
}

/**
 * 权限检查装饰器函数
 * @param requiredPermissions 所需权限列表
 * @returns 装饰器函数
 */
export function requirePermissions(requiredPermissions: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      // 假设第一个参数是NextRequest
      const request = args[0];
      const auth = (request as any).auth;
      
      // 检查认证状态
      if (!auth || !auth.authenticated) {
        return createApiErrorResponse({
          status: 401,
          error: '未授权',
          message: '请提供有效的API密钥',
        });
      }
      
      // 检查是否为管理员权限
      const isAdmin = auth.permissions && auth.permissions.includes('admin');
      
      // 如果是管理员，跳过权限检查但记录操作
      if (isAdmin) {
        console.info(`管理员权限访问: 用户 ${auth.ownerId} 使用API密钥 ${auth.apiKeyId} 访问 ${request.nextUrl.pathname}`);
        return originalMethod.apply(this, args);
      }
      
      // 检查权限
      const hasAllPermissions = requiredPermissions.every(permission => 
        auth.permissions && auth.permissions.includes(permission)
      );
      
      if (!hasAllPermissions) {
        // 记录权限不足的详细信息
        console.warn(
          `权限不足: API密钥 ${auth.apiKeyId} (用户 ${auth.ownerId}) 尝试访问 ${request.nextUrl.pathname}`,
          { required: requiredPermissions, available: auth.permissions }
        );
        return createApiErrorResponse({
          status: 403,
          error: '禁止访问',
          message: 'API密钥缺少必要的权限',
          details: {
            required: requiredPermissions,
            available: auth.permissions
          }
        });
      }
      
      // 权限检查通过，继续执行原始方法
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * 生成安全的响应头
 * @returns 安全响应头对象
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // 防止XSS攻击
    'X-XSS-Protection': '1; mode=block',
    // 防止点击劫持
    'X-Frame-Options': 'DENY',
    // 控制内容类型嗅探
    'X-Content-Type-Options': 'nosniff',
    // 内容安全策略
    'Content-Security-Policy': "default-src 'self'",
    // 引用策略
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // 特性策略
    'Feature-Policy': "geolocation 'none'; camera 'none'",
    // HSTS (HTTP严格传输安全)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    // 预期CT (证书透明度)
    'Expect-CT': 'max-age=86400, enforce'
  };
}

/**
 * 验证请求数据完整性
 * @param data 请求数据
 * @param schema 验证模式
 * @returns 验证结果
 */
export function validateRequestData<T>(data: any, schema: any): { valid: boolean; data?: T; error?: string } {
  try {
    // 这里可以集成任何验证库，如Zod、Joi等
    // 目前是简化版本，实际项目中应替换为实际的验证逻辑
    if (!data || typeof data !== 'object') {
      return { valid: false, error: '请求数据必须是有效的JSON对象' };
    }
    return { valid: true, data: data as T };
  } catch (error) {
    console.error('数据验证错误:', error);
    return { valid: false, error: '请求数据格式错误' };
  }
}

/**
 * 创建API响应的辅助函数
 * @param data 响应数据
 * @param options 响应选项
 * @returns NextResponse对象
 */
export const createApiResponse = <T>(
  data: T,
  options: { status?: number; headers?: Record<string, string> } = {}
): NextResponse => {
  const { status = 200, headers = {} } = options;
  
  const response = NextResponse.json(data, { status });
  
  // 添加自定义头部
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // 添加标准API响应头部
  response.headers.set('Content-Type', 'application/json');
  response.headers.set('Access-Control-Allow-Origin', '*'); // 实际生产环境中应该限制来源
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  
  return response;
};

/**
 * 创建API错误响应的辅助函数
 * @param error 错误信息或对象
 * @param status HTTP状态码
 * @returns NextResponse错误对象
 */
export const createApiErrorResponse = (
  error: string | Error,
  status: number = 400
): NextResponse => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return createApiResponse(
    { 
      error: errorMessage, 
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.pathname : ''
    },
    { status }
  );
};