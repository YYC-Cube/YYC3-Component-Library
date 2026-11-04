'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Input } from '@yyc3/ui';
import { Label } from '@yyc3/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui';
import { Progress } from '@yyc3/ui';
import { 
  Play, 
  Pause, 
  Download, 
  Upload, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity,
  Target,
  DollarSign,
  Calendar,
  Settings
} from 'lucide-react';

interface AIModelBacktestingProps {
  language: 'zh' | 'en';
}

export function AIModelBacktesting({ language }: AIModelBacktestingProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const content = {
    zh: {
      title: 'AI交易模型回测',
      subtitle: '验证您的AI交易策略表现',
      tabs: {
        config: '策略配置',
        results: '回测结果',
        analysis: '风险分析',
        trades: '交易明细'
      },
      config: {
        title: '回测配置',
        modelType: '模型类型',
        symbol: '交易标的',
        timeframe: '时间周期',
        startDate: '开始日期',
        endDate: '结束日期',
        initialCapital: '初始资金',
        commission: '手续费率',
        slippage: '滑点',
        runBacktest: '开始回测',
        pauseBacktest: '暂停回测',
        importStrategy: '导入策略',
        exportResults: '导出结果'
      },
      results: {
        title: '回测结果概览',
        totalReturn: '总收益率',
        annualReturn: '年化收益率',
        winRate: '胜率',
        maxDrawdown: '最大回撤',
        sharpeRatio: '夏普比率',
        totalTrades: '总交易次数',
        profitFactor: '盈利因子',
        avgWin: '平均盈利',
        avgLoss: '平均亏损'
      },
      analysis: {
        title: '风险分析',
        volatility: '波动率',
        var: '风险价值(VaR)',
        beta: 'Beta系数',
        alpha: 'Alpha系数',
        correlation: '相关性',
        drawdownPeriod: '回撤周期'
      },
      trades: {
        title: '交易记录',
        date: '日期',
        type: '类型',
        symbol: '标的',
        quantity: '数量',
        price: '价格',
        pnl: '盈亏',
        status: '状态'
      },
      models: [
        { value: 'lstm', label: 'LSTM神经网络' },
        { value: 'transformer', label: 'Transformer模型' },
        { value: 'reinforcement', label: '强化学习' },
        { value: 'ensemble', label: '集成模型' }
      ]
    },
    en: {
      title: 'AI Model Backtesting',
      subtitle: 'Validate your AI trading strategy performance',
      tabs: {
        config: 'Strategy Config',
        results: 'Backtest Results',
        analysis: 'Risk Analysis',
        trades: 'Trade Details'
      },
      config: {
        title: 'Backtest Configuration',
        modelType: 'Model Type',
        symbol: 'Trading Symbol',
        timeframe: 'Timeframe',
        startDate: 'Start Date',
        endDate: 'End Date',
        initialCapital: 'Initial Capital',
        commission: 'Commission Rate',
        slippage: 'Slippage',
        runBacktest: 'Run Backtest',
        pauseBacktest: 'Pause Backtest',
        importStrategy: 'Import Strategy',
        exportResults: 'Export Results'
      },
      results: {
        title: 'Backtest Results Overview',
        totalReturn: 'Total Return',
        annualReturn: 'Annual Return',
        winRate: 'Win Rate',
        maxDrawdown: 'Max Drawdown',
        sharpeRatio: 'Sharpe Ratio',
        totalTrades: 'Total Trades',
        profitFactor: 'Profit Factor',
        avgWin: 'Average Win',
        avgLoss: 'Average Loss'
      },
      analysis: {
        title: 'Risk Analysis',
        volatility: 'Volatility',
        var: 'Value at Risk (VaR)',
        beta: 'Beta Coefficient',
        alpha: 'Alpha Coefficient',
        correlation: 'Correlation',
        drawdownPeriod: 'Drawdown Period'
      },
      trades: {
        title: 'Trade Records',
        date: 'Date',
        type: 'Type',
        symbol: 'Symbol',
        quantity: 'Quantity',
        price: 'Price',
        pnl: 'P&L',
        status: 'Status'
      },
      models: [
        { value: 'lstm', label: 'LSTM Neural Network' },
        { value: 'transformer', label: 'Transformer Model' },
        { value: 'reinforcement', label: 'Reinforcement Learning' },
        { value: 'ensemble', label: 'Ensemble Model' }
      ]
    }
  };

  const t = content[language];

  const mockResults = {
    totalReturn: '+156.7%',
    annualReturn: '+42.3%',
    winRate: '68.5%',
    maxDrawdown: '-12.4%',
    sharpeRatio: '2.34',
    totalTrades: '1,247',
    profitFactor: '1.89',
    avgWin: '+2.3%',
    avgLoss: '-1.2%'
  };

  const mockTrades = [
    { date: '2024-01-15', type: 'BUY', symbol: 'BTCUSDT', quantity: '0.5', price: '$43,200', pnl: '+$1,234', status: '已完成' },
    { date: '2024-01-14', type: 'SELL', symbol: 'ETHUSDT', quantity: '2.0', price: '$2,580', pnl: '-$234', status: '已完成' },
    { date: '2024-01-13', type: 'BUY', symbol: 'ADAUSDT', quantity: '1000', price: '$0.45', pnl: '+$567', status: '已完成' },
    { date: '2024-01-12', type: 'SELL', symbol: 'BNBUSDT', quantity: '10', price: '$345', pnl: '+$890', status: '已完成' }
  ];

  const handleRunBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
            <Upload className="w-4 h-4 mr-2" />
            {t.config.importStrategy}
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            {t.config.exportResults}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">回测进行中...</span>
              <span className="text-blue-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="config" className="data-[state=active]:bg-blue-600">
            {t.tabs.config}
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-green-600">
            {t.tabs.results}
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-orange-600">
            {t.tabs.analysis}
          </TabsTrigger>
          <TabsTrigger value="trades" className="data-[state=active]:bg-purple-600">
            {t.tabs.trades}
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                {t.config.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.modelType}</Label>
                  <Select defaultValue="lstm">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {t.models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.symbol}</Label>
                  <Select defaultValue="BTCUSDT">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                      <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                      <SelectItem value="BNBUSDT">BNBUSDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.timeframe}</Label>
                  <Select defaultValue="1h">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5m">5分钟</SelectItem>
                      <SelectItem value="15m">15分钟</SelectItem>
                      <SelectItem value="1h">1小时</SelectItem>
                      <SelectItem value="4h">4小时</SelectItem>
                      <SelectItem value="1d">1天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.initialCapital}</Label>
                  <Input
                    type="number"
                    placeholder="100000"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.startDate}</Label>
                  <Input
                    type="date"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.endDate}</Label>
                  <Input
                    type="date"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.commission}</Label>
                  <Input
                    type="number"
                    placeholder="0.1"
                    step="0.01"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.config.slippage}</Label>
                  <Input
                    type="number"
                    placeholder="0.05"
                    step="0.01"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleRunBacktest}
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      {t.config.pauseBacktest}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {t.config.runBacktest}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(mockResults).map(([key, value], index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">
                        {t.results[key as keyof typeof t.results]}
                      </p>
                      <p className={`text-lg ${
                        value.includes('+') ? 'text-green-400' : 
                        value.includes('-') ? 'text-red-400' : 'text-white'
                      }`}>
                        {value}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      {value.includes('+') ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : value.includes('-') ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Equity Curve Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">权益曲线</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">权益曲线图表</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-400" />
                {t.analysis.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.analysis.volatility}</span>
                    <span className="text-white">18.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.analysis.var}</span>
                    <span className="text-red-400">-5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.analysis.beta}</span>
                    <span className="text-white">1.34</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.analysis.alpha}</span>
                    <span className="text-green-400">0.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.analysis.correlation}</span>
                    <span className="text-white">0.78</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.analysis.drawdownPeriod}</span>
                    <span className="text-white">45天</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trades Tab */}
        <TabsContent value="trades" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-400" />
                {t.trades.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 pb-2">{t.trades.date}</th>
                      <th className="text-left text-slate-400 pb-2">{t.trades.type}</th>
                      <th className="text-left text-slate-400 pb-2">{t.trades.symbol}</th>
                      <th className="text-left text-slate-400 pb-2">{t.trades.quantity}</th>
                      <th className="text-left text-slate-400 pb-2">{t.trades.price}</th>
                      <th className="text-left text-slate-400 pb-2">{t.trades.pnl}</th>
                      <th className="text-left text-slate-400 pb-2">{t.trades.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTrades.map((trade, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300">{trade.date}</td>
                        <td className="py-3">
                          <Badge variant={trade.type === 'BUY' ? 'default' : 'secondary'}>
                            {trade.type}
                          </Badge>
                        </td>
                        <td className="py-3 text-white">{trade.symbol}</td>
                        <td className="py-3 text-slate-300">{trade.quantity}</td>
                        <td className="py-3 text-slate-300">{trade.price}</td>
                        <td className={`py-3 ${
                          trade.pnl.includes('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.pnl}
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="bg-green-500/20 text-green-300">
                            {trade.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}