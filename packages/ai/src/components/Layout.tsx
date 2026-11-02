/**
 * @file 布局组件
 * @description 提供统一的页面布局结构
 * @component
 * @module components/Layout
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import React, { ReactNode } from 'react';

interface LayoutProps {
  /** 页面标题 */
  title?: string;
  /** 页面内容 */
  children: ReactNode;
  /** 是否显示侧边栏 */
  showSidebar?: boolean;
  /** 自定义类名 */
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  showSidebar = true,
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* 页面头部 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              YYC
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title || 'YYC³ Easy❤️AI'}
            </h1>
          </div>
          
          {/* 头部右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 后续可以添加用户头像、通知等组件 */}
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 YYC³ Easy❤️AI. 多行业AI智能工具平台。</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;