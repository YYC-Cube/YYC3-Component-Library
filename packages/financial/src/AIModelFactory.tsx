'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Label } from '@yyc3/ui-enterprise';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui-enterprise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui-enterprise';
import { Textarea } from '@yyc3/ui-enterprise';
import { 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  Bot,
  BarChart3,
  Zap,
  Brain,
  Target,
  Activity,
  DollarSign,
  PieChart,
  LineChart,
  Send
} from 'lucide-react';

interface AIModelFactoryProps {
  language: 'zh' | 'en';
}

export function AIModelFactory({ language }: AIModelFactoryProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [isTrading, setIsTrading] = useState(false);

  const content = {
    zh: {
      title: 'AI模型工厂',
      subtitle: '智能交易模型构建与测试平台',
      tabs: {
        chart: 'TradingView图表',
        chat: 'AI对话助手',
        factors: '模型因子选择'
      },
      chart: {
        title: '实时价格图表',
        symbol: '交易对',
        timeframe: '时间周期',
        indicators: '技术指标',
        startTrading: '开始交易',
        stopTrading: '停止交易',
        refresh: '刷新数据'
      },
      chat: {
        title: 'AI智能助手',
        placeholder: '询问关于交易策略、市场分析或技术指标...',
        send: '发送',
        conversations: '对话历史',
        aiAnalysis: 'AI分析建议',
        marketInsight: '市场洞察'
      },
      factors: {
        title: '模型因子配置',
        technicalFactors: '技术因子',
        fundamentalFactors: '基本面因子',
        sentimentFactors: '情绪因子',
        saveModel: '保存模型',
        testModel: '测试模型',
        deployModel: '部署模型'
      },
      mockData: {
        price: '41,267.89',
        change: '+2.34%',
        volume: '1.2B',
        high24h: '42,100',
        low24h: '40,850'
      }
    },
    en: {
      title: 'AI Model Factory',
      subtitle: 'Intelligent Trading Model Building and Testing Platform',
      tabs: {
        chart: 'TradingView Chart',
        chat: 'AI Assistant',
        factors: 'Model Factor Selection'
      },
      chart: {
        title: 'Real-time Price Chart',
        symbol: 'Trading Pair',
        timeframe: 'Timeframe',
        indicators: 'Technical Indicators',
        startTrading: 'Start Trading',
        stopTrading: 'Stop Trading',
        refresh: 'Refresh Data'
      },
      chat: {
        title: 'AI Smart Assistant',
        placeholder: 'Ask about trading strategies, market analysis, or technical indicators...',
        send: 'Send',
        conversations: 'Chat History',
        aiAnalysis: 'AI Analysis',
        marketInsight: 'Market Insights'
      },
      factors: {
        title: 'Model Factor Configuration',
        technicalFactors: 'Technical Factors',
        fundamentalFactors: 'Fundamental Factors',
        sentimentFactors: 'Sentiment Factors',
        saveModel: 'Save Model',
        testModel: 'Test Model',
        deployModel: 'Deploy Model'
      },
      mockData: {
        price: '41,267.89',
        change: '+2.34%',
        volume: '1.2B',
        high24h: '42,100',
        low24h: '40,850'
      }
    }
  };

  const t = content[language];

  const mockChatHistory = [
    {
      type: 'user',
      message: language === 'zh' ? '分析一下当前BTC的趋势' : 'Analyze the current BTC trend',
      time: '10:30'
    },
    {
      type: 'ai',
      message: language === 'zh' 
        ? 'BTC当前处于上升趋势，RSI指标显示60，MACD呈现金叉信号。建议关注41500阻力位。' 
        : 'BTC is currently in an uptrend with RSI at 60 and MACD showing bullish crossover. Watch for 41500 resistance.',
      time: '10:31'
    }
  ];

  const technicalFactors = [
    { name: 'RSI', selected: true, value: 60.5 },
    { name: 'MACD', selected: true, value: 0.2 },
    { name: 'Bollinger Bands', selected: false, value: 0.8 },
    { name: 'Moving Average', selected: true, value: 0.65 },
    { name: 'Volume Profile', selected: false, value: 0.7 }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-slate-400 text-lg">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button 
            variant={isTrading ? "destructive" : "default"} 
            onClick={() => setIsTrading(!isTrading)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isTrading ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                {t.chart.stopTrading}
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t.chart.startTrading}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{language === 'zh' ? '价格' : 'Price'}</p>
                <p className="text-xl font-bold text-white">${t.mockData.price}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{language === 'zh' ? '24h涨跌' : '24h Change'}</p>
                <p className="text-xl font-bold text-green-400">{t.mockData.change}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{language === 'zh' ? '成交量' : 'Volume'}</p>
                <p className="text-xl font-bold text-white">{t.mockData.volume}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{language === 'zh' ? '24h最高' : '24h High'}</p>
                <p className="text-xl font-bold text-white">${t.mockData.high24h}</p>
              </div>
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{language === 'zh' ? '24h最低' : '24h Low'}</p>
                <p className="text-xl font-bold text-white">${t.mockData.low24h}</p>
              </div>
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/80">
          <TabsTrigger value="chart" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <LineChart className="w-4 h-4 mr-2" />
            {t.tabs.chart}
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t.tabs.chat}
          </TabsTrigger>
          <TabsTrigger value="factors" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            {t.tabs.factors}
          </TabsTrigger>
        </TabsList>

        {/* TradingView Chart Tab */}
        <TabsContent value="chart" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">{t.chart.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t.chart.symbol}</Label>
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                      <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                      <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                      <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.chart.timeframe}</Label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1分钟</SelectItem>
                      <SelectItem value="5m">5分钟</SelectItem>
                      <SelectItem value="15m">15分钟</SelectItem>
                      <SelectItem value="1h">1小时</SelectItem>
                      <SelectItem value="4h">4小时</SelectItem>
                      <SelectItem value="1d">1天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.chart.indicators}</Label>
                  <div className="space-y-2">
                    {['RSI', 'MACD', 'EMA', 'Bollinger'].map((indicator) => (
                      <div key={indicator} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked={indicator === 'RSI'} />
                        <span className="text-slate-300 text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.chart.refresh}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 lg:col-span-3">
              <CardContent className="p-6">
                <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                  <div className="text-center">
                    <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">TradingView {language === 'zh' ? '图表区域' : 'Chart Area'}</p>
                    <p className="text-slate-500 text-sm mt-2">
                      {language === 'zh' ? '实际部署时将集成TradingView图表' : 'TradingView chart will be integrated in production'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/80 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-green-400" />
                  {t.chat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 bg-slate-900 rounded-lg border border-slate-700 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {mockChatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${
                          chat.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          <p className="text-sm">{chat.message}</p>
                          <p className="text-xs opacity-70 mt-1">{chat.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={t.chat.placeholder}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">{t.chat.aiAnalysis}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <h4 className="text-white text-sm font-medium mb-2">{t.chat.marketInsight}</h4>
                  <p className="text-slate-300 text-sm">
                    {language === 'zh' 
                      ? 'BTC当前呈现强势上涨趋势，成交量配合良好���建议关注回调买入机会。'
                      : 'BTC shows strong upward trend with good volume support. Consider buying on dips.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">{language === 'zh' ? '市场情绪' : 'Market Sentiment'}</span>
                    <Badge className="bg-green-500/20 text-green-300">{language === 'zh' ? '乐观' : 'Bullish'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">{language === 'zh' ? '技术指标' : 'Technical'}</span>
                    <Badge className="bg-blue-500/20 text-blue-300">{language === 'zh' ? '中性' : 'Neutral'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">{language === 'zh' ? '风险等级' : 'Risk Level'}</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300">{language === 'zh' ? '中等' : 'Medium'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Model Factors Tab */}
        <TabsContent value="factors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  {t.factors.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white text-sm font-medium mb-3">{t.factors.technicalFactors}</h4>
                  <div className="space-y-3">
                    {technicalFactors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked={factor.selected} className="rounded" />
                          <span className="text-slate-300">{factor.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-sm">{factor.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white text-sm font-medium mb-3">{t.factors.fundamentalFactors}</h4>
                  <div className="space-y-2">
                    {['Market Cap', 'Trading Volume', 'News Sentiment', 'Social Media'].map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-slate-300 text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">{language === 'zh' ? '模型配置' : 'Model Configuration'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{language === 'zh' ? '模型名称' : 'Model Name'}</Label>
                  <Input 
                    placeholder={language === 'zh' ? '输入模型名称' : 'Enter model name'}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{language === 'zh' ? '策略类型' : 'Strategy Type'}</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={language === 'zh' ? '选择策略类型' : 'Select strategy type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trend">{language === 'zh' ? '趋势跟踪' : 'Trend Following'}</SelectItem>
                      <SelectItem value="mean">{language === 'zh' ? '均值回归' : 'Mean Reversion'}</SelectItem>
                      <SelectItem value="momentum">{language === 'zh' ? '动量策略' : 'Momentum'}</SelectItem>
                      <SelectItem value="arbitrage">{language === 'zh' ? '套利策略' : 'Arbitrage'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{language === 'zh' ? '风险等级' : 'Risk Level'}</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={language === 'zh' ? '选择风险等级' : 'Select risk level'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{language === 'zh' ? '低风险' : 'Low Risk'}</SelectItem>
                      <SelectItem value="medium">{language === 'zh' ? '中等风险' : 'Medium Risk'}</SelectItem>
                      <SelectItem value="high">{language === 'zh' ? '高风险' : 'High Risk'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{language === 'zh' ? '模型描述' : 'Model Description'}</Label>
                  <Textarea 
                    placeholder={language === 'zh' ? '描述您的交易策略...' : 'Describe your trading strategy...'}
                    className="bg-slate-700 border-slate-600 text-white resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Target className="w-4 h-4 mr-2" />
                    {t.factors.testModel}
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    {t.factors.saveModel}
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    {t.factors.deployModel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}