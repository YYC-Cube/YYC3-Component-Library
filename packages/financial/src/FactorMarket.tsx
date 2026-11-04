'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Input } from '@yyc3/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Download, 
  Eye, 
  ShoppingCart,
  Zap,
  BarChart3,
  Users,
  Coins,
  Upload
} from 'lucide-react';

interface FactorMarketProps {
  language: 'zh' | 'en';
}

export function FactorMarket({ language }: FactorMarketProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const content = {
    zh: {
      title: '因子市场',
      subtitle: '发现和交易优质量化因子',
      tabs: {
        market: '因子市场',
        portfolio: '我的因子',
        publish: '发布因子'
      },
      stats: {
        activeFactor: '活跃因子',
        qualityFactor: '优质因子',
        avgIC: '平均IC',
        coverage: '因子覆盖率'
      },
      search: {
        placeholder: '搜索因子名称或描述...',
        category: '因子分类',
        sortBy: '排序方式'
      },
      categories: [
        { value: 'all', label: '全部' },
        { value: 'technical', label: '技术指标' },
        { value: 'fundamental', label: '基本面' },
        { value: 'sentiment', label: '情绪指标' },
        { value: 'macro', label: '宏观经济' },
        { value: 'alternative', label: '另类数据' }
      ],
      sortOptions: [
        { value: 'ic', label: 'IC值' },
        { value: 'subscribers', label: '订阅数' },
        { value: 'price', label: '价格' },
        { value: 'rating', label: '评分' }
      ],
      factors: [
        {
          id: 1,
          name: 'AI动量因子',
          description: '基于深度学习的价格动量预测因子，适用于中短期交易',
          category: 'technical',
          ic: 0.15,
          subscribers: 2534,
          price: 50,
          rating: 4.8,
          author: 'QuantLab',
          performance: '+23.4%',
          coverage: '85%',
          lastUpdate: '2024-01-15'
        },
        {
          id: 2,
          name: '基本面价值因子',
          description: '综合财务指标的价值评估因子，识别被低估的优质标的',
          category: 'fundamental',
          ic: 0.12,
          subscribers: 1876,
          price: 80,
          rating: 4.6,
          author: 'ValueQuant',
          performance: '+18.7%',
          coverage: '92%',
          lastUpdate: '2024-01-14'
        },
        {
          id: 3,
          name: '市场情绪因子',
          description: '基于社交媒体和新闻情绪分析的市场预测因子',
          category: 'sentiment',
          ic: 0.08,
          subscribers: 3241,
          price: 30,
          rating: 4.3,
          author: 'SentimentAI',
          performance: '+12.1%',
          coverage: '78%',
          lastUpdate: '2024-01-13'
        },
        {
          id: 4,
          name: '波动率预测因子',
          description: '使用GARCH模型预测未来波动率，用于风险管理',
          category: 'technical',
          ic: 0.18,
          subscribers: 1567,
          price: 120,
          rating: 4.9,
          author: 'RiskLab',
          performance: '+31.2%',
          coverage: '89%',
          lastUpdate: '2024-01-12'
        }
      ],
      actions: {
        buy: '购买',
        subscribe: '订阅',
        preview: '预览',
        details: '详情'
      }
    },
    en: {
      title: 'Factor Market',
      subtitle: 'Discover and trade high-quality quantitative factors',
      tabs: {
        market: 'Factor Market',
        portfolio: 'My Factors',
        publish: 'Publish Factor'
      },
      stats: {
        activeFactor: 'Active Factors',
        qualityFactor: 'Quality Factors',
        avgIC: 'Average IC',
        coverage: 'Factor Coverage'
      },
      search: {
        placeholder: 'Search factor name or description...',
        category: 'Category',
        sortBy: 'Sort By'
      },
      categories: [
        { value: 'all', label: 'All' },
        { value: 'technical', label: 'Technical' },
        { value: 'fundamental', label: 'Fundamental' },
        { value: 'sentiment', label: 'Sentiment' },
        { value: 'macro', label: 'Macro Economic' },
        { value: 'alternative', label: 'Alternative Data' }
      ],
      sortOptions: [
        { value: 'ic', label: 'IC Value' },
        { value: 'subscribers', label: 'Subscribers' },
        { value: 'price', label: 'Price' },
        { value: 'rating', label: 'Rating' }
      ],
      factors: [
        {
          id: 1,
          name: 'AI Momentum Factor',
          description: 'Deep learning-based price momentum prediction factor for medium-term trading',
          category: 'technical',
          ic: 0.15,
          subscribers: 2534,
          price: 50,
          rating: 4.8,
          author: 'QuantLab',
          performance: '+23.4%',
          coverage: '85%',
          lastUpdate: '2024-01-15'
        },
        {
          id: 2,
          name: 'Fundamental Value Factor',
          description: 'Value assessment factor combining financial indicators to identify undervalued quality targets',
          category: 'fundamental',
          ic: 0.12,
          subscribers: 1876,
          price: 80,
          rating: 4.6,
          author: 'ValueQuant',
          performance: '+18.7%',
          coverage: '92%',
          lastUpdate: '2024-01-14'
        },
        {
          id: 3,
          name: 'Market Sentiment Factor',
          description: 'Market prediction factor based on social media and news sentiment analysis',
          category: 'sentiment',
          ic: 0.08,
          subscribers: 3241,
          price: 30,
          rating: 4.3,
          author: 'SentimentAI',
          performance: '+12.1%',
          coverage: '78%',
          lastUpdate: '2024-01-13'
        },
        {
          id: 4,
          name: 'Volatility Prediction Factor',
          description: 'GARCH model-based future volatility prediction for risk management',
          category: 'technical',
          ic: 0.18,
          subscribers: 1567,
          price: 120,
          rating: 4.9,
          author: 'RiskLab',
          performance: '+31.2%',
          coverage: '89%',
          lastUpdate: '2024-01-12'
        }
      ],
      actions: {
        buy: 'Buy',
        subscribe: 'Subscribe',
        preview: 'Preview',
        details: 'Details'
      }
    }
  };

  const t = content[language];

  const filteredFactors = t.factors.filter(factor => {
    const matchesSearch = factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || factor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-500/20 text-blue-300';
      case 'fundamental': return 'bg-green-500/20 text-green-300';
      case 'sentiment': return 'bg-purple-500/20 text-purple-300';
      case 'macro': return 'bg-orange-500/20 text-orange-300';
      case 'alternative': return 'bg-pink-500/20 text-pink-300';
      default: return 'bg-slate-500/20 text-slate-300';
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.activeFactor}</p>
                <p className="text-2xl text-white">1,247</p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.qualityFactor}</p>
                <p className="text-2xl text-white">568</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.avgIC}</p>
                <p className="text-2xl text-white">0.142</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.coverage}</p>
                <p className="text-2xl text-white">87.3%</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
            {t.tabs.market}
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-green-600">
            {t.tabs.portfolio}
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
                    placeholder={t.search.placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder={t.search.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select defaultValue="ic">
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder={t.search.sortBy} />
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

          {/* Factor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFactors.map((factor) => (
              <Card key={factor.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-white">{factor.name}</CardTitle>
                        <Badge className={getCategoryColor(factor.category)}>
                          {t.categories.find(c => c.value === factor.category)?.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        {factor.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 text-sm">IC值:</span>
                        <span className="text-green-400">{factor.ic}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 text-sm">覆盖率:</span>
                        <span className="text-blue-400">{factor.coverage}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 text-sm">订阅数:</span>
                        <span className="text-white">{factor.subscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 text-sm">表现:</span>
                        <span className="text-green-400">{factor.performance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(factor.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="text-slate-400 text-sm">({factor.rating})</span>
                      </div>
                      <span className="text-slate-400 text-sm">by {factor.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-white">{factor.price} LYH</span>
                    </div>
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

        <TabsContent value="portfolio" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">我的因子组合</p>
                <p className="text-sm">您还没有购买任何因子，去市场看看吧！</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">
                <Upload className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">发布您的因子</p>
                <p className="text-sm">分享您的量化因子，获得被动收入！</p>
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