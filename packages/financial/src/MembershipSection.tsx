'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, Crown, Zap, Star, ArrowRight } from 'lucide-react';

interface MembershipSectionProps {
  language: 'zh' | 'en';
  onSubscribe?: () => void;
}

export function MembershipSection({ language, onSubscribe }: MembershipSectionProps) {
  const content = {
    zh: {
      title: '会员订阅',
      subtitle: '选择适合您的专业方案',
      description: '仅支持加密货币支付，享受去中心化金融服务',
      paymentNote: '💰 仅支持加密货币支付 (USDT, ETH, BTC)',
      plans: [
        {
          name: '免费版',
          price: '0',
          period: '永久免费',
          description: '体验基础功能',
          icon: Zap,
          color: 'from-slate-400 to-slate-600',
          features: [
            '基础行情查看',
            '简单技术指标',
            '社区论坛访问',
            '基础AI对话',
            '每日5次AI询问'
          ],
          limitations: [
            '无策略回测',
            '无高级因子',
            '无实时信号'
          ]
        },
        {
          name: '基础版',
          price: '99',
          period: '每月',
          description: '适合个人投资者',
          icon: Star,
          color: 'from-blue-400 to-blue-600',
          popular: true,
          features: [
            '完整行情数据',
            '策略回测功能',
            '基础AI分析',
            '因子库访问',
            '每日50次AI询问',
            '邮件客服支持'
          ],
          crypto: 'USDT'
        },
        {
          name: '高级版',
          price: '299',
          period: '每月',
          description: '适合专业交易者',
          icon: Crown,
          color: 'from-purple-400 to-purple-600',
          features: [
            '实时AI信号',
            '高级因子分析',
            'AI Copilot助手',
            '知识图谱访问',
            '无限AI询问',
            '策略市场权限',
            '优先客服支持',
            '专属活动邀请'
          ],
          crypto: 'ETH'
        },
        {
          name: 'VIP版',
          price: '999',
          period: '每月',
          description: '适合机构用户',
          icon: Crown,
          color: 'from-orange-400 to-red-600',
          features: [
            '所有高级功能',
            'API开发者权限',
            '定制化策略',
            '私享投研报告',
            '1对1专属客服',
            '线下活动优先权',
            '项目早期投资权',
            '平台治理投票权'
          ],
          crypto: 'BTC'
        }
      ],
      cta: '立即订阅',
      currentPlan: '当前方案'
    },
    en: {
      title: 'Membership',
      subtitle: 'Choose the Right Professional Plan for You',
      description: 'Cryptocurrency payments only, enjoy decentralized financial services',
      paymentNote: '💰 Cryptocurrency payments only (USDT, ETH, BTC)',
      plans: [
        {
          name: 'Free',
          price: '0',
          period: 'Forever Free',
          description: 'Experience basic features',
          icon: Zap,
          color: 'from-slate-400 to-slate-600',
          features: [
            'Basic market data',
            'Simple technical indicators',
            'Community forum access',
            'Basic AI chat',
            '5 AI queries per day'
          ],
          limitations: [
            'No strategy backtesting',
            'No advanced factors',
            'No real-time signals'
          ]
        },
        {
          name: 'Basic',
          price: '99',
          period: 'per month',
          description: 'For individual investors',
          icon: Star,
          color: 'from-blue-400 to-blue-600',
          popular: true,
          features: [
            'Complete market data',
            'Strategy backtesting',
            'Basic AI analysis',
            'Factor library access',
            '50 AI queries per day',
            'Email customer support'
          ],
          crypto: 'USDT'
        },
        {
          name: 'Premium',
          price: '299',
          period: 'per month',
          description: 'For professional traders',
          icon: Crown,
          color: 'from-purple-400 to-purple-600',
          features: [
            'Real-time AI signals',
            'Advanced factor analysis',
            'AI Copilot assistant',
            'Knowledge graph access',
            'Unlimited AI queries',
            'Strategy market access',
            'Priority customer support',
            'Exclusive event invitations'
          ],
          crypto: 'ETH'
        },
        {
          name: 'VIP',
          price: '999',
          period: 'per month',
          description: 'For institutional users',
          icon: Crown,
          color: 'from-orange-400 to-red-600',
          features: [
            'All premium features',
            'API developer access',
            'Customized strategies',
            'Private research reports',
            '1-on-1 dedicated support',
            'Offline event priority',
            'Early project investment rights',
            'Platform governance voting'
          ],
          crypto: 'BTC'
        }
      ],
      cta: 'Subscribe Now',
      currentPlan: 'Current Plan'
    }
  };

  const t = content[language];

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    }
  };

  return (
    <section id="membership" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-orange-500/20 text-orange-300 border-orange-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
            {t.description}
          </p>
          <p className="text-orange-300 text-sm bg-orange-500/10 px-4 py-2 rounded-lg inline-block">
            {t.paymentNote}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.plans.map((plan, index) => {
            const Icon = plan.icon;
            
            return (
              <Card 
                key={index}
                className={`relative bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500/50 scale-105' : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center mt-4">
                    <span className="text-3xl text-white">${plan.price}</span>
                    <span className="text-slate-400 text-sm">/{plan.period}</span>
                    {plan.crypto && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                          {plan.crypto}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Limitations for free plan */}
                  {plan.limitations && (
                    <div className="space-y-2 pt-2 border-t border-slate-700">
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <span className="w-4 h-4 text-red-400 text-center">×</span>
                          <span className="text-slate-400 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleSubscribe}
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    } text-white`}
                  >
                    {index === 0 ? 'Get Started' : t.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            {language === 'zh' 
              ? '所有订阅均支持随时取消，按月计费。VIP用户享受平台治理权限和代币激励。' 
              : 'All subscriptions can be cancelled at any time, billed monthly. VIP users enjoy platform governance rights and token incentives.'
            }
          </p>
        </div>
      </div>
    </section>
  );
}