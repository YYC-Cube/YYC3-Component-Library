import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { usePlayer } from './PlayerContext'

// 创建播放列表上下文
const PlaylistContext = createContext()

// 自定义Hook用于使用播放列表上下文
export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }
  return context
}

// 模拟播放列表数据（与组件期望的数据结构一致）
const mockPlaylists = [
  {
    id: '1',
    name: '我的最爱',
    description: '收藏的喜欢的歌曲',
    coverImage: '/placeholder-playlist1.png',
    creator: {
      id: '1',
      username: '我',
      avatar: '/default-avatar.png'
    },
    isPublic: false,
    playCount: 125,
    favorites: 0,
    songCount: 20,
    duration: 3600,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-07-10'),
    tags: ['最爱', '流行']
  },
  {
    id: '2',
    name: '工作专注',
    description: '适合工作时听的轻音乐',
    coverImage: '/placeholder-playlist2.png',
    creator: {
      id: '1',
      username: '我',
      avatar: '/default-avatar.png'
    },
    isPublic: true,
    playCount: 89,
    favorites: 5,
    songCount: 15,
    duration: 2850,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-06-25'),
    tags: ['专注', '轻音乐']
  },
  {
    id: '3',
    name: '民谣精选',
    description: '精选的民谣歌曲合集',
    coverImage: '/placeholder-playlist3.png',
    creator: {
      id: '2',
      username: '音乐达人',
      avatar: '/default-avatar.png'
    },
    isPublic: true,
    playCount: 1256,
    favorites: 128,
    songCount: 30,
    duration: 5400,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-07-05'),
    tags: ['民谣', '精选']
  }
]

// 播放列表提供者组件
export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([])
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { playSong, mockSongs } = usePlayer()

  // 获取用户的所有播放列表
  const fetchUserPlaylists = async (userId = '1', type = 'created', page = 1, limit = 20) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时返回模拟数据
      setPlaylists(mockPlaylists)
    } catch (err) {
      setError('获取播放列表失败，请稍后再试')
      console.error('获取播放列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 获取播放列表详情
  const fetchPlaylistDetail = async (playlistId) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时返回模拟数据
      const playlist = mockPlaylists.find(p => p.id === playlistId)
      if (playlist) {
        setCurrentPlaylist(playlist)
      } else {
        setError('未找到该播放列表')
      }
    } catch (err) {
      setError('获取播放列表详情失败，请稍后再试')
      console.error('获取播放列表详情失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 播放播放列表
  const playPlaylist = (playlist) => {
    if (playlist && mockSongs && mockSongs.length > 0) {
      // 随机选择一首歌曲播放
      const randomIndex = Math.floor(Math.random() * mockSongs.length)
      playSong(mockSongs[randomIndex])
    }
  }

  // 创建新播放列表
  const createPlaylist = async (playlistData) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时创建新的播放列表（实际项目中应该调用API）
      const newPlaylist = {
        id: Date.now().toString(),
        name: playlistData.name,
        description: playlistData.description || '',
        coverImage: '/default-playlist.png',
        creator: {
          id: '1',
          username: '我',
          avatar: '/default-avatar.png'
        },
        isPublic: playlistData.isPublic || false,
        playCount: 0,
        favorites: 0,
        songCount: 0,
        duration: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: playlistData.tags || []
      }
      
      setPlaylists(prev => [newPlaylist, ...prev])
      return newPlaylist
    } catch (err) {
      setError('创建播放列表失败，请稍后再试')
      console.error('创建播放列表失败:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 删除播放列表
  const deletePlaylist = async (playlistId) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时删除播放列表（实际项目中应该调用API）
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
      if (currentPlaylist && currentPlaylist.id === playlistId) {
        setCurrentPlaylist(null)
      }
    } catch (err) {
      setError('删除播放列表失败，请稍后再试')
      console.error('删除播放列表失败:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 更新播放列表
  const updatePlaylist = async (playlistId, updateData) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时更新播放列表（实际项目中应该调用API）
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, ...updateData, updatedAt: new Date() }
          : p
      ))
      
      if (currentPlaylist && currentPlaylist.id === playlistId) {
        setCurrentPlaylist(prev => ({ ...prev, ...updateData, updatedAt: new Date() }))
      }
    } catch (err) {
      setError('更新播放列表失败，请稍后再试')
      console.error('更新播放列表失败:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 添加歌曲到播放列表
  const addSongToPlaylist = async (playlistId, songId) => {
    // 实际项目中应该调用API
    setError('功能正在开发中')
    console.log('添加歌曲到播放列表:', playlistId, songId)
  }

  // 从播放列表中移除歌曲
  const removeSongFromPlaylist = async (playlistId, songId) => {
    // 实际项目中应该调用API
    setError('功能正在开发中')
    console.log('从播放列表中移除歌曲:', playlistId, songId)
  }

  // 切换播放列表公开状态
  const togglePlaylistPublicStatus = async (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId)
    if (playlist) {
      await updatePlaylist(playlistId, { isPublic: !playlist.isPublic })
    }
  }

  // 获取播放列表的歌曲列表
  const fetchPlaylistSongs = async (playlistId, page = 1, limit = 50) => {
    // 实际项目中应该调用API
    // 这里返回模拟数据的子集
    setError('功能正在开发中')
    console.log('获取播放列表歌曲:', playlistId)
    return { songs: mockSongs.slice(0, 10), total: mockSongs.length }
  }

  // 复制播放列表
  const duplicatePlaylist = async (playlistId, newName = '') => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时复制播放列表（实际项目中应该调用API）
      const originalPlaylist = playlists.find(p => p.id === playlistId)
      if (originalPlaylist) {
        const newPlaylist = {
          ...originalPlaylist,
          id: Date.now().toString(),
          name: newName || `${originalPlaylist.name} (副本)`,
          playCount: 0,
          favorites: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        setPlaylists(prev => [newPlaylist, ...prev])
        return newPlaylist
      } else {
        setError('未找到该播放列表')
        throw new Error('未找到该播放列表')
      }
    } catch (err) {
      setError('复制播放列表失败，请稍后再试')
      console.error('复制播放列表失败:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 点赞/取消点赞播放列表
  const toggleFavoritePlaylist = async (playlistId) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 临时处理点赞/取消点赞（实际项目中应该调用API）
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, favorites: p.favorites + 1 }
          : p
      ))
    } catch (err) {
      setError('操作失败，请稍后再试')
      console.error('切换播放列表收藏状态失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 搜索播放列表
  const searchPlaylists = async (query, filters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 临时搜索逻辑（实际项目中应该调用API）
      let filtered = [...mockPlaylists]
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.creator.username.toLowerCase().includes(lowerQuery) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        )
      }
      
      if (filters.isPublic !== undefined) {
        filtered = filtered.filter(p => p.isPublic === filters.isPublic)
      }
      
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'createdAt':
              return new Date(b.createdAt) - new Date(a.createdAt)
            case 'playCount':
              return b.playCount - a.playCount
            case 'favorites':
              return b.favorites - a.favorites
            case 'songCount':
              return b.songCount - a.songCount
            default:
              return 0
          }
        })
      }
      
      return filtered.slice(0, filters.limit || 20)
    } catch (err) {
      setError('搜索播放列表失败，请稍后再试')
      console.error('搜索播放列表失败:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // 上下文值
  const contextValue = {
    playlists,
    currentPlaylist,
    loading,
    error,
    fetchUserPlaylists,
    fetchPlaylistDetail,
    playPlaylist,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    togglePlaylistPublicStatus,
    fetchPlaylistSongs,
    duplicatePlaylist,
    toggleFavoritePlaylist,
    searchPlaylists,
    mockPlaylists
  }

  // 初始加载用户播放列表
  React.useEffect(() => {
    fetchUserPlaylists()
  }, [])

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
    </PlaylistContext.Provider>
  )
}

export default PlaylistContext