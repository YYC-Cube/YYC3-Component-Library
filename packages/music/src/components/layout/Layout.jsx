import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../Common/LoginForm';
import RegisterForm from '../Common/RegisterForm';

const Layout = ({ children }) => {
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    togglePlay, 
    playPrevious, 
    playNext, 
    setVolumeLevel, 
    setProgress, 
    mockSongs 
  } = usePlayer();

  const { user, logout } = useAuth();
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // 格式化时间为 MM:SS 格式
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 更新本地时间显示
  useEffect(() => {
    setLocalCurrentTime(currentTime);
  }, [currentTime]);

  // 处理进度条拖动
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    setLocalCurrentTime(newProgress * duration);
  };

  // 处理音量调节
  const handleVolumeChange = (e) => {
    setVolumeLevel(parseInt(e.target.value));
  };

  // 处理用户注销
  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      console.log('用户注销成功');
    } catch (error) {
      console.error('注销失败:', error);
    }
  };

  // 获取当前进度百分比
  const getProgressPercentage = () => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  };

  // 默认显示的歌曲信息
  const defaultSong = mockSongs && mockSongs.length > 0 ? mockSongs[0] : null;
  const displaySong = currentSong || defaultSong;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl font-bold">D</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              D-Music
            </span>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {[ 
              { name: '首页', path: '/' },
              { name: '播放器', path: '/player' },
              { name: '歌词', path: '/lyrics' },
              { name: '社区', path: '/fans' },
              { name: '分析', path: '/analytics' },
              ...(user ? [{ name: '我的播放列表', path: '/playlists' }] : [])
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="relative px-2 py-1 group inline-block"
                >
                  {item.name}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 搜索按钮 */}
            <motion.a
              href="/search"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors"
            >
              <span className="text-lg">🔍</span>
            </motion.a>
            
            {/* 用户菜单 */}
            {user ? (
              <div className="relative">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="text-sm font-bold">{user.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                </motion.button>
                
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-900 border border-purple-500/20 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-800">
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email || user.phone}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-purple-900/30 transition-colors">
                        个人资料
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-purple-900/30 transition-colors">
                        设置
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                        onClick={handleLogout}
                      >
                        退出登录
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-900/20 transition-colors"
                  onClick={() => setShowLoginForm(true)}
                >
                  登录
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
                  onClick={() => setShowRegisterForm(true)}
                >
                  注册
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* 主内容区 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      
      {/* 登录表单模态框 */}
      {showLoginForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLoginForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <LoginForm 
              onClose={() => setShowLoginForm(false)} 
              onLoginSuccess={() => {
                setShowLoginForm(false);
                // 登录成功后的操作，例如显示通知或刷新页面
              }}
            />
          </motion.div>
        </motion.div>
      )}
      
      {/* 注册表单模态框 */}
      {showRegisterForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowRegisterForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterForm 
              onClose={() => setShowRegisterForm(false)} 
              onRegisterSuccess={() => {
                setShowRegisterForm(false);
                setShowLoginForm(true); // 注册成功后自动显示登录表单
                // 注册成功后的操作，例如显示通知
              }}
            />
          </motion.div>
        </motion.div>
      )}
      
      {/* 底部播放器 */}
      {displaySong && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-md border-t border-purple-500/20 flex items-center px-4"
        >
          <div className="w-full flex items-center justify-between">
            {/* 当前歌曲信息 */}
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-14 h-14 rounded-md overflow-hidden shadow-lg"
                animate={{ rotate: isPlaying ? [0, 5, -5, 0] : 0 }}
                transition={{ repeat: isPlaying ? Infinity : 0, duration: 3 }}
              >
                <img 
                  src={displaySong.cover} 
                  alt={displaySong.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="max-w-[150px]">
                <h4 className="font-medium truncate">{displaySong.title}</h4>
                <p className="text-xs text-gray-400 truncate">{displaySong.artist}</p>
              </div>
            </div>
            
            {/* 播放控制 */}
            <div className="hidden md:flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-6">
                <motion.button 
                  onClick={playPrevious}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ⏮️
                </motion.button>
                <motion.button 
                  onClick={togglePlay}
                  whileTap={{ scale: 0.9 }}
                  className="text-white w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:from-purple-500 hover:to-pink-500 transition-colors"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </motion.button>
                <motion.button 
                  onClick={playNext}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ⏭️
                </motion.button>
              </div>
              <div className="w-72 flex items-center space-x-2">
                <span className="text-xs w-8 text-center">{formatTime(localCurrentTime)}</span>
                <div className="flex-grow h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const progress = (e.clientX - rect.left) / rect.width;
                  setProgress(progress);
                }}>
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <span className="text-xs w-8 text-right">{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* 音量控制 */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">🔉</button>
              <div className="hidden md:block w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${volume}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Layout;