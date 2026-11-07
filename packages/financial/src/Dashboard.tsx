'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Progress } from '@yyc3/ui-enterprise';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Brain,
  Database,
  BarChart3,
  Users,
  DollarSign,
  Target
} from 'lucide-react';

interface DashboardProps {
  language: 'zh' | 'en';
}

export function Dashboard({ language }: DashboardProps) {
  const content = {
    zh: {
      title: '智能仪表板',
      subtitle: '实时监控您的量化交易状态',
      sections: {
        market: '市场指数',
        performance: '系统性能',
        alerts: '智能预警',
        aiAgent: 'AI Agent状态',
        portfolio: '投资组合概览'
      },
      marketIndices: [
        { name: '上证指数', value: '3,247.89', change: '+1.24%', trend: 'up' },
        { name: '深证成指', value: '10,876.45', change: '-0.56%', trend: 'down' },
        { name: '创业板指', value: '2,156.78', change: '+2.15%', trend: 'up' },
        { name: '沪深300', value: '4,123.67', change: '+0.89%', trend: 'up' }
      ],
      systemStats: [
        { label: 'CPU使用率', value: 68, unit: '%', status: 'normal' },
        { label: '内存使用', value: 82, unit: '%', status: 'warning' },
        { label: '存储使用', value: 45, unit: '%', status: 'normal' },
        { label: '数据延迟', value: 12, unit: 'ms', status: 'good' }
      ],
      alerts: [
        { type: 'success', message: 'AI模型预测准确率达到94.2%', time: '5分钟前' },
        { type: 'warning', message: '检测到异常交易量，建议关注', time: '12分钟前' },
        { type: 'info', message: '新的因子模型已完成训练', time: '1小时前' }
      ],
      aiAgents: [
        { name: '量化策略Agent', status: 'active', accuracy: 94.2, trades: 156 },
        { name: '风险控制Agent', status: 'active', accuracy: 97.8, trades: 43 },
        { name: '因子挖掘Agent', status: 'training', accuracy: 89.5, trades: 0 }
      ],
      overview: {
        totalAssets: '¥1,234,567',
        todayPnL: '+¥12,345 (+2.34%)',
        activeStrategies: 8,
        aiModels: 15
      }
    },
    en: {
      title: 'Smart Dashboard',
      subtitle: 'Real-time monitoring of your quantitative trading status',
      sections: {
        market: 'Market Indices',
        performance: 'System Performance',
        alerts: 'Smart Alerts',
        aiAgent: 'AI Agent Status',
        portfolio: 'Portfolio Overview'
      },
      marketIndices: [
        { name: 'Shanghai Index', value: '3,247.89', change: '+1.24%', trend: 'up' },
        { name: 'Shenzhen Index', value: '10,876.45', change: '-0.56%', trend: 'down' },
        { name: 'ChiNext Index', value: '2,156.78', change: '+2.15%', trend: 'up' },
        { name: 'CSI 300', value: '4,123.67', change: '+0.89%', trend: 'up' }
      ],
      systemStats: [
        { label: 'CPU Usage', value: 68, unit: '%', status: 'normal' },
        { label: 'Memory Usage', value: 82, unit: '%', status: 'warning' },
        { label: 'Storage Usage', value: 45, unit: '%', status: 'normal' },
        { label: 'Data Latency', value: 12, unit: 'ms', status: 'good' }
      ],
      alerts: [
        { type: 'success', message: 'AI model prediction accuracy reached 94.2%', time: '5 min ago' },
        { type: 'warning', message: 'Abnormal trading volume detected, attention recommended', time: '12 min ago' },
        { type: 'info', message: 'New factor model training completed', time: '1 hour ago' }
      ],
      aiAgents: [
        { name: 'Quant Strategy Agent', status: 'active', accuracy: 94.2, trades: 156 },
        { name: 'Risk Control Agent', status: 'active', accuracy: 97.8, trades: 43 },
        { name: 'Factor Mining Agent', status: 'training', accuracy: 89.5, trades: 0 }
      ],
      overview: {
        totalAssets: '$175,234',
        todayPnL: '+$1,756 (+2.34%)',
        activeStrategies: 8,
        aiModels: 15
      }
    }
  };

  const t = content[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'normal': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
            <Activity className="w-4 h-4 mr-2" />
            实时数据
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Target className="w-4 h-4 mr-2" />
            策略优化
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              总资产
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">{t.overview.totalAssets}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              今日盈亏
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-400">{t.overview.todayPnL}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
              活跃策略
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">{t.overview.activeStrategies}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-purple-400" />
              AI模型
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">{t.overview.aiModels}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Indices */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              {t.sections.market}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {t.marketIndices.map((index, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white">{index.name}</div>
                  <div className="text-2xl text-slate-300">{index.value}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {index.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={index.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                    {index.change}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-green-400" />
              {t.sections.performance}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {t.systemStats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className={`${getStatusColor(stat.status)}`}>
                    {stat.value}{stat.unit}
                  </span>
                </div>
                <Progress 
                  value={stat.value} 
                  className="h-2 bg-slate-700"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Alerts */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              {t.sections.alerts}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {t.alerts.map((alert, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="text-slate-300 text-sm">{alert.message}</div>
                  <div className="text-xs text-slate-500 mt-1">{alert.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Agent Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              {t.sections.aiAgent}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {t.aiAgents.map((agent, i) => (
              <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">{agent.name}</span>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={
                      agent.status === 'active' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }
                  >
                    {agent.status === 'active' ? '运行中' : '训练中'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">准确率: </span>
                    <span className="text-green-400">{agent.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">交易次数: </span>
                    <span className="text-blue-400">{agent.trades}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}