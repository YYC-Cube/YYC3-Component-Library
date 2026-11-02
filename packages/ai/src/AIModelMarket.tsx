'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  ShoppingCart,
  Brain,
  TrendingUp,
  Zap,
  Target,
  Coins,
  Users
} from 'lucide-react';

interface AIModelMarketProps {
  language: 'zh' | 'en';
}

export function AIModelMarket({ language }: AIModelMarketProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const content = {
    zh: {
      title: 'AI模型市场',
      subtitle: '发现和部署优质AI交易模型',
      tabs: {
        market: '模型市场',
        myModels: '我的模型',
        publish: '发布模型'
      },
      stats: {
        totalModels: '总模型数',
        activeModels: '活跃模型',
        avgPerformance: '平均表现',
        totalUsers: '用户数量'
      },
      categories: [
        { value: 'all', label: '全部模型' },
        { value: 'momentum', label: '动量策略' },
        { value: 'reversal', label: '反转策略' },
        { value: 'arbitrage', label: '套利策略' },
        { value: 'portfolio', label: '组合策略' },
        { value: 'risk', label: '风险管理' }
      ],
      sortOptions: [
        { value: 'performance', label: '表现排序' },
        { value: 'downloads', label: '下载量' },
        { value: 'rating', label: '评分' },
        { value: 'price', label: '价格' }
      ],
      models: [
        {
          id: 1,
          name: 'LSTM动量追踪器',
          description: '基于LSTM神经网络的价格动量预测模型，适用于中短期交易',
          category: 'momentum',
          author: 'QuantLab Pro',
          price: 199,
          downloads: 3420,
          rating: 4.8,
          performance: '+34.2%',
          accuracy: '87.3%',
          maxDrawdown: '-8.5%',
          tags: ['LSTM', '动量', '神经网络'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: true
        },
        {
          id: 2,
          name: 'DQN套利机器人',
          description: '深度Q网络驱动的跨交易所套利策略，自动发现价差机会',
          category: 'arbitrage',
          author: 'ArbitrageAI',
          price: 299,
          downloads: 2156,
          rating: 4.6,
          performance: '+28.9%',
          accuracy: '92.1%',
          maxDrawdown: '-5.2%',
          tags: ['DQN', '套利', '强化学习'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: true
        },
        {
          id: 3,
          name: '均值回归预测器',
          description: '统计套利模型，识别价格偏离并预测回归时机',
          category: 'reversal',
          author: 'StatArb Solutions',
          price: 150,
          downloads: 1897,
          rating: 4.4,
          performance: '+19.7%',
          accuracy: '78.5%',
          maxDrawdown: '-12.3%',
          tags: ['统计套利', '均值回归', '量化'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: false
        },
        {
          id: 4,
          name: '智能组合优化器',
          description: '基于现代投资组合理论的AI驱动资产配置模型',
          category: 'portfolio',
          author: 'Portfolio AI',
          price: 399,
          downloads: 1234,
          rating: 4.9,
          performance: '+42.1%',
          accuracy: '89.7%',
          maxDrawdown: '-6.8%',
          tags: ['组合优化', 'MPT', '资产配置'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: true
        }
      ],
      searchPlaceholder: '搜索AI模型...',
      actions: {
        buy: '购买',
        download: '下载',
        preview: '预览',
        details: '详情'
      }
    },
    en: {
      title: 'AI Model Market',
      subtitle: 'Discover and Deploy High-Quality AI Trading Models',
      tabs: {
        market: 'Model Market',
        myModels: 'My Models',
        publish: 'Publish Model'
      },
      stats: {
        totalModels: 'Total Models',
        activeModels: 'Active Models',
        avgPerformance: 'Avg Performance',
        totalUsers: 'Total Users'
      },
      categories: [
        { value: 'all', label: 'All Models' },
        { value: 'momentum', label: 'Momentum Strategy' },
        { value: 'reversal', label: 'Reversal Strategy' },
        { value: 'arbitrage', label: 'Arbitrage Strategy' },
        { value: 'portfolio', label: 'Portfolio Strategy' },
        { value: 'risk', label: 'Risk Management' }
      ],
      sortOptions: [
        { value: 'performance', label: 'Performance' },
        { value: 'downloads', label: 'Downloads' },
        { value: 'rating', label: 'Rating' },
        { value: 'price', label: 'Price' }
      ],
      models: [
        {
          id: 1,
          name: 'LSTM Momentum Tracker',
          description: 'LSTM neural network-based price momentum prediction model for medium-term trading',
          category: 'momentum',
          author: 'QuantLab Pro',
          price: 199,
          downloads: 3420,
          rating: 4.8,
          performance: '+34.2%',
          accuracy: '87.3%',
          maxDrawdown: '-8.5%',
          tags: ['LSTM', 'Momentum', 'Neural Network'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: true
        },
        {
          id: 2,
          name: 'DQN Arbitrage Bot',
          description: 'Deep Q-Network driven cross-exchange arbitrage strategy that automatically discovers price spreads',
          category: 'arbitrage',
          author: 'ArbitrageAI',
          price: 299,
          downloads: 2156,
          rating: 4.6,
          performance: '+28.9%',
          accuracy: '92.1%',
          maxDrawdown: '-5.2%',
          tags: ['DQN', 'Arbitrage', 'Reinforcement Learning'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: true
        },
        {
          id: 3,
          name: 'Mean Reversion Predictor',
          description: 'Statistical arbitrage model that identifies price deviations and predicts reversion timing',
          category: 'reversal',
          author: 'StatArb Solutions',
          price: 150,
          downloads: 1897,
          rating: 4.4,
          performance: '+19.7%',
          accuracy: '78.5%',
          maxDrawdown: '-12.3%',
          tags: ['Statistical Arbitrage', 'Mean Reversion', 'Quantitative'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: false
        },
        {
          id: 4,
          name: 'Smart Portfolio Optimizer',
          description: 'AI-driven asset allocation model based on Modern Portfolio Theory',
          category: 'portfolio',
          author: 'Portfolio AI',
          price: 399,
          downloads: 1234,
          rating: 4.9,
          performance: '+42.1%',
          accuracy: '89.7%',
          maxDrawdown: '-6.8%',
          tags: ['Portfolio Optimization', 'MPT', 'Asset Allocation'],
          thumbnail: '/api/placeholder/300/200',
          isVerified: true
        }
      ],
      searchPlaceholder: 'Search AI models...',
      actions: {
        buy: 'Buy',
        download: 'Download',
        preview: 'Preview',
        details: 'Details'
      }
    }
  };

  const t = content[language];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'momentum': return 'bg-blue-500/20 text-blue-300';
      case 'reversal': return 'bg-green-500/20 text-green-300';
      case 'arbitrage': return 'bg-purple-500/20 text-purple-300';
      case 'portfolio': return 'bg-orange-500/20 text-orange-300';
      case 'risk': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const filteredModels = t.models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.totalModels}</p>
                <p className="text-2xl text-white">2,847</p>
              </div>
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.activeModels}</p>
                <p className="text-2xl text-white">1,456</p>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.avgPerformance}</p>
                <p className="text-2xl text-white">+26.4%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.totalUsers}</p>
                <p className="text-2xl text-white">15,623</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
            {t.tabs.market}
          </TabsTrigger>
          <TabsTrigger value="myModels" className="data-[state=active]:bg-green-600">
            {t.tabs.myModels}
          </TabsTrigger>
          <TabsTrigger value="publish" className="data-[state=active]:bg-purple-600">
            {t.tabs.publish}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select defaultValue="performance">
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Model Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-white">{model.name}</CardTitle>
                        {model.isVerified && (
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                            ✓ 认证
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(model.category)}>
                          {t.categories.find(c => c.value === model.category)?.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        {model.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Model Thumbnail */}
                  <div className="h-32 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-slate-600" />
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">收益率</p>
                      <p className="text-green-400">{model.performance}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">准确率</p>
                      <p className="text-blue-400">{model.accuracy}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">最大回撤</p>
                      <p className="text-red-400">{model.maxDrawdown}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="bg-slate-700/50 text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats and Price */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(model.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="text-slate-400">({model.rating})</span>
                      </div>
                      <span className="text-slate-400">{model.downloads.toLocaleString()} 下载</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-white">{model.price} LYH</span>
                    </div>
                  </div>

                  <div className="text-slate-400 text-sm">
                    by {model.author}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {t.actions.buy}
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Eye className="w-4 h-4 mr-2" />
                      {t.actions.preview}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="myModels" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">
                <Brain className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">我的AI模型</p>
                <p className="text-sm">您还没有购买任何AI模型，去市场看看吧！</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">
                <Target className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">发布您的AI模型</p>
                <p className="text-sm">分享您的AI交易模型，获得被动收入！</p>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  开始发布
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}