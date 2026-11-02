/**
 * @file Root Layout组件
 * @description 应用程序的根布局，包含全局配置和样式
 * @module app/layout
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// 使用Inter字体
const inter = Inter({ subsets: ['latin'] });

// 配置应用元数据
export const metadata: Metadata = {
  title: 'YYC³ Easy❤️AI',
  description: '多行业AI智能工具平台',
};

/**
 * 根布局组件
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}