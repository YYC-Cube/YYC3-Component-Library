/**
 * @file 统一错误类定义
 * @description 实现YYC³系统的错误类层次结构和标准化错误处理
 * @module error-handling/errors
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

/**
 * YYC3错误基类
 */
export class YYC3Error extends Error {
  /**
   * 错误码
   */
  public code: string;
  
  /**
   * 错误级别
   */
  public severity: 'info' | 'warning' | 'error' | 'critical';
  
  /**
   * 错误上下文
   */
  public context?: Record<string, any>;
  
  /**
   * 错误时间戳
   */
  public timestamp: number;
  
  /**
   * 构造函数
   * @param message 错误消息
   * @param code 错误码，遵循 YYC3_{LAYER}_{ERROR_TYPE} 模式
   * @param severity 错误级别
   * @param context 错误上下文
   */
  constructor(
    message: string, 
    code: string, 
    severity: 'info' | 'warning' | 'error' | 'critical' = 'error', 
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.timestamp = Date.now();
    
    // 维护正确的堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
   * 转换为JSON格式
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * 输入错误类 - 用于处理用户输入验证错误
 */
export class YYC3InputError extends YYC3Error {
  /**
   * 构造函数
   * @param message 错误消息
   * @param context 错误上下文，通常包含字段验证信息
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'YYC3_INPUT_VALIDATION_ERROR', 'warning', context);
  }
}

/**
 * 处理错误类 - 用于处理业务逻辑错误
 */
export class YYC3ProcessingError extends YYC3Error {
  /**
   * 构造函数
   * @param message 错误消息
   * @param context 错误上下文，包含处理相关信息
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'YYC3_PROCESSING_ERROR', 'error', context);
  }
}

/**
 * 依赖错误类 - 用于处理外部服务依赖错误
 */
export class YYC3DependencyError extends YYC3Error {
  /**
   * 构造函数
   * @param message 错误消息
   * @param context 错误上下文，包含依赖服务信息
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'YYC3_DEPENDENCY_ERROR', 'critical', context);
  }
}

/**
 * 认证错误类 - 用于处理身份验证和授权错误
 */
export class YYC3AuthError extends YYC3Error {
  /**
   * 构造函数
   * @param message 错误消息
   * @param context 错误上下文，包含认证相关信息
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'YYC3_AUTH_ERROR', 'error', context);
  }
}

/**
 * 配置错误类 - 用于处理配置相关错误
 */
export class YYC3ConfigError extends YYC3Error {
  /**
   * 构造函数
   * @param message 错误消息
   * @param context 错误上下文，包含配置信息
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'YYC3_CONFIG_ERROR', 'critical', context);
  }
}

/**
 * 资源错误类 - 用于处理资源访问错误（如404）
 */
export class YYC3ResourceError extends YYC3Error {
  /**
   * 构造函数
   * @param message 错误消息
   * @param context 错误上下文，包含资源信息
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'YYC3_RESOURCE_ERROR', 'error', context);
  }
}
