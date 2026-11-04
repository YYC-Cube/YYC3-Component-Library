'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui';
import { 
  Code, 
  Terminal, 
  Puzzle, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight, 
  Play,
  Copy,
  ExternalLink,
  Star,
  TrendingUp
} from 'lucide-react';

interface DeveloperPlatformProps {
  language: 'zh' | 'en';
}

export function DeveloperPlatform({ language }: DeveloperPlatformProps) {
  const [activeDemo, setActiveDemo] = useState('signals');

  const content = {
    zh: {
      title: '开发者平台',
      subtitle: 'AI量化模型API，赋能开发者生态',
      description: '开放AI量化模型、Agent API能力，支持外部系统集成和生态合作',
      tabs: {
        api: 'API文档',
        marketplace: '插件市场',
        ecosystem: '生态合作'
      },
      apiFeatures: [
        {
          icon: Zap,
          title: '多因子智能决策',
          description: '集成多维度因子分析，提供智能化投资决策建议',
          endpoint: '/api/v1/decisions',
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: TrendingUp,
          title: '自动化策略生成',
          description: '基于历史数据和市场环境，自动生成优化交易策略',
          endpoint: '/api/v1/strategies/generate',
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Terminal,
          title: '自然语言策略编写',
          description: '通过自然语言描述，AI自动转换为可执行的交易策略',
          endpoint: '/api/v1/strategies/nlp',
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Shield,
          title: '实时信号推送',
          description: '毫秒级信号推送，支持WebSocket实时数据流',
          endpoint: '/ws/signals',
          color: 'from-orange-400 to-red-600'
        }
      ],
      codeExample: {
        signals: `// 获取实时AI信号
const response = await fetch('https://api.chaincoven.com/v1/signals', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const signals = await response.json();
console.log(signals);`,
        strategies: `// 生成AI交易策略
const strategy = await fetch('https://api.chaincoven.com/v1/strategies/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'BTCUSDT',
    timeframe: '1h',
    factors: ['RSI', 'MACD', 'Volume']
  })
});`,
        nlp: `// 自然语言策略
const nlpStrategy = await fetch('https://api.chaincoven.com/v1/strategies/nlp', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: "当RSI低于30时买入，高于70时卖出"
  })
});`
      },
      marketplace: {
        title: '插件市场',
        plugins: [
          { name: 'AI风险控制插件', downloads: '12.5K', rating: 4.8, price: '免费' },
          { name: '高频交易插件', downloads: '8.3K', rating: 4.9, price: '99 USDT' },
          { name: '情绪分析插件', downloads: '15.7K', rating: 4.7, price: '49 USDT' },
          { name: '套利机会发现', downloads: '6.2K', rating: 4.6, price: '199 USDT' }
        ]
      },
      ecosystem: {
        title: '生态合作',
        partners: [
          { name: '量化基金', description: '专业量化投资机构', count: '150+' },
          { name: '交易所', description: '主流数字资产交易平台', count: '25+' },
          { name: '数据提供商', description: '金融数据服务商', count: '40+' },
          { name: '硬件厂商', description: 'AI硬件设备制造商', count: '30+' }
        ]
      },
      features: {
        title: '核心能力',
        list: [
          '多模型协作与策略组合',
          '插件式扩展架构',
          'RESTful API + WebSocket',
          '开发者收益分成机制',
          '安全权限管理',
          '调用统计与监控'
        ]
      },
      cta: '获取API密钥'
    },
    en: {
      title: 'Developer Platform',
      subtitle: 'AI Quantitative Model API, Empowering Developer Ecosystem',
      description: 'Open AI quantitative models and Agent API capabilities, supporting external system integration and ecosystem cooperation',
      tabs: {
        api: 'API Docs',
        marketplace: 'Plugin Market',
        ecosystem: 'Ecosystem'
      },
      apiFeatures: [
        {
          icon: Zap,
          title: 'Multi-factor Smart Decisions',
          description: 'Integrate multi-dimensional factor analysis to provide intelligent investment decision suggestions',
          endpoint: '/api/v1/decisions',
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: TrendingUp,
          title: 'Automated Strategy Generation',
          description: 'Automatically generate optimized trading strategies based on historical data and market environment',
          endpoint: '/api/v1/strategies/generate',
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Terminal,
          title: 'Natural Language Strategy Writing',
          description: 'AI automatically converts natural language descriptions into executable trading strategies',
          endpoint: '/api/v1/strategies/nlp',
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Shield,
          title: 'Real-time Signal Push',
          description: 'Millisecond-level signal push, supporting WebSocket real-time data streams',
          endpoint: '/ws/signals',
          color: 'from-orange-400 to-red-600'
        }
      ],
      codeExample: {
        signals: `// Get real-time AI signals
const response = await fetch('https://api.chaincoven.com/v1/signals', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const signals = await response.json();
console.log(signals);`,
        strategies: `// Generate AI trading strategy
const strategy = await fetch('https://api.chaincoven.com/v1/strategies/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'BTCUSDT',
    timeframe: '1h',
    factors: ['RSI', 'MACD', 'Volume']
  })
});`,
        nlp: `// Natural language strategy
const nlpStrategy = await fetch('https://api.chaincoven.com/v1/strategies/nlp', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: "Buy when RSI below 30, sell when above 70"
  })
});`
      },
      marketplace: {
        title: 'Plugin Market',
        plugins: [
          { name: 'AI Risk Control Plugin', downloads: '12.5K', rating: 4.8, price: 'Free' },
          { name: 'High Frequency Trading', downloads: '8.3K', rating: 4.9, price: '99 USDT' },
          { name: 'Sentiment Analysis', downloads: '15.7K', rating: 4.7, price: '49 USDT' },
          { name: 'Arbitrage Discovery', downloads: '6.2K', rating: 4.6, price: '199 USDT' }
        ]
      },
      ecosystem: {
        title: 'Ecosystem Partners',
        partners: [
          { name: 'Quant Funds', description: 'Professional quantitative investment institutions', count: '150+' },
          { name: 'Exchanges', description: 'Mainstream digital asset trading platforms', count: '25+' },
          { name: 'Data Providers', description: 'Financial data service providers', count: '40+' },
          { name: 'Hardware Manufacturers', description: 'AI hardware device manufacturers', count: '30+' }
        ]
      },
      features: {
        title: 'Core Capabilities',
        list: [
          'Multi-model collaboration & strategy combination',
          'Plugin-based extensible architecture',
          'RESTful API + WebSocket',
          'Developer revenue sharing mechanism',
          'Secure permission management',
          'Call statistics & monitoring'
        ]
      },
      cta: 'Get API Key'
    }
  };

  const t = content[language];

  return (
    <section id="developers" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-purple-500/20 text-purple-300 border-purple-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <Tabs defaultValue="api" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 max-w-md mx-auto">
            <TabsTrigger value="api" className="data-[state=active]:bg-blue-600">
              {t.tabs.api}
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-600">
              {t.tabs.marketplace}
            </TabsTrigger>
            <TabsTrigger value="ecosystem" className="data-[state=active]:bg-green-600">
              {t.tabs.ecosystem}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-8">
            {/* API Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.apiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeDemo === feature.endpoint.split('/').pop();
                
                return (
                  <Card 
                    key={index} 
                    className={`bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer ${
                      isActive ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setActiveDemo(feature.endpoint.split('/').pop() || 'signals')}
                  >
                    <CardHeader>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <code className="text-sm text-blue-300 bg-slate-900/50 px-2 py-1 rounded">
                          {feature.endpoint}
                        </code>
                        <Button size="sm" variant="ghost" className="text-blue-400">
                          <Play className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Code Example */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Code className="w-5 h-5 mr-2 text-green-400" />
                  代码示例
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">JavaScript</span>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{t.codeExample[activeDemo as keyof typeof t.codeExample]}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Core Features */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">{t.features.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {t.features.list.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl text-white mb-4">{t.marketplace.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.marketplace.plugins.map((plugin, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{plugin.name}</CardTitle>
                      <Badge variant="outline" className="bg-green-500/20 text-green-300">
                        {plugin.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-slate-300">{plugin.rating}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{plugin.downloads} downloads</span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      安装插件
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ecosystem" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl text-white mb-4">{t.ecosystem.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.ecosystem.partners.map((partner, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-colors text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl text-blue-400 mb-3">{partner.count}</div>
                    <h4 className="text-white mb-2">{partner.name}</h4>
                    <p className="text-slate-400 text-sm">{partner.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 py-3 group"
          >
            {t.cta}
            <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}