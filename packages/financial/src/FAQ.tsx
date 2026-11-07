'use client';

import { useState } from 'react';
import { Card, CardContent } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@yyc3/ui-enterprise';
import { Search } from 'lucide-react';

interface FAQProps {
  language: 'zh' | 'en';
}

export function FAQ({ language }: FAQProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const content = {
    zh: {
      title: '常见问题',
      subtitle: '快速获得您需要的答案',
      searchPlaceholder: '搜索问题...',
      categories: [
        {
          title: '新手指引',
          faqs: [
            {
              question: '什么是ChainCoven？',
              answer: 'ChainCoven是一个基于区块链和AI技术的金融量化平台，为用户提供智能化的投资决策工具和自动化交易服务。'
            },
            {
              question: '如何开始使用平台？',
              answer: '您需要先注册账户，完成身份验证，然后选择适合的会员套餐。我们提供详细的新手教程帮助您快速上手。'
            },
            {
              question: '平台支持哪些数字资产？',
              answer: '我们支持主流数字资产如BTC、ETH、BNB等，以及各大交易所的热门交易对。具体支持列表请查看产品文档。'
            }
          ]
        },
        {
          title: '平台安全',
          faqs: [
            {
              question: '平台如何保障资金安全？',
              answer: '我们采用多重安全机制，包括冷钱包存储、多重签名、智能合约审计、风控系统等，确保用户资金安全。'
            },
            {
              question: '个人信息会被泄露吗？',
              answer: '我们严格遵守数据保护法规，采用端到端加密技术，不会向第三方泄露用户个人信息。'
            },
            {
              question: '如何设置安全验证？',
              answer: '建议开启双因子认证(2FA)、设置强密码、绑定安全邮箱和手机号等多重安全验证措施。'
            }
          ]
        },
        {
          title: '合规说明',
          faqs: [
            {
              question: '平台是否合规运营？',
              answer: '我们严格遵守各国法律法规，持有相关金融牌照，定期接受监管审计，确保合规运营。'
            },
            {
              question: '是否支持税务报告？',
              answer: '平台提供详细的交易记录和收益报告，方便用户进行税务申报。具体要求请咨询当地税务部门。'
            },
            {
              question: '哪些地区可以使用？',
              answer: '我们在大部分国家和地区提供服务，但会根据当地法规限制某些功能。详情请查看服务条款。'
            }
          ]
        }
      ]
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Get the answers you need quickly',
      searchPlaceholder: 'Search questions...',
      categories: [
        {
          title: 'Getting Started',
          faqs: [
            {
              question: 'What is ChainCoven?',
              answer: 'ChainCoven is a blockchain and AI-powered financial quantitative platform that provides intelligent investment decision tools and automated trading services.'
            },
            {
              question: 'How to start using the platform?',
              answer: 'You need to register an account, complete identity verification, and then choose a suitable membership plan. We provide detailed tutorials to help you get started quickly.'
            },
            {
              question: 'Which digital assets are supported?',
              answer: 'We support mainstream digital assets like BTC, ETH, BNB, and popular trading pairs from major exchanges. Please check our product documentation for the complete list.'
            }
          ]
        },
        {
          title: 'Platform Security',
          faqs: [
            {
              question: 'How does the platform ensure fund security?',
              answer: 'We employ multiple security mechanisms including cold wallet storage, multi-signature, smart contract audits, and risk control systems to ensure user fund security.'
            },
            {
              question: 'Will personal information be leaked?',
              answer: 'We strictly comply with data protection regulations, use end-to-end encryption technology, and will not disclose user personal information to third parties.'
            },
            {
              question: 'How to set up security verification?',
              answer: 'We recommend enabling two-factor authentication (2FA), setting strong passwords, binding security email and phone numbers for multiple security verification.'
            }
          ]
        },
        {
          title: 'Compliance',
          faqs: [
            {
              question: 'Is the platform operating in compliance?',
              answer: 'We strictly comply with laws and regulations of various countries, hold relevant financial licenses, and undergo regular regulatory audits to ensure compliant operations.'
            },
            {
              question: 'Do you support tax reporting?',
              answer: 'The platform provides detailed transaction records and profit reports to facilitate user tax filing. Please consult local tax authorities for specific requirements.'
            },
            {
              question: 'Which regions can use the service?',
              answer: 'We provide services in most countries and regions, but may restrict certain functions according to local regulations. Please check our terms of service for details.'
            }
          ]
        }
      ]
    }
  };

  const t = content[language];

  const filteredCategories = t.categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-teal-500/20 text-teal-300 border-teal-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl text-white mb-6">{category.title}</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border-slate-700"
                    >
                      <AccordionTrigger className="text-slate-300 hover:text-white text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-400 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">没有找到相关问题，请尝试其他关键词或联系客服。</p>
          </div>
        )}
      </div>
    </section>
  );
}