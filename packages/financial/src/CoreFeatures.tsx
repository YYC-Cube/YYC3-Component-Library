'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Zap, 
  Network, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CoreFeaturesProps {
  language: 'zh' | 'en';
}

export function CoreFeatures({ language }: CoreFeaturesProps) {
  const content = {
    zh: {
      title: '核心功能',
      subtitle: '智能量化，全面覆盖',
      description: '从数据分析到AI决策，从回测验证到实盘交易，一站式量化交易解决方案',
      features: [
        {
          icon: BarChart3,
          title: '智能仪表板',
          description: '实时市场监控、系统性能、智能预警，全方位掌控交易状态',
          highlights: ['实时数据', '性能监控', '智能预警', '多市场支持'],
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: TrendingUp,
          title: '专业行情图表',
          description: '集成TradingView专业图表，支持技术分析、AI分析、智能解读',
          highlights: ['K线图表', '技术指标', 'AI解读', '智能对话'],
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Brain,
          title: 'AI Copilot助手',
          description: '自然语言交互，智能决策建议，AI执行监控，全程智能陪伴',
          highlights: ['自然对话', '智能建议', 'AI执行', '风险控制'],
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Target,
          title: '策略回测系统',
          description: '专业回测引擎，多维度分析，策略优化，历史验证',
          highlights: ['专业回测', '多维分析', '策略优化', '报告导出'],
          color: 'from-orange-400 to-red-600'
        },
        {
          icon: Zap,
          title: '智能因子分析',
          description: '自动化因子生成，IC值分析，因子筛选，智能组合',
          highlights: ['自动生成', 'IC分析', '因子筛选', '智能组合'],
          color: 'from-indigo-400 to-blue-600'
        },
        {
          icon: Network,
          title: '知识图谱',
          description: '金融实体关系，供应链分析，投资关系，智能推理',
          highlights: ['实体关系', '供应链', '投资网络', '智能推理'],
          color: 'from-teal-400 to-cyan-600'
        }
      ],
      cta: '探索功能',
      learnMore: '了解详情'
    },
    en: {
      title: 'Core Features',
      subtitle: 'Intelligent Quantitative, Comprehensive Coverage',
      description: 'From data analysis to AI decisions, from backtesting to live trading, one-stop quantitative trading solution',
      features: [
        {
          icon: BarChart3,
          title: 'Smart Dashboard',
          description: 'Real-time market monitoring, system performance, intelligent alerts, comprehensive trading control',
          highlights: ['Real-time Data', 'Performance Monitor', 'Smart Alerts', 'Multi-market Support'],
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: TrendingUp,
          title: 'Professional Charts',
          description: 'Integrated TradingView professional charts, supporting technical analysis, AI analysis, intelligent interpretation',
          highlights: ['K-line Charts', 'Technical Indicators', 'AI Interpretation', 'Smart Dialogue'],
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Brain,
          title: 'AI Copilot Assistant',
          description: 'Natural language interaction, intelligent decision suggestions, AI execution monitoring, full intelligent companion',
          highlights: ['Natural Dialogue', 'Smart Suggestions', 'AI Execution', 'Risk Control'],
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Target,
          title: 'Strategy Backtesting',
          description: 'Professional backtesting engine, multi-dimensional analysis, strategy optimization, historical validation',
          highlights: ['Professional Backtest', 'Multi-dimensional Analysis', 'Strategy Optimization', 'Report Export'],
          color: 'from-orange-400 to-red-600'
        },
        {
          icon: Zap,
          title: 'Smart Factor Analysis',
          description: 'Automated factor generation, IC value analysis, factor screening, intelligent combination',
          highlights: ['Auto Generation', 'IC Analysis', 'Factor Screening', 'Smart Combination'],
          color: 'from-indigo-400 to-blue-600'
        },
        {
          icon: Network,
          title: 'Knowledge Graph',
          description: 'Financial entity relationships, supply chain analysis, investment relationships, intelligent reasoning',
          highlights: ['Entity Relations', 'Supply Chain', 'Investment Network', 'Smart Reasoning'],
          color: 'from-teal-400 to-cyan-600'
        }
      ],
      cta: 'Explore Features',
      learnMore: 'Learn More'
    }
  };

  const t = content[language];

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group hover:scale-105"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="bg-slate-700/50 text-slate-300 text-xs"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 group"
                    >
                      {t.learnMore}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 group"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            {t.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}