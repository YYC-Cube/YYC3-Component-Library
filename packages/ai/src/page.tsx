/**
 * @file 智能呼叫系统主页
 * @description YYC³智能呼叫系统主页面，提供系统入口和快速导航
 * @module page
 * @author YYC³
 * @version 1.0.0
 * @created 2025-02-03
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Users, MessageSquare, BarChart3, Settings, ArrowRight, Shield, Zap, Headphones } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950 text-white">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <nav className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-10 w-48 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center text-xl font-bold">
                    YYC³ 智能呼叫系统
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/call-system">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    进入系统
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              YYC³ <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">智能呼叫系统</span>
            </h1>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto mb-8">
              集成自动语音呼叫、语音识别、语音合成和对话管理的智能通信平台，为企业提供高效、稳定、可扩展的智能呼叫解决方案
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/call-system">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8">
                  立即开始
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                了解更多
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">呼叫管理</CardTitle>
                  <CardDescription className="text-blue-100/70">
                    创建、执行、监控和管理自动呼叫任务
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-blue-100/80 space-y-2">
                    <li>• 批量呼叫支持</li>
                    <li>• 定时呼叫任务</li>
                    <li>• 实时状态监控</li>
                    <li>• 呼叫记录导出</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">客户管理</CardTitle>
                  <CardDescription className="text-blue-100/70">
                    高效管理客户信息、分组和标签
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-blue-100/80 space-y-2">
                    <li>• 客户信息管理</li>
                    <li>• 客户分组管理</li>
                    <li>• 标签分类系统</li>
                    <li>• 批量导入导出</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">对话管理</CardTitle>
                  <CardDescription className="text-blue-100/70">
                    可视化设计对话流程和话术模板
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-blue-100/80 space-y-2">
                    <li>• 可视化流程设计</li>
                    <li>• 对话意图管理</li>
                    <li>• 话术模板库</li>
                    <li>• 多轮对话支持</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-white">统计分析</CardTitle>
                  <CardDescription className="text-blue-100/70">
                    全面的数据统计和可视化报表
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-blue-100/80 space-y-2">
                    <li>• 呼叫数据统计</li>
                    <li>• 客户数据分析</li>
                    <li>• 对话效果分析</li>
                    <li>• 可视化报表</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">技术优势</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white">高性能</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100/80">
                    采用先进的微服务架构，支持高并发呼叫处理，确保系统稳定性和响应速度
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-pink-400" />
                  </div>
                  <CardTitle className="text-white">安全可靠</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100/80">
                    完善的认证授权机制，数据加密传输，保障客户信息和通话数据的安全
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6 text-yellow-400" />
                  </div>
                  <CardTitle className="text-white">智能交互</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100/80">
                    集成阿里云语音识别和语音合成，支持自然语言理解和智能对话
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">开始使用</h2>
            <p className="text-xl text-blue-100/80 mb-8">
              立即体验YYC³智能呼叫系统，提升您的客户服务效率
            </p>
            <Link href="/call-system">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-12">
                进入智能呼叫系统
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <footer className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-md border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-blue-100/80">
              © 2025 YanYu Cloud | 言语云³ | YYC³智能呼叫系统 v1.0.0
            </p>
            <p className="text-blue-100/60 text-sm mt-2">
              联系邮箱: <admin@0379.email>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
