import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import musicService from '../services/musicService';

// 创建播放器上下文
const PlayerContext = createContext();

// 自定义Hook用于使用播放器上下文
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

// 播放器提供者组件
export const PlayerProvider = ({ children }) => {
  // 播放器状态
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off, one, all
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState([]); // 播放队列
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1); // 当前在队列中的位置
  const [lyrics, setLyrics] = useState([]); // 当前歌曲歌词
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1); // 当前歌词索引

  // 创建Audio实例引用
  const audioRef = useRef(new Audio());
  const progressIntervalRef = useRef(null);

  // 模拟歌曲数据
  const mockSongs = [
    {
      id: 1,
      title: '董小姐',
      artist: '宋冬野',
      album: '安和桥北',
      cover: '/placeholder1.png',
      src: '/music/dongxiaojie.mp3',
      duration: 234,
      genre: '民谣',
      year: 2013,
      lyrics: [
        { time: 0, text: '董小姐 - 宋冬野' },
        { time: 10, text: '董小姐 你嘴角向下的时候很美' },
        { time: 15, text: '就像安和桥下 清澈的水' },
        { time: 20, text: '董小姐 我也是个复杂的动物' },
        { time: 25, text: '嘴上一句带过 心里却一直重复' },
        { time: 30, text: '董小姐 鼓楼的夜晚时间匆匆' },
        { time: 35, text: '陌生的人 请给我一支兰州' },
        { time: 40, text: '所以那些可能都不是真的 董小姐' },
        { time: 45, text: '你才不是一个没有故事的女同学' },
        { time: 50, text: '爱上一匹野马 可我的家里没有草原' },
        { time: 55, text: '这让我感到绝望 董小姐' },
        { time: 60, text: '董小姐 你熄灭了烟 说起从前' },
        { time: 65, text: '你说前半生就这样吧 还有明天' },
        { time: 70, text: '董小姐 你可知道我说够了再见' },
        { time: 75, text: '在五月的早晨 终于丢失了睡眠' },
        { time: 80, text: '所以那些可能都不是真的 董小姐' },
        { time: 85, text: '你才不是一个没有故事的女同学' },
        { time: 90, text: '爱上一匹野马 可我的家里没有草原' },
        { time: 95, text: '这让我感到绝望 董小姐' },
        { time: 100, text: '所以那些可能都会是真的 董小姐' },
        { time: 105, text: '谁会不厌其烦的安慰那无知的少年' },
        { time: 110, text: '我想和你一样 不顾那些所以' },
        { time: 115, text: '跟我走吧 董小姐' },
        { time: 120, text: '躁起来吧 董小姐' }
      ]
    },
    {
      id: 2,
      title: '南山南',
      artist: '马頔',
      album: '孤岛',
      cover: '/placeholder2.png',
      src: '/music/nanshannan.mp3',
      duration: 245,
      genre: '民谣',
      year: 2014,
      lyrics: [
        { time: 0, text: '南山南 - 马頔' },
        { time: 12, text: '你在南方的艳阳里 大雪纷飞' },
        { time: 18, text: '我在北方的寒夜里 四季如春' },
        { time: 24, text: '如果天黑之前来得及' },
        { time: 28, text: '我要忘了你的眼睛' },
        { time: 32, text: '穷极一生 做不完一场梦' },
        { time: 38, text: '他不再和谁谈论相逢的孤岛' },
        { time: 44, text: '因为心里早已荒无人烟' },
        { time: 50, text: '他的心里再装不下一个家' },
        { time: 56, text: '做一个只对自己说谎的哑巴' },
        { time: 62, text: '他说你任何为人称道的美丽' },
        { time: 68, text: '不及他第一次遇见你' },
        { time: 74, text: '时光苟延残喘 无可奈何' },
        { time: 80, text: '如果所有土地连在一起' },
        { time: 86, text: '走上一生只为拥抱你' },
        { time: 92, text: '喝醉了他的梦 晚安' },
        { time: 98, text: '他听见有人唱着古老的歌' },
        { time: 104, text: '唱着今天还在远方发生的' },
        { time: 110, text: '就在他眼睛里看到的孤岛' }
      ]
    },
    {
      id: 3,
      title: '成都',
      artist: '赵雷',
      album: '无法长大',
      cover: '/placeholder3.png',
      src: '/music/chengdu.mp3',
      duration: 295,
      genre: '民谣',
      year: 2016
    },
    {
      id: 4,
      title: '理想',
      artist: '赵雷',
      album: '吉姆餐厅',
      cover: '/placeholder4.png',
      src: '/music/lixiang.mp3',
      duration: 322,
      genre: '民谣',
      year: 2014
    },
    {
      id: 5,
      title: '夜空中最亮的星',
      artist: '逃跑计划',
      album: '世界',
      cover: '/placeholder5.png',
      src: '/music/yezongkongzuiliangdexing.mp3',
      duration: 247,
      genre: '摇滚',
      year: 2011
    }
  ];


  // 播放歌曲
  const playSong = async (song) => {
    if (!song) return;
    
    setIsLoading(true);
    setCurrentSong(song);
    
    try {
      // 1. 更新播放记录
      if (song.id) {
        await musicService.recordPlayHistory(song.id);
      }
      
      // 2. 获取歌词（如果没有歌词数据）
      if (song.id && (!song.lyrics || song.lyrics.length === 0)) {
        try {
          const lyricsData = await musicService.getLyrics(song.id);
          song = { ...song, lyrics: lyricsData };
          setLyrics(lyricsData);
        } catch (error) {
          console.warn('获取歌词失败:', error);
          setLyrics([]);
        }
      } else if (song.lyrics) {
        setLyrics(song.lyrics);
      }
      
      // 3. 配置音频播放器
      audioRef.current.src = song.src;
      audioRef.current.volume = volume / 100;
      
      // 4. 加载并播放
      await audioRef.current.load();
      await audioRef.current.play();
      
      setIsPlaying(true);
      setDuration(song.duration || audioRef.current.duration);
      setCurrentTime(0);
      setCurrentLyricIndex(-1);
      
      // 5. 设置进度更新定时器
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(updateProgress, 1000);
      
    } catch (error) {
      console.error('播放歌曲失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 暂停播放
  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      // 清除进度更新定时器
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  // 切换播放状态
  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else if (currentSong) {
      playSong(currentSong);
    }
  };

  // 设置播放列表
  const setCurrentPlaylist = (newPlaylist) => {
    setPlaylist(newPlaylist);
    setQueue([...newPlaylist]);
    setCurrentQueueIndex(-1);
  };

  // 切换随机播放
  const toggleShuffle = () => {
    const newShuffleState = !shuffle;
    setShuffle(newShuffleState);
    
    // 重新生成播放队列
    if (newShuffleState && playlist.length > 0) {
      setQueue(shuffleArray([...playlist]));
    } else {
      setQueue([...playlist]);
    }
  };

  // 切换循环模式
  const toggleRepeat = () => {
    if (repeat === 'off') {
      setRepeat('one');
    } else if (repeat === 'one') {
      setRepeat('all');
    } else {
      setRepeat('off');
    }
  };

  // 设置音量
  const setVolumeLevel = (newVolume) => {
    const volumeLevel = Math.max(0, Math.min(100, newVolume));
    setVolume(volumeLevel);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeLevel / 100;
    }
  };

  // 设置当前播放时间
  const setCurrentPosition = (newTime) => {
    const clampedTime = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(clampedTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = clampedTime;
    }
  };

  // 更新进度
  const updateProgress = () => {
    if (audioRef.current && isPlaying) {
      setCurrentTime(audioRef.current.currentTime);
      updateCurrentLyric();
    }
  };

  // 更新当前歌词
  const updateCurrentLyric = () => {
    if (!lyrics || lyrics.length === 0) return;
    
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (lyrics[i].time <= currentTime) {
        if (i !== currentLyricIndex) {
          setCurrentLyricIndex(i);
        }
        break;
      }
    }
  };

  // 播放下一首
  const playNext = () => {
    if (queue.length === 0) return;
    
    let nextIndex;
    
    if (repeat === 'one') {
      // 单曲循环
      nextIndex = currentQueueIndex;
    } else if (currentQueueIndex < queue.length - 1) {
      // 正常顺序下一首
      nextIndex = currentQueueIndex + 1;
    } else if (repeat === 'all') {
      // 列表循环，回到第一首
      nextIndex = 0;
    } else {
      // 不循环，不执行任何操作
      return;
    }
    
    setCurrentQueueIndex(nextIndex);
    playSong(queue[nextIndex]);
  };

  // 播放上一首
  const playPrevious = () => {
    if (queue.length === 0) return;
    
    let prevIndex;
    
    if (repeat === 'one') {
      // 单曲循环
      prevIndex = currentQueueIndex;
    } else if (currentQueueIndex > 0) {
      // 正常顺序上一首
      prevIndex = currentQueueIndex - 1;
    } else if (repeat === 'all') {
      // 列表循环，回到最后一首
      prevIndex = queue.length - 1;
    } else {
      // 不循环，不执行任何操作
      return;
    }
    
    setCurrentQueueIndex(prevIndex);
    playSong(queue[prevIndex]);
  };

  // 添加歌曲到播放队列
  const addToQueue = (song) => {
    const newQueue = [...queue, song];
    setQueue(newQueue);
  };

  // 从播放队列移除歌曲
  const removeFromQueue = (songId) => {
    const newQueue = queue.filter(song => song.id !== songId);
    setQueue(newQueue);
    
    // 如果移除的是当前播放的歌曲，播放下一首
    if (currentSong && currentSong.id === songId) {
      if (newQueue.length > 0) {
        playNext();
      } else {
        pauseSong();
        setCurrentSong(null);
        setCurrentQueueIndex(-1);
      }
    }
  };

  // 随机打乱数组（Fisher-Yates 算法）
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 点赞/取消点赞歌曲
  const toggleLikeSong = async (songId) => {
    try {
      const result = await musicService.toggleLike(songId);
      
      // 更新当前歌曲的点赞状态
      if (currentSong && currentSong.id === songId) {
        setCurrentSong(prev => ({
          ...prev,
          isLiked: result.isLiked
        }));
      }
      
      // 更新播放队列中歌曲的点赞状态
      setQueue(prevQueue => prevQueue.map(song => 
        song.id === songId ? { ...song, isLiked: result.isLiked } : song
      ));
      
      // 更新播放列表中歌曲的点赞状态
      setPlaylist(prevPlaylist => prevPlaylist.map(song => 
        song.id === songId ? { ...song, isLiked: result.isLiked } : song
      ));
      
      return result;
    } catch (error) {
      console.error('点赞/取消点赞失败:', error);
      throw error;
    }
  };

  // 收藏/取消收藏歌曲
  const toggleFavoriteSong = async (songId) => {
    try {
      const result = await musicService.toggleFavorite(songId);
      
      // 更新当前歌曲的收藏状态
      if (currentSong && currentSong.id === songId) {
        setCurrentSong(prev => ({
          ...prev,
          isFavorited: result.isFavorited
        }));
      }
      
      // 更新播放队列中歌曲的收藏状态
      setQueue(prevQueue => prevQueue.map(song => 
        song.id === songId ? { ...song, isFavorited: result.isFavorited } : song
      ));
      
      // 更新播放列表中歌曲的收藏状态
      setPlaylist(prevPlaylist => prevPlaylist.map(song => 
        song.id === songId ? { ...song, isFavorited: result.isFavorited } : song
      ));
      
      return result;
    } catch (error) {
      console.error('收藏/取消收藏失败:', error);
      throw error;
    }
  };

  // 监听音频事件
  useEffect(() => {
    const audio = audioRef.current;
    
    // 监听播放结束事件
    const handleEnded = () => {
      if (repeat === 'one') {
        // 单曲循环
        audio.currentTime = 0;
        audio.play();
      } else if (repeat === 'all') {
        // 列表循环
        playNext();
      } else if (currentQueueIndex < queue.length - 1) {
        // 不循环，播放下一首
        playNext();
      } else {
        // 播放列表结束，暂停播放
        pauseSong();
        setCurrentTime(0);
      }
    };
    
    // 监听加载元数据事件
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    // 添加事件监听器
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // 清理函数
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      
      // 清除进度更新定时器
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // 暂停音频
      audio.pause();
    };
  }, [queue, currentQueueIndex, repeat]);


  // 上下文值
  const contextValue = {
    mockSongs,
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    shuffle,
    repeat,
    isLoading,
    queue,
    currentQueueIndex,
    lyrics,
    currentLyricIndex,
    playSong,
    pauseSong,
    togglePlay,
    setCurrentPlaylist,
    toggleShuffle,
    toggleRepeat,
    setVolumeLevel,
    setCurrentPosition,
    playNext,
    playPrevious,
    addToQueue,
    removeFromQueue,
    toggleLikeSong,
    toggleFavoriteSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};