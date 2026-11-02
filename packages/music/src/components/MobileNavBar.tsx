import { motion } from 'motion/react';
import {
  Layers, Play, Pause, Sparkles, User, Music, SkipForward,
  Disc3, Download, WifiOff
} from 'lucide-react';

type Tab = 'library' | 'hub' | 'play' | 'ai' | 'profile';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isPlaying: boolean;
  hasTrack: boolean;
  onPlayPause: () => void;
  language: 'zh' | 'en';
}

const TAB_CONFIG: { id: Tab; icon: any; label: { zh: string; en: string }; activeColor: string }[] = [
  { id: 'library', icon: Music, label: { zh: '「音乐库」', en: 'Library' }, activeColor: 'text-purple-400' },
  { id: 'hub', icon: Layers, label: { zh: '「功能」', en: 'Hub' }, activeColor: 'text-violet-400' },
  { id: 'play', icon: Play, label: { zh: '「播放」', en: 'Play' }, activeColor: 'text-white' },
  { id: 'ai', icon: Sparkles, label: { zh: '「AI」', en: 'AI' }, activeColor: 'text-blue-400' },
  { id: 'profile', icon: User, label: { zh: '「我的」', en: 'Me' }, activeColor: 'text-fuchsia-400' },
];

export function MobileNavBar({ activeTab, onTabChange, isPlaying, hasTrack, onPlayPause, language }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[55]">
      {/* Frosted glass background */}
      <div className="relative bg-[#08061a]/85 backdrop-blur-2xl border-t border-white/[0.06]">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        <nav className="flex items-end justify-around px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {TAB_CONFIG.map(tab => {
            const active = activeTab === tab.id;
            const isPlayBtn = tab.id === 'play';
            
            if (isPlayBtn) {
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    if (hasTrack) onPlayPause();
                    else onTabChange('play');
                  }}
                  className="relative -mt-4 flex flex-col items-center"
                >
                  {/* Glow ring */}
                  <motion.div
                    animate={isPlaying ? {
                      boxShadow: [
                        '0 0 12px 2px rgba(139,92,246,0.2)',
                        '0 0 24px 4px rgba(139,92,246,0.35)',
                        '0 0 12px 2px rgba(139,92,246,0.2)',
                      ]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-br from-white/15 to-white/5 border border-white/15'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white fill-current" />
                    ) : hasTrack ? (
                      <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                    ) : (
                      <Disc3 className="w-6 h-6 text-white/50" />
                    )}
                    {/* Spinning ring when playing */}
                    {isPlaying && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        className="absolute inset-[-3px] rounded-full border border-dashed border-purple-400/20"
                      />
                    )}
                  </motion.div>
                  <span className={`text-[8px] font-bold mt-1 tracking-wider ${
                    isPlaying ? 'text-purple-400' : 'text-white/30'
                  }`}>
                    {isPlaying ? (language === 'zh' ? '「暂停」' : 'Pause') : (language === 'zh' ? '「播放」' : 'Play')}
                  </span>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center py-1.5 px-3 relative min-w-[52px]"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-purple-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                  />
                )}
                <tab.icon className={`w-[22px] h-[22px] transition-colors duration-200 ${
                  active ? tab.activeColor : 'text-white/25'
                }`} />
                <span className={`text-[9px] font-bold mt-0.5 tracking-wider transition-colors ${
                  active ? tab.activeColor : 'text-white/20'
                }`}>
                  {tab.label[language]}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MOBILE NOW-PLAYING BAR — Spotify-style compact bar
// ═══════════════════════════════════════════════════════

interface NowPlayingBarProps {
  trackTitle: string | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onNext: () => void;
  onTap: () => void;
  language: 'zh' | 'en';
}

export function MobileNowPlayingBar({ trackTitle, isPlaying, progress, onPlayPause, onNext, onTap, language }: NowPlayingBarProps) {
  if (!trackTitle) return null;

  return (
    <div className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-2 right-2 z-[54]">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="relative bg-[#1a1030]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.06)] overflow-hidden"
      >
        {/* Top progress line */}
        <div className="h-[2px] bg-white/[0.04]">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-violet-400"
            style={{ width: `${progress * 100}%` }}
            layout
          />
        </div>

        <div className="flex items-center gap-3 px-3.5 py-2.5" onClick={onTap}>
          {/* Mini album art */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 via-[#1a1030] to-blue-500/15 border border-white/10 flex items-center justify-center flex-shrink-0"
          >
            <div className="w-3 h-3 rounded-full bg-purple-500/30 border border-white/10" />
          </motion.div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-[13px] font-semibold truncate leading-tight">{trackTitle}</p>
            <p className="text-purple-400/30 text-[9px] font-mono uppercase tracking-widest mt-0.5">
              {isPlaying ? (language === 'zh' ? '「正在播放」' : 'Now Playing') : (language === 'zh' ? '「已暂停」' : 'Paused')}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 active:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onNext}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 active:text-white/70 active:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PWA INSTALL PROMPT
// ═══════════════════════════════════════════════════════

interface PWAPromptProps {
  isVisible: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  language: 'zh' | 'en';
}

export function PWAInstallPrompt({ isVisible, onInstall, onDismiss, language }: PWAPromptProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[200] safe-top"
    >
      <div className="mx-3 mt-[max(0.75rem,env(safe-area-inset-top))] bg-gradient-to-r from-purple-500/15 via-violet-500/10 to-blue-500/15 backdrop-blur-2xl rounded-2xl border border-purple-500/20 shadow-[0_8px_40px_rgba(139,92,246,0.15)] p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-sm font-bold tracking-tight">
              {language === 'zh' ? '「安装 D-Music」' : 'Install D-Music'}
            </p>
            <p className="text-white/40 text-[11px] mt-0.5 leading-tight">
              {language === 'zh'
                ? '「添加至主屏幕，获得原生应用体验」'
                : 'Add to home screen for a native app experience'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onInstall}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/25"
            >
              {language === 'zh' ? '「安装」' : 'Install'}
            </motion.button>
            <button
              onClick={onDismiss}
              className="p-2 text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// OFFLINE STATUS INDICATOR
// ═══════════════════════════════════════════════════════

export function OfflineIndicator({ isOffline, language }: { isOffline: boolean; language: 'zh' | 'en' }) {
  if (!isOffline) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      className="fixed top-[max(0.5rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[199]"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 backdrop-blur-2xl rounded-full border border-amber-500/20">
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-amber-300 text-[11px] font-bold">
          {language === 'zh' ? '「离线模式」' : 'Offline Mode'}
        </span>
      </div>
    </motion.div>
  );
}