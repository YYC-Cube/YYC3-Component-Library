'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Label } from '@yyc3/ui-enterprise';
import { Separator } from '@yyc3/ui-enterprise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui-enterprise';
import { 
  ArrowLeft, 
  Globe, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome,
  Shield,
  CheckCircle
} from 'lucide-react';

interface LoginPageProps {
  language: 'zh' | 'en';
  onLanguageChange: (lang: 'zh' | 'en') => void;
  onLogin: () => void;
  onBackToLanding: () => void;
}

export function LoginPage({ language, onLanguageChange, onLogin, onBackToLanding }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const content = {
    zh: {
      title: '加入 ChainCoven',
      subtitle: '开启您的AI量化交易之旅',
      login: {
        title: '登录',
        subtitle: '欢迎回来',
        emailLabel: '邮箱地址',
        emailPlaceholder: '请输入您的邮箱',
        passwordLabel: '密码',
        passwordPlaceholder: '请输入密码',
        rememberMe: '记住我',
        forgotPassword: '忘记密码？',
        loginButton: '登录',
        noAccount: '没有账户？',
        signUp: '立即注册'
      },
      register: {
        title: '注册',
        subtitle: '创建新账户',
        emailLabel: '邮箱地址',
        emailPlaceholder: '请输入您的邮箱',
        passwordLabel: '密码',
        passwordPlaceholder: '至少8位字符',
        confirmPasswordLabel: '确认密码',
        confirmPasswordPlaceholder: '再次输入密码',
        terms: '我同意',
        termsLink: '服务条款',
        and: '和',
        privacy: '隐私政策',
        registerButton: '创建账户',
        hasAccount: '已有账户？',
        signIn: '立即登录'
      },
      socialLogin: {
        title: '或使用以下方式',
        google: '使用 Google 继续',
        github: '使用 GitHub 继续'
      },
      features: [
        {
          icon: Shield,
          title: '银行级安全',
          description: '多重加密保护您的资产安全'
        },
        {
          icon: CheckCircle,
          title: '实时AI分析',
          description: '24/7智能监控市场动态'
        },
        {
          icon: Globe,
          title: '全球服务',
          description: '支持多个国家和地区'
        }
      ],
      backToHome: '返回首页'
    },
    en: {
      title: 'Join ChainCoven',
      subtitle: 'Start Your AI Quantitative Trading Journey',
      login: {
        title: 'Sign In',
        subtitle: 'Welcome back',
        emailLabel: 'Email Address',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        loginButton: 'Sign In',
        noAccount: "Don't have an account?",
        signUp: 'Sign up'
      },
      register: {
        title: 'Sign Up',
        subtitle: 'Create new account',
        emailLabel: 'Email Address',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'At least 8 characters',
        confirmPasswordLabel: 'Confirm Password',
        confirmPasswordPlaceholder: 'Enter password again',
        terms: 'I agree to the',
        termsLink: 'Terms of Service',
        and: 'and',
        privacy: 'Privacy Policy',
        registerButton: 'Create Account',
        hasAccount: 'Already have an account?',
        signIn: 'Sign in'
      },
      socialLogin: {
        title: 'Or continue with',
        google: 'Continue with Google',
        github: 'Continue with GitHub'
      },
      features: [
        {
          icon: Shield,
          title: 'Bank-level Security',
          description: 'Multi-layer encryption protects your assets'
        },
        {
          icon: CheckCircle,
          title: 'Real-time AI Analysis',
          description: '24/7 intelligent market monitoring'
        },
        {
          icon: Globe,
          title: 'Global Service',
          description: 'Supporting multiple countries and regions'
        }
      ],
      backToHome: 'Back to Home'
    }
  };

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={onBackToLanding}
                className="text-slate-400 hover:text-white p-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t.backToHome}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
                className="text-slate-300 hover:text-white"
              >
                <Globe className="w-4 h-4 mr-1" />
                {language === 'zh' ? '中' : 'EN'}
              </Button>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
            </div>
            <h1 className="text-2xl text-white mb-2">{t.title}</h1>
            <p className="text-slate-400">{t.subtitle}</p>
          </div>

          {/* Login/Register Tabs */}
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
                {t.login.title}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-blue-600">
                {t.register.title}
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t.login.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {t.login.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">
                        {t.login.emailLabel}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t.login.emailPlaceholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300">
                        {t.login.passwordLabel}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t.login.passwordPlaceholder}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 text-slate-300">
                        <input type="checkbox" className="rounded" />
                        <span>{t.login.rememberMe}</span>
                      </label>
                      <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                        {t.login.forgotPassword}
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {t.login.loginButton}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t.register.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {t.register.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-slate-300">
                        {t.register.emailLabel}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder={t.register.emailPlaceholder}
                          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-slate-300">
                        {t.register.passwordLabel}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t.register.passwordPlaceholder}
                          className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-slate-300">
                        {t.register.confirmPasswordLabel}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder={t.register.confirmPasswordPlaceholder}
                          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-sm text-slate-300">
                      <label className="flex items-start space-x-2">
                        <input type="checkbox" className="rounded mt-0.5" required />
                        <span>
                          {t.register.terms} <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">{t.register.termsLink}</Button> {t.register.and} <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">{t.register.privacy}</Button>
                        </span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {t.register.registerButton}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-400">{t.socialLogin.title}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={onLogin}
              >
                <Chrome className="w-4 h-4 mr-2" />
                {t.socialLogin.google}
              </Button>
              <Button
                variant="outline"
                className="w-full bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={onLogin}
              >
                <Github className="w-4 h-4 mr-2" />
                {t.socialLogin.github}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 items-center justify-center p-8">
        <div className="max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl text-white mb-4">为什么选择 ChainCoven？</h2>
            <p className="text-slate-300">
              全球领先的AI驱动量化交易平台，为您的投资决策提供智能支持
            </p>
          </div>

          <div className="space-y-6">
            {t.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}