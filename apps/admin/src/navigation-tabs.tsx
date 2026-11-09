/**
 * @file 导航标签组件
 * @description 提供应用内导航功能，包含各种功能模块的入口
 * @module navigation
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  ChevronDown,
  Code,
  FileText,
  Home,
  LineChart,
  ListTodo,
  MessageSquare,
  PieChart,
  Settings,
  Star,
  Users,
  UserRound,
  Zap,
  Search,
  Menu,
  X
} from 'lucide-react';

import {
  Button
} from '@/components/ui/button';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Input
} from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// 导航项类型定义
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  badge?: number;
}

// 导航分组类型定义
interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

/**
 * 导航标签组件
 */
const NavigationTabs: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavGroup, setActiveNavGroup] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // 导航分组数据
  const navGroups: NavGroup[] = [
    {
      id: 'dashboard',
      title: '仪表盘',
      items: [
        { id: 'overview', label: '概览', icon: <Home size={20} />, route: '/' },
        { id: 'analytics', label: '数据分析', icon: <BarChart3 size={20} />, route: '/analytics' },
        { id: 'performance', label: '绩效指标', icon: <LineChart size={20} />, route: '/performance' },
        { id: 'statistics', label: '统计分析', icon: <PieChart size={20} />, route: '/statistics' },
      ],
    },
    {
      id: 'management',
      title: '管理中心',
      items: [
        { id: 'tasks', label: '任务管理', icon: <ListTodo size={20} />, route: '/tasks' },
        { id: 'employees', label: '员工管理', icon: <Users size={20} />, route: '/employees' },
        { id: 'departments', label: '部门管理', icon: <Briefcase size={20} />, route: '/departments' },
        { id: 'announcements', label: '公告管理', icon: <FileText size={20} />, route: '/announcements' },
      ],
    },
    {
      id: 'communication',
      title: '沟通协作',
      items: [
        { id: 'messages', label: '消息中心', icon: <MessageSquare size={20} />, route: '/messages', badge: 5 },
        { id: 'notifications', label: '通知提醒', icon: <Bell size={20} />, route: '/notifications', badge: 12 },
        { id: 'calendar', label: '日程安排', icon: <Calendar size={20} />, route: '/calendar' },
      ],
    },
    {
      id: 'personal',
      title: '个人中心',
      items: [
        { id: 'profile', label: '个人资料', icon: <UserRound size={20} />, route: '/profile' },
        { id: 'planning', label: '个人规划', icon: <Star size={20} />, route: '/planning' },
        { id: 'learning', label: '学习中心', icon: <Code size={20} />, route: '/learning' },
        { id: 'settings', label: '设置', icon: <Settings size={20} />, route: '/settings' },
      ],
    },
  ];

  // 过滤导航项
  const filteredGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // 渲染导航项
  const renderNavItem = (item: NavItem) => (
    <div
      key={item.id}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 group"
    >
      <div className="text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary">
        {item.icon}
      </div>
      <span className="text-sm font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          {item.badge}
        </span>
      )}
    </div>
  );

  // 移动端菜单
  const MobileMenu = () => (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">导航菜单</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(false)}
          className="rounded-full"
        >
          <X size={24} />
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="搜索导航项..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredGroups.map(group => (
          <div key={group.id}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-4">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* 桌面端导航 */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="flex flex-col h-full">
            {/* 搜索框 */}
            <div className="relative p-4">
              <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="搜索功能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-0"
              />
            </div>

            {/* 导航分组 */}
            <Tabs defaultValue="dashboard" className="flex-1" onValueChange={setActiveNavGroup}>
              <TabsList className="w-full flex justify-start overflow-x-auto p-1 bg-transparent border-b">
                {navGroups.map(group => (
                  <TabsTrigger
                    key={group.id}
                    value={group.id}
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md"
                  >
                    {group.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="p-2">
                {navGroups.map(group => (
                  <TabsContent
                    key={group.id}
                    value={group.id}
                    className="space-y-1 pt-2 focus-visible:outline-none focus-visible:ring-0"
                  >
                    {filteredGroups.find(g => g.id === group.id)?.items.map(renderNavItem) || (
                      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        没有找到匹配的导航项
                      </div>
                    )}
                  </TabsContent>
                ))}
              </div>
            </Tabs>

            {/* 用户信息 */}
            <div className="p-4 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="relative mr-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserRound size={16} className="text-primary" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                    </div>
                    <span className="text-sm font-medium">张三</span>
                    <ChevronDown size={16} className="ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>个人资料</DropdownMenuItem>
                  <DropdownMenuItem>设置</DropdownMenuItem>
                  <DropdownMenuItem>帮助中心</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">退出登录</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 移动端导航触发器 */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-full"
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-lg font-bold">双导管理系统</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell size={24} />
        </Button>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && <MobileMenu />}
    </div>
  );
};

export default NavigationTabs;