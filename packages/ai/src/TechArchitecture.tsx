'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Database, 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Cpu, 
  BarChart3, 
  Network,
  ArrowRight,
  GitBranch,
  Activity
} from 'lucide-react';

interface TechArchitectureProps {
  language: 'zh' | 'en';
}

export function TechArchitecture({ language }: TechArchitectureProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const content = {
    zh: {
      title: '技术架构',
      subtitle: '分层架构，智能驱动',
      description: '基于云原生、微服务、AI融合的现代化金融科技架构',
      layers: {
        data: {
          title: '数据采集层',
          description: '多源异构数据统一接入',
          features: ['实时行情数据', '链上数据', '新闻社交媒体', 'Pulsar消息队列']
        },
        processing: {
          title: '流批处理层',
          description: '高性能数据处理引擎',
          features: ['Flink实时处理', 'Spark批量处理', '智能因子生成', 'NLP文本处理']
        },
        storage: {
          title: '分层存储层',
          description: '多样化存储解决方案',
          features: ['QuestDB热数据', 'ClickHouse冷数据', '向量数据库', '知识图谱']
        },
        ai: {
          title: 'AI智能层',
          description: 'AI与强化学习深度融合',
          features: ['AI Copilot', 'RAG检索增强', 'RL Agent', 'LLM模型']
        },
        api: {
          title: 'API前端层',
          description: '开放生态，多终端适配',
          features: ['FastAPI聚合', 'React前端', '多终端支持', 'SDK开放']
        }
      },
      innovations: [
        {
          icon: Brain,
          title: 'AI Copilot + RL Agent',
          description: '智能助手与强化学习深度协同'
        },
        {
          icon: Database,
          title: 'RAG + 知识图谱',
          description: '检索增强生成与关系推理结合'
        },
        {
          icon: Network,
          title: '多终端智能交互',
          description: '支持手表、眼镜、汽车等智能设备'
        }
      ],
      dataFlow: {
        title: '关键数据流',
        steps: [
          '多源数据采集',
          'Pulsar消息分发',
          'Flink/Spark处理',
          '分层存储',
          'AI模型推理',
          'API聚合输出'
        ]
      }
    },
    en: {
      title: 'Technical Architecture',
      subtitle: 'Layered Architecture, AI-Driven',
      description: 'Modern fintech architecture based on cloud-native, microservices, and AI integration',
      layers: {
        data: {
          title: 'Data Collection Layer',
          description: 'Unified multi-source heterogeneous data access',
          features: ['Real-time Market Data', 'On-chain Data', 'News & Social Media', 'Pulsar Message Queue']
        },
        processing: {
          title: 'Stream/Batch Processing',
          description: 'High-performance data processing engine',
          features: ['Flink Real-time', 'Spark Batch', 'Smart Factor Generation', 'NLP Text Processing']
        },
        storage: {
          title: 'Tiered Storage Layer',
          description: 'Diversified storage solutions',
          features: ['QuestDB Hot Data', 'ClickHouse Cold Data', 'Vector Database', 'Knowledge Graph']
        },
        ai: {
          title: 'AI Intelligence Layer',
          description: 'Deep integration of AI and reinforcement learning',
          features: ['AI Copilot', 'RAG Enhancement', 'RL Agent', 'LLM Models']
        },
        api: {
          title: 'API & Frontend Layer',
          description: 'Open ecosystem, multi-terminal adaptation',
          features: ['FastAPI Aggregation', 'React Frontend', 'Multi-terminal Support', 'Open SDK']
        }
      },
      innovations: [
        {
          icon: Brain,
          title: 'AI Copilot + RL Agent',
          description: 'Deep collaboration between intelligent assistant and reinforcement learning'
        },
        {
          icon: Database,
          title: 'RAG + Knowledge Graph',
          description: 'Retrieval-augmented generation combined with relational reasoning'
        },
        {
          icon: Network,
          title: 'Multi-terminal Smart Interaction',
          description: 'Support for watches, glasses, cars and other smart devices'
        }
      ],
      dataFlow: {
        title: 'Key Data Flow',
        steps: [
          'Multi-source Collection',
          'Pulsar Distribution',
          'Flink/Spark Processing',
          'Tiered Storage',
          'AI Model Inference',
          'API Aggregation Output'
        ]
      }
    }
  };

  const t = content[language];

  const layers = [
    { key: 'api', icon: Globe, color: 'from-green-400 to-emerald-600' },
    { key: 'ai', icon: Brain, color: 'from-purple-400 to-pink-600' },
    { key: 'storage', icon: Database, color: 'from-blue-400 to-cyan-600' },
    { key: 'processing', icon: Zap, color: 'from-orange-400 to-red-600' },
    { key: 'data', icon: BarChart3, color: 'from-indigo-400 to-blue-600' }
  ];

  return (
    <section id="architecture" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-purple-500/20 text-purple-300 border-purple-400/30">
            {t.title}
          </Badge>
          <h2 className="text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <Tabs defaultValue="architecture" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="architecture" className="data-[state=active]:bg-blue-600">
              Architecture
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="data-[state=active]:bg-purple-600">
              Data Flow
            </TabsTrigger>
            <TabsTrigger value="innovations" className="data-[state=active]:bg-green-600">
              Innovations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-8">
            {/* Architecture Diagram */}
            <div className="relative bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50">
              <div className="space-y-4">
                {layers.map((layer, index) => {
                  const layerData = t.layers[layer.key as keyof typeof t.layers];
                  const Icon = layer.icon;
                  
                  return (
                    <div
                      key={layer.key}
                      className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeLayer === layer.key
                          ? 'bg-slate-700/50 border-slate-600 scale-105'
                          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/30'
                      }`}
                      onClick={() => setActiveLayer(activeLayer === layer.key ? null : layer.key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${layer.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1">{layerData.title}</h3>
                            <p className="text-slate-400 text-sm">{layerData.description}</p>
                          </div>
                        </div>
                        <ArrowRight className={`w-5 h-5 text-slate-400 transition-transform ${
                          activeLayer === layer.key ? 'rotate-90' : ''
                        }`} />
                      </div>
                      
                      {activeLayer === layer.key && (
                        <div className="mt-4 pt-4 border-t border-slate-600">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {layerData.features.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="bg-slate-700 text-slate-300">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {index < layers.length - 1 && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-4 bg-gradient-to-b from-slate-600 to-transparent"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dataflow" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.dataFlow.steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-sm">{index + 1}</span>
                        </div>
                        <CardTitle className="text-white text-sm">{step}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                  {index < t.dataFlow.steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="innovations" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.innovations.map((innovation, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-colors group">
                  <CardHeader>
                    <innovation.icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-white">{innovation.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {innovation.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}