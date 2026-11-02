import { useState } from 'react';
import { Shield, Lock, Key, Eye, ToggleLeft, ToggleRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const translations = {
  zh: {
    title: '安全架构',
    desc: '配置零信任安全协议',
    security_score: '安全评分',
    features_title: '安全特性',
    advanced_title: '高级设置',
    features: {
      zero_trust: { title: '零信任协议', desc: '永不信任，始终验证' },
      encryption: { title: '加密层', desc: '端到端加密', level: '加密级别', recommended: '推荐', max: '最高' },
      mfa: { title: '多因素认证', desc: '所有用户强制 2FA' },
      audit: { title: '审计日志', desc: '追踪所有系统活动' }
    },
    settings: {
      session_timeout: '会话超时',
      max_attempts: '最大登录尝试',
      min: '分',
      tries: '次'
    },
    status: {
      excellent: '安全状态：优秀',
      excellent_desc: '所有关键安全功能均已启用并配置。',
      improve: '安全状态：需改进',
      improve_desc: '启用更多安全功能以提高安全评分。'
    }
  },
  en: {
    title: 'Security Architecture',
    desc: 'Configure Zero Trust security protocols',
    security_score: 'Security Score',
    features_title: 'Security Features',
    advanced_title: 'Advanced Settings',
    features: {
      zero_trust: { title: 'Zero Trust Protocol', desc: 'Never trust, always verify' },
      encryption: { title: 'Encryption Layer', desc: 'End-to-end encryption', level: 'Encryption Level', recommended: 'Recommended', max: 'Maximum' },
      mfa: { title: 'Multi-Factor Auth', desc: 'Require 2FA for all users' },
      audit: { title: 'Audit Logging', desc: 'Track all system activities' }
    },
    settings: {
      session_timeout: 'Session Timeout',
      max_attempts: 'Max Login Attempts',
      min: 'min',
      tries: 'tries'
    },
    status: {
      excellent: 'Security Status: Excellent',
      excellent_desc: 'All critical security features are enabled and configured.',
      improve: 'Security Status: Needs Improvement',
      improve_desc: 'Enable more security features to improve your security score.'
    }
  }
};

interface SecurityControlsProps {
  language?: 'zh' | 'en';
}

export function SecurityControls({ language = 'zh' }: SecurityControlsProps) {
  const t = translations[language];
  const [settings, setSettings] = useState({
    zeroTrust: true,
    encryption: true,
    mfa: true,
    auditLogging: true,
    rateLimiting: true,
    ipWhitelisting: false,
  });

  const [encryptionLevel, setEncryptionLevel] = useState('AES-256');
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const securityScore = Object.values(settings).filter(Boolean).length * 15;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 bg-white rounded-2xl shadow-sm border border-slate-100"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{t.title}</h2>
        <p className="text-sm text-slate-500">{t.desc}</p>
      </div>

      {/* Security Score */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -z-10" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-700">{t.security_score}</span>
          <span className={`text-2xl font-bold ${
            securityScore >= 80 ? 'text-emerald-500' : securityScore >= 60 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {securityScore}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${securityScore}%` }}
            transition={{ duration: 1, type: "spring" }}
            className={`h-full ${
              securityScore >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : securityScore >= 60
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
          />
        </div>
      </motion.div>

      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">{t.features_title}</h3>

        <div className="grid gap-3">
          {/* Zero Trust */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-2 rounded-lg">
                  <Shield className={`w-5 h-5 ${settings.zeroTrust ? 'text-red-500' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{t.features.zero_trust.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.features.zero_trust.desc}</p>
                </div>
              </div>
              <button onClick={() => toggleSetting('zeroTrust')} className="focus:outline-none">
                {settings.zeroTrust ? (
                  <ToggleRight className="w-9 h-9 text-red-500 transition-colors" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Encryption */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Lock className={`w-5 h-5 ${settings.encryption ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{t.features.encryption.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.features.encryption.desc}</p>
                </div>
              </div>
              <button onClick={() => toggleSetting('encryption')} className="focus:outline-none">
                {settings.encryption ? (
                  <ToggleRight className="w-9 h-9 text-blue-500 transition-colors" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300 transition-colors" />
                )}
              </button>
            </div>
            {settings.encryption && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-14 pr-2"
              >
                <label className="text-xs text-slate-500 mb-1.5 block font-semibold">{t.features.encryption.level}</label>
                <select
                  value={encryptionLevel}
                  onChange={(e) => setEncryptionLevel(e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 rounded-lg px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="AES-128">AES-128</option>
                  <option value="AES-256">AES-256 ({t.features.encryption.recommended})</option>
                  <option value="AES-512">AES-512 ({t.features.encryption.max})</option>
                </select>
              </motion.div>
            )}
          </motion.div>

          {/* MFA */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <Key className={`w-5 h-5 ${settings.mfa ? 'text-emerald-500' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{t.features.mfa.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.features.mfa.desc}</p>
                </div>
              </div>
              <button onClick={() => toggleSetting('mfa')} className="focus:outline-none">
                {settings.mfa ? (
                  <ToggleRight className="w-9 h-9 text-emerald-500 transition-colors" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Audit Logging */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Eye className={`w-5 h-5 ${settings.auditLogging ? 'text-purple-500' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{t.features.audit.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.features.audit.desc}</p>
                </div>
              </div>
              <button onClick={() => toggleSetting('auditLogging')} className="focus:outline-none">
                {settings.auditLogging ? (
                  <ToggleRight className="w-9 h-9 text-purple-500 transition-colors" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">{t.advanced_title}</h3>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-6"
        >
          {/* Session Timeout */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-700">{t.settings.session_timeout}</label>
              <span className="text-sm font-medium text-slate-500">{sessionTimeout} {t.settings.min}</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>5 {t.settings.min}</span>
              <span>120 {t.settings.min}</span>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Max Login Attempts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-700">{t.settings.max_attempts}</label>
              <span className="text-sm font-medium text-slate-500">{maxLoginAttempts} {t.settings.tries}</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>3 {t.settings.tries}</span>
              <span>10 {t.settings.tries}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Alert */}
      {securityScore >= 80 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-700 mb-1">{t.status.excellent}</h4>
            <p className="text-xs text-emerald-600/80 leading-relaxed">{t.status.excellent_desc}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-700 mb-1">{t.status.improve}</h4>
            <p className="text-xs text-amber-600/80 leading-relaxed">{t.status.improve_desc}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
