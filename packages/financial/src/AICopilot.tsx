'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Progress } from '@yyc3/ui';
import { Input } from '@yyc3/ui';
import { Textarea } from '@yyc3/ui';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  Activity, 
  Zap, 
  MessageCircle,
  Send,
  Play,
  Pause,
  Settings,
  Target,
  AlertTriangle
} from 'lucide-react';

interface AICopilotProps {
  language: 'zh' | 'en';
}

export function AICopilot({ language }: AICopilotProps) {
  const [isAIActive, setIsAIActive] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [riskLevel, setRiskLevel] = useState(3);

  const content = {
    zh: {
      title: 'AI Copilot 智能交易助手',
      subtitle: '您的专属AI量化交易伙伴',
      sections: {
        portfolio: '投资组合概览',
        decisions: 'AI决策建议',
        execution: '执行监控',
        status: 'AI状态监控',
        risk: '风险管理',
        chat: '智能对话'
      },
      portfolio: {
        totalAssets: '总资产',
        todayPnL: '今日盈亏',
        holdingValue: '持仓市值',
        aiPnL: 'AI执行盈亏'
      },
      aiDecisions: [
        {
          type: 'buy',
          symbol: 'BTCUSDT',
          action: '建议买入',
          confidence: 85,
          quantity: '0.1 BTC',
          price: '$43,200',
          reason: '技术突破+量价配合'
        },
        {
          type: 'sell',
          symbol: 'ETHUSDT',
          action: '建议减仓',
          confidence: 72,
          quantity: '2 ETH',
          price: '$2,580',
          reason: 'RSI超买+获利了结'
        },
        {
          type: 'hold',
          symbol: 'ADAUSDT',
          action: '建议持有',
          confidence: 68,
          quantity: '1000 ADA',
          price: '$0.45',
          reason: '横盘整理+等待突破'
        }
      ],
      aiStatus: {
        modelStatus: 'AI模型状态',
        accuracy: '预测准确率',
        executionRate: '执行成功率',
        resourceUsage: '资源占用'
      },
      riskSettings: {
        maxDrawdown: '最大回撤限制',
        positionSize: '单笔仓位限制',
        stopLoss: '止损设置',
        riskLevel: '风险等级'
      },
      chatPlaceholder: '问问AI助手...',
      controls: {
        start: '启动AI',
        pause: '暂停AI',
        settings: '设置',
        execute: '执行'
      }
    },
    en: {
      title: 'AI Copilot Trading Assistant',
      subtitle: 'Your Personal AI Quantitative Trading Partner',
      sections: {
        portfolio: 'Portfolio Overview',
        decisions: 'AI Decision Suggestions',
        execution: 'Execution Monitoring',
        status: 'AI Status Monitor',
        risk: 'Risk Management',
        chat: 'Smart Chat'
      },
      portfolio: {
        totalAssets: 'Total Assets',
        todayPnL: 'Today P&L',
        holdingValue: 'Holdings Value',
        aiPnL: 'AI Execution P&L'
      },
      aiDecisions: [
        {
          type: 'buy',
          symbol: 'BTCUSDT',
          action: 'Buy Recommendation',
          confidence: 85,
          quantity: '0.1 BTC',
          price: '$43,200',
          reason: 'Technical breakout + Volume confirmation'
        },
        {
          type: 'sell',
          symbol: 'ETHUSDT',
          action: 'Reduce Position',
          confidence: 72,
          quantity: '2 ETH',
          price: '$2,580',
          reason: 'RSI overbought + Profit taking'
        },
        {
          type: 'hold',
          symbol: 'ADAUSDT',
          action: 'Hold Position',
          confidence: 68,
          quantity: '1000 ADA',
          price: '$0.45',
          reason: 'Sideways consolidation + Wait for breakout'
        }
      ],
      aiStatus: {
        modelStatus: 'AI Model Status',
        accuracy: 'Prediction Accuracy',
        executionRate: 'Execution Success Rate',
        resourceUsage: 'Resource Usage'
      },
      riskSettings: {
        maxDrawdown: 'Max Drawdown Limit',
        positionSize: 'Position Size Limit',
        stopLoss: 'Stop Loss Setting',
        riskLevel: 'Risk Level'
      },
      chatPlaceholder: 'Ask AI assistant...',
      controls: {
        start: 'Start AI',
        pause: 'Pause AI',
        settings: 'Settings',
        execute: 'Execute'
      }
    }
  };

  const t = content[language];

  const getActionColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-500/20';
      case 'sell': return 'text-red-400 bg-red-500/20';
      case 'hold': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="w-4 h-4" />;
      case 'sell': return <TrendingDown className="w-4 h-4" />;
      case 'hold': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            variant={isAIActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsAIActive(!isAIActive)}
            className={isAIActive ? 'bg-green-600 hover:bg-green-700' : 'border-slate-600 text-slate-300'}
          >
            {isAIActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAIActive ? t.controls.pause : t.controls.start}
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
            <Settings className="w-4 h-4 mr-2" />
            {t.controls.settings}
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-blue-400" />
              {t.portfolio.totalAssets}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">$175,234</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              {t.portfolio.todayPnL}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-400">+$2,567 (+1.48%)</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-purple-400" />
              {t.portfolio.holdingValue}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">$156,780</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-cyan-400" />
              {t.portfolio.aiPnL}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-cyan-400">+$8,934 (+5.12%)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Decision Suggestions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              {t.sections.decisions}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {t.aiDecisions.map((decision, i) => (
              <div key={i} className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getActionColor(decision.type)}>
                      {getActionIcon(decision.type)}
                      <span className="ml-1">{decision.action}</span>
                    </Badge>
                    <span className="text-white">{decision.symbol}</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    置信度: <span className="text-blue-400">{decision.confidence}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-slate-400">数量: </span>
                    <span className="text-white">{decision.quantity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">价格: </span>
                    <span className="text-white">{decision.price}</span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-300 mb-3">
                  <span className="text-slate-400">理由: </span>
                  {decision.reason}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                    {t.controls.execute}
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                    详情
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Status Monitor */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              {t.sections.status}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t.aiStatus.modelStatus}</span>
                <Badge className="bg-green-600 text-white">运行中</Badge>
              </div>
            </div>

            {/* Accuracy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t.aiStatus.accuracy}</span>
                <span className="text-green-400">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2 bg-slate-700" />
            </div>

            {/* Execution Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t.aiStatus.executionRate}</span>
                <span className="text-blue-400">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2 bg-slate-700" />
            </div>

            {/* Resource Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t.aiStatus.resourceUsage}</span>
                <span className="text-yellow-400">67%</span>
              </div>
              <Progress value={67} className="h-2 bg-slate-700" />
            </div>

            {/* Risk Management */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-white mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-orange-400" />
                {t.sections.risk}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.riskSettings.maxDrawdown}</span>
                  <span className="text-white">-5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.riskSettings.positionSize}</span>
                  <span className="text-white">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.riskSettings.stopLoss}</span>
                  <span className="text-white">-3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.riskSettings.riskLevel}</span>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300">
                    中等
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Interface */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
            {t.sections.chat}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages Area */}
            <div className="h-64 bg-slate-900/50 rounded-lg p-4 overflow-y-auto border border-slate-700">
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-300 p-3 rounded-lg max-w-xs">
                    <div className="text-sm">您好！我是您的AI交易助手。有什么可以帮助您的吗？</div>
                    <div className="text-xs opacity-70 mt-1">14:30</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                    <div className="text-sm">分析一下当前的投资组合风险</div>
                    <div className="text-xs opacity-70 mt-1">14:31</div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-300 p-3 rounded-lg max-w-sm">
                    <div className="text-sm">根据分析，您当前的投资组合风险适中。总持仓集中度为65%，建议适当分散。BTC仓位占比较高(35%)，可考虑部分获利了结。</div>
                    <div className="text-xs opacity-70 mt-1">14:32</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={t.chatPlaceholder}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                onKeyPress={(e) => e.key === 'Enter' && setChatMessage('')}
              />
              <Button
                size="icon"
                onClick={() => setChatMessage('')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}