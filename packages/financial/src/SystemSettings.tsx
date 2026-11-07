'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Label } from '@yyc3/ui-enterprise';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui-enterprise';
import { Switch } from '@yyc3/ui-enterprise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui-enterprise';
import { Textarea } from '@yyc3/ui-enterprise';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Key, 
  Globe, 
  Palette, 
  Database,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

interface SystemSettingsProps {
  language: 'zh' | 'en';
}

export function SystemSettings({ language }: SystemSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    trading: true,
    signals: true,
    news: false
  });

  const content = {
    zh: {
      title: '系统设置',
      subtitle: '管理您的账户和应用设置',
      tabs: {
        account: '账户设置',
        security: '安全设置',
        notifications: '通知设置',
        api: 'API设置',
        appearance: '外观设置',
        advanced: '高级设置'
      },
      account: {
        title: '账户信息',
        email: '邮箱地址',
        username: '用户名',
        displayName: '显示名称',
        bio: '个人简介',
        timezone: '时区',
        language: '语言',
        save: '保存更改'
      },
      security: {
        title: '安全设置',
        currentPassword: '当前密码',
        newPassword: '新密码',
        confirmPassword: '确认密码',
        twoFactor: '双重验证',
        twoFactorDesc: '启用双重验证以增强账户安全',
        sessionManagement: '会话管理',
        activeSessions: '活跃会话',
        changePassword: '更改密码',
        logoutAll: '注销所有设备'
      },
      notifications: {
        title: '通知偏好',
        email: '邮件通知',
        emailDesc: '接收重要更新和通知',
        push: '推送通知',
        pushDesc: '接收桌面和移动推送',
        sms: '短信通知',
        smsDesc: '接收重要提醒短信',
        trading: '交易通知',
        tradingDesc: '订单执行和交易状态',
        signals: '信号通知',
        signalsDesc: 'AI信号和预警',
        news: '新闻通知',
        newsDesc: '市场新闻和公告'
      },
      api: {
        title: 'API设置',
        apiKey: 'API密钥',
        apiKeyDesc: '用于第三方应用访问',
        webhooks: 'Webhook设置',
        webhookUrl: 'Webhook URL',
        rateLimit: '请求限制',
        rateLimitDesc: '每分钟最大请求数',
        regenerate: '重新生成',
        copy: '复制',
        copied: '已复制',
        testWebhook: '测试Webhook'
      },
      appearance: {
        title: '外观设置',
        theme: '主题',
        themeDesc: '选择您喜欢的界面主题',
        language: '界面语言',
        languageDesc: '选择界面显示语言',
        dateFormat: '日期格式',
        dateFormatDesc: '选择日期显示格式',
        currency: '默认货币',
        currencyDesc: '选择默认显示货币'
      },
      advanced: {
        title: '高级设置',
        dataRetention: '数据保留',
        dataRetentionDesc: '历史数据保留时间',
        exportData: '导出数据',
        exportDataDesc: '导出您的所有数据',
        deleteAccount: '删除账户',
        deleteAccountDesc: '永久删除您的账户和数据',
        dangerZone: '危险区域',
        export: '导出',
        delete: '删除账户'
      }
    },
    en: {
      title: 'System Settings',
      subtitle: 'Manage your account and application settings',
      tabs: {
        account: 'Account Settings',
        security: 'Security Settings',
        notifications: 'Notifications',
        api: 'API Settings',
        appearance: 'Appearance',
        advanced: 'Advanced'
      },
      account: {
        title: 'Account Information',
        email: 'Email Address',
        username: 'Username',
        displayName: 'Display Name',
        bio: 'Bio',
        timezone: 'Timezone',
        language: 'Language',
        save: 'Save Changes'
      },
      security: {
        title: 'Security Settings',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        twoFactor: 'Two-Factor Authentication',
        twoFactorDesc: 'Enable two-factor authentication for enhanced security',
        sessionManagement: 'Session Management',
        activeSessions: 'Active Sessions',
        changePassword: 'Change Password',
        logoutAll: 'Logout All Devices'
      },
      notifications: {
        title: 'Notification Preferences',
        email: 'Email Notifications',
        emailDesc: 'Receive important updates and notifications',
        push: 'Push Notifications',
        pushDesc: 'Receive desktop and mobile push notifications',
        sms: 'SMS Notifications',
        smsDesc: 'Receive important alerts via SMS',
        trading: 'Trading Notifications',
        tradingDesc: 'Order execution and trading status',
        signals: 'Signal Notifications',
        signalsDesc: 'AI signals and alerts',
        news: 'News Notifications',
        newsDesc: 'Market news and announcements'
      },
      api: {
        title: 'API Settings',
        apiKey: 'API Key',
        apiKeyDesc: 'For third-party application access',
        webhooks: 'Webhook Settings',
        webhookUrl: 'Webhook URL',
        rateLimit: 'Rate Limit',
        rateLimitDesc: 'Maximum requests per minute',
        regenerate: 'Regenerate',
        copy: 'Copy',
        copied: 'Copied',
        testWebhook: 'Test Webhook'
      },
      appearance: {
        title: 'Appearance Settings',
        theme: 'Theme',
        themeDesc: 'Choose your preferred interface theme',
        language: 'Interface Language',
        languageDesc: 'Choose interface display language',
        dateFormat: 'Date Format',
        dateFormatDesc: 'Choose date display format',
        currency: 'Default Currency',
        currencyDesc: 'Choose default display currency'
      },
      advanced: {
        title: 'Advanced Settings',
        dataRetention: 'Data Retention',
        dataRetentionDesc: 'Historical data retention period',
        exportData: 'Export Data',
        exportDataDesc: 'Export all your data',
        deleteAccount: 'Delete Account',
        deleteAccountDesc: 'Permanently delete your account and data',
        dangerZone: 'Danger Zone',
        export: 'Export',
        delete: 'Delete Account'
      }
    }
  };

  const t = content[language];

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk-1234567890abcdef...');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-800/50">
          <TabsTrigger value="account" className="data-[state=active]:bg-blue-600">
            {t.tabs.account}
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600">
            {t.tabs.security}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600">
            {t.tabs.notifications}
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-purple-600">
            {t.tabs.api}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-orange-600">
            {t.tabs.appearance}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-gray-600">
            {t.tabs.advanced}
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                {t.account.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t.account.email}</Label>
                  <Input
                    type="email"
                    defaultValue="user@chaincoven.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">{t.account.username}</Label>
                  <Input
                    defaultValue="quanttrader"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">{t.account.displayName}</Label>
                  <Input
                    defaultValue="Quant Trader"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">{t.account.timezone}</Label>
                  <Select defaultValue="asia/shanghai">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/shanghai">Asia/Shanghai</SelectItem>
                      <SelectItem value="america/new_york">America/New_York</SelectItem>
                      <SelectItem value="europe/london">Europe/London</SelectItem>
                      <SelectItem value="asia/tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.account.bio}</Label>
                <Textarea
                  placeholder="介绍一下您自己..."
                  className="bg-slate-700 border-slate-600 text-white resize-none"
                  rows={3}
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {t.account.save}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-400" />
                {t.security.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-white">{t.security.changePassword}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">{t.security.currentPassword}</Label>
                    <Input
                      type="password"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">{t.security.newPassword}</Label>
                    <Input
                      type="password"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">{t.security.confirmPassword}</Label>
                    <Input
                      type="password"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                  {t.security.changePassword}
                </Button>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white mb-1">{t.security.twoFactor}</h3>
                    <p className="text-slate-400 text-sm">{t.security.twoFactorDesc}</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white mb-1">{t.security.sessionManagement}</h3>
                    <p className="text-slate-400 text-sm">{t.security.activeSessions}: 3</p>
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    {t.security.logoutAll}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-green-400" />
                {t.notifications.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white mb-1">
                      {t.notifications[key as keyof typeof t.notifications]}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {t.notifications[`${key}Desc` as keyof typeof t.notifications]}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => handleNotificationChange(key as keyof typeof notifications)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 mr-2 text-purple-400" />
                {t.api.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">{t.api.apiKey}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.api.apiKeyDesc}</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value="sk-1234567890abcdef..."
                      readOnly
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="border-slate-600 text-slate-300"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyApiKey}
                      className="border-slate-600 text-slate-300"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t.api.regenerate}
                  </Button>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 space-y-4">
                <div>
                  <Label className="text-slate-300">{t.api.webhookUrl}</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      placeholder="https://your-webhook-url.com"
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                    />
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      {t.api.testWebhook}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">{t.api.rateLimit}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.api.rateLimitDesc}</p>
                  <Select defaultValue="1000">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                      <SelectItem value="1000">1000</SelectItem>
                      <SelectItem value="5000">5000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Palette className="w-5 h-5 mr-2 text-orange-400" />
                {t.appearance.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">{t.appearance.theme}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.appearance.themeDesc}</p>
                  <Select defaultValue="dark">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">{t.appearance.language}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.appearance.languageDesc}</p>
                  <Select defaultValue="zh">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">{t.appearance.dateFormat}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.appearance.dateFormatDesc}</p>
                  <Select defaultValue="yyyy-mm-dd">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">{t.appearance.currency}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.appearance.currencyDesc}</p>
                  <Select defaultValue="usd">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="cny">CNY</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="btc">BTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-400" />
                {t.advanced.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">{t.advanced.dataRetention}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.advanced.dataRetentionDesc}</p>
                  <Select defaultValue="1year">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3个月</SelectItem>
                      <SelectItem value="6months">6个月</SelectItem>
                      <SelectItem value="1year">1年</SelectItem>
                      <SelectItem value="forever">永久</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">{t.advanced.exportData}</Label>
                  <p className="text-slate-400 text-sm mb-2">{t.advanced.exportDataDesc}</p>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <Database className="w-4 h-4 mr-2" />
                    {t.advanced.export}
                  </Button>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-red-400 mb-2">{t.advanced.dangerZone}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">{t.advanced.deleteAccount}</Label>
                      <p className="text-slate-400 text-sm mb-2">{t.advanced.deleteAccountDesc}</p>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        {t.advanced.delete}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}