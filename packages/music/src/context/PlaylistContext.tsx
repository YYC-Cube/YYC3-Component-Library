import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import type { Track, Playlist } from '../types'

interface PlaylistContextType {
  playlists: Playlist[]
  activePlaylist: Playlist | null
  currentTrackInPlaylist: Track | null
  currentTrackIndexInPlaylist: number | null
  createPlaylist: (name: string, description?: string) => void
  deletePlaylist: (playlistId: string) => void
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void
  addTrackToPlaylist: (playlistId: string, track: Track) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  setActivePlaylist: (playlist: Playlist | null) => void
  setCurrentTrackInPlaylist: (track: Track | null, index: number | null) => void
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

interface PlaylistProviderProps {
  children: ReactNode
}

/**
 * 播放列表上下文提供者
 */
export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  // 从localStorage加载播放列表
  const loadPlaylists = (): Playlist[] => {
    try {
      const saved = localStorage.getItem('playlists')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to load playlists:', error)
      return []
    }
  }

  // 保存播放列表到localStorage
  const savePlaylists = (playlists: Playlist[]) => {
    try {
      localStorage.setItem('playlists', JSON.stringify(playlists))
    } catch (error) {
      console.error('Failed to save playlists:', error)
    }
  }

  const [playlists, setPlaylists] = useState<Playlist[]>(loadPlaylists)
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)
  const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState<Track | null>(null)
  const [currentTrackIndexInPlaylist, setCurrentTrackIndexInPlaylist] = useState<number | null>(null)

  // 保存播放列表到localStorage
  useEffect(() => {
    savePlaylists(playlists)
  }, [playlists])

  // 创建播放列表
  const createPlaylist = (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}`,
      name,
      description: description || '',
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackCount: 0,
      isPublic: false
    }

    setPlaylists(prev => [...prev, newPlaylist])
  }

  // 删除播放列表
  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId))
    
    // 如果删除的是当前激活的播放列表，清除激活状态
    if (activePlaylist && activePlaylist.id === playlistId) {
      setActivePlaylist(null)
      setCurrentTrackInPlaylist(null)
      setCurrentTrackIndexInPlaylist(null)
    }
  }

  // 更新播放列表
  const updatePlaylist = (playlistId: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
      return playlist
    }))

    // 如果更新的是当前激活的播放列表，同步更新激活状态
    if (activePlaylist && activePlaylist.id === playlistId) {
      setActivePlaylist(prev => prev ? {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      } : null)
    }
  }

  // 添加曲目到播放列表
  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        // 检查曲目是否已存在
        const trackExists = playlist.tracks.some(t => t.id === track.id)
        if (trackExists) return playlist

        return {
          ...playlist,
          tracks: [...playlist.tracks, track],
          updatedAt: new Date().toISOString()
        }
      }
      return playlist
    }))

    // 如果添加到的是当前激活的播放列表，同步更新激活状态
    if (activePlaylist && activePlaylist.id === playlistId) {
      setActivePlaylist(prev => prev ? {
        ...prev,
        tracks: [...prev.tracks, track],
        updatedAt: new Date().toISOString()
      } : null)
    }
  }

  // 从播放列表中移除曲目
  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter(track => track.id !== trackId),
          updatedAt: new Date().toISOString()
        }
      }
      return playlist
    }))

    // 如果从当前激活的播放列表中移除曲目，同步更新激活状态
    if (activePlaylist && activePlaylist.id === playlistId) {
      setActivePlaylist(prev => prev ? {
        ...prev,
        tracks: prev.tracks.filter(track => track.id !== trackId),
        updatedAt: new Date().toISOString()
      } : null)

      // 如果移除的是当前播放的曲目，清除当前曲目状态
      if (currentTrackInPlaylist && currentTrackInPlaylist.id === trackId) {
        setCurrentTrackInPlaylist(null)
        setCurrentTrackIndexInPlaylist(null)
      }
    }
  }

  const value: PlaylistContextType = {
    playlists,
    activePlaylist,
    currentTrackInPlaylist,
    currentTrackIndexInPlaylist,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    setActivePlaylist,
    setCurrentTrackInPlaylist
  }

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  )
}

/**
 * 自定义钩子，用于在组件中使用播放列表上下文
 */
export const usePlaylist = (): PlaylistContextType => {
  const context = useContext(PlaylistContext)
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }
  return context
}