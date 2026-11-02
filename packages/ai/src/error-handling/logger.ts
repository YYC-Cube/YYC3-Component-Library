/**
 * @file 统一日志服务
 * @description 实现YYC³系统的标准化日志记录和错误处理
 * @module error-handling/logger
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import { YYC3Error } from './errors';

/**
 * 日志级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

/**
 * 日志选项
 */
export interface LogOptions {
  /**
   * 日志上下文信息
   */
  context?: Record<string, any>;
  
  /**
   * 是否包含堆栈跟踪
   */
  stack?: boolean;
  
  /**
   * 错误实例（如果适用）
   */
  error?: Error;
  
  /**
   * 功能模块名称
   */
  module?: string;
}

/**
 * YYC³日志接口
 */
export interface YYC3Logger {
  debug(message: string, options?: LogOptions): void;
  info(message: string, options?: LogOptions): void;
  warn(message: string, options?: LogOptions): void;
  error(message: string, options?: LogOptions): void;
  critical(message: string, options?: LogOptions): void;
  log(level: LogLevel, message: string, options?: LogOptions): void;
  
  // 便捷方法
  logError(error: Error | YYC3Error, context?: string): void;
  logApiRequest(method: string, url: string, status: number, duration: number, options?: LogOptions): void;
  logPerformance(operation: string, duration: number, options?: LogOptions): void;
}

/**
 * YYC³日志服务实现类
 */
export class YYC3LoggerService implements YYC3Logger {
  private static instance: YYC3LoggerService;
  private logLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  
  private constructor() {}
  
  /**
   * 获取日志服务单例
   */
  public static getInstance(): YYC3LoggerService {
    if (!YYC3LoggerService.instance) {
      YYC3LoggerService.instance = new YYC3LoggerService();
    }
    return YYC3LoggerService.instance;
  }
  
  /**
   * 设置日志级别
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  /**
   * 检查是否应该记录该级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'critical'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
  
  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, options: LogOptions = {}): Record<string, any> {
    const timestamp = new Date().toISOString();
    const formattedMessage = {
      timestamp,
      level,
      message,
      module: options.module || 'default',
      ...(options.context && { context: options.context }),
    };
    
    // 如果有错误或需要堆栈，添加堆栈信息
    if (options.error || options.stack) {
      const error = options.error || new Error(message);
      formattedMessage.stack = error.stack;
      
      // 如果是YYC3Error，提取更多信息
      if (error instanceof YYC3Error) {
        formattedMessage.errorCode = error.code;
        formattedMessage.errorSeverity = error.severity;
        if (error.context) {
          formattedMessage.errorContext = error.context;
        }
      }
    }
    
    return formattedMessage;
  }
  
  /**
   * 发送日志（可扩展为发送到远程日志服务）
   */
  private sendLog(formattedMessage: Record<string, any>): void {
    // 在开发环境中，使用console输出
    if (process.env.NODE_ENV === 'development') {
      const { level, message, ...rest } = formattedMessage;
      
      switch (level) {
        case 'debug':
          console.debug(`[DEBUG] ${message}`, rest);
          break;
        case 'info':
          console.info(`[INFO] ${message}`, rest);
          break;
        case 'warn':
          console.warn(`[WARN] ${message}`, rest);
          break;
        case 'error':
          console.error(`[ERROR] ${message}`, rest);
          break;
        case 'critical':
          console.error(`[CRITICAL] ${message}`, rest);
          break;
      }
    } else {
      // 在生产环境中，可以将日志发送到远程日志服务
      // 例如：发送到ELK、Datadog等
      // 这里使用console.error作为后备
      console.error(JSON.stringify(formattedMessage));
    }
  }
  
  /**
   * 记录调试日志
   */
  public debug(message: string, options?: LogOptions): void {
    if (this.shouldLog('debug')) {
      const formattedMessage = this.formatMessage('debug', message, options);
      this.sendLog(formattedMessage);
    }
  }
  
  /**
   * 记录信息日志
   */
  public info(message: string, options?: LogOptions): void {
    if (this.shouldLog('info')) {
      const formattedMessage = this.formatMessage('info', message, options);
      this.sendLog(formattedMessage);
    }
  }
  
  /**
   * 记录警告日志
   */
  public warn(message: string, options?: LogOptions): void {
    if (this.shouldLog('warn')) {
      const formattedMessage = this.formatMessage('warn', message, options);
      this.sendLog(formattedMessage);
    }
  }
  
  /**
   * 记录错误日志
   */
  public error(message: string, options?: LogOptions): void {
    if (this.shouldLog('error')) {
      const formattedMessage = this.formatMessage('error', message, options);
      this.sendLog(formattedMessage);
    }
  }
  
  /**
   * 记录严重错误日志
   */
  public critical(message: string, options?: LogOptions): void {
    if (this.shouldLog('critical')) {
      const formattedMessage = this.formatMessage('critical', message, options);
      this.sendLog(formattedMessage);
      
      // 对于严重错误，可以添加额外的告警逻辑
      this.sendAlert(formattedMessage);
    }
  }
  
  /**
   * 通用日志方法
   */
  public log(level: LogLevel, message: string, options?: LogOptions): void {
    switch (level) {
      case 'debug':
        this.debug(message, options);
        break;
      case 'info':
        this.info(message, options);
        break;
      case 'warn':
        this.warn(message, options);
        break;
      case 'error':
        this.error(message, options);
        break;
      case 'critical':
        this.critical(message, options);
        break;
    }
  }
  
  /**
   * 便捷方法：记录错误
   */
  public logError(error: Error | YYC3Error, context?: string): void {
    const message = error instanceof YYC3Error 
      ? `${context || 'Error occurred'}: ${error.message}` 
      : `${context || 'Unknown error occurred'}: ${error.message}`;
    
    const level = error instanceof YYC3Error ? this.mapErrorSeverityToLogLevel(error.severity) : 'error';
    
    this.log(level, message, {
      error,
      context: error instanceof YYC3Error ? error.context : undefined,
    });
  }
  
  /**
   * 便捷方法：记录API请求
   */
  public logApiRequest(method: string, url: string, status: number, duration: number, options?: LogOptions): void {
    const message = `${method} ${url} ${status} (${duration}ms)`;
    
    let level: LogLevel = 'info';
    if (status >= 500) level = 'error';
    else if (status >= 400) level = 'warn';
    else if (duration > 1000) level = 'warn'; // 慢请求警告
    
    this.log(level, message, {
      context: {
        method,
        url,
        status,
        duration,
        ...(options?.context || {}),
      },
      ...(options || {}),
    });
  }
  
  /**
   * 便捷方法：记录性能指标
   */
  public logPerformance(operation: string, duration: number, options?: LogOptions): void {
    const message = `${operation} took ${duration}ms`;
    
    let level: LogLevel = 'info';
    if (duration > 3000) level = 'error';
    else if (duration > 1000) level = 'warn';
    
    this.log(level, message, {
      context: {
        operation,
        duration,
        ...(options?.context || {}),
      },
      ...(options || {}),
    });
  }
  
  /**
   * 将错误严重程度映射到日志级别
   */
  private mapErrorSeverityToLogLevel(severity: 'info' | 'warning' | 'error' | 'critical'): LogLevel {
    switch (severity) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warn';
      case 'error':
        return 'error';
      case 'critical':
        return 'critical';
    }
  }
  
  /**
   * 发送告警（可扩展为发送到告警系统）
   */
  private sendAlert(formattedMessage: Record<string, any>): void {
    // 在生产环境中，这里可以实现告警逻辑
    // 例如：发送到Slack、钉钉、邮件等
    console.error('🚨 ALERT:', JSON.stringify(formattedMessage));
  }
}

/**
 * 默认日志实例
 */
export const logger = YYC3LoggerService.getInstance();
