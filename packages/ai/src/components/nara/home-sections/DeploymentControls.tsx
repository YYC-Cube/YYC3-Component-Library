import { useState } from 'react';
import { Laptop, Smartphone, Cloud, Bolt, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const translations = {
  zh: {
    title: '部署控制',
    desc: '管理多平台部署和路由',
    smart_routing: '智能路由',
    auto_routing: '自动路由',
    manual_control: '手动控制',
    auto_desc: '根据复杂度和资源自动路由任务',
    manual_desc: '为每个任务手动选择部署目标',
    active_deployments: '活跃部署',
    macbook: {
      name: 'MacBook (主设备)',
      desc: 'Tauri + Edge AI'
    },
    iphone: {
      name: 'iPhone (移动端)',
      desc: 'Capacitor 封装'
    },
    vps: {
      name: 'VPS (常驻)',
      desc: 'Docker 24/7'
    },
    hybrid: {
      name: '混合云/本地',
      desc: '智能路由'
    },
    stats: {
      cpu: 'CPU',
      memory: '内存',
      battery: '电量',
      uptime: '运行时间',
      local: '本地处理',
      cloud: '云端处理'
    }
  },
  en: {
    title: 'Deployment Controls',
    desc: 'Manage multi-platform deployment and routing',
    smart_routing: 'Smart Routing',
    auto_routing: 'Auto Routing',
    manual_control: 'Manual Control',
    auto_desc: 'Automatically route tasks based on complexity and resources',
    manual_desc: 'Manually select deployment target for each task',
    active_deployments: 'Active Deployments',
    macbook: {
      name: 'MacBook (Primary)',
      desc: 'Tauri + Edge AI'
    },
    iphone: {
      name: 'iPhone (Mobile)',
      desc: 'Capacitor wrapper'
    },
    vps: {
      name: 'VPS (Always-On)',
      desc: 'Docker 24/7'
    },
    hybrid: {
      name: 'Hybrid Cloud/Local',
      desc: 'Smart routing'
    },
    stats: {
      cpu: 'CPU',
      memory: 'Memory',
      battery: 'Battery',
      uptime: 'Uptime',
      local: 'Local Processing',
      cloud: 'Cloud Processing'
    }
  }
};

interface DeploymentControlsProps {
  language?: 'zh' | 'en';
}

export function DeploymentControls({ language = 'zh' }: DeploymentControlsProps) {
  const t = translations[language];
  const [deployments, setDeployments] = useState({
    macbook: { enabled: true, status: 'online', cpu: 32, memory: 4.2 },
    iphone: { enabled: true, status: 'online', battery: 87 },
    vps: { enabled: true, status: 'online', uptime: 99.8 },
    hybrid: { enabled: true, localUsage: 30, cloudUsage: 70 },
  });

  const [routingMode, setRoutingMode] = useState<'auto' | 'manual'>('auto');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 bg-white rounded-2xl shadow-sm border border-slate-100"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{t.title}</h2>
        <p className="text-sm text-slate-500">{t.desc}</p>
      </div>

      {/* Routing Mode */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 mb-4">{t.smart_routing}</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setRoutingMode('auto')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-sm ${
              routingMode === 'auto'
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.auto_routing}
          </button>
          <button
            onClick={() => setRoutingMode('manual')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-sm ${
              routingMode === 'manual'
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.manual_control}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3 font-medium">
          {routingMode === 'auto' ? t.auto_desc : t.manual_desc}
        </p>
      </div>

      {/* Deployment Status */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">{t.active_deployments}</h3>

        {/* MacBook */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-2.5 rounded-xl">
                <Laptop className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm">{t.macbook.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{t.macbook.desc}</p>
              </div>
            </div>
            {deployments.macbook.enabled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-300" />
            )}
          </div>
          {deployments.macbook.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.cpu}</div>
                <div className="text-sm font-bold text-emerald-600">{deployments.macbook.cpu}%</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.memory}</div>
                <div className="text-sm font-bold text-blue-600">{deployments.macbook.memory}GB</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* iPhone */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-2.5 rounded-xl">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm">{t.iphone.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{t.iphone.desc}</p>
              </div>
            </div>
            {deployments.iphone.enabled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-300" />
            )}
          </div>
          {deployments.iphone.enabled && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.battery}</div>
              <div className="text-sm font-bold text-emerald-600">{deployments.iphone.battery}%</div>
            </div>
          )}
        </motion.div>

        {/* VPS */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-50 p-2.5 rounded-xl">
                <Cloud className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm">{t.vps.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{t.vps.desc}</p>
              </div>
            </div>
            {deployments.vps.enabled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-300" />
            )}
          </div>
          {deployments.vps.enabled && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.uptime}</div>
              <div className="text-sm font-bold text-emerald-600">{deployments.vps.uptime}%</div>
            </div>
          )}
        </motion.div>

        {/* Hybrid */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-2.5 rounded-xl">
                <Bolt className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm">{t.hybrid.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{t.hybrid.desc}</p>
              </div>
            </div>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          {deployments.hybrid.enabled && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">{t.stats.local}</span>
                  <span className="text-blue-600">{deployments.hybrid.localUsage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${deployments.hybrid.localUsage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">{t.stats.cloud}</span>
                  <span className="text-purple-600">{deployments.hybrid.cloudUsage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${deployments.hybrid.cloudUsage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
