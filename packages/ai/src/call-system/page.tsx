/**
 * @file 智能呼叫系统主页面
 * @description 智能呼叫系统的核心管理界面，提供呼叫管理、客户管理、对话管理等功能入口
 * @module call-system
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Phone, Users, MessageSquare, BarChart3, Settings, Plus, PlayCircle, TrendingUp, AlertCircle } from 'lucide-react';

// 模拟呼叫统计数据
const callStatsData = [
  { name: '周一', 已完成: 120, 失败: 20, 未接通: 30 },
  { name: '周二', 已完成: 190, 失败: 15, 未接通: 25 },
  { name: '周三', 已完成: 150, 失败: 18, 未接通: 32 },
  { name: '周四', 已完成: 200, 失败: 12, 未接通: 28 },
  { name: '周五', 已完成: 180, 失败: 22, 未接通: 35 },
  { name: '周六', 已完成: 90, 失败: 10, 未接通: 20 },
  { name: '周日', 已完成: 80, 失败: 8, 未接通: 15 },
];

// 模拟最近呼叫记录
const recentCalls = [
  { id: 1, customer: '张三', phone: '138****1234', status: '已完成', duration: '2分30秒', time: '2024-10-15 14:30' },
  { id: 2, customer: '李四', phone: '139****5678', status: '失败', duration: '1分15秒', time: '2024-10-15 14:25' },
  { id: 3, customer: '王五', phone: '137****9012', status: '未接通', duration: '0分30秒', time: '2024-10-15 14:20' },
  { id: 4, customer: '赵六', phone: '136****3456', status: '已完成', duration: '3分45秒', time: '2024-10-15 14:15' },
];

/**
 * 智能呼叫系统主页面组件
 */
export default function CallSystemPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">智能呼叫系统</h1>
          <p className="text-muted-foreground">高效管理自动呼叫任务、客户信息和对话流程</p>
        </div>

        {/* 核心功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总呼叫数</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,258</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> 12.5%
                </span>
                {' '}较上周
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成功呼叫</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">987</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> 8.2%
                </span>
                {' '}较上周
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活跃客户</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,543</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> 5.8%
                </span>
                {' '}较上周
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成功率</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> -1.2%
                </span>
                {' '}较上周
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 呼叫统计图表 */}
        <Card>
          <CardHeader>
            <CardTitle>呼叫统计</CardTitle>
            <CardDescription>过去7天的呼叫情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={callStatsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="已完成" fill="#10b981" />
                  <Bar dataKey="失败" fill="#ef4444" />
                  <Bar dataKey="未接通" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 主要功能区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 最近呼叫记录 */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>最近呼叫记录</CardTitle>
                <CardDescription>查看最近的呼叫详情</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                查看全部
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{call.customer}</p>
                        <p className="text-sm text-muted-foreground">{call.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${call.status === '已完成' ? 'text-green-600' : call.status === '失败' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {call.status}
                        </p>
                        <p className="text-xs text-muted-foreground">{call.duration}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{call.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 功能快捷入口 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用功能快速访问</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  创建呼叫任务
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  执行呼叫任务
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  管理客户信息
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  设计对话流程
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  系统设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 系统状态 */}
        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>智能呼叫系统各模块运行状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>呼叫服务</span>
                </div>
                <span className="text-sm text-muted-foreground">运行正常</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>语音识别</span>
                </div>
                <span className="text-sm text-muted-foreground">运行正常</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>语音合成</span>
                </div>
                <span className="text-sm text-muted-foreground">运行正常</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>数据库</span>
                </div>
                <span className="text-sm text-muted-foreground">运行正常</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
