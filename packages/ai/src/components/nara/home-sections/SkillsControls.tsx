import { useState } from 'react';
import { Zap, Plus, Pause, Play, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Skill {
  id: string;
  nameKey: string;
  status: 'active' | 'training' | 'paused';
  performance: number;
  uses: number;
}

const translations = {
  zh: {
    title: '技能学习引擎',
    desc: '管理 AI 技能和自动学习能力',
    stats: {
      active: '活跃技能',
      training: '训练中',
      total: '总技能'
    },
    deployed_skills: '已部署技能',
    add_skill: '添加技能',
    status: {
      active: '活跃',
      training: '训练中',
      paused: '已暂停'
    },
    performance: '性能',
    uses: '次使用',
    skills: {
      content_analysis: '内容分析',
      trend_pred: '趋势预测',
      comp_research: '竞争对手研究',
      seo_opt: 'SEO 优化',
      social_strat: '社交媒体策略'
    }
  },
  en: {
    title: 'Skill Learning Engine',
    desc: 'Manage AI skills and auto-learning capabilities',
    stats: {
      active: 'Active Skills',
      training: 'In Training',
      total: 'Total Skills'
    },
    deployed_skills: 'Deployed Skills',
    add_skill: 'Add Skill',
    status: {
      active: 'Active',
      training: 'Training',
      paused: 'Paused'
    },
    performance: 'Performance',
    uses: 'uses',
    skills: {
      content_analysis: 'Content Analysis',
      trend_pred: 'Trend Prediction',
      comp_research: 'Competitor Research',
      seo_opt: 'SEO Optimization',
      social_strat: 'Social Media Strategy'
    }
  }
};

interface SkillsControlsProps {
  language?: 'zh' | 'en';
}

export function SkillsControls({ language = 'zh' }: SkillsControlsProps) {
  const t = translations[language];
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', nameKey: 'content_analysis', status: 'active', performance: 98, uses: 1247 },
    { id: '2', nameKey: 'trend_pred', status: 'active', performance: 92, uses: 892 },
    { id: '3', nameKey: 'comp_research', status: 'active', performance: 95, uses: 634 },
    { id: '4', nameKey: 'seo_opt', status: 'training', performance: 76, uses: 123 },
    { id: '5', nameKey: 'social_strat', status: 'active', performance: 89, uses: 456 },
  ]);

  const toggleSkillStatus = (id: string) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id
          ? {
              ...skill,
              status: skill.status === 'active' ? 'paused' : 'active',
            }
          : skill
      )
    );
  };

  const activeSkills = skills.filter(s => s.status === 'active').length;
  const trainingSkills = skills.filter(s => s.status === 'training').length;

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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.active}</div>
          <div className="text-2xl font-bold text-emerald-600">{activeSkills}</div>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.training}</div>
          <div className="text-2xl font-bold text-amber-500">{trainingSkills}</div>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-slate-500 mb-1 font-semibold">{t.stats.total}</div>
          <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
        </motion.div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">{t.deployed_skills}</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-all shadow-sm hover:shadow-md">
            <Plus className="w-4 h-4" />
            {t.add_skill}
          </button>
        </div>

        {skills.map((skill, index) => {
          const skillName = t.skills[skill.nameKey as keyof typeof t.skills] || skill.nameKey;
          const statusText = t.status[skill.status];

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.05) }}
              key={skill.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    skill.status === 'active' ? 'bg-amber-50' : 
                    skill.status === 'training' ? 'bg-blue-50' : 
                    'bg-slate-50'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      skill.status === 'active' ? 'text-amber-500' : 
                      skill.status === 'training' ? 'text-blue-500' : 
                      'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">{skillName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{skill.uses.toLocaleString()} {t.uses}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${
                    skill.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                    skill.status === 'training' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {statusText}
                  </span>
                  <button
                    onClick={() => toggleSkillStatus(skill.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                  >
                    {skill.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">{t.performance}</span>
                  <span className={`${
                    skill.performance >= 90 ? 'text-emerald-600' :
                    skill.performance >= 70 ? 'text-amber-500' :
                    'text-red-500'
                  }`}>
                    {skill.performance}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.performance}%` }}
                    transition={{ duration: 1, type: "spring" }}
                    className={`h-full ${
                      skill.performance >= 90 ? 'bg-emerald-500' :
                      skill.performance >= 70 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
