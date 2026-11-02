/**
 * @file 统一错误处理工具
 * @description 实现YYC³系统的错误捕获、处理和恢复机制
 * @module error-handling/error-handler
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import { 
  YYC3Error, 
  YYC3InputError, 
  YYC3ProcessingError, 
  YYC3DependencyError, 
  YYC3AuthError, 
  YYC3ConfigError, 
  YYC3ResourceError 
} from './errors';
import { logger } from './logger';

/**
 * 错误处理选项
 */
export interface ErrorHandlerOptions {
  /**
   * 是否自动记录错误
   */
  autoLog?: boolean;
  
  /**
   * 是否自动转换为YYC3Error
   */
  autoConvert?: boolean;
  
  /**
   * 错误上下文信息
   */
  context?: Record<string, any>;
  
  /**
   * 错误回调函数
   */
  onError?: (error: YYC3Error) => void;
}

/**
 * HTTP错误映射
 */
export interface HttpErrorInfo {
  statusCode: number;
  userMessage: string;
}

/**
 * YYC³错误处理器接口
 */
export interface YYC3ErrorHandler {
  handle(error: unknown, context?: string, options?: ErrorHandlerOptions): YYC3Error;
  wrap<T>(fn: () => T, context?: string, options?: ErrorHandlerOptions): T;
  wrapAsync<T>(fn: () => Promise<T>, context?: string, options?: ErrorHandlerOptions): Promise<T>;
  toHttpError(error: YYC3Error): HttpErrorInfo;
  captureGlobalErrors(): void;
  captureReactErrors(): void;
}

/**
 * YYC³错误处理器实现类
 */
export class YYC3ErrorHandlerImpl implements YYC3ErrorHandler {
  private static instance: YYC3ErrorHandlerImpl;
  
  private constructor() {}
  
  /**
   * 获取错误处理器单例
   */
  public static getInstance(): YYC3ErrorHandlerImpl {
    if (!YYC3ErrorHandlerImpl.instance) {
      YYC3ErrorHandlerImpl.instance = new YYC3ErrorHandlerImpl();
    }
    return YYC3ErrorHandlerImpl.instance;
  }
  
  /**
   * 处理错误
   */
  public handle(error: unknown, context: string = 'Unknown context', options: ErrorHandlerOptions = {}): YYC3Error {
    const { autoLog = true, autoConvert = true, onError } = options;
    
    // 转换为标准错误对象
    let yyc3Error: YYC3Error;
    
    if (error instanceof YYC3Error) {
      // 如果已经是YYC3Error，合并上下文
      if (options.context) {
        error.context = {
          ...error.context,
          ...options.context,
        };
      }
      yyc3Error = error;
    } else if (autoConvert) {
      // 自动转换为YYC3Error
      yyc3Error = this.convertToYYC3Error(error, context, options.context);
    } else {
      // 如果不自动转换，创建通用错误
      const errorMessage = error instanceof Error ? error.message : String(error);
      yyc3Error = new YYC3Error(
        errorMessage,
        'YYC3_UNKNOWN_ERROR',
        'error',
        {
          originalError: error,
          ...options.context,
        }
      );
      
      // 保留原始堆栈
      if (error instanceof Error && error.stack) {
        yyc3Error.stack = error.stack;
      }
    }
    
    // 自动记录错误
    if (autoLog) {
      logger.logError(yyc3Error, context);
    }
    
    // 执行错误回调
    if (onError) {
      try {
        onError(yyc3Error);
      } catch (callbackError) {
        logger.error('Error handler callback failed', {
          context: 'ErrorHandler.handle',
          error: callbackError,
        });
      }
    }
    
    return yyc3Error;
  }
  
  /**
   * 包装同步函数，捕获并处理错误
   */
  public wrap<T>(fn: () => T, context?: string, options?: ErrorHandlerOptions): T {
    try {
      return fn();
    } catch (error) {
      const yyc3Error = this.handle(error, context, options);
      throw yyc3Error;
    }
  }
  
  /**
   * 包装异步函数，捕获并处理错误
   */
  public wrapAsync<T>(fn: () => Promise<T>, context?: string, options?: ErrorHandlerOptions): Promise<T> {
    return Promise.resolve().then(() => fn()).catch((error) => {
      const yyc3Error = this.handle(error, context, options);
      throw yyc3Error;
    });
  }
  
  /**
   * 转换为HTTP错误信息
   */
  public toHttpError(error: YYC3Error): HttpErrorInfo {
    switch (error.constructor) {
      case YYC3InputError:
        return {
          statusCode: 400,
          userMessage: error.message || '输入参数错误，请检查输入后重试',
        };
      case YYC3AuthError:
        return {
          statusCode: 401,
          userMessage: error.message || '认证失败，请重新登录',
        };
      case YYC3ResourceError:
        return {
          statusCode: 404,
          userMessage: error.message || '请求的资源不存在',
        };
      case YYC3ConfigError:
        return {
          statusCode: 500,
          userMessage: '系统配置错误，请联系管理员',
        };
      case YYC3DependencyError:
        return {
          statusCode: 503,
          userMessage: '服务暂时不可用，请稍后重试',
        };
      case YYC3ProcessingError:
        return {
          statusCode: 500,
          userMessage: error.message || '处理请求时发生错误',
        };
      default:
        // 在开发环境中显示详细错误，生产环境中显示通用错误
        const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
        return {
          statusCode: 500,
          userMessage: isDev ? error.message : '服务器内部错误，请联系管理员',
        };
    }
  }
  
  /**
   * 捕获全局错误
   */
  public captureGlobalErrors(): void {
    // 捕获未处理的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      this.handle(reason, 'Unhandled Promise Rejection', {
        context: { promise },
      });
    });
    
    // 捕获未捕获的异常
    process.on('uncaughtException', (error) => {
      this.handle(error, 'Uncaught Exception', {
        autoLog: true,
      });
      
      // 对于未捕获的异常，建议在记录日志后退出进程
      // 但为了不影响开发体验，只在生产环境中执行
      if (process.env.NODE_ENV === 'production') {
        setTimeout(() => {
          process.exit(1);
        }, 1000).unref();
      }
    });
  }
  
  /**
   * 捕获React错误（在浏览器环境中）
   */
  public captureReactErrors(): void {
    // 在浏览器环境中，使用window.onerror
    if (typeof window !== 'undefined') {
      window.onerror = (message, source, lineno, colno, error) => {
        if (error) {
          this.handle(error, 'React Error Boundary', {
            context: {
              source,
              lineno,
              colno,
            },
          });
        } else {
          this.handle(new Error(String(message)), 'React Error Boundary', {
            context: {
              source,
              lineno,
              colno,
            },
          });
        }
        
        // 返回true表示已处理错误，不再传播
        return true;
      };
    }
  }
  
  /**
   * 将各种错误转换为YYC3Error
   */
  private convertToYYC3Error(error: unknown, context: string, errorContext?: Record<string, any>): YYC3Error {
    const combinedContext = {
      ...errorContext,
      conversionContext: context,
    };
    
    if (error instanceof Error) {
      // 根据错误类型和特征进行转换
      
      // 输入验证错误（如Zod、Joi等）
      if (error.name === 'ValidationError' || error.name === 'ZodError') {
        return new YYC3InputError(
          error.message,
          combinedContext
        );
      }
      
      // 认证错误
      if (error.name === 'AuthError' || error.message?.includes('auth') || error.message?.includes('login')) {
        return new YYC3AuthError(
          error.message,
          combinedContext
        );
      }
      
      // 资源不存在错误
      if (error.name === 'NotFoundError' || error.message?.includes('not found')) {
        return new YYC3ResourceError(
          error.message,
          combinedContext
        );
      }
      
      // 配置错误
      if (error.name === 'ConfigError' || error.message?.includes('config') || error.message?.includes('configuration')) {
        return new YYC3ConfigError(
          error.message,
          combinedContext
        );
      }
      
      // 网络/依赖错误
      if (error.name === 'NetworkError' || error.name === 'RequestError' || 
          error.message?.includes('network') || error.message?.includes('timeout')) {
        return new YYC3DependencyError(
          error.message,
          combinedContext
        );
      }
      
      // 默认作为处理错误
      return new YYC3ProcessingError(
        error.message,
        {
          ...combinedContext,
          originalError: error,
        }
      );
    }
    
    // 非Error类型的错误
    const errorMessage = String(error);
    return new YYC3Error(
      errorMessage,
      'YYC3_UNKNOWN_ERROR',
      'error',
      {
        ...combinedContext,
        originalError: error,
      }
    );
  }
}

/**
 * 默认错误处理器实例
 */
export const errorHandler = YYC3ErrorHandlerImpl.getInstance();

/**
 * 便捷方法：处理错误
 */
export const handleError = (error: unknown, context?: string, options?: ErrorHandlerOptions): YYC3Error => {
  return errorHandler.handle(error, context, options);
};

/**
 * 便捷方法：包装同步函数
 */
export const wrapError = <T>(fn: () => T, context?: string, options?: ErrorHandlerOptions): T => {
  return errorHandler.wrap(fn, context, options);
};

/**
 * 便捷方法：包装异步函数
 */
export const wrapAsyncError = <T>(fn: () => Promise<T>, context?: string, options?: ErrorHandlerOptions): Promise<T> => {
  return errorHandler.wrapAsync(fn, context, options);
};
