'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@yyc3/ui-enterprise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui-enterprise';
import { 
  Network, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Share, 
  Maximize,
  Users,
  Building,
  TrendingUp,
  Link
} from 'lucide-react';

interface KnowledgeGraphProps {
  language: 'zh' | 'en';
}

export function KnowledgeGraph({ language }: KnowledgeGraphProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState('all');

  const content = {
    zh: {
      title: '知识图谱',
      subtitle: '探索实体关系与智能洞察',
      tabs: {
        overview: '图谱概览',
        entities: '实体管理',
        relations: '关系分析',
        insights: '智能洞察'
      },
      stats: {
        entities: '实体数量',
        relations: '关系连接',
        types: '关系类型',
        updates: '更新时间'
      },
      entityTypes: [
        { value: 'all', label: '全部实体' },
        { value: 'company', label: '公司' },
        { value: 'person', label: '人员' },
        { value: 'project', label: '项目' },
        { value: 'token', label: '代币' },
        { value: 'exchange', label: '交易所' }
      ],
      relationTypes: [
        {
          type: 'investment',
          name: '投资关系',
          description: '机构与项目间的投资关系',
          count: 1247,
          color: 'bg-blue-500'
        },
        {
          type: 'partnership',
          name: '合作关系', 
          description: '公司与项目间的战略合作',
          count: 856,
          color: 'bg-green-500'
        },
        {
          type: 'employment',
          name: '雇佣关系',
          description: '人员与公司间的就职关系',
          count: 2341,
          color: 'bg-purple-500'
        },
        {
          type: 'ownership',
          name: '持有关系',
          description: '代币持有与控制关系',
          count: 567,
          color: 'bg-orange-500'
        }
      ],
      entities: [
        {
          id: 1,
          name: 'Binance',
          type: 'exchange',
          category: '交易所',
          connections: 145,
          description: '全球最大的加密货币交易平台',
          tags: ['交易所', 'BNB', '全球']
        },
        {
          id: 2,
          name: 'Vitalik Buterin',
          type: 'person',
          category: '人员',
          connections: 89,
          description: '以太坊联合创始人',
          tags: ['以太坊', '创始人', '开发者']
        },
        {
          id: 3,
          name: 'Ethereum',
          type: 'project',
          category: '项目',
          connections: 234,
          description: '智能合约区块链平台',
          tags: ['区块链', '智能合约', 'DeFi']
        },
        {
          id: 4,
          name: 'Coinbase',
          type: 'company',
          category: '公司',
          connections: 167,
          description: '美国上市加密货币公司',
          tags: ['交易所', '上市公司', '美国']
        }
      ],
      searchPlaceholder: '搜索实体或关系...',
      actions: {
        viewGraph: '查看图谱',
        export: '导出数据',
        share: '分享',
        fullscreen: '全屏查看'
      }
    },
    en: {
      title: 'Knowledge Graph',
      subtitle: 'Explore Entity Relationships & Intelligent Insights',
      tabs: {
        overview: 'Graph Overview',
        entities: 'Entity Management',
        relations: 'Relationship Analysis',
        insights: 'Smart Insights'
      },
      stats: {
        entities: 'Entity Count',
        relations: 'Relationship Connections',
        types: 'Relationship Types',
        updates: 'Update Time'
      },
      entityTypes: [
        { value: 'all', label: 'All Entities' },
        { value: 'company', label: 'Company' },
        { value: 'person', label: 'Person' },
        { value: 'project', label: 'Project' },
        { value: 'token', label: 'Token' },
        { value: 'exchange', label: 'Exchange' }
      ],
      relationTypes: [
        {
          type: 'investment',
          name: 'Investment Relations',
          description: 'Investment relationships between institutions and projects',
          count: 1247,
          color: 'bg-blue-500'
        },
        {
          type: 'partnership',
          name: 'Partnership Relations',
          description: 'Strategic partnerships between companies and projects',
          count: 856,
          color: 'bg-green-500'
        },
        {
          type: 'employment',
          name: 'Employment Relations',
          description: 'Employment relationships between people and companies',
          count: 2341,
          color: 'bg-purple-500'
        },
        {
          type: 'ownership',
          name: 'Ownership Relations',
          description: 'Token holding and control relationships',
          count: 567,
          color: 'bg-orange-500'
        }
      ],
      entities: [
        {
          id: 1,
          name: 'Binance',
          type: 'exchange',
          category: 'Exchange',
          connections: 145,
          description: 'World\'s largest cryptocurrency trading platform',
          tags: ['Exchange', 'BNB', 'Global']
        },
        {
          id: 2,
          name: 'Vitalik Buterin',
          type: 'person',
          category: 'Person',
          connections: 89,
          description: 'Co-founder of Ethereum',
          tags: ['Ethereum', 'Founder', 'Developer']
        },
        {
          id: 3,
          name: 'Ethereum',
          type: 'project',
          category: 'Project',
          connections: 234,
          description: 'Smart contract blockchain platform',
          tags: ['Blockchain', 'Smart Contract', 'DeFi']
        },
        {
          id: 4,
          name: 'Coinbase',
          type: 'company',
          category: 'Company',
          connections: 167,
          description: 'US publicly listed cryptocurrency company',
          tags: ['Exchange', 'Public Company', 'USA']
        }
      ],
      searchPlaceholder: 'Search entities or relationships...',
      actions: {
        viewGraph: 'View Graph',
        export: 'Export Data',
        share: 'Share',
        fullscreen: 'Fullscreen View'
      }
    }
  };

  const t = content[language];

  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case 'company': return 'bg-blue-500/20 text-blue-300';
      case 'person': return 'bg-green-500/20 text-green-300';
      case 'project': return 'bg-purple-500/20 text-purple-300';
      case 'token': return 'bg-orange-500/20 text-orange-300';
      case 'exchange': return 'bg-pink-500/20 text-pink-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'company': return Building;
      case 'person': return Users;
      case 'project': return TrendingUp;
      case 'token': return TrendingUp;
      case 'exchange': return Building;
      default: return Network;
    }
  };

  const filteredEntities = t.entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEntityType === 'all' || entity.type === selectedEntityType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            {t.actions.export}
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
            <Share className="w-4 h-4 mr-2" />
            {t.actions.share}
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Maximize className="w-4 h-4 mr-2" />
            {t.actions.fullscreen}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.entities}</p>
                <p className="text-2xl text-white">15,247</p>
              </div>
              <Network className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.relations}</p>
                <p className="text-2xl text-white">45,891</p>
              </div>
              <Link className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.types}</p>
                <p className="text-2xl text-white">28</p>
              </div>
              <Filter className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.updates}</p>
                <p className="text-2xl text-white">实时</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            {t.tabs.overview}
          </TabsTrigger>
          <TabsTrigger value="entities" className="data-[state=active]:bg-green-600">
            {t.tabs.entities}
          </TabsTrigger>
          <TabsTrigger value="relations" className="data-[state=active]:bg-purple-600">
            {t.tabs.relations}
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-orange-600">
            {t.tabs.insights}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Knowledge Graph Visualization */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Network className="w-5 h-5 mr-2 text-blue-400" />
                知识图谱可视化
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">交互式知识图谱</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {t.actions.viewGraph}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entities Tab */}
        <TabsContent value="entities" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                
                <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.entityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Entity List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEntities.map((entity) => {
              const Icon = getEntityIcon(entity.type);
              
              return (
                <Card key={entity.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{entity.name}</CardTitle>
                          <Badge className={getEntityTypeColor(entity.type)}>
                            {entity.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">关联</p>
                        <p className="text-white">{entity.connections}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-slate-400 text-sm">{entity.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {entity.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-slate-700/50 text-slate-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Eye className="w-4 h-4 mr-2" />
                      查看详情
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Relations Tab */}
        <TabsContent value="relations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.relationTypes.map((relation, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${relation.color} rounded-full`}></div>
                    <CardTitle className="text-white">{relation.name}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    {relation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">关系数量</span>
                    <span className="text-white text-lg">{relation.count.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">
                <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">智能洞察</p>
                <p className="text-sm">基于知识图谱的智能分析与洞察即将推出</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}