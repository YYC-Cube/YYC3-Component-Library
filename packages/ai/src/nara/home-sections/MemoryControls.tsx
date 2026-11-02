import { useState } from 'react';
import { Database, HardDrive, Brain, Trash2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const translations = {
  zh: {
    title: '记忆与自学习控制',
    desc: '管理记忆分配和学习参数',
    long_term: '长期记忆',
    working: '工作记忆',
    of: '/',
    learning_params: '学习参数',
    retention: '上下文保留率',
    compression: '压缩级别',
    optimize: '优化记忆',
    optimize_desc: '压缩并重组',
    clear_cache: '清除缓存',
    clear_cache_desc: '释放工作记忆'
  },
  en: {
    title: 'Memory & Self-Learning Controls',
    desc: 'Manage memory allocation and learning parameters',
    long_term: 'Long-term Memory',
    working: 'Working Memory',
    of: 'of',
    learning_params: 'Learning Parameters',
    retention: 'Context Retention Rate',
    compression: 'Compression Level',
    optimize: 'Optimize Memory',
    optimize_desc: 'Compress & reorganize',
    clear_cache: 'Clear Cache',
    clear_cache_desc: 'Free working memory'
  }
};

interface MemoryControlsProps {
  language?: 'zh' | 'en';
}

export function MemoryControls({ language = 'zh' }: MemoryControlsProps) {
  const t = translations[language];
  const [longTermMemory] = useState({ used: 2.4, total: 10, unit: 'TB' });
  const [workingMemory] = useState({ used: 128, total: 256, unit: 'GB' });
  const [retentionRate, setRetentionRate] = useState(99.2);
  const [compressionLevel, setCompressionLevel] = useState(7);

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

      {/* Memory Usage */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-700">{t.long_term}</h3>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mb-1">
            {longTermMemory.used} {longTermMemory.unit}
          </div>
          <div className="text-xs text-slate-500 mb-3 font-medium">{t.of} {longTermMemory.total} {longTermMemory.unit}</div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(longTermMemory.used / longTermMemory.total) * 100}%` }}
              transition={{ duration: 1, type: "spring" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <HardDrive className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-700">{t.working}</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {workingMemory.used} {workingMemory.unit}
          </div>
          <div className="text-xs text-slate-500 mb-3 font-medium">{t.of} {workingMemory.total} {workingMemory.unit}</div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(workingMemory.used / workingMemory.total) * 100}%` }}
              transition={{ duration: 1, type: "spring" }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Learning Parameters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5"
      >
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.learning_params}</h3>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-700">{t.retention}</label>
            <span className="text-sm font-bold text-emerald-600">{retentionRate}%</span>
          </div>
          <input
            type="range"
            min="90"
            max="100"
            step="0.1"
            value={retentionRate}
            onChange={(e) => setRetentionRate(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="border-t border-slate-100" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-700">{t.compression}</label>
            <span className="text-sm font-bold text-blue-600">{compressionLevel}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(Number(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </motion.div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-blue-200 group text-left"
        >
          <div className="bg-blue-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700">{t.optimize}</div>
            <div className="text-xs text-slate-500 font-medium">{t.optimize_desc}</div>
          </div>
        </motion.button>
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-red-200 group text-left"
        >
          <div className="bg-red-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700">{t.clear_cache}</div>
            <div className="text-xs text-slate-500 font-medium">{t.clear_cache_desc}</div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
