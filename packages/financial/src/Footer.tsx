'use client';

import { Badge } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Github, Twitter, Linkedin, Mail, Globe, MessageCircle } from 'lucide-react';

interface FooterProps {
  language: 'zh' | 'en';
}

export function Footer({ language }: FooterProps) {
  const content = {
    zh: {
      description: 'chaincoven - 用区块链和AI技术重塑金融量化生态',
      sections: {
        platform: {
          title: '平台',
          links: ['产品介绍', '技术架构', 'API文档', '开发者平台']
        },
        community: {
          title: '社区',
          links: ['会员中心', '社区论坛', '技术支持', '用户指南']
        },
        company: {
          title: '公司',
          links: ['关于我们', '招聘信息', '媒体报道', '合作伙伴']
        },
        legal: {
          title: '法律',
          links: ['隐私政策', '服务条款', '风险声明', '合规说明']
        }
      },
      download: {
        title: '下载应用',
        platforms: ['Web应用', 'iOS下载', 'Android下载', '桌面版']
      },
      contact: '联系我们',
      rights: '© 2024 ChainCoven. 保留所有权利.',
      disclaimer: '风险提示：数字资产投资有风险，请谨慎投资。'
    },
    en: {
      description: 'chaincoven - Reshaping financial quantitative ecosystem with blockchain and AI technology',
      sections: {
        platform: {
          title: 'Platform',
          links: ['Products', 'Architecture', 'API Docs', 'Developers']
        },
        community: {
          title: 'Community',
          links: ['Member Center', 'Forum', 'Support', 'User Guide']
        },
        company: {
          title: 'Company',
          links: ['About Us', 'Careers', 'Press', 'Partners']
        },
        legal: {
          title: 'Legal',
          links: ['Privacy Policy', 'Terms of Service', 'Risk Statement', 'Compliance']
        }
      },
      download: {
        title: 'Download App',
        platforms: ['Web App', 'iOS Download', 'Android Download', 'Desktop']
      },
      contact: 'Contact Us',
      rights: '© 2024 ChainCoven. All rights reserved.',
      disclaimer: 'Risk Warning: Digital asset investment is risky, please invest carefully.'
    }
  };

  const t = content[language];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: MessageCircle, href: '#', label: 'Discord' }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                chaincoven
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              {t.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 text-slate-400 hover:text-white hover:bg-slate-800/50"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(t.sections).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Download Section */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white mb-2">{t.download.title}</h4>
              <div className="flex flex-wrap gap-2">
                {t.download.platforms.map((platform, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50 cursor-pointer"
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Mail className="mr-2 w-4 h-4" />
              {t.contact}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900/50 border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
            <p>{t.rights}</p>
            <p className="mt-2 md:mt-0 text-orange-300">{t.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Animated Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse"></div>
    </footer>
  );
}