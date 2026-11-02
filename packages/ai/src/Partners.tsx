'use client';

import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface PartnersProps {
  language: 'zh' | 'en';
}

export function Partners({ language }: PartnersProps) {
  const content = {
    zh: {
      title: '合作伙伴与生态联盟',
      subtitle: '携手共建Web3金融生态',
      categories: [
        {
          title: '区块链基础设施',
          partners: ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Arbitrum', 'Optimism']
        },
        {
          title: '金融机构',
          partners: ['Coinbase', 'Binance', 'OKX', 'Huobi', 'Kraken']
        },
        {
          title: 'AI技术伙伴',
          partners: ['OpenAI', 'Anthropic', 'Google Cloud', 'AWS', 'Microsoft Azure']
        },
        {
          title: '数据服务商',
          partners: ['CoinGecko', 'CoinMarketCap', 'Messari', 'Glassnode', 'Santiment']
        }
      ]
    },
    en: {
      title: 'Partners & Ecosystem Alliance',
      subtitle: 'Building Web3 Financial Ecosystem Together',
      categories: [
        {
          title: 'Blockchain Infrastructure',
          partners: ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Arbitrum', 'Optimism']
        },
        {
          title: 'Financial Institutions',
          partners: ['Coinbase', 'Binance', 'OKX', 'Huobi', 'Kraken']
        },
        {
          title: 'AI Technology Partners',
          partners: ['OpenAI', 'Anthropic', 'Google Cloud', 'AWS', 'Microsoft Azure']
        },
        {
          title: 'Data Service Providers',
          partners: ['CoinGecko', 'CoinMarketCap', 'Messari', 'Glassnode', 'Santiment']
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.categories.map((category, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-white mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.partners.map((partner, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <span className="text-slate-300">{partner}</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 text-xs">
                        已集成
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          <div className="text-center">
            <div className="text-3xl text-blue-400 mb-2">50+</div>
            <div className="text-slate-400 text-sm">合作伙伴</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-purple-400 mb-2">15+</div>
            <div className="text-slate-400 text-sm">支持公链</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-green-400 mb-2">200+</div>
            <div className="text-slate-400 text-sm">集成协议</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-orange-400 mb-2">$500M+</div>
            <div className="text-slate-400 text-sm">生态TVL</div>
          </div>
        </div>
      </div>
    </section>
  );
}