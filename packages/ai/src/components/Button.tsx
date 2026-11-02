/**
 * @file 按钮组件
 * @description 提供可复用的按钮组件
 * @component
 * @module components/Button
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import React from 'react';

interface ButtonProps {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 按钮点击事件 */
  onClick?: () => void;
  /** 按钮内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  type = 'button',
}) => {
  // 变体样式映射
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    accent: 'bg-accent text-white hover:bg-accent/90',
    neutral: 'bg-neutral text-neutral-foreground hover:bg-neutral/90',
  };

  // 尺寸样式映射
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // 基础样式
  const baseStyles = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

  // 禁用样式
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  // 组合所有样式
  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled || loading ? disabledStyles : '',
    className,
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;