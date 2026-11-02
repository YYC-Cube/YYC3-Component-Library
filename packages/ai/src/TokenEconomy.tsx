'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowRight, 
  PieChart,
  Vote,
  Gift,
  Repeat
} from 'lucide-react';

interface TokenEconomyProps {
  language: 'zh' | 'en';
}

export function TokenEconomy({ language }: TokenEconomyProps) {
  const content = {
    zh: {
      title: '平台代币经济',
      subtitle: 'LYH Token，驱动生态价值循环',
      description: '基于区块链的代币经济模型，激励生态参与者，实现价值共享与可持续发展',
      tokenInfo: {
        name: 'LYH Token',
        totalSupply: '10亿枚',
        symbol: 'LYH',
        network: 'Ethereum / BSC'
      },
      useCases: [
        {
          icon: TrendingUp,
          title: 'AI交易模型分成',
          description: '用户使用代币支付模型费用，参与收益分成，策略开发者获得代币奖励',
          percentage: 35,
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: Zap,
          title: 'AI服务消耗',
          description: '高级AI功能、API调用、模型训练等服务需消耗代币，推动代币流通',
          percentage: 25,
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Users,
          title: '社区激励与治理',
          description: '内容创作、策略分享、社区贡献获得代币奖励，参与DAO治理投票',
          percentage: 20,
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Gift,
          title: '会员订阅与权益',
          description: '会员订阅、等级升级、专属功能解锁均以代币支付，享受平台分红',
          percentage: 20,
          color: 'from-orange-400 to-red-600'
        }
      ],
      distribution: {
        title: '代币分配',
        items: [
          { label: '生态激励', percentage: 40, color: 'bg-blue-500' },
          { label: '社区预售', percentage: 25, color: 'bg-purple-500' },
          { label: '团队与顾问', percentage: 20, color: 'bg-green-500' },
          { label: '合作伙伴', percentage: 10, color: 'bg-orange-500' },
          { label: '基金会储备', percentage: 5, color: 'bg-gray-500' }
        ]
      },
      flowPath: {
        title: '代币流转路径',
        steps: [
          '用户购买/获得代币',
          '支付AI服务/模型费用',
          '开发者/创作者获得分成',
          '平台回购与销毁',
          '生态基金再投资'
        ]
      },
      benefits: {
        title: '持币权益',
        items: [
          '平台收益分红',
          'DAO治理投票权',
          '新项目优先投资权',
          '会员等级折扣',
          '专属活动参与权',
          '空投奖励'
        ]
      },
      cta: '了解代币经济'
    },
    en: {
      title: 'Platform Token Economy',
      subtitle: 'LYH Token, Driving Ecosystem Value Circulation',
      description: 'Blockchain-based token economic model that incentivizes ecosystem participants and achieves value sharing and sustainable development',
      tokenInfo: {
        name: 'LYH Token',
        totalSupply: '1 Billion',
        symbol: 'LYH',
        network: 'Ethereum / BSC'
      },
      useCases: [
        {
          icon: TrendingUp,
          title: 'AI Trading Model Revenue Sharing',
          description: 'Users pay model fees with tokens, participate in revenue sharing, strategy developers receive token rewards',
          percentage: 35,
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: Zap,
          title: 'AI Service Consumption',
          description: 'Advanced AI functions, API calls, model training services require token consumption, driving token circulation',
          percentage: 25,
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Users,
          title: 'Community Incentives & Governance',
          description: 'Content creation, strategy sharing, community contributions earn token rewards, participate in DAO governance voting',
          percentage: 20,
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Gift,
          title: 'Membership & Benefits',
          description: 'Membership subscriptions, level upgrades, exclusive features unlocked with tokens, enjoy platform dividends',
          percentage: 20,
          color: 'from-orange-400 to-red-600'
        }
      ],
      distribution: {
        title: 'Token Distribution',
        items: [
          { label: 'Ecosystem Incentives', percentage: 40, color: 'bg-blue-500' },
          { label: 'Community Presale', percentage: 25, color: 'bg-purple-500' },
          { label: 'Team & Advisors', percentage: 20, color: 'bg-green-500' },
          { label: 'Partners', percentage: 10, color: 'bg-orange-500' },
          { label: 'Foundation Reserve', percentage: 5, color: 'bg-gray-500' }
        ]
      },
      flowPath: {
        title: 'Token Flow Path',
        steps: [
          'Users purchase/earn tokens',
          'Pay for AI services/model fees',
          'Developers/creators receive shares',
          'Platform buyback & burn',
          'Ecosystem fund reinvestment'
        ]
      },
      benefits: {
        title: 'Token Holder Benefits',
        items: [
          'Platform revenue dividends',
          'DAO governance voting rights',
          'New project priority investment',
          'Membership level discounts',
          'Exclusive event participation',
          'Airdrop rewards'
        ]
      },
      cta: 'Learn Token Economy'
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Token Info */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white mb-2">{t.tokenInfo.name}</h4>
                <p className="text-slate-400 text-sm">{t.tokenInfo.symbol}</p>
              </div>
              <div>
                <div className="text-2xl text-yellow-400 mb-2">{t.tokenInfo.totalSupply}</div>
                <p className="text-slate-400 text-sm">总供应量</p>
              </div>
              <div>
                <div className="text-2xl text-blue-400 mb-2">永不增发</div>
                <p className="text-slate-400 text-sm">通缩机制</p>
              </div>
              <div>
                <div className="text-lg text-green-400 mb-2">{t.tokenInfo.network}</div>
                <p className="text-slate-400 text-sm">支持网络</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {t.useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${useCase.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{useCase.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">使用占比</span>
                    <span className="text-white">{useCase.percentage}%</span>
                  </div>
                  <Progress value={useCase.percentage} className="h-2 bg-slate-700" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Token Distribution */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-400" />
                {t.distribution.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {t.distribution.items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2 bg-slate-700" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Token Flow */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Repeat className="w-5 h-5 mr-2 text-green-400" />
                {t.flowPath.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {t.flowPath.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">{index + 1}</span>
                  </div>
                  <span className="text-slate-300 text-sm">{step}</span>
                  {index < t.flowPath.steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 ml-auto" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Token Benefits */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Vote className="w-5 h-5 mr-2 text-purple-400" />
              {t.benefits.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.benefits.items.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white border-0 px-8 py-3 group"
          >
            {t.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}