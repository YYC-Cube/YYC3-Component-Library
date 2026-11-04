'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { 
  Shield, 
  Link, 
  Vote, 
  Layers,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface BlockchainEcosystemProps {
  language: 'zh' | 'en';
}

export function BlockchainEcosystem({ language }: BlockchainEcosystemProps) {
  const content = {
    zh: {
      title: '区块链生态',
      subtitle: '重塑金融量化生态',
      description: 'chaincoven作为区块链金融科技平台，致力于构建透明、安全、去中心化的金融量化生态系统',
      features: [
        {
          icon: Shield,
          title: '链上数据透明',
          description: '所有交易数据、模型表现、收益分配均在区块链上公开透明，确保数据真实性与可追溯性',
          highlights: ['数据不可篡改', '全程可追溯', '公开透明', '去中心化验证'],
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: Link,
          title: '智能合约',
          description: '基于智能合约的自动化执行机制，确保收益分配、权限管理、交易执行的公平性与安全性',
          highlights: ['自动执行', '无需信任', '程序化治理', '安全可靠'],
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Vote,
          title: '去中心化治理',
          description: '社区持币者参与平台重大决策，包括功能更新、费率调整、生态发展等关键事项的投票治理',
          highlights: ['社区治理', 'DAO投票', '共同决策', '生态共建'],
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Layers,
          title: '跨链互操作',
          description: '支持多链部署与跨链资产管理，实现不同区块链网络间的资产流动与数据互通',
          highlights: ['多链支持', '资产互通', '数据同步', '生态融合'],
          color: 'from-orange-400 to-red-600'
        }
      ],
      vision: {
        title: '平台愿景与价值观',
        items: [
          {
            title: '推动金融创新',
            description: '利用区块链和AI技术，打造下一代金融基础设施，推动行业数字化转型'
          },
          {
            title: '赋能社区共建',
            description: '构建开放、包容的开发者生态，让每个参与者都能从平台发展中获益'
          },
          {
            title: '促进数字资产合规与普惠',
            description: '在合规框架下，让更多用户享受到数字资产投资的便利与收益'
          }
        ]
      },
      cta: '了解生态'
    },
    en: {
      title: 'Blockchain Ecosystem',
      subtitle: 'Reshaping Financial Quantitative Ecosystem',
      description: 'chaincoven as a blockchain fintech platform, committed to building a transparent, secure, and decentralized financial quantitative ecosystem',
      features: [
        {
          icon: Shield,
          title: 'On-chain Data Transparency',
          description: 'All trading data, model performance, and revenue distribution are publicly transparent on the blockchain, ensuring data authenticity and traceability',
          highlights: ['Immutable Data', 'Full Traceability', 'Public Transparency', 'Decentralized Verification'],
          color: 'from-blue-400 to-cyan-600'
        },
        {
          icon: Link,
          title: 'Smart Contracts',
          description: 'Automated execution mechanism based on smart contracts, ensuring fairness and security in revenue distribution, permission management, and trade execution',
          highlights: ['Auto Execution', 'Trustless', 'Programmable Governance', 'Secure & Reliable'],
          color: 'from-purple-400 to-pink-600'
        },
        {
          icon: Vote,
          title: 'Decentralized Governance',
          description: 'Community token holders participate in major platform decisions, including feature updates, fee adjustments, and ecosystem development voting',
          highlights: ['Community Governance', 'DAO Voting', 'Collective Decision', 'Ecosystem Co-building'],
          color: 'from-green-400 to-emerald-600'
        },
        {
          icon: Layers,
          title: 'Cross-chain Interoperability',
          description: 'Support multi-chain deployment and cross-chain asset management, enabling asset flow and data interoperability between different blockchain networks',
          highlights: ['Multi-chain Support', 'Asset Interoperability', 'Data Synchronization', 'Ecosystem Integration'],
          color: 'from-orange-400 to-red-600'
        }
      ],
      vision: {
        title: 'Platform Vision & Values',
        items: [
          {
            title: 'Driving Financial Innovation',
            description: 'Using blockchain and AI technology to build next-generation financial infrastructure and drive industry digital transformation'
          },
          {
            title: 'Empowering Community Co-building',
            description: 'Building an open and inclusive developer ecosystem where every participant can benefit from platform development'
          },
          {
            title: 'Promoting Digital Asset Compliance & Inclusion',
            description: 'Under the compliance framework, enabling more users to enjoy the convenience and benefits of digital asset investment'
          }
        ]
      },
      cta: 'Explore Ecosystem'
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-green-500/20 text-green-300 border-green-400/30">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
                  <div className="grid grid-cols-2 gap-2">
                    {feature.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-xs">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Vision Section */}
        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-2xl text-white mb-8 text-center flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
            {t.vision.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.vision.items.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h4 className="text-white">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 px-8 py-3 group"
          >
            {t.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}