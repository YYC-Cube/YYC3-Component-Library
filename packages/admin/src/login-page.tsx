/**
 * @file 登录页面组件
 * @description 提供用户登录功能，包含表单验证、错误处理和登录状态管理
 * @module components
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// 登录表单模式
type LoginFormMode = 'password' | 'otp';

// 登录表单数据接口
const LoginFormSchema = z.object({
  username: z.string()
    .min(1, '用户名不能为空')
    .max(50, '用户名最多50个字符'),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(50, '密码最多50个字符'),
  rememberMe: z.boolean().default(false),
  otp: z.string().optional()
    .refine((val) => val === undefined || val.length === 6, '验证码必须是6位数字'),
    .optional()
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

/**
 * 登录页面组件
 */
export const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formMode, setFormMode] = useState<LoginFormMode>('password');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 使用React Hook Form处理表单
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
      otp: undefined
    }
  });

  // 处理路由参数中的消息
  useEffect(() => {
    const params = router.query;
    if (params.logout === 'success') {
      setSuccessMessage('您已成功登出');
      setShowSuccess(true);
      // 3秒后隐藏成功消息
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    if (params.reset === 'success') {
      setSuccessMessage('密码重置成功，请使用新密码登录');
      setShowSuccess(true);
      // 3秒后隐藏成功消息
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  // 处理登录提交
  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      setLocalError(null);
      
      // 调用登录服务
      await login({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe
      });

      // 登录成功，跳转到指定页面或首页
      const returnUrl = router.query.returnUrl as string;
      router.replace(returnUrl || '/');
    } catch (error) {
      console.error('登录失败:', error);
      
      // 处理特殊错误情况
      const errorMessage = error instanceof Error ? error.message : '登录失败，请检查您的凭据';
      
      // 检查是否需要OTP验证
      if (errorMessage.includes('需要验证码') || errorMessage.includes('OTP')) {
        setFormMode('otp');
      } else {
        setLocalError(errorMessage);
      }
    }
  }, [login, router]);

  // 处理OTP提交
  const handleOtpSubmit = useCallback(async (data: LoginFormData) => {
    try {
      setLocalError(null);
      
      // 这里可以添加OTP验证逻辑
      // await loginWithOtp(data.username, data.password, data.otp || '');
      
      // 演示用：登录成功，跳转到指定页面或首页
      const returnUrl = router.query.returnUrl as string;
      router.replace(returnUrl || '/');
    } catch (error) {
      console.error('OTP验证失败:', error);
      const errorMessage = error instanceof Error ? error.message : '验证码错误，请重试';
      setLocalError(errorMessage);
    }
  }, [router]);

  // 切换密码可见性
  const togglePasswordVisibility = () =
    setShowPassword(!showPassword);

  // 切换回密码登录模式
  const switchToPasswordMode = () =
    setFormMode('password');

  // 表单动画配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // 合并错误信息
  const displayError = authError || localError;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4"
          >
            <LockIcon size={32} />
          </motion.div
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            欢迎回来
          </h1
          <p className="text-gray-600 dark:text-gray-300">
            请登录您的账户以继续
          </p
        </div

        {/* 成功消息 */}
        {showSuccess && successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              >
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div
        )}

        {/* 错误消息 */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <Alert className="bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              >
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          </motion.div
        )}

        {/* 登录表单卡片 */}
        <Card className="border-0 shadow-xl dark:bg-gray-800 dark:shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-center">用户登录</CardTitle
            <CardDescription className="text-center">
              输入您的凭据以访问您的账户
            </CardDescription
          </CardHeader

          <CardContent>
            <Form {...form}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* 用户名输入 */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="username">用户名</FormLabel
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div
                        <FormControl>
                          <Input
                            id="username"
                            placeholder="请输入用户名"
                            className="pl-10"
                            {...field}
                            disabled={authLoading}
                          />
                        </FormControl
                        <FormMessage />
                      </div
                    </FormItem
                  )}
                /

                {/* 密码输入 */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="password">密码</FormLabel
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div
                        <FormControl>
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="请输入密码"
                            className="pl-10 pr-10"
                            {...field}
                            disabled={authLoading}
                          />
                        </FormControl
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          disabled={authLoading}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-400 dark:text-gray-500"
                              /
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500"
                              /
                          )}
                        </button
                        <FormMessage />
                      </div
                    </FormItem
                  )}
                /

                {/* OTP验证码输入 - 仅在OTP模式下显示 */}
                {formMode === 'otp' && (
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="otp">验证码 (OTP)</FormLabel
                        <div className="relative">
                          <FormControl>
                            <Input
                              id="otp"
                              type="text"
                              placeholder="请输入6位验证码"
                              className="pl-3 pr-3"
                              {...field}
                              disabled={authLoading}
                              inputMode="numeric"
                              maxLength={6}
                            />
                          </FormControl
                          <FormMessage />
                        </div
                      </FormItem
                    )}
                  /
                )}

                {/* 记住我复选框 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl className="sr-only">
                            <Checkbox
                              id="remember-me"
                              {...field}
                              disabled={authLoading}
                            />
                          </FormControl
                          <Label htmlFor="remember-me" className="text-sm font-medium">
                            记住我
                          </Label
                        </FormItem
                      )}
                    /
                  </div
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    忘记密码?
                  </a
                </div
              </motion.div

              {/* 提交按钮 */}
              <CardFooter className="pt-4 pb-0">
                <Button
                  type="submit"
                  onClick={() => form.handleSubmit(formMode === 'otp' ? handleOtpSubmit : onSubmit)()}
                  disabled={authLoading}
                  className="w-full py-6 text-base"
                >
                  {authLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div
                      登录中...
                    </div
                  ) : formMode === 'otp' ? (
                    '验证验证码'
                  ) : (
                    '登录'
                  )}
                </Button
              </CardFooter
            </Form
          </CardContent
        </Card

        {/* 切换登录模式按钮 - 仅在OTP模式下显示 */}
        {formMode === 'otp' && (
          <div className="mt-4 text-center"
            >
            <Button
              type="button"
              variant="ghost"
              onClick={switchToPasswordMode}
              disabled={authLoading}
              className="text-sm"
            >
              返回密码登录
            </Button
          </div
        )}

        {/* 注册链接 */}
        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            还没有账户?
            <a
              href="/register"
              className="ml-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              立即注册
            </a
          </span
        </div

        {/* 其他登录选项 */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div
            </div
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                或通过以下方式登录
              </span
            </div
          </div
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={authLoading}
              className="flex items-center justify-center"
            >
              {/* 这里可以放置第三方登录图标 */}
              <span className="text-xs">企业微信</span>
            </Button
            <Button
              type="button"
              variant="secondary"
              disabled={authLoading}
              className="flex items-center justify-center"
            >
              {/* 这里可以放置第三方登录图标 */}
              <span className="text-xs">钉钉</span>
            </Button
            <Button
              type="button"
              variant="secondary"
              disabled={authLoading}
              className="flex items-center justify-center"
            >
              {/* 这里可以放置第三方登录图标 */}
              <span className="text-xs">扫码</span>
            </Button
          </div
        </div

        {/* 页脚链接 */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 mx-2">隐私政策</a
          <a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 mx-2">服务条款</a
          <a href="/help" className="hover:text-gray-700 dark:hover:text-gray-300 mx-2">帮助中心</a
          <span className="block mt-2">© 2024 双导管理系统. 保留所有权利。</span
        </div
      </div
    </div
  );
};

export default LoginPage;
