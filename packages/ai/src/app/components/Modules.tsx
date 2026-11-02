import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Tabs from '@radix-ui/react-tabs';
import { Palette, Compass, Box, Monitor, LayoutDashboard, Play, Move } from 'lucide-react';

const modules = [
  {
    id: 'color',
    title: '色彩引擎',
    icon: Palette,
    desc: '动态化与情感化',
    content: {
      logic: 'Logo作为核心锚点。AI提取“核心色”并根据背景和环境生成自适应色板。',
      tech: 'Figma Color IQ, Chroma.js, MidJourney AIGC.',
      practice: '根据日/夜自动调整，背景图像分析（LAB值提取），确保品牌一致性。'
    }
  },
  {
    id: 'nav',
    title: '导航设计',
    icon: Compass,
    desc: '沉浸式与无感交互',
    content: {
      logic: '导航作为“隐形入口”。通过DeepStack预测唤醒。统一的交互协议。',
      tech: 'Three.js (3D 节点), Hammer.js (手势识别), AR.js (空间路径).',
      practice: '背景融合，3D空间手势（捏合/缩放），物理屏幕上的AR叠加。'
    }
  },
  {
    id: 'components',
    title: '组件设计',
    icon: Box,
    desc: '模块化与智能化',
    content: {
      logic: '背景自适应。数据联动。全终端品牌一致性。',
      tech: 'React/Vue + Tailwind CSS, Three.js (3D 组件).',
      practice: '样式随上传背景自适应。高对比度实心按钮 vs 低对比度线框按钮。'
    }
  },
  {
    id: 'vis',
    title: '可视化开发',
    icon: LayoutDashboard,
    desc: '低代码与AI生成',
    content: {
      logic: '从拖拽搭建到AI生成。自动适配导入的Logo/背景。',
      tech: '低代码平台 (Bubble/Mendix 逻辑), Tableau Copilot AI, Wasm 渲染。',
      practice: '自然语言生成可视化。使用WebAssembly优化3D背景渲染。'
    }
  },
  {
    id: 'screen',
    title: '大屏设计',
    icon: Monitor,
    desc: '数据驱动与多模态',
    content: {
      logic: '云枢的实体化呈现。数据驱动背景动态。',
      tech: 'DataV/Grafana 集成, WebSocket, Hololens SDK.',
      practice: '背景元素与实时数据绑定。多屏视觉统一，同步延迟<100ms。'
    }
  },
  {
    id: 'anim',
    title: '动画交互',
    icon: Play,
    desc: '微交互与情感化',
    content: {
      logic: '传递信息与品牌情感的动画。基于物理的真实感。',
      tech: 'Lottie (微交互), Matter.js (物理引擎), WebAssembly (性能优化).',
      practice: '反馈匹配背景风格。“能量流”粒子与“机械感”精度。'
    }
  },
  {
    id: 'flip',
    title: '翻页交互',
    icon: Move,
    desc: '非线性与沉浸式',
    content: {
      logic: '打破线性翻页。叙事驱动，空间过渡。',
      tech: 'CSS 3D 变换, React Router, WebGL 空间过渡。',
      practice: '通过背景元素讲述故事。具有Z轴深度的“无边界”翻页。'
    }
  }
];

export const Modules = () => {
  const [activeTab, setActiveTab] = useState(modules[0].id);

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8 min-h-[400px]">
      <Tabs.List className="flex flex-col gap-2 min-w-[200px]">
        {modules.map((m) => (
          <Tabs.Trigger
            key={m.id}
            value={m.id}
            className={`group flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
              activeTab === m.id 
                ? 'bg-brand-primary text-white shadow-lg' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <m.icon size={20} className={activeTab === m.id ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
            <span className="font-medium">{m.title}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {modules.map((m) => (
            m.id === activeTab ? (
              <Tabs.Content key={m.id} value={m.id} asChild>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-8 rounded-2xl h-full"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-brand-primary/20 text-brand-primary">
                      <m.icon size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{m.title}</h3>
                      <p className="text-brand-secondary">{m.desc}</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">设计逻辑</h4>
                      <p className="text-gray-200 leading-relaxed">{m.content.logic}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">技术栈</h4>
                      <p className="text-gray-200 leading-relaxed font-mono text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                        {m.content.tech}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">实践方案</h4>
                      <p className="text-gray-200 leading-relaxed">{m.content.practice}</p>
                    </div>
                  </div>
                </motion.div>
              </Tabs.Content>
            ) : null
          ))}
        </AnimatePresence>
      </div>
    </Tabs.Root>
  );
};
