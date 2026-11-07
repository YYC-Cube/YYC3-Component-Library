'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui-enterprise';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  MessageCircle, 
  Send, 
  BarChart3, 
  Activity,
  Zap,
  Target,
  Search
} from 'lucide-react';

interface MarketChartsProps {
  language: 'zh' | 'en';
}

export function MarketCharts({ language }: MarketChartsProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chatMessage, setChatMessage] = useState('');

  const content = {
    zh: {
      title: '行情图表',
      subtitle: '专业图表分析，AI智能解读',
      tabs: {
        chart: '图表分析',
        technical: '技术分析',
        ai: 'AI分析'
      },
      symbols: [
        { symbol: 'BTCUSDT', name: '比特币', price: '43,267.89', change: '+2.34%', trend: 'up' },
        { symbol: 'ETHUSDT', name: '以太坊', price: '2,567.45', change: '-1.23%', trend: 'down' },
        { symbol: 'BNBUSDT', name: 'BNB', price: '345.67', change: '+0.89%', trend: 'up' },
        { symbol: 'ADAUSDT', name: 'ADA', price: '0.4567', change: '+3.45%', trend: 'up' }
      ],
      timeframes: ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M'],
      technicalAnalysis: {
        support: '支撑位: $42,500',
        resistance: '阻力位: $45,200',
        trend: '趋势: 上升',
        rsi: 'RSI: 67.8 (中性)',
        macd: 'MACD: 看涨',
        volume: '成交量: 异常放量'
      },
      aiAnalysis: {
        prediction: '24小时预测: 上涨 2.5%',
        confidence: '置信度: 78%',
        signals: [
          '买入信号: 突破关键阻力位',
          '量价配合: 成交量放大',
          '技术指标: RSI显示超买信号'
        ]
      },
      chatPlaceholder: '询问AI关于当前行情...',
      chatResponses: [
        { type: 'user', message: '分析一下BTC的走势', time: '14:30' },
        { type: 'ai', message: '根据技术分析，BTC目前处于上升趋势中，已突破43000关键阻力位。成交量配合良好，预计短期内有继续上涨的可能。建议关注45200一线的阻力。', time: '14:31' }
      ]
    },
    en: {
      title: 'Market Charts',
      subtitle: 'Professional chart analysis with AI insights',
      tabs: {
        chart: 'Chart Analysis',
        technical: 'Technical Analysis',
        ai: 'AI Analysis'
      },
      symbols: [
        { symbol: 'BTCUSDT', name: 'Bitcoin', price: '43,267.89', change: '+2.34%', trend: 'up' },
        { symbol: 'ETHUSDT', name: 'Ethereum', price: '2,567.45', change: '-1.23%', trend: 'down' },
        { symbol: 'BNBUSDT', name: 'BNB', price: '345.67', change: '+0.89%', trend: 'up' },
        { symbol: 'ADAUSDT', name: 'ADA', price: '0.4567', change: '+3.45%', trend: 'up' }
      ],
      timeframes: ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M'],
      technicalAnalysis: {
        support: 'Support: $42,500',
        resistance: 'Resistance: $45,200',
        trend: 'Trend: Bullish',
        rsi: 'RSI: 67.8 (Neutral)',
        macd: 'MACD: Bullish',
        volume: 'Volume: Above Average'
      },
      aiAnalysis: {
        prediction: '24h Prediction: +2.5%',
        confidence: 'Confidence: 78%',
        signals: [
          'Buy Signal: Breakout above key resistance',
          'Volume Confirmation: Increased volume',
          'Technical: RSI showing overbought signals'
        ]
      },
      chatPlaceholder: 'Ask AI about current market conditions...',
      chatResponses: [
        { type: 'user', message: 'Analyze BTC trend', time: '14:30' },
        { type: 'ai', message: 'Based on technical analysis, BTC is currently in an uptrend, having broken above the key resistance at 43000. Volume is supportive, suggesting potential for continued upside. Watch for resistance around 45200.', time: '14:31' }
      ]
    }
  };

  const t = content[language];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle chat message
      setChatMessage('');
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
      </div>

      {/* Symbol Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.symbols.map((symbol, i) => (
          <Card 
            key={i} 
            className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-800/70 ${
              selectedSymbol === symbol.symbol ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedSymbol(symbol.symbol)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">{symbol.name}</span>
                <Badge variant="outline" className="text-xs">
                  {symbol.symbol}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg text-slate-300">${symbol.price}</span>
                <div className="flex items-center space-x-1">
                  {symbol.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={symbol.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                    {symbol.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                  {selectedSymbol}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {t.timeframes.map((tf) => (
                    <Button
                      key={tf}
                      variant={selectedTimeframe === tf ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(tf)}
                      className={
                        selectedTimeframe === tf 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simulated TradingView Chart */}
              <div className="h-96 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">TradingView Chart</p>
                  <p className="text-sm text-slate-500">Real chart integration here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="technical" className="data-[state=active]:bg-blue-600">
                技术
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600">
                AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-green-400" />
                    技术分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(t.technicalAnalysis).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-slate-300">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-400" />
                    AI预测
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-green-400">{t.aiAnalysis.prediction}</div>
                  <div className="text-sm text-blue-400">{t.aiAnalysis.confidence}</div>
                  <div className="space-y-2">
                    {t.aiAnalysis.signals.map((signal, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start">
                        <Zap className="w-3 h-3 mr-2 text-yellow-400 mt-0.5 flex-shrink-0" />
                        {signal}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* AI Chat */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                AI对话
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {t.chatResponses.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg text-sm ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      <div>{msg.message}</div>
                      <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder={t.chatPlaceholder}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}