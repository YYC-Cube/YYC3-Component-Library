'use client';

import { useState } from 'react';
import { Button } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@yyc3/ui-enterprise';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Network, 
  Brain, 
  ShoppingCart, 
  Database, 
  Settings, 
  Users,
  Globe,
  Bell,
  User,
  LogOut,
  Menu,
  Activity,
  Factory,
  Store
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  language: 'zh' | 'en';
  onLanguageChange: (lang: 'zh' | 'en') => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout?: () => void;
}

export function DashboardLayout({ children, language, onLanguageChange, currentPage, onPageChange, onLogout }: DashboardLayoutProps) {
  const content = {
    zh: {
      nav: {
        core: '核心功能',
        ai: 'AI智能',
        system: '系统管理',
        user: '用户中心'
      },
      pages: {
        dashboard: '仪表板',
        factory: 'AI模型工厂',
        backtesting: 'AI交易模型回测',
        factors: '因子市场',
        signals: 'AI信号',
        knowledge: '知识图谱',
        copilot: 'AI Copilot',
        market: 'AI模型市场',
        datamarket: '数据市场',
        data: '数据管理',
        settings: '系统设置',
        community: '会员中心'
      },
      userMenu: {
        profile: '个人资料',
        notifications: '通知中心',
        logout: '退出登录'
      }
    },
    en: {
      nav: {
        core: 'Core Functions',
        ai: 'AI Intelligence',
        system: 'System Management',
        user: 'User Center'
      },
      pages: {
        dashboard: 'Dashboard',
        factory: 'AI Model Factory',
        backtesting: 'AI Model Backtesting',
        factors: 'Factor Market',
        signals: 'AI Signals',
        knowledge: 'Knowledge Graph',
        copilot: 'AI Copilot',
        market: 'AI Model Market',
        datamarket: 'Data Market',
        data: 'Data Management',
        settings: 'Settings',
        community: 'Member Center'
      },
      userMenu: {
        profile: 'Profile',
        notifications: 'Notifications',
        logout: 'Logout'
      }
    }
  };

  const t = content[language];

  const navigationItems = [
    {
      group: t.nav.core,
      items: [
        { key: 'dashboard', label: t.pages.dashboard, icon: BarChart3, color: 'text-blue-400' },
        { key: 'factory', label: t.pages.factory, icon: Factory, color: 'text-green-400' },
        { key: 'backtesting', label: t.pages.backtesting, icon: Target, color: 'text-orange-400' }
      ]
    },
    {
      group: t.nav.ai,
      items: [
        { key: 'factors', label: t.pages.factors, icon: Zap, color: 'text-purple-400' },
        { key: 'signals', label: t.pages.signals, icon: Activity, color: 'text-pink-400' },
        { key: 'knowledge', label: t.pages.knowledge, icon: Network, color: 'text-cyan-400' },
        { key: 'copilot', label: t.pages.copilot, icon: Brain, color: 'text-indigo-400' },
        { key: 'market', label: t.pages.market, icon: ShoppingCart, color: 'text-emerald-400' },
        { key: 'datamarket', label: t.pages.datamarket, icon: Store, color: 'text-teal-400' }
      ]
    },
    {
      group: t.nav.system,
      items: [
        { key: 'data', label: t.pages.data, icon: Database, color: 'text-slate-400' },
        { key: 'settings', label: t.pages.settings, icon: Settings, color: 'text-gray-400' }
      ]
    },
    {
      group: t.nav.user,
      items: [
        { key: 'community', label: t.pages.community, icon: Users, color: 'text-yellow-400' }
      ]
    }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-900">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-700 bg-slate-800/50">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  chaincoven
                </span>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                  Pro
                </Badge>
              </div>
            </div>

            {/* Navigation */}
            {navigationItems.map((group, groupIndex) => (
              <SidebarGroup key={groupIndex}>
                <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider">
                  {group.group}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.key;
                      
                      return (
                        <SidebarMenuItem key={item.key}>
                          <SidebarMenuButton
                            onClick={() => onPageChange(item.key)}
                            className={`w-full justify-start transition-all duration-200 ${
                              isActive 
                                ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-400' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-400' : item.color}`} />
                            {item.label}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden text-slate-300 hover:text-white">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl text-white">
                {t.pages[currentPage as keyof typeof t.pages]}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Globe className="w-4 h-4 mr-1" />
                {language === 'zh' ? '中' : 'EN'}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 relative"
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm text-white">VIP用户</p>
                  <p className="text-xs text-slate-400">premium@chaincoven.com</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  title={t.userMenu.logout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 bg-slate-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}