/**
 * @file 登录页面组件
 * @description 用户登录页面，提供账号密码登录功能
 * @module app/login/page
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

'use client';
import React, { useState } from 'react';

/**
 * 登录页面组件
 */
export default function LoginPage() {
  // 表单状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({});
  
  // 邮箱验证函数
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setValidationErrors(prev => ({ ...prev, email: isValid ? undefined : '请输入有效的邮箱地址' }));
    return isValid;
  };
  
  // 密码验证函数
  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setValidationErrors(prev => ({ ...prev, password: '密码长度至少6位' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, password: undefined }));
    return true;
  };
  
  // 验证所有字段
  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  };

  // 处理登录表单提交
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 执行表单验证
      if (!validateForm()) {
        throw new Error('请修正表单中的错误');
      }
      
      // 这里可以添加实际的登录逻辑
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 登录成功后的处理
      console.log('登录成功', { email });
      window.location.href = '/tools'; // 登录成功后跳转到工具页面
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-800">
        {/* 红色心形图标 */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-2xl font-bold text-white text-center mb-6">登录 YYC³ Easy❤️AI</h1>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-900/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-2">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (value) validateEmail(value);
            }}
              placeholder="请输入邮箱"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${validationErrors.email ? 'border-red-500' : 'border-gray-700'}`}
              aria-invalid={!!validationErrors.email}
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
            />
              {validationErrors.email && (
                <p id="email-error" className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
              )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-400 text-sm mb-2">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              if (value) validatePassword(value);
            }}
              placeholder="请输入密码"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${validationErrors.password ? 'border-red-500' : 'border-gray-700'}`}
              aria-invalid={!!validationErrors.password}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
            />
              {validationErrors.password && (
                <p id="password-error" className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
              )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        {/* 其他选项 */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">忘记密码？</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">注册账号</a>
        </div>
      </div>

      {/* 底部链接 */}
      <div className="mt-8 text-center">
        <a href="/" className="text-gray-500 hover:text-gray-300 text-sm">
          返回首页
        </a>
      </div>
    </main>
  );
}
