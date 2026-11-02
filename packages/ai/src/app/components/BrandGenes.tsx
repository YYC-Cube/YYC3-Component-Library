import React from 'react';
import { Layers, Zap, Command, Database } from 'lucide-react';

const genes = [
  {
    key: 'Cloud Nexus (云枢)',
    icon: Command,
    logic: [
      '视觉统一 (色彩, 背景, Logo)',
      '交互协同 (组件, 导航, 数据)',
      '场景适配 (多端, 多模态)'
    ],
    tech: 'AI色彩引擎, 交互中台, 跨端组件库'
  },
  {
    key: 'DeepStack (深栈)',
    icon: Layers,
    logic: [
      '设计到开发 (低代码/AIGC)',
      '前端到后端 (实时绑定)',
      '软件到硬件 (传感器/AR适配)'
    ],
    tech: '低代码平台, 全栈组件库, 硬件接口层'
  },
  {
    key: 'Unified Origin (万象归元)',
    icon: Database,
    logic: [
      '视觉资产统一 (色彩, 动效, Logo)',
      '交互逻辑统一 (手势, 导航协议)',
      '数据协议统一 (实时联动格式)'
    ],
    tech: '品牌设计资产表, 交互协议规范, API标准'
  },
  {
    key: 'New Era Ignite (智启新纪元)',
    icon: Zap,
    logic: [
      'AI驱动的个性化 (千人千面)',
      '3D/XR 沉浸式交互',
      '物理引擎真实感'
    ],
    tech: 'AIGC生成, 3D/WebGL, Matter.js 物理引擎'
  }
];

export const BrandGenes = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {genes.map((gene, index) => (
        <div 
          key={gene.key}
          className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-brand-primary/20 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <gene.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">{gene.key}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-2">设计逻辑</h4>
              <ul className="space-y-1">
                {gene.logic.map((item, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-2">技术载体</h4>
              <p className="text-sm text-gray-300">{gene.tech}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
