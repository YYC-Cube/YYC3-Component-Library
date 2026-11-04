'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui';
import { Button } from '@yyc3/ui';
import { Badge } from '@yyc3/ui';
import { Separator } from '@yyc3/ui';
import { 
  FileText, 
  Download, 
  Share2, 
  BookOpen, 
  Lightbulb,
  Target,
  Layers,
  Users,
  Coins,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Database,
  Brain,
  Network,
  Code,
  Smartphone,
  Eye
} from 'lucide-react';

interface WhitepaperProps {
  language: 'zh' | 'en';
}

export function Whitepaper({ language }: WhitepaperProps) {
  const [activeSection, setActiveSection] = useState('overview');

  const content = {
    zh: {
      title: 'ChainCoven 白皮书',
      subtitle: 'AI金融量化平台',
      version: 'v1.0',
      lastUpdate: '2024年1月',
      downloadPdf: '下载PDF',
      shareWhitepaper: '分享白皮书',
      tableOfContents: '目录',
      sections: {
        overview: '项目概览',
        vision: '愿景与定位',
        problems: '市场痛点',
        architecture: '技术架构',
        markets: '核心市场',
        community: '社区生态',
        tokenomics: '代币经济',
        business: '商业模式',
        usecases: '应用场景',
        roadmap: '发展规划',
        team: '团队合作',
        risks: '风险对策'
      },
      highlights: {
        title: '核心亮点',
        items: [
          '全球首个区块链+AI驱动的金融量化平台',
          '四大创新市场：AI模型、因子、数据集、信号',
          '强化学习与AI Agent深度融合',
          '多终端智能交互体验',
          '开放API/SDK生态系统',
          '代币激励与DAO治理机制'
        ]
      },
      keyMetrics: {
        title: '关键指标',
        totalSupply: '代币总量',
        totalSupplyValue: '10亿枚',
        ecosystemValue: '生态价值',
        ecosystemValueDesc: '多市场联动',
        supportedTerminals: '支持终端',
        supportedTerminalsValue: '8+种设备',
        apiEndpoints: 'API接口',
        apiEndpointsValue: '200+个'
      }
    },
    en: {
      title: 'ChainCoven Whitepaper',
      subtitle: 'AI Financial Quantitative Platform',
      version: 'v1.0',
      lastUpdate: 'January 2024',
      downloadPdf: 'Download PDF',
      shareWhitepaper: 'Share Whitepaper',
      tableOfContents: 'Table of Contents',
      sections: {
        overview: 'Project Overview',
        vision: 'Vision & Positioning',
        problems: 'Market Pain Points',
        architecture: 'Technical Architecture',
        markets: 'Core Markets',
        community: 'Community Ecosystem',
        tokenomics: 'Token Economics',
        business: 'Business Model',
        usecases: 'Use Cases',
        roadmap: 'Development Roadmap',
        team: 'Team & Partnership',
        risks: 'Risk Management'
      },
      highlights: {
        title: 'Key Highlights',
        items: [
          'World\'s first blockchain+AI-driven financial quantitative platform',
          'Four innovative markets: AI models, factors, datasets, signals',
          'Deep integration of reinforcement learning and AI agents',
          'Multi-terminal intelligent interaction experience',
          'Open API/SDK ecosystem',
          'Token incentives and DAO governance mechanism'
        ]
      },
      keyMetrics: {
        title: 'Key Metrics',
        totalSupply: 'Total Supply',
        totalSupplyValue: '1 Billion',
        ecosystemValue: 'Ecosystem Value',
        ecosystemValueDesc: 'Multi-market synergy',
        supportedTerminals: 'Supported Terminals',
        supportedTerminalsValue: '8+ Devices',
        apiEndpoints: 'API Endpoints',
        apiEndpointsValue: '200+ APIs'
      }
    }
  };

  const t = content[language];

  const navigationItems = [
    { key: 'overview', label: t.sections.overview, icon: Eye },
    { key: 'vision', label: t.sections.vision, icon: Target },
    { key: 'problems', label: t.sections.problems, icon: Lightbulb },
    { key: 'architecture', label: t.sections.architecture, icon: Layers },
    { key: 'markets', label: t.sections.markets, icon: TrendingUp },
    { key: 'community', label: t.sections.community, icon: Users },
    { key: 'tokenomics', label: t.sections.tokenomics, icon: Coins },
    { key: 'business', label: t.sections.business, icon: Target },
    { key: 'usecases', label: t.sections.usecases, icon: Smartphone },
    { key: 'roadmap', label: t.sections.roadmap, icon: TrendingUp },
    { key: 'team', label: t.sections.team, icon: Users },
    { key: 'risks', label: t.sections.risks, icon: Shield }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. 项目愿景与定位</h2>
              <p className="text-slate-300 leading-relaxed">
                chaincoven 致力于打造全球领先的区块链+AI驱动的金融量化平台。平台以"开放、智能、共建"为核心理念，围绕AI交易模型/Agent、因子市场、数据集市场、AI信号市场等创新业务，构建以平台代币为核心的智能金融生态，赋能全球量化投资者、数据科学家、开发者和内容提供者。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium mb-1">AI驱动</h3>
                  <p className="text-slate-400 text-sm">深度学习与强化学习</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Network className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium mb-1">区块链</h3>
                  <p className="text-slate-400 text-sm">去中心化与透明化</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium mb-1">多元市场</h3>
                  <p className="text-slate-400 text-sm">模型、因子、数据、信号</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Globe className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium mb-1">全球生态</h3>
                  <p className="text-slate-400 text-sm">开放API与多终端</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'problems':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. 市场痛点与机会</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-300 text-lg">现有痛点</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">传统量化平台以策略为主，AI能力弱、创新慢，难以适应加密市场的高波动与多样性</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">AI大模型、RAG、知识图谱等新技术尚未在金融量化领域大规模落地</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">缺乏高质量因子、数据、AI模型的交易与激励机制，开发者动力不足</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">多终端智能交互需求日益增长，但现有平台支持有限</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 text-lg">我们的机会</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">构建AI+区块链融合的量化生态系统</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">创新四大核心市场，实现价值流通与激励</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">开放API/SDK生态，支持多终端设备接入</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">代币经济与DAO治理，建立可持续发展机制</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
        
      case 'architecture':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. 技术架构与核心能力</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">3.1 分层架构</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-blue-300 text-sm">数据采集层</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300">
                      多源异构数据统一接入，Pulsar消息队列分发
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-green-300 text-sm">流批处理层</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300">
                      Flink实时处理，Spark批量计算
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-purple-300 text-sm">分层存储层</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300">
                      QuestDB、ClickHouse、MinIO多层存储
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-500/10 border-orange-500/30">
                    <CardHeader>
                      <CardTitle className="text-orange-300 text-sm">AI系统层</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300">
                      AI Copilot、RL Agent、因子生成
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3.2 核心技术栈</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { name: 'QuestDB', category: '热数据' },
                    { name: 'ClickHouse', category: '冷数据' },
                    { name: 'MinIO', category: '对象存储' },
                    { name: 'Milvus', category: '向量数据库' },
                    { name: 'Neo4j', category: '知识图谱' },
                    { name: 'Kubernetes', category: '容器化' }
                  ].map((tech, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-3 text-center">
                        <Code className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                        <p className="text-white text-sm font-medium">{tech.name}</p>
                        <p className="text-slate-400 text-xs">{tech.category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'markets':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. 平台核心市场与创新点</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-400" />
                      AI模型市场
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• 用户可用平台代币购买、训练、订阅、复用AI交易模型</p>
                    <p>• 开发者可获得收益分成，支持排行榜、审核机制</p>
                    <p>• 支持迁移学习和模型组合优化</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-400" />
                      因子市场
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• 因子开发者可上传、发布、打包销售高质量因子</p>
                    <p>• 用户用代币交易、订阅、组合因子</p>
                    <p>• 平台支持因子溯源、版本管理、收益分成</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Database className="w-5 h-5 mr-2 text-green-400" />
                      数据集市场
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• 用户和开发者可用代币购买、订阅、下载各类高质量数据集</p>
                    <p>• 支持API调用、自动更新、质量报告</p>
                    <p>• 透明的收益分成机制</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
                      AI信号市场
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• AI模型自动生成多类型信号，用户用代币订阅、购买</p>
                    <p>• 开发者可获得激励，平台支持信号回测</p>
                    <p>• 排行榜展示和实时推送服务</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
        
      case 'tokenomics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. 平台代币经济模型（LYH Token）</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">6.1 代币基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium mb-1">代币名称</h4>
                      <p className="text-slate-300">LYH Token</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium mb-1">总量上限</h4>
                      <p className="text-slate-300">10亿枚</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium mb-1">发行策略</h4>
                      <p className="text-slate-300">永不增发</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">6.2 核心应用场景</h3>
                <div className="space-y-3">
                  {[
                    'AI模型市场交易 - 购买、训练、订阅AI交易模型',
                    '因子市场交易 - 因子开发者获得收益，用户订阅购买因子',
                    '数据集市场交易 - 购买、订阅、下载高质量数据集',
                    'AI信号市场交易 - 订阅购买AI信号，开发者获得收益',
                    'AI服务消耗 - 高级AI功能、算力包、API调用',
                    '社区激励与治理 - DAO投票、内容创作奖励',
                    '项目发行与众筹 - IDO、NFT发行参与',
                    '生态合作激励 - 第三方开发者、合作伙伴激励'
                  ].map((scenario, index) => (
                    <Card key={index} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-medium">{index + 1}</span>
                          </div>
                          <p className="text-slate-300 text-sm">{scenario}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'roadmap':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">11. 发展规划与里程碑</h2>
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-300">0-6个月：MVP阶段</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• MVP开发、K8s部署</p>
                    <p>• 核心功能上线：行情、AI交易模型、因子市场、数据集市场</p>
                    <p>• AI信号市场、AI Copilot、RAG、知识图谱</p>
                    <p>• 社区论坛建立</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-300">6-12个月：生态建设</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• 多平台内容接入</p>
                    <p>• 平台代币发行与经济模型启动</p>
                    <p>• 项目发行功能</p>
                    <p>• API/SDK开放，开发者生态建设</p>
                    <p>• 移动端和可穿戴终端适配</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300">12-24个月：全球扩展</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>• 生态系统扩展与深化</p>
                    <p>• B端企业合作</p>
                    <p>• 国际化运营</p>
                    <p>• 品牌定制化服务</p>
                    <p>• AI手表/眼镜/汽车终端/耳机等智能硬件落地</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">选择左侧目录查看详细内容</p>
          </div>
        );
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">{t.title}</h1>
          </div>
          <p className="text-xl text-slate-300 mb-2">{t.subtitle}</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              {t.version}
            </Badge>
            <span>{t.lastUpdate}</span>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                {t.highlights.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.highlights.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">{t.keyMetrics.totalSupply}</h3>
                <p className="text-slate-300 text-xl font-bold">{t.keyMetrics.totalSupplyValue}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Network className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">{t.keyMetrics.ecosystemValue}</h3>
                <p className="text-slate-300 text-xl font-bold">{t.keyMetrics.ecosystemValueDesc}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">{t.keyMetrics.supportedTerminals}</h3>
                <p className="text-slate-300 text-xl font-bold">{t.keyMetrics.supportedTerminalsValue}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Code className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">{t.keyMetrics.apiEndpoints}</h3>
                <p className="text-slate-300 text-xl font-bold">{t.keyMetrics.apiEndpointsValue}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  {t.tableOfContents}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-2 ${
                        activeSection === item.key
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                {renderSectionContent()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Download className="w-5 h-5 mr-2" />
              {t.downloadPdf}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-3">
              <Share2 className="w-5 h-5 mr-2" />
              {t.shareWhitepaper}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}