/**
 * @file 错误页面组件
 * @description 用于显示各种错误状态（如404、403、500等）
 * @module components
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React from 'react';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  LockIcon,
  SearchIcon,
  ServerIcon,
  ShieldAlertIcon,
  SparklesIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

// 错误类型枚举
export enum ErrorType {
  NOT_FOUND = 'not-found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  SERVER_ERROR = 'server-error',
  NETWORK_ERROR = 'network-error',
  MAINTENANCE = 'maintenance',
  SERVICE_UNAVAILABLE = 'service-unavailable',
  BAD_GATEWAY = 'bad-gateway',
  TIMEOUT = 'timeout',
  GENERIC = 'generic'
}

// 错误页面Props接口
interface ErrorPageProps {
  /** 错误类型 */
  type?: ErrorType;
  /** 错误代码 (如 404, 500 等) */
  code?: number;
  /** 自定义错误消息 */
  message?: string;
  /** 自定义标题 */
  title?: string;
  /** 返回按钮链接 */
  backLink?: string;
  /** 返回按钮文本 */
  backButtonText?: string;
  /** 额外按钮配置 */
  extraButton?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary';
  };
  /** 是否显示返回首页按钮 */
  showHomeButton?: boolean;
  /** 自定义样式类 */
  className?: string;
  /** 测试ID */
  testId?: string;
}

// 错误配置类型
interface ErrorConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  code: number;
  color: string;
}

/**
 * 错误页面组件
 * 用于显示各种HTTP错误和应用错误
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({
  type = ErrorType.GENERIC,
  code,
  message,
  title,
  backLink,
  backButtonText = '返回上一页',
  extraButton,
  showHomeButton = true,
  className = '',
  testId = 'error-page'
}) => {
  const router = useRouter();

  // 错误配置映射
  const errorConfigs: Record<ErrorType, ErrorConfig> = {
    [ErrorType.NOT_FOUND]: {
      icon: <SearchIcon size={64} />,
      title: '页面不存在',
      message: '您访问的页面可能已被删除、改名或暂时不可用。',
      code: 404,
      color: 'text-orange-500',
    },
    [ErrorType.UNAUTHORIZED]: {
      icon: <LockIcon size={64} />,
      title: '未授权访问',
      message: '您需要先登录才能访问此页面。',
      code: 401,
      color: 'text-blue-500',
    },
    [ErrorType.FORBIDDEN]: {
      icon: <ShieldAlertIcon size={64} />,
      title: '禁止访问',
      message: '您没有权限访问此页面。',
      code: 403,
      color: 'text-red-500',
    },
    [ErrorType.SERVER_ERROR]: {
      icon: <ServerIcon size={64} />,
      title: '服务器错误',
      message: '服务器遇到了一个错误，请稍后再试。',
      code: 500,
      color: 'text-red-600',
    },
    [ErrorType.NETWORK_ERROR]: {
      icon: <AlertCircleIcon size={64} />,
      title: '网络错误',
      message: '网络连接失败，请检查您的网络设置。',
      code: 0,
      color: 'text-orange-500',
    },
    [ErrorType.MAINTENANCE]: {
      icon: <SparklesIcon size={64} />,
      title: '系统维护中',
      message: '系统正在进行维护，请稍后再访问。',
      code: 503,
      color: 'text-purple-500',
    },
    [ErrorType.SERVICE_UNAVAILABLE]: {
      icon: <AlertCircleIcon size={64} />,
      title: '服务不可用',
      message: '请求的服务暂时不可用，请稍后再试。',
      code: 503,
      color: 'text-orange-600',
    },
    [ErrorType.BAD_GATEWAY]: {
      icon: <ServerIcon size={64} />,
      title: '网关错误',
      message: '代理服务器收到了无效的响应。',
      code: 502,
      color: 'text-red-500',
    },
    [ErrorType.TIMEOUT]: {
      icon: <AlertCircleIcon size={64} />,
      title: '请求超时',
      message: '服务器响应超时，请稍后再试。',
      code: 408,
      color: 'text-orange-500',
    },
    [ErrorType.GENERIC]: {
      icon: <AlertCircleIcon size={64} />,
      title: '发生错误',
      message: '操作过程中发生了错误，请稍后再试。',
      code: 0,
      color: 'text-gray-500',
    },
  };

  // 获取当前错误配置
  const config = errorConfigs[type];
  
  // 使用自定义值或配置值
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displayCode = code || config.code;
  const displayColor = config.color;

  // 处理返回上一页
  const handleGoBack = () =
    router.back();

  // 处理返回首页
  const handleGoHome = () =
    router.push('/');

  // 动画配置
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 ${className}`}
      data-testid={testId}
    >
      <div className="w-full max-w-md text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 错误图标 */}
          <motion.div
            variants={itemVariants}
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg ${displayColor}`}
          >
            {config.icon}
          </motion.div

          {/* 错误代码 */}
          {displayCode !== 0 && (
            <motion.div
              variants={itemVariants}
              className="text-9xl font-bold text-gray-200 dark:text-gray-700"
            >
              {displayCode}
            </motion.div
          )}

          {/* 错误标题 */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-2xl font-bold text-gray-900 dark:text-white"
          >
            {displayTitle}
          </motion.h1

          {/* 错误消息 */}
          <motion.p
            variants={itemVariants}
            className="mt-2 text-base text-gray-600 dark:text-gray-300"
          >
            {displayMessage}
          </motion.p

          {/* 错误详情（如果有） */}
          {message && message !== config.message && (
            <motion.div
              variants={itemVariants}
              className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-left text-sm"
            >
              {message}
            </motion.div
          )}

          {/* 操作按钮 */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            {/* 返回上一页按钮 */}
            <Button
              onClick={handleGoBack}
              className="flex items-center justify-center space-x-2"
              variant="secondary"
            >
              <ArrowLeftIcon size={16} />
              <span>{backButtonText}</span
            </Button

            {/* 返回首页按钮 */}
            {showHomeButton && (
              <Button
                onClick={handleGoHome}
                className="flex items-center justify-center"
              >
                返回首页
              </Button
            )}

            {/* 额外按钮 */}
            {extraButton && (
              <Button
                onClick={() => router.push(extraButton.href)}
                className="flex items-center justify-center"
                variant={extraButton.variant || 'primary'}
              >
                {extraButton.text}
              </Button
            )}

            {/* 自定义链接按钮 */}
            {backLink && (
              <Button
                onClick={() => router.push(backLink)}
                className="flex items-center justify-center"
                variant="secondary"
              >
                前往指定页面
              </Button
            )}
          </motion.div

          {/* 搜索建议 */}
          {type === ErrorType.NOT_FOUND && (
            <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                您可以尝试以下操作：
              </p
              <div className="flex justify-center space-x-4"
                >
                <a
                  href="/search"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  搜索内容
                </a
                <a
                  href="/sitemap"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  网站地图
                </a
              </div
            </motion.div
          )}

          {/* 登录建议 */}
          {(type === ErrorType.UNAUTHORIZED || type === ErrorType.FORBIDDEN) && (
            <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                登录账户
              </a
            </motion.div
          )}
        </motion.div

        {/* 页脚链接 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>如果问题持续存在，请联系 <a href="/support" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">技术支持</a></p
          <p className="mt-2">© 2024 双导管理系统. 保留所有权利。</p
        </motion.div
      </div
    </div
  );
};

/**
 * 404错误页面组件
 */
export const NotFoundError: React.FC<Omit<ErrorPageProps, 'type' | 'code'>> = (props) => (
  <ErrorPage
    type={ErrorType.NOT_FOUND}
    code={404}
    {...props}
  />
);

/**
 * 401未授权错误页面组件
 */
export const UnauthorizedError: React.FC<Omit<ErrorPageProps, 'type' | 'code'>> = (props) => (
  <ErrorPage
    type={ErrorType.UNAUTHORIZED}
    code={401}
    extraButton={{
      text: '前往登录',
      href: '/login',
      variant: 'primary'
    }}
    {...props}
  />
);

/**
 * 403禁止访问错误页面组件
 */
export const ForbiddenError: React.FC<Omit<ErrorPageProps, 'type' | 'code'>> = (props) => (
  <ErrorPage
    type={ErrorType.FORBIDDEN}
    code={403}
    {...props}
  />
);

/**
 * 500服务器错误页面组件
 */
export const ServerError: React.FC<Omit<ErrorPageProps, 'type' | 'code'>> = (props) => (
  <ErrorPage
    type={ErrorType.SERVER_ERROR}
    code={500}
    {...props}
  />
);

/**
 * 网络错误页面组件
 */
export const NetworkError: React.FC<Omit<ErrorPageProps, 'type'>> = (props) => (
  <ErrorPage
    type={ErrorType.NETWORK_ERROR}
    {...props}
  />
);

/**
 * 系统维护页面组件
 */
export const MaintenanceError: React.FC<Omit<ErrorPageProps, 'type' | 'code'>> = (props) => (
  <ErrorPage
    type={ErrorType.MAINTENANCE}
    code={503}
    {...props}
  />
);

// 默认导出错误页面组件
export default ErrorPage;
