import { useState } from 'react';
import { Server, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const translations = {
  zh: {
    title: '系统架构控制',
    desc: '管理和监控核心操作系统层',
    auto_scale: '自动扩缩容',
    load_balancing: '负载均衡',
    auto_scale_desc: '根据负载自动调整实例',
    manual_desc: '手动实例管理',
    lb_desc: '在实例间分发流量',
    direct_desc: '仅直接路由',
    layer_mgmt: '层级管理',
    layers: {
      input: '输入层',
      brain: '大脑层',
      execution: '执行层',
      output: '输出层',
      infrastructure: '基础设施层'
    },
    running: '{0} 个实例正在运行',
    active: '活跃',
    disabled: '已禁用',
    current_load: '当前负载',
    instances: '实例',
    high_load_title: '检测到高负载',
    high_load_desc: '部分层级负载过高。建议启用自动扩缩容或手动增加实例。'
  },
  en: {
    title: 'System Architecture Controls',
    desc: 'Manage and monitor core operating system layers',
    auto_scale: 'Auto-Scaling',
    load_balancing: 'Load Balancing',
    auto_scale_desc: 'Automatically adjust instances based on load',
    manual_desc: 'Manual instance management',
    lb_desc: 'Distribute traffic across instances',
    direct_desc: 'Direct routing only',
    layer_mgmt: 'Layer Management',
    layers: {
      input: 'Input Layer',
      brain: 'Brain Layer',
      execution: 'Execution Layer',
      output: 'Output Layer',
      infrastructure: 'Infrastructure Layer'
    },
    running: '{0} instance{1} running',
    active: 'Active',
    disabled: 'Disabled',
    current_load: 'Current Load',
    instances: 'Instances',
    high_load_title: 'High Load Detected',
    high_load_desc: 'Some layers are experiencing high load. Consider enabling auto-scaling or manually increasing instances.'
  }
};

interface SystemArchitectureControlsProps {
  language?: 'zh' | 'en';
}

export function SystemArchitectureControls({ language = 'zh' }: SystemArchitectureControlsProps) {
  const t = translations[language];
  const [layers, setLayers] = useState({
    input: { enabled: true, load: 100, instances: 3 },
    brain: { enabled: true, load: 87, instances: 5 },
    execution: { enabled: true, load: 95, instances: 4 },
    output: { enabled: true, load: 100, instances: 2 },
    infrastructure: { enabled: true, load: 98, instances: 8 },
  });

  const [autoScale, setAutoScale] = useState(true);
  const [loadBalancing, setLoadBalancing] = useState(true);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({
      ...prev,
      [layer]: { ...prev[layer], enabled: !prev[layer].enabled }
    }));
  };

  const adjustInstances = (layer: keyof typeof layers, delta: number) => {
    setLayers(prev => ({
      ...prev,
      [layer]: { 
        ...prev[layer], 
        instances: Math.max(1, Math.min(10, prev[layer].instances + delta))
      }
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 bg-white rounded-2xl shadow-sm border border-slate-100"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{t.title}</h2>
        <p className="text-sm text-slate-500">{t.desc}</p>
      </div>

      {/* Global Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 transition-all hover:shadow-md hover:bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700">{t.auto_scale}</span>
            <button onClick={() => setAutoScale(!autoScale)} className="focus:outline-none">
              {autoScale ? (
                <ToggleRight className="w-10 h-10 text-emerald-500 transition-colors" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300 transition-colors" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {autoScale ? t.auto_scale_desc : t.manual_desc}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 transition-all hover:shadow-md hover:bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700">{t.load_balancing}</span>
            <button onClick={() => setLoadBalancing(!loadBalancing)} className="focus:outline-none">
              {loadBalancing ? (
                <ToggleRight className="w-10 h-10 text-blue-500 transition-colors" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300 transition-colors" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {loadBalancing ? t.lb_desc : t.direct_desc}
          </p>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">{t.layer_mgmt}</h3>
        
        {Object.entries(layers).map(([key, layer], index) => {
          const layerKey = key as keyof typeof layers;
          const layerName = t.layers[layerKey as keyof typeof t.layers];
          const isHighLoad = layer.load > 90;
          
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={key}
              className={`bg-white rounded-xl p-5 border transition-all duration-300 ${
                layer.enabled 
                  ? 'border-slate-200 shadow-sm hover:shadow-md' 
                  : 'border-slate-100 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Layer Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${layer.enabled ? 'bg-blue-50' : 'bg-slate-100'}`}>
                    <Server className={`w-5 h-5 ${layer.enabled ? 'text-blue-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">{layerName}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {language === 'zh' 
                        ? t.running.replace('{0}', layer.instances.toString())
                        : t.running.replace('{0}', layer.instances.toString()).replace('{1}', layer.instances > 1 ? 's' : '')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleLayer(layerKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    layer.enabled
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  }`}
                >
                  {layer.enabled ? t.active : t.disabled}
                </button>
              </div>

              {layer.enabled && (
                <div className="space-y-4">
                  {/* Load Indicator */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-500">{t.current_load}</span>
                      <span className={`${
                        isHighLoad ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                        {layer.load}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${layer.load}%` }}
                        transition={{ duration: 1, type: "spring" }}
                        className={`h-full ${
                          isHighLoad
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Instance Control */}
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 ml-1">{t.instances}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjustInstances(layerKey, -1)}
                        disabled={autoScale || layer.instances <= 1}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center font-bold"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold w-6 text-center text-slate-700">{layer.instances}</span>
                      <button
                        onClick={() => adjustInstances(layerKey, 1)}
                        disabled={autoScale || layer.instances >= 10}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Warnings */}
      {Object.values(layers).some(l => l.load > 90 && l.enabled) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-700 mb-1">{t.high_load_title}</h4>
            <p className="text-xs text-red-600/80 leading-relaxed">
              {t.high_load_desc}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
