'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react';

interface NewsSectionProps {
  language: 'zh' | 'en';
}

export function NewsSection({ language }: NewsSectionProps) {
  const content = {
    zh: {
      title: '新闻动态',
      subtitle: '最新进展与媒体报道',
      news: [
        {
          type: '产品发布',
          title: 'ChainCoven AI Copilot正式上线',
          description: '全新AI智能交易助手，支持自然语言交互和自动化策略执行',
          date: '2024-01-15',
          tag: '重要更新'
        },
        {
          type: '媒体报道',
          title: 'Forbes：Web3量化交易的新趋势',
          description: 'ChainCoven被评为最具创新力的AI金融科技平台之一',
          date: '2024-01-10',
          tag: '媒体报道'
        },
        {
          type: '合作公告',
          title: '与币安智能链深度合作',
          description: '成为BSC生态官方合作伙伴，共建DeFi量化交易基础设施',
          date: '2024-01-05',
          tag: '战略合作'
        },
        {
          type: '活动预告',
          title: 'Web3量化交易峰会即将举办',
          description: '邀请全球顶级量化团队分享最新策略和技术发展',
          date: '2024-02-01',
          tag: '即将举办'
        }
      ],
      cta: '查看全部'
    },
    en: {
      title: 'News & Updates',
      subtitle: 'Latest Developments & Media Coverage',
      news: [
        {
          type: 'Product Launch',
          title: 'ChainCoven AI Copilot Officially Launched',
          description: 'New AI intelligent trading assistant supporting natural language interaction and automated strategy execution',
          date: '2024-01-15',
          tag: 'Major Update'
        },
        {
          type: 'Media Coverage',
          title: 'Forbes: New Trends in Web3 Quantitative Trading',
          description: 'ChainCoven rated as one of the most innovative AI fintech platforms',
          date: '2024-01-10',
          tag: 'Media Report'
        },
        {
          type: 'Partnership',
          title: 'Deep Cooperation with Binance Smart Chain',
          description: 'Became BSC ecosystem official partner to build DeFi quantitative trading infrastructure',
          date: '2024-01-05',
          tag: 'Strategic Partnership'
        },
        {
          type: 'Event',
          title: 'Web3 Quantitative Trading Summit Coming Soon',
          description: 'Inviting top global quantitative teams to share latest strategies and technology developments',
          date: '2024-02-01',
          tag: 'Upcoming Event'
        }
      ],
      cta: 'View All'
    }
  };

  const t = content[language];

  const getTagColor = (tag: string) => {
    if (tag.includes('重要') || tag.includes('Major')) return 'bg-red-500/20 text-red-300 border-red-400/30';
    if (tag.includes('媒体') || tag.includes('Media')) return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
    if (tag.includes('合作') || tag.includes('Partnership')) return 'bg-green-500/20 text-green-300 border-green-400/30';
    return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {t.news.map((item, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className={getTagColor(item.tag)}>
                    {item.tag}
                  </Badge>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {item.date}
                  </div>
                </div>
                <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-0">
                  阅读更多
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 px-8 py-3 group"
          >
            {t.cta}
            <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}