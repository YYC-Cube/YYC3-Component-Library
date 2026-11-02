'use client'

/**
 * @file 开发者门户页面
 * @description 为开发者提供API文档、SDK下载和使用示例
 * @module app/developer/page
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * 开发者门户页面组件
 */
export default function DeveloperPortal() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* 导航栏 */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              YYC³ Easy❤️AI
            </span>
            <span className="text-sm font-medium text-gray-500">开发者门户</span>
          </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">开发者门户</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过我们的API和SDK，轻松集成AI能力到您的应用中
          </p>
        </div>
        
        {/* 快速链接 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Link href="#documentation" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">API 文档</h3>
            <p className="text-gray-600">详细的API接口说明和参数文档</p>
          </Link>
          <Link href="#sdk" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">SDK 下载</h3>
            <p className="text-gray-600">多语言SDK支持，快速集成开发</p>
          </Link>
          <Link href="#examples" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">示例代码</h3>
            <p className="text-gray-600">丰富的集成示例，快速上手</p>
          </Link>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 YYC³ Easy❤️AI. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
}
