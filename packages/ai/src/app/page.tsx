/**
 * @file 首页组件
 * @description 应用程序的主页面
 * @module app/page
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-16
 */

'use client';
import React from 'react';
import Link from 'next/link';

/**
 * 首页组件 - YYC³ Easy❤️AI应用入口
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
      {/* 红色心形图标 */}
      <div className="mb-12">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      {/* 标题 */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12">
        YYC³ Easy❤️AI
      </h1>

      {/* 按钮组 */}
      <div className="flex flex-wrap justify-center gap-6">
        <Link 
          href="/tools"
          className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105"
          aria-label="开始使用"
        >
          开始使用
        </Link>
        <Link 
          href="/IntegratedDocs/01-项目概览/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg shadow-lg hover:bg-white/10 transition-colors duration-300 transform hover:scale-105"
          aria-label="了解更多"
        >
          了解更多
        </Link>
      </div>

      {/* 添加简单的动画效果 */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <div className="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </main>
  );
}