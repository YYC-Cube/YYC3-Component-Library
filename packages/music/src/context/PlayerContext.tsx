import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react'
import { Howl } from 'howler'
import type { Track } from '../types'

interface PlayerContextType {
  tracks: Track[]
  currentTrackIndex: number | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isRepeat: boolean
  isShuffle: boolean
  likedTracks: Set<string>
  setTracks: (tracks: Track[]) => void
  setCurrentTrackIndex: (index: number | null) => void
  togglePlay: () => void
  play: (index?: number) => void
  pause: () => void
  nextTrack: () => void
  previousTrack: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleRepeat: () => void
  toggleShuffle: () => void
  toggleLike: (trackId: string) => void
  formatTime: (seconds: number) => string
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

interface PlayerProviderProps {
  children: ReactNode
  initialTracks?: Track[]
  initialTrackIndex?: number
}

/**
 * 音乐播放器上下文提供者
 */
export const PlayerProvider: React.FC<PlayerProviderProps> = ({
  children,
  initialTracks = [],
  initialTrackIndex = 0
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    initialTracks.length > 0 ? initialTrackIndex : null
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  const howlRef = useRef<Howl | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 获取当前曲目
  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null

  // 初始化或切换曲目
  useEffect(() => {
    if (!currentTrack || !tracks.length) return

    // 销毁之前的实例
    if (howlRef.current) {
      howlRef.current.unload()
      stopProgressUpdate()
    }

    // 创建新的Howl实例
    const howl = new Howl({
      src: [currentTrack.audioUrl],
      html5: true,
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(howl.duration())
      },
      onplay: () => {
        setIsPlaying(true)
        startProgressUpdate()
      },
      onpause: () => {
        setIsPlaying(false)
        stopProgressUpdate()
      },
      onend: () => {
        handleTrackEnd()
      },
      onloaderror: (_id, error) => {
        console.error('Failed to load audio:', error)
      }
    })

    howlRef.current = howl

    // 清理函数
    return () => {
      if (howlRef.current) {
        howlRef.current.unload()
      }
      stopProgressUpdate()
    }
  }, [currentTrack, tracks, volume, isMuted])

  // 音量变化时更新
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted])

  // 更新播放进度
  const startProgressUpdate = () => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      if (howlRef.current) {
        setCurrentTime(howlRef.current.seek() as number)
      }
    }, 100)
  }

  const stopProgressUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // 处理播放结束
  const handleTrackEnd = () => {
    stopProgressUpdate()
    if (isRepeat && currentTrackIndex !== null) {
      // 单曲循环
      if (howlRef.current) {
        howlRef.current.seek(0)
        howlRef.current.play()
      }
    } else {
      // 播放下一首
      nextTrack()
    }
  }

  // 播放/暂停切换
  const togglePlay = () => {
    if (!howlRef.current || currentTrackIndex === null) return

    if (isPlaying) {
      howlRef.current.pause()
    } else {
      howlRef.current.play()
    }
  }

  // 播放指定曲目
  const play = (index?: number) => {
    if (index !== undefined && index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index)
    } else if (currentTrackIndex !== null && howlRef.current) {
      howlRef.current.play()
    }
  }

  // 暂停播放
  const pause = () => {
    if (howlRef.current) {
      howlRef.current.pause()
    }
  }

  // 下一首
  const nextTrack = () => {
    if (!tracks.length || currentTrackIndex === null) return

    let nextIndex
    if (isShuffle) {
      // 随机播放
      nextIndex = Math.floor(Math.random() * tracks.length)
    } else {
      // 顺序播放
      nextIndex = (currentTrackIndex + 1) % tracks.length
    }

    setCurrentTrackIndex(nextIndex)
  }

  // 上一首
  const previousTrack = () => {
    if (!tracks.length || currentTrackIndex === null) return

    let prevIndex
    if (isShuffle) {
      // 随机播放
      prevIndex = Math.floor(Math.random() * tracks.length)
    } else {
      // 顺序播放
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
    }

    setCurrentTrackIndex(prevIndex)
  }

  // 跳转到指定时间
  const seek = (time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time)
      setCurrentTime(time)
    }
  }

  // 切换重复模式
  const toggleRepeat = () => setIsRepeat(!isRepeat)

  // 切换静音
  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (howlRef.current) {
      howlRef.current.volume(newMuted ? 0 : volume)
    }
  }

  // 切换随机播放
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  // 切换喜欢状态
  const toggleLike = (trackId: string) => {
    const newLiked = new Set(likedTracks)
    if (newLiked.has(trackId)) newLiked.delete(trackId)
    else newLiked.add(trackId)
    setLikedTracks(newLiked)
  }

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const value: PlayerContextType = {
    tracks,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    likedTracks,
    setTracks,
    setCurrentTrackIndex,
    togglePlay,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    toggleLike,
    formatTime
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

/**
 * 自定义钩子，用于在组件中使用播放器上下文
 */
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}