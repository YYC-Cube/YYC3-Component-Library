'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Input } from '@yyc3/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui';
import { 
  Database, 
  Clock, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Star,
  TrendingUp,
  Activity,
  DollarSign,
  Eye,
  ShoppingCart,
  Calendar,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react';

interface DataMarketProps {
  language: 'zh' | 'en';
}

export function DataMarket({ language }: DataMarketProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const content = {
    zh: {
      title: '数据市场',
      subtitle: 'AI数据交易与分析平台',
      tabs: {
        historical: '历史数据区',
        realtime: '实时数据区',
        mydata: '我的数据'
      },
      stats: {
        totalDatasets: '数据集总数',
        activeProviders: '活跃供应商',
        totalDownloads: '总下载量',
        avgRating: '平均评分'
      },
      historical: {
        title: '历史数据交易',
        search: '搜索数据集',
        category: '数据类别',
        priceRange: '价格范围',
        provider: '数据提供商',
        lastUpdated: '最后更新',
        downloads: '下载量',
        rating: '评分',
        price: '价格',
        viewDetails: '查看详情',
        purchase: '购买',
        preview: '预览'
      },
      realtime: {
        title: '实时数据流',
        provider: '数据提供商',
        subscribe: '订阅',
        unsubscribe: '取消订阅',
        latency: '延迟',
        frequency: '频率',
        dataPoints: '数据点',
        status: '状态',
        active: '活跃',
        inactive: '未激活'
      },
      categories: [
        { value: 'all', label: '全部' },
        { value: 'price', label: '价格数据' },
        { value: 'volume', label: '成交量数据' },
        { value: 'social', label: '社交媒体' },
        { value: 'news', label: '新闻数据' },
        { value: 'onchain', label: '链上数据' },
        { value: 'defi', label: 'DeFi数据' }
      ],
      priceRanges: [
        { value: 'all', label: '全部价格' },
        { value: 'free', label: '免费' },
        { value: 'low', label: '0-100 USDT' },
        { value: 'medium', label: '100-500 USDT' },
        { value: 'high', label: '500+ USDT' }
      ]
    },
    en: {
      title: 'Data Market',
      subtitle: 'AI Data Trading and Analytics Platform',
      tabs: {
        historical: 'Historical Data',
        realtime: 'Real-time Data',
        mydata: 'My Data'
      },
      stats: {
        totalDatasets: 'Total Datasets',
        activeProviders: 'Active Providers',
        totalDownloads: 'Total Downloads',
        avgRating: 'Average Rating'
      },
      historical: {
        title: 'Historical Data Trading',
        search: 'Search datasets',
        category: 'Category',
        priceRange: 'Price Range',
        provider: 'Data Provider',
        lastUpdated: 'Last Updated',
        downloads: 'Downloads',
        rating: 'Rating',
        price: 'Price',
        viewDetails: 'View Details',
        purchase: 'Purchase',
        preview: 'Preview'
      },
      realtime: {
        title: 'Real-time Data Streams',
        provider: 'Provider',
        subscribe: 'Subscribe',
        unsubscribe: 'Unsubscribe',
        latency: 'Latency',
        frequency: 'Frequency',
        dataPoints: 'Data Points',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive'
      },
      categories: [
        { value: 'all', label: 'All' },
        { value: 'price', label: 'Price Data' },
        { value: 'volume', label: 'Volume Data' },
        { value: 'social', label: 'Social Media' },
        { value: 'news', label: 'News Data' },
        { value: 'onchain', label: 'On-chain Data' },
        { value: 'defi', label: 'DeFi Data' }
      ],
      priceRanges: [
        { value: 'all', label: 'All Prices' },
        { value: 'free', label: 'Free' },
        { value: 'low', label: '0-100 USDT' },
        { value: 'medium', label: '100-500 USDT' },
        { value: 'high', label: '500+ USDT' }
      ]
    }
  };

  const t = content[language];

  const mockHistoricalData = [
    {
      id: 1,
      name: 'BTC Price History 2020-2024',
      provider: 'CryptoData Pro',
      category: 'price',
      price: 299,
      rating: 4.8,
      downloads: 12450,
      lastUpdated: '2024-01-15',
      description: 'Complete Bitcoin price history with minute-level data',
      size: '2.5 GB'
    },
    {
      id: 2,
      name: 'Social Sentiment Dataset',
      provider: 'AI Analytics',
      category: 'social',
      price: 199,
      rating: 4.6,
      downloads: 8930,
      lastUpdated: '2024-01-14',
      description: 'Twitter and Reddit sentiment analysis for top 100 cryptos',
      size: '1.2 GB'
    },
    {
      id: 3,
      name: 'DeFi Protocol TVL Data',
      provider: 'DeFi Insights',
      category: 'defi',
      price: 0,
      rating: 4.7,
      downloads: 15670,
      lastUpdated: '2024-01-13',
      description: 'Total Value Locked data for major DeFi protocols',
      size: '800 MB'
    },
    {
      id: 4,
      name: 'On-chain Transaction Data',
      provider: 'Blockchain Analytics',
      category: 'onchain',
      price: 599,
      rating: 4.9,
      downloads: 5430,
      lastUpdated: '2024-01-12',
      description: 'Detailed on-chain transaction data for Bitcoin and Ethereum',
      size: '5.8 GB'
    }
  ];

  const mockRealtimeStreams = [
    {
      id: 1,
      name: 'Live Price Feed - Top 100',
      provider: 'RealTime Data Co.',
      frequency: '1ms',
      latency: '< 10ms',
      price: 99,
      status: 'active',
      subscribers: 2341,
      dataPoints: '1.2M/min'
    },
    {
      id: 2,
      name: 'Social Sentiment Stream',
      provider: 'SentimentAI',
      frequency: '1s',
      latency: '< 100ms',
      price: 149,
      status: 'active',
      subscribers: 856,
      dataPoints: '15K/min'
    },
    {
      id: 3,
      name: 'News Feed - Crypto',
      provider: 'NewsFlow',
      frequency: '5s',
      latency: '< 500ms',
      price: 79,
      status: 'inactive',
      subscribers: 432,
      dataPoints: '500/min'
    },
    {
      id: 4,
      name: 'Order Book Data',
      provider: 'Exchange Data',
      frequency: '100ms',
      latency: '< 50ms',
      price: 199,
      status: 'active',
      subscribers: 1234,
      dataPoints: '500K/min'
    }
  ];

  const filteredHistoricalData = mockHistoricalData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'free' && item.price === 0) ||
      (priceRange === 'low' && item.price > 0 && item.price <= 100) ||
      (priceRange === 'medium' && item.price > 100 && item.price <= 500) ||
      (priceRange === 'high' && item.price > 500);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-slate-400 text-lg">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Upload className="w-4 h-4 mr-2" />
            {language === 'zh' ? '上传数据' : 'Upload Data'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.totalDatasets}</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <Database className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.activeProviders}</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.totalDownloads}</p>
                <p className="text-2xl font-bold text-white">856K</p>
              </div>
              <Download className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.avgRating}</p>
                <p className="text-2xl font-bold text-white">4.7</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historical" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/80">
          <TabsTrigger value="historical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Database className="w-4 h-4 mr-2" />
            {t.tabs.historical}
          </TabsTrigger>
          <TabsTrigger value="realtime" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            {t.tabs.realtime}
          </TabsTrigger>
          <TabsTrigger value="mydata" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            {t.tabs.mydata}
          </TabsTrigger>
        </TabsList>

        {/* Historical Data Tab */}
        <TabsContent value="historical" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder={t.historical.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
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

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Historical Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistoricalData.map((dataset) => (
              <Card key={dataset.id} className="bg-slate-800/80 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg line-clamp-2">{dataset.name}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {t.historical.provider}: {dataset.provider}
                      </CardDescription>
                    </div>
                    <Badge className={`${dataset.price === 0 ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {dataset.price === 0 ? (language === 'zh' ? '免费' : 'Free') : `$${dataset.price}`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm line-clamp-2">{dataset.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">{t.historical.rating}:</span>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{dataset.rating}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">{t.historical.downloads}:</span>
                      <p className="text-white mt-1">{dataset.downloads.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">{language === 'zh' ? '大小' : 'Size'}:</span>
                      <p className="text-white mt-1">{dataset.size}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">{t.historical.lastUpdated}:</span>
                      <p className="text-white mt-1">{dataset.lastUpdated}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Eye className="w-4 h-4 mr-1" />
                      {t.historical.preview}
                    </Button>
                    <Button size="sm" className={`flex-1 ${dataset.price === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                      {dataset.price === 0 ? (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          {language === 'zh' ? '下载' : 'Download'}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {t.historical.purchase}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Real-time Data Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockRealtimeStreams.map((stream) => (
              <Card key={stream.id} className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{stream.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {t.realtime.provider}: {stream.provider}
                      </CardDescription>
                    </div>
                    <Badge className={`${stream.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {stream.status === 'active' ? t.realtime.active : t.realtime.inactive}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">{t.realtime.frequency}:</span>
                      <p className="text-white mt-1">{stream.frequency}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">{t.realtime.latency}:</span>
                      <p className="text-white mt-1">{stream.latency}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">{t.realtime.dataPoints}:</span>
                      <p className="text-white mt-1">{stream.dataPoints}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">{language === 'zh' ? '订阅者' : 'Subscribers'}:</span>
                      <p className="text-white mt-1">{stream.subscribers.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-sm">{t.historical.price}:</span>
                      <p className="text-white text-lg font-bold">${stream.price}/month</p>
                    </div>
                    <Button 
                      className={`${stream.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {stream.status === 'active' ? t.realtime.unsubscribe : t.realtime.subscribe}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Data Tab */}
        <TabsContent value="mydata" className="space-y-6">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">{language === 'zh' ? '我的数据资产' : 'My Data Assets'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">
                  {language === 'zh' ? '您还没有购买或上传任何数据' : 'You haven\'t purchased or uploaded any data yet'}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {language === 'zh' ? '浏览数据市场' : 'Browse Data Market'}
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Upload className="w-4 h-4 mr-2" />
                    {language === 'zh' ? '上传数据' : 'Upload Data'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}