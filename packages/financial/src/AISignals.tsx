'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui-enterprise';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Filter, 
  Search, 
  Clock, 
  Target,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AISignalsProps {
  language: 'zh' | 'en';
}

export function AISignals({ language }: AISignalsProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const content = {
    zh: {
      title: 'AI信号',
      subtitle: '实时智能交易信号监控',
      stats: {
        activeModels: '活跃模型',
        accuracy: '预测准确率',
        todaySignals: '今日信号',
        signalStrength: '信号强度'
      },
      filters: [
        { value: 'all', label: '全部信号' },
        { value: 'buy', label: '买入信号' },
        { value: 'sell', label: '卖出信号' },
        { value: 'hold', label: '观望信号' }
      ],
      signals: [
        {
          id: 1,
          symbol: 'BTCUSDT',
          type: 'BUY',
          confidence: 85,
          price: '$43,267',
          change: '+2.34%',
          description: '技术突破+量价配合，建议买入',
          time: '2分钟前',
          source: 'AI Momentum Model',
          strength: 'HIGH'
        },
        {
          id: 2,
          symbol: 'ETHUSDT',
          type: 'SELL',
          confidence: 72,
          price: '$2,567',
          change: '-1.23%',
          description: 'RSI超买+获利了结信号',
          time: '5分钟前',
          source: 'Technical Analysis AI',
          strength: 'MEDIUM'
        },
        {
          id: 3,
          symbol: 'BNBUSDT',
          type: 'HOLD',
          confidence: 68,
          price: '$345',
          change: '+0.89%',
          description: '横盘整理中，等待方向选择',
          time: '8分钟前',
          source: 'Pattern Recognition AI',
          strength: 'LOW'
        },
        {
          id: 4,
          symbol: 'ADAUSDT',
          type: 'BUY',
          confidence: 91,
          price: '$0.456',
          change: '+3.45%',
          description: '基本面改善+资金流入',
          time: '12分钟前',
          source: 'Fundamental AI',
          strength: 'HIGH'
        }
      ],
      signalHistory: '信号历史',
      searchPlaceholder: '搜索交易对...'
    },
    en: {
      title: 'AI Signals',
      subtitle: 'Real-time intelligent trading signal monitoring',
      stats: {
        activeModels: 'Active Models',
        accuracy: 'Prediction Accuracy',
        todaySignals: 'Today Signals',
        signalStrength: 'Signal Strength'
      },
      filters: [
        { value: 'all', label: 'All Signals' },
        { value: 'buy', label: 'Buy Signals' },
        { value: 'sell', label: 'Sell Signals' },
        { value: 'hold', label: 'Hold Signals' }
      ],
      signals: [
        {
          id: 1,
          symbol: 'BTCUSDT',
          type: 'BUY',
          confidence: 85,
          price: '$43,267',
          change: '+2.34%',
          description: 'Technical breakout + volume confirmation, recommend buy',
          time: '2 min ago',
          source: 'AI Momentum Model',
          strength: 'HIGH'
        },
        {
          id: 2,
          symbol: 'ETHUSDT',
          type: 'SELL',
          confidence: 72,
          price: '$2,567',
          change: '-1.23%',
          description: 'RSI overbought + profit taking signal',
          time: '5 min ago',
          source: 'Technical Analysis AI',
          strength: 'MEDIUM'
        },
        {
          id: 3,
          symbol: 'BNBUSDT',
          type: 'HOLD',
          confidence: 68,
          price: '$345',
          change: '+0.89%',
          description: 'Sideways consolidation, waiting for direction',
          time: '8 min ago',
          source: 'Pattern Recognition AI',
          strength: 'LOW'
        },
        {
          id: 4,
          symbol: 'ADAUSDT',
          type: 'BUY',
          confidence: 91,
          price: '$0.456',
          change: '+3.45%',
          description: 'Fundamental improvement + capital inflow',
          time: '12 min ago',
          source: 'Fundamental AI',
          strength: 'HIGH'
        }
      ],
      signalHistory: 'Signal History',
      searchPlaceholder: 'Search trading pairs...'
    }
  };

  const t = content[language];

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'SELL': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'HOLD': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-400/30';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY': return <TrendingUp className="w-4 h-4" />;
      case 'SELL': return <TrendingDown className="w-4 h-4" />;
      case 'HOLD': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const filteredSignals = selectedFilter === 'all' 
    ? t.signals 
    : t.signals.filter(signal => signal.type.toLowerCase() === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Activity className="w-4 h-4 mr-2" />
            实时监控
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.activeModels}</p>
                <p className="text-2xl text-white">15</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.accuracy}</p>
                <p className="text-2xl text-white">87.3%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.todaySignals}</p>
                <p className="text-2xl text-white">342</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.signalStrength}</p>
                <p className="text-2xl text-white">75.6</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder={t.searchPlaceholder}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {t.filters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Signals List */}
      <div className="space-y-4">
        {filteredSignals.map((signal) => (
          <Card key={signal.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Left Side - Signal Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getSignalColor(signal.type)}>
                      {getSignalIcon(signal.type)}
                      <span className="ml-1">{signal.type}</span>
                    </Badge>
                    <h3 className="text-white text-lg">{signal.symbol}</h3>
                  </div>
                  
                  <div className="hidden md:block border-l border-slate-700 pl-4">
                    <p className="text-white">{signal.price}</p>
                    <p className={`text-sm ${
                      signal.change.includes('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {signal.change}
                    </p>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="text-right">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">置信度</p>
                      <p className="text-white">{signal.confidence}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">信号强度</p>
                      <p className={getStrengthColor(signal.strength)}>{signal.strength}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {signal.time}
                  </div>
                </div>
              </div>

              {/* Signal Description */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-slate-300 mb-2">{signal.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">来源: {signal.source}</span>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                    查看详情
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Signal History */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            {t.signalHistory}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Activity className="w-16 h-16 mx-auto mb-4" />
            <p>查看历史信号记录和表现统计</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}