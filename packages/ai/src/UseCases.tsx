'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Coins, 
  BarChart3, 
  Image, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

interface UseCasesProps {
  language: 'zh' | 'en';
}

export function UseCases({ language }: UseCasesProps) {
  const [activeCase, setActiveCase] = useState(0);

  const content = {
    zh: {
      title: '行业应用场景',
      subtitle: '多元化金融科技应用',
      description: '从DeFi到NFT金融，从链上量化到数据分析，全方位覆盖数字金融生态',
      cases: [
        {
          icon: Coins,
          title: 'DeFi协议集成',
          description: '与主流DeFi协议深度集成，提供流动性挖矿、收益农场、自动化做市等服务',
          features: ['自动化流动性管理', 'DeFi收益优化', '跨协议套利', '风险对冲策略'],
          image: '/api/placeholder/400/250',
          stats: { protocols: '50+', tvl: '$125M', apy: '15.6%' },
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: TrendingUp,
          title: '链上量化交易',
          description: '基于链上数据的量化交易策略，实时监控链上资金流动和市场情绪',
          features: ['链上数据分析', '巨鲸地址监控', '资金流向预测', '市场情绪指标'],
          image: '/api/placeholder/400/250',
          stats: { transactions: '1M+', accuracy: '87.3%', profit: '+234%' },
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Image,
          title: 'NFT金融服务',
          description: 'NFT估值、流动性解决方案、碎片化交易和NFT抵押借贷服务',
          features: ['NFT价格预测', '流动性池', '碎片化交易', '抵押借贷'],
          image: '/api/placeholder/400/250',
          stats: { collections: '5K+', volume: '$45M', floor: '+125%' },
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: BarChart3,
          title: '链上数据分析',
          description: '全方位链上数据分析平台，提供实时监控、趋势分析和预警服务',
          features: ['实时数据监控', '趋势分析预测', '异常交易检测', '智能预警系统'],
          image: '/api/placeholder/400/250',
          stats: { chains: '15+', data: '100TB+', alerts: '99.1%' },
          color: 'from-orange-400 to-red-600'
        }
      ],
      features: {
        title: '核心优势',
        items: [
          { icon: Zap, title: '实时响应', description: '毫秒级数据处理与信号推送' },
          { icon: Shield, title: '安全可靠', description: '多重安全机制保障资金安全' },
          { icon: Globe, title: '全链覆盖', description: '支持主流公链与Layer2网络' }
        ]
      },
      cta: '探索应用'
    },
    en: {
      title: 'Industry Use Cases',
      subtitle: 'Diversified Fintech Applications',
      description: 'From DeFi to NFT finance, from on-chain quantitative trading to data analysis, comprehensive coverage of digital financial ecosystem',
      cases: [
        {
          icon: Coins,
          title: 'DeFi Protocol Integration',
          description: 'Deep integration with mainstream DeFi protocols, providing liquidity mining, yield farming, automated market making services',
          features: ['Automated liquidity management', 'DeFi yield optimization', 'Cross-protocol arbitrage', 'Risk hedging strategies'],
          image: '/api/placeholder/400/250',
          stats: { protocols: '50+', tvl: '$125M', apy: '15.6%' },
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: TrendingUp,
          title: 'On-chain Quantitative Trading',
          description: 'Quantitative trading strategies based on on-chain data, real-time monitoring of on-chain capital flows and market sentiment',
          features: ['On-chain data analysis', 'Whale address monitoring', 'Capital flow prediction', 'Market sentiment indicators'],
          image: '/api/placeholder/400/250',
          stats: { transactions: '1M+', accuracy: '87.3%', profit: '+234%' },
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Image,
          title: 'NFT Financial Services',
          description: 'NFT valuation, liquidity solutions, fractionalized trading and NFT collateral lending services',
          features: ['NFT price prediction', 'Liquidity pools', 'Fractionalized trading', 'Collateral lending'],
          image: '/api/placeholder/400/250',
          stats: { collections: '5K+', volume: '$45M', floor: '+125%' },
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: BarChart3,
          title: 'On-chain Data Analytics',
          description: 'Comprehensive on-chain data analytics platform, providing real-time monitoring, trend analysis and alert services',
          features: ['Real-time data monitoring', 'Trend analysis & prediction', 'Abnormal transaction detection', 'Smart alert system'],
          image: '/api/placeholder/400/250',
          stats: { chains: '15+', data: '100TB+', alerts: '99.1%' },
          color: 'from-orange-400 to-red-600'
        }
      ],
      features: {
        title: 'Core Advantages',
        items: [
          { icon: Zap, title: 'Real-time Response', description: 'Millisecond-level data processing and signal push' },
          { icon: Shield, title: 'Secure & Reliable', description: 'Multiple security mechanisms to ensure fund safety' },
          { icon: Globe, title: 'Full Chain Coverage', description: 'Support mainstream public chains and Layer2 networks' }
        ]
      },
      cta: 'Explore Applications'
    }
  };

  const t = content[language];
  const activeUseCase = t.cases[activeCase];
  const ActiveCaseIcon = activeUseCase.icon;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Use Cases Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {t.cases.map((useCase, index) => {
              const Icon = useCase.icon;
              
              return (
                <Button
                  key={index}
                  variant={activeCase === index ? 'default' : 'ghost'}
                  className={`${
                    activeCase === index 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  onClick={() => setActiveCase(index)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {useCase.title}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Active Use Case Detail */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content */}
              <div className="space-y-6">
                <div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${activeUseCase.color} flex items-center justify-center mb-4`}>
                    <ActiveCaseIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-white mb-4">{activeUseCase.title}</h3>
                  <p className="text-slate-400 mb-6">{activeUseCase.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-white">核心功能</h4>
                  {activeUseCase.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  {Object.entries(activeUseCase.stats).map(([key, value], i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl text-blue-400 mb-1">{value}</div>
                      <div className="text-xs text-slate-500 uppercase">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center h-64 lg:h-full">
                <div className="text-center">
                  <ActiveCaseIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">案例可视化图表</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {t.features.items.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-colors text-center">
                <CardContent className="p-6">
                  <Icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-white mb-2">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 px-8 py-3 group"
          >
            {t.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}