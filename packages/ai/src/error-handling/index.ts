/**
 * @file 错误处理系统入口
 * @description 统一导出错误处理系统的所有核心功能
 * @module error-handling
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

// 错误类导出
export * from './errors';

// 日志服务导出
export * from './logger';

// 错误处理器导出
export * from './error-handler';

// 错误类型导出
export type {
  // 错误类型
  YYC3Error,
  YYC3InputError,
  YYC3ProcessingError,
  YYC3DependencyError,
  YYC3AuthError,
  YYC3ConfigError,
  YYC3ResourceError,
  
  // 日志相关类型
  LogLevel,
  LogOptions,
  YYC3Logger,
  
  // 错误处理相关类型
  ErrorHandlerOptions,
  HttpErrorInfo,
  YYC3ErrorHandler,
} from './errors';

export type { LogLevel, LogOptions, YYC3Logger } from './logger';
export type { ErrorHandlerOptions, HttpErrorInfo, YYC3ErrorHandler } from './error-handler';

/**
 * 初始化错误处理系统
 */
export function initializeErrorHandling(): void {
  const { errorHandler, logger } = require('./error-handler');
  
  // 捕获全局错误
  errorHandler.captureGlobalErrors();
  
  // 在浏览器环境中捕获React错误
  if (typeof window !== 'undefined') {
    errorHandler.captureReactErrors();
  }
  
  logger.info('错误处理系统已初始化', {
    module: 'error-handling',
    environment: process.env.NODE_ENV,
  });
}

/**
 * 便捷方法：创建API错误响应
 */
export function createErrorResponse(error: unknown, context?: string) {
  const { errorHandler } = require('./error-handler');
  const handledError = errorHandler.handle(error, context);
  const httpError = errorHandler.toHttpError(handledError);
  
  return {
    statusCode: httpError.statusCode,
    body: {
      success: false,
      error: {
        code: handledError.code,
        message: httpError.userMessage,
        // 在开发环境中返回详细错误信息
        ...(process.env.NODE_ENV === 'development' && {
          details: handledError.message,
          context: handledError.context,
          stack: handledError.stack,
        }),
      },
    },
  };
}
