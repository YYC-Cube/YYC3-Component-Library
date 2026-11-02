/**
 * @file API版本控制中间件
 * @description 处理API版本控制，支持通过URL路径和请求头进行版本控制
 * @module lib/apiVersionMiddleware
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * API版本控制选项
 */
export interface ApiVersionOptions {
  /**
   * 支持的API版本列表
   */
  supportedVersions?: string[];
  
  /**
   * 默认API版本
   */
  defaultVersion?: string;
  
  /**
   * 版本控制方式
   * @default 'path'
   */
  versionMethod?: 'path' | 'header' | 'both';
  
  /**
   * 版本请求头名称
   * @default 'X-API-Version'
   */
  versionHeaderName?: string;
  
  /**
   * 是否允许降级到默认版本
   * @default true
   */
  allowFallback?: boolean;
}

/**
 * API版本控制上下文
 */
export interface ApiVersionContext {
  /**
   * 请求的API版本
   */
  version: string;
  
  /**
   * 规范化后的API路径（去除版本信息）
   */
  normalizedPath: string;
  
  /**
   * 是否使用默认版本
   */
  isDefaultVersion: boolean;
}

/**
 * 默认的API版本控制选项
 */
const defaultOptions: ApiVersionOptions = {
  supportedVersions: ['v1'],
  defaultVersion: 'v1',
  versionMethod: 'path',
  versionHeaderName: 'X-API-Version',
  allowFallback: true,
};

/**
 * 从请求中提取API版本信息
 * @param request Next.js请求对象
 * @param options 版本控制选项
 * @returns API版本和规范化路径的信息
 */
export const extractApiVersion = (
  request: NextRequest,
  options: ApiVersionOptions = {}
): ApiVersionContext => {
  const mergedOptions = { ...defaultOptions, ...options };
  const { supportedVersions, defaultVersion, versionMethod, versionHeaderName } = mergedOptions;
  
  let version = defaultVersion;
  let normalizedPath = request.nextUrl.pathname;
  let isDefaultVersion = true;
  
  // 从URL路径提取版本（如 /api/v1/resource）
  if (versionMethod === 'path' || versionMethod === 'both') {
    const pathVersionMatch = request.nextUrl.pathname.match(/\/api\/(v\d+)\//);
    if (pathVersionMatch && pathVersionMatch[1]) {
      const pathVersion = pathVersionMatch[1];
      if (supportedVersions.includes(pathVersion)) {
        version = pathVersion;
        normalizedPath = request.nextUrl.pathname.replace(`/api/${pathVersion}`, '/api');
        isDefaultVersion = version === defaultVersion;
      }
    }
  }
  
  // 从请求头提取版本（如果URL路径中没有或版本方法允许）
  if ((versionMethod === 'header' || versionMethod === 'both') && isDefaultVersion) {
    const headerVersion = request.headers.get(versionHeaderName);
    if (headerVersion && supportedVersions.includes(headerVersion)) {
      version = headerVersion;
      isDefaultVersion = version === defaultVersion;
    }
  }
  
  return {
    version,
    normalizedPath,
    isDefaultVersion
  };
};

/**
 * API版本控制中间件
 * 用于处理API版本路由和向后兼容性
 */
export const withApiVersion = (options: ApiVersionOptions = {}) => {
  return (next: (request: NextRequest, ctx?: any) => Promise<NextResponse>) => {
    return async (request: NextRequest, ctx?: any): Promise<NextResponse> => {
      const mergedOptions = { ...defaultOptions, ...options };
      const { supportedVersions, allowFallback } = mergedOptions;
      
      // 提取API版本信息
      const versionContext = extractApiVersion(request, mergedOptions);
      const { version, normalizedPath, isDefaultVersion } = versionContext;
      
      // 检查版本是否受支持
      if (!supportedVersions.includes(version) && !allowFallback) {
        return NextResponse.json(
          {
            success: false,
            error: 'UNSUPPORTED_API_VERSION',
            message: `不支持的API版本: ${version}。支持的版本有: ${supportedVersions.join(', ')}`,
          },
          { status: 400 }
        );
      }
      
      // 如果请求的版本不受支持但允许降级，则使用默认版本
      if (!supportedVersions.includes(version) && allowFallback) {
        versionContext.version = mergedOptions.defaultVersion;
        versionContext.isDefaultVersion = true;
      }
      
      // 将版本信息附加到请求对象
      (request as any).apiVersion = versionContext;
      
      // 修改请求URL路径（如果使用路径版本控制）
      if (mergedOptions.versionMethod === 'path' || mergedOptions.versionMethod === 'both') {
        const originalUrl = request.nextUrl.toString();
        const newUrl = originalUrl.replace(
          `/api/${version}/`,
          '/api/'
        ).replace(
          `/api/${version}$`,
          '/api'
        );
        
        request.nextUrl.href = newUrl;
      }
      
      // 调用下一个处理函数
      const response = await next(request, ctx);
      
      // 添加版本信息响应头
      response.headers.set('X-API-Version', versionContext.version);
      response.headers.set('X-API-Version-Default', versionContext.isDefaultVersion.toString());
      
      return response;
    };
  };
};

/**
 * 为特定版本创建API路由前缀
 * @param version API版本
 * @param path API路径（不包含/api前缀）
 * @returns 完整的API路径
 */
export const createVersionedApiPath = (version: string, path: string): string => {
  return `/api/${version}${path.startsWith('/') ? '' : '/'}${path}`;
};

/**
 * 获取API版本的路由处理器
 * 用于将请求路由到正确的版本处理函数
 */
export const getVersionedHandler = (
  handlers: Record<string, (request: NextRequest, ctx?: any) => Promise<NextResponse>>,
  defaultHandler?: (request: NextRequest, ctx?: any) => Promise<NextResponse>
) => {
  return async (request: NextRequest, ctx?: any): Promise<NextResponse> => {
    const versionContext = (request as any).apiVersion;
    
    // 如果有特定版本的处理器，则使用它
    if (versionContext && handlers[versionContext.version]) {
      return handlers[versionContext.version](request, ctx);
    }
    
    // 否则使用默认处理器
    if (defaultHandler) {
      return defaultHandler(request, ctx);
    }
    
    // 如果都没有，则返回404
    return NextResponse.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '请求的API端点不存在',
      },
      { status: 404 }
    );
  };
};
