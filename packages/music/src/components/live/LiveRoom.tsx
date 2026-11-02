import React, { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar, Text, Input, Button, Badge, ScrollArea } from '@mantine/core'
// import { IconHeart, IconGift, IconUsers, IconMic, IconMicOff, IconVideo, IconVideoOff, IconMoreHorizontal, IconSend, IconVolume2, IconVolumeX, IconShare2 } from '@tabler/icons-react'
// import { useCache } from '../../hooks/useCache'
// import { syncService } from '../../services/syncService'

// 定义消息类型
interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: number
  type: 'text' | 'system' | 'like' | 'gift'
  gift?: {
    name: string
    count: number
    icon: string
  }
}

// 定义观众类型
interface Viewer {
  id: string
  username: string
  avatar: string
  isOnline: boolean
  joinTime: number
  isBroadcaster: boolean
  isModerator: boolean
  isSpeaker?: boolean
}

// 定义直播状态类型
interface LiveStatus {
  isLive: boolean
  viewers: number
  likes: number
  streamUrl?: string
  startTime?: number
  title?: string
  description?: string
  coverImage?: string
  broadcaster?: Viewer
  isRecording?: boolean
}

// WebRTC配置接口
interface WebRTCConfig {
  iceServers?: RTCIceServer[]
  mediaConstraints?: MediaStreamConstraints
}

interface LiveRoomProps {
  roomId: string
  isBroadcaster?: boolean
  initialTitle?: string
  initialDescription?: string
  onLiveStatusChange?: (status: boolean) => void
  onViewerCountChange?: (count: number) => void
}

/**
 * LiveRoom组件
 * 实现直播互动系统，包括WebSocket连接管理、观众计数、消息处理、点赞和礼物功能，以及WebRTC初始化逻辑和视频流处理
 */
const LiveRoom: React.FC<LiveRoomProps> = ({
  roomId,
  isBroadcaster = false,
  initialTitle = 'Live Music Session',
  initialDescription = 'Join me for a live music performance!',
  onLiveStatusChange,
  onViewerCountChange
}) => {
  // 状态管理
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [viewers, setViewers] = useState<Viewer[]>([])
  const [liveStatus, setLiveStatus] = useState<LiveStatus>({
    isLive: false,
    viewers: 0,
    likes: 0,
    title: initialTitle,
    description: initialDescription
  })
  const [newMessage, setNewMessage] = useState<string>('')

  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true)
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map())
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [myViewerInfo, setMyViewerInfo] = useState<Viewer | null>(null)
  const [showViewerList, setShowViewerList] = useState<boolean>(false)
  const [likeAnimationActive, setLikeAnimationActive] = useState<boolean>(false)

  // 引用
  const videoRef = useRef<HTMLVideoElement>(null)
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const cacheRef = useRef()
  const webRTCConfig = useRef<WebRTCConfig>({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    mediaConstraints: {
      video: { width: 1280, height: 720, frameRate: 30 },
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    }
  })

  // 获取当前用户信息
  const getCurrentUserInfo = useCallback((): Viewer => {
    const userId = localStorage.getItem('userId') || uuidv4()
    const username = localStorage.getItem('username') || `User_${Math.floor(Math.random() * 10000)}`
    const avatar = localStorage.getItem('avatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
    
    return {
      id: userId,
      username,
      avatar,
      isOnline: true,
      joinTime: Date.now(),
      isBroadcaster,
      isModerator: isBroadcaster,
      isSpeaker: isBroadcaster
    }
  }, [isBroadcaster])

  // 初始化WebSocket连接
  const initWebSocket = useCallback(() => {
    try {
      const currentUser = getCurrentUserInfo()
      setMyViewerInfo(currentUser)

      // 使用环境变量中的WebSocket URL，如果没有则使用默认值
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001'
      const socketUrl = `${wsUrl}/live/${roomId}?userId=${currentUser.id}&username=${currentUser.username}&isBroadcaster=${isBroadcaster}`
      
      const ws = new WebSocket(socketUrl)
      setSocket(ws)

      ws.onopen = () => {
        console.log('WebSocket connected to live room:', roomId)
        
        // 如果是主播，自动开始直播准备
        if (isBroadcaster) {
          handleStartLivePreparation()
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setConnectionError('Connection lost. Attempting to reconnect...')
        
        // 尝试重连
        setTimeout(() => {
          initWebSocket()
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionError('Failed to connect to live room')
      }

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      setConnectionError('Failed to initialize connection')
    }
  }, [roomId, isBroadcaster, getCurrentUserInfo])

  // 处理WebSocket消息
  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'live_status_update':
        setLiveStatus(prev => ({ ...prev, ...data.payload }))
        if (onLiveStatusChange) {
          onLiveStatusChange(data.payload.isLive)
        }
        break

      case 'viewer_count_update':
        setLiveStatus(prev => ({ ...prev, viewers: data.payload }))
        if (onViewerCountChange) {
          onViewerCountChange(data.payload)
        }
        break

      case 'viewer_list_update':
        setViewers(data.payload)
        break

      case 'new_message':
        setMessages(prev => [...prev, data.payload])
        break

      case 'like_update':
        setLiveStatus(prev => ({ ...prev, likes: data.payload }))
        handleLikeAnimation()
        break

      case 'webrtc_offer':
        handleWebRTCOffer(data.payload)
        break

      case 'webrtc_answer':
        handleWebRTCAnswer(data.payload)
        break

      case 'webrtc_ice_candidate':
        handleWebRTCIceCandidate(data.payload)
        break

      case 'peer_joined':
        handlePeerJoined(data.payload)
        break

      case 'peer_left':
        handlePeerLeft(data.payload)
        break

      case 'system_message':
        setMessages(prev => [...prev, data.payload])
        break

      default:
        console.log('Unknown WebSocket message type:', data.type)
    }
  }, [onLiveStatusChange, onViewerCountChange])

  // 初始化WebRTC
  const initWebRTC = useCallback(async () => {
    try {
      // 获取本地媒体流
      const stream = await navigator.mediaDevices.getUserMedia(webRTCConfig.current.mediaConstraints || {
        video: true,
        audio: true
      })

      setLocalStream(stream)

      // 将本地流设置到视频元素
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // 初始禁用音频或视频（如果需要）
      if (!isMicEnabled && stream.getAudioTracks().length > 0) {
        stream.getAudioTracks()[0].enabled = false
      }
      
      if (!isCameraEnabled && stream.getVideoTracks().length > 0) {
        stream.getVideoTracks()[0].enabled = false
      }

    } catch (error) {
      console.error('Failed to initialize WebRTC:', error)
      setConnectionError('Failed to access camera and microphone')
    }
  }, [isMicEnabled, isCameraEnabled])

  // 创建对等连接
  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(webRTCConfig.current)
    
    // 添加本地流到对等连接
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)
      })
    }

    // 处理ICE候选者
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendWebSocketMessage({
          type: 'relay_ice_candidate',
          payload: {
            target: peerId,
            candidate: event.candidate
          }
        })
      }
    }

    // 处理远程流
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      setRemoteStreams(prev => {
        const newMap = new Map(prev)
        newMap.set(peerId, remoteStream)
        return newMap
      })

      // 更新远程视频元素
      setTimeout(() => {
        const videoElement = remoteVideosRef.current.get(peerId)
        if (videoElement) {
          videoElement.srcObject = remoteStream
        }
      }, 100)
    }

    // 处理连接状态变化
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, pc.connectionState)
      
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        handlePeerLeft(peerId)
      }
    }

    // 保存对等连接
    setPeerConnections(prev => {
      const newMap = new Map(prev)
      newMap.set(peerId, pc)
      return newMap
    })

    return pc
  }, [localStream])

  // 处理WebRTC Offer
  const handleWebRTCOffer = useCallback(async (data: any) => {
    const { peerId, offer } = data
    
    let pc = peerConnections.get(peerId)
    if (!pc) {
      pc = createPeerConnection(peerId)
    }

    try {
      // 设置远程描述
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      
      // 创建Answer
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      
      // 发送Answer
      sendWebSocketMessage({
        type: 'relay_answer',
        payload: {
          target: peerId,
          answer: answer
        }
      })
    } catch (error) {
      console.error('Failed to handle WebRTC offer:', error)
    }
  }, [peerConnections, createPeerConnection])

  // 处理WebRTC Answer
  const handleWebRTCAnswer = useCallback(async (data: any) => {
    const { peerId, answer } = data
    
    const pc = peerConnections.get(peerId)
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
      } catch (error) {
        console.error('Failed to handle WebRTC answer:', error)
      }
    }
  }, [peerConnections])

  // 处理WebRTC ICE候选者
  const handleWebRTCIceCandidate = useCallback(async (data: any) => {
    const { peerId, candidate } = data
    
    const pc = peerConnections.get(peerId)
    if (pc && candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (error) {
        console.log('Failed to add ICE candidate:', error)
      }
    }
  }, [peerConnections])

  // 处理新的对等连接加入
  const handlePeerJoined = useCallback(async (peerId: string) => {
    if (isBroadcaster) {
      // 主播主动发起连接
      setTimeout(async () => {
        const pc = createPeerConnection(peerId)
        
        try {
          // 创建Offer
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          
          // 发送Offer
          sendWebSocketMessage({
            type: 'relay_offer',
            payload: {
              target: peerId,
              offer: offer
            }
          })
        } catch (error) {
          console.error('Failed to create WebRTC offer:', error)
        }
      }, 1000)
    }
  }, [isBroadcaster, createPeerConnection])

  // 处理对等连接离开
  const handlePeerLeft = useCallback((peerId: string) => {
    // 关闭并删除对等连接
    const pc = peerConnections.get(peerId)
    if (pc) {
      pc.close()
      setPeerConnections(prev => {
        const newMap = new Map(prev)
        newMap.delete(peerId)
        return newMap
      })
    }

    // 删除远程流
    setRemoteStreams(prev => {
      const newMap = new Map(prev)
      newMap.delete(peerId)
      return newMap
    })

    // 删除远程视频元素引用
    remoteVideosRef.current.delete(peerId)
  }, [peerConnections])

  // 发送WebSocket消息
  const sendWebSocketMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [socket])

  // 发送聊天消息
  const sendChatMessage = useCallback(() => {
    if (newMessage.trim() && myViewerInfo) {
      const message: ChatMessage = {
        id: uuidv4(),
        userId: myViewerInfo.id,
        username: myViewerInfo.username,
        avatar: myViewerInfo.avatar,
        content: newMessage.trim(),
        timestamp: Date.now(),
        type: 'text'
      }

      // 发送到服务器
      sendWebSocketMessage({
        type: 'send_message',
        payload: message
      })

      // 清空输入框
      setNewMessage('')
    }
  }, [newMessage, myViewerInfo, sendWebSocketMessage])

  // 发送点赞
  const sendLike = useCallback(() => {
    if (myViewerInfo) {
      const likeMessage: ChatMessage = {
        id: uuidv4(),
        userId: myViewerInfo.id,
        username: myViewerInfo.username,
        avatar: myViewerInfo.avatar,
        content: '',
        timestamp: Date.now(),
        type: 'like'
      }

      // 发送到服务器
      sendWebSocketMessage({
        type: 'send_like',
        payload: likeMessage
      })

      // 触发点赞动画
      handleLikeAnimation()
    }
  }, [myViewerInfo, sendWebSocketMessage])

  // 发送礼物
  const sendGift = useCallback((giftName: string, count: number = 1) => {
    if (myViewerInfo) {
      const giftMessage: ChatMessage = {
        id: uuidv4(),
        userId: myViewerInfo.id,
        username: myViewerInfo.username,
        avatar: myViewerInfo.avatar,
        content: '',
        timestamp: Date.now(),
        type: 'gift',
        gift: {
          name: giftName,
          count,
          icon: `/gifts/${giftName.toLowerCase().replace(/\s+/g, '_')}.svg`
        }
      }

      // 发送到服务器
      sendWebSocketMessage({
        type: 'send_gift',
        payload: giftMessage
      })
    }
  }, [myViewerInfo, sendWebSocketMessage])

  // 处理点赞动画
  const handleLikeAnimation = useCallback(() => {
    setLikeAnimationActive(true)
    setTimeout(() => {
      setLikeAnimationActive(false)
    }, 1000)
  }, [])

  // 开始直播准备
  const handleStartLivePreparation = useCallback(async () => {
    try {
      // 初始化WebRTC
      await initWebRTC()
      
      // 通知服务器准备开始直播
      sendWebSocketMessage({
        type: 'prepare_live',
        payload: {
          title: liveStatus.title,
          description: liveStatus.description,
          startTime: Date.now()
        }
      })
      
      setLiveStatus(prev => ({ ...prev, isLive: true }))
      
    } catch (error) {
      console.error('Failed to prepare live stream:', error)
      setConnectionError('Failed to prepare live stream')
    }
  }, [initWebRTC, sendWebSocketMessage, liveStatus.title, liveStatus.description])

  // 开始直播
  const handleStartLive = useCallback(() => {
    sendWebSocketMessage({
      type: 'start_live',
      payload: {
        timestamp: Date.now()
      }
    })
    
    setLiveStatus(prev => ({ ...prev, isLive: true }))
  }, [sendWebSocketMessage])

  // 停止直播
  const handleStopLive = useCallback(() => {
    sendWebSocketMessage({
      type: 'stop_live',
      payload: {
        timestamp: Date.now()
      }
    })
    
    setLiveStatus(prev => ({ ...prev, isLive: false }))
    
    // 清理WebRTC资源
    cleanupWebRTC()
  }, [sendWebSocketMessage])

  // 切换麦克风状态
  const toggleMic = useCallback(() => {
    const newMicState = !isMicEnabled
    setIsMicEnabled(newMicState)
    
    // 更新本地流
    if (localStream && localStream.getAudioTracks().length > 0) {
      localStream.getAudioTracks()[0].enabled = newMicState
    }
    
    // 通知服务器
    sendWebSocketMessage({
      type: 'update_media_state',
      payload: {
        micEnabled: newMicState
      }
    })
  }, [isMicEnabled, localStream, sendWebSocketMessage])

  // 切换摄像头状态
  const toggleCamera = useCallback(() => {
    const newCameraState = !isCameraEnabled
    setIsCameraEnabled(newCameraState)
    
    // 更新本地流
    if (localStream && localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].enabled = newCameraState
    }
    
    // 通知服务器
    sendWebSocketMessage({
      type: 'update_media_state',
      payload: {
        cameraEnabled: newCameraState
      }
    })
  }, [isCameraEnabled, localStream, sendWebSocketMessage])

  // 切换音频输出
  const toggleAudioOutput = useCallback(() => {
    setIsAudioEnabled(!isAudioEnabled)
  }, [isAudioEnabled])

  // 清理WebRTC资源
  const cleanupWebRTC = useCallback(() => {
    // 停止本地流
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    // 关闭所有对等连接
    peerConnections.forEach(pc => pc.close())
    setPeerConnections(new Map())
    
    // 清理远程流
    setRemoteStreams(new Map())
    remoteVideosRef.current.clear()
  }, [localStream, peerConnections])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 组件挂载时初始化
  useEffect(() => {
    initWebSocket()

    // 组件卸载时清理
    return () => {
      // 关闭WebSocket连接
      if (socket) {
        socket.close()
      }

      // 清理WebRTC资源
      cleanupWebRTC()
    }
  }, [initWebSocket, cleanupWebRTC, socket])

  // 渲染消息气泡
  const renderMessage = useCallback((message: ChatMessage) => {
    switch (message.type) {
      case 'like':
        return (
          <div key={message.id} className="like-message flex items-center space-x-2 py-1">
            <Avatar size={24} src={message.avatar} alt={message.username} />
            <Text size="sm" className="text-gray-300">
              <span className="font-medium text-pink-500">{message.username}</span> liked the stream
            </Text>
          </div>
        )

      case 'gift':
        return (
          <div key={message.id} className="gift-message flex items-center space-x-2 py-1 bg-gray-800/50 p-2 rounded-lg">
            <Avatar size={24} src={message.avatar} alt={message.username} />
            <div className="flex-1">
              <Text size="sm" className="text-gray-200">
                <span className="font-medium text-pink-500">{message.username}</span> sent
                <span className="ml-1 text-yellow-500 font-bold"> {message.gift?.name}</span>
                {message.gift && message.gift.count && message.gift.count > 1 && <span className="ml-1 text-yellow-400">x{message.gift.count}</span>}
              </Text>
            </div>
          </div>
        )

      case 'system':
        return (
          <div key={message.id} className="system-message text-center py-1">
            <Badge variant="outline" color="blue" size="sm">
              {message.content}
            </Badge>
          </div>
        )

      default:
        return (
          <div key={message.id} className="message flex space-x-2 py-1">
            <Avatar size={24} src={message.avatar} alt={message.username} />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Text size="sm" className="font-medium">{message.username}</Text>
                <Text size="xs" className="text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
              </div>
              <Text size="sm" className="text-gray-200">{message.content}</Text>
            </div>
          </div>
        )
    }
  }, [])

  // 格式化时间
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }, [])

  return (
    <div className="live-room flex flex-col h-full bg-gray-900 text-white">
      {/* 直播区域 */}
      <div className="live-area relative flex-1 bg-black overflow-hidden">
        {/* 视频区域 */}
        <div className="video-container relative w-full h-full">
          {/* 主播视频 */}
          {isBroadcaster ? (
            <video
              ref={videoRef}
              autoPlay
              muted={isBroadcaster} // 主播端自动静音避免回声
              className="w-full h-full object-contain"
              playsInline
            />
          ) : (
            /* 观众端显示主播视频或占位符 */
            liveStatus.isLive ? (
              <video
                ref={videoRef}
                autoPlay
                muted={!isAudioEnabled}
                className="w-full h-full object-contain"
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Text size="lg" className="text-gray-400">
                  Stream will start soon...
                </Text>
              </div>
            )
          )}

          {/* 直播状态信息 */}
          <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Badge color={liveStatus.isLive ? "red" : "gray"} className="animate-pulse">
                {liveStatus.isLive ? 'LIVE' : 'OFFLINE'}
              </Badge>
              <Text size="sm">
                {liveStatus.title || 'Live Stream'}
              </Text>
            </div>
            {liveStatus.isLive && (
              <Text size="xs" className="text-gray-400 mt-1">
                {formatTime(Math.floor((Date.now() - (liveStatus.startTime || Date.now())) / 1000))}
              </Text>
            )}
          </div>

          {/* 观看人数 */}
          <div className="absolute top-4 right-4 bg-black/70 rounded-full px-3 py-1 backdrop-blur-sm flex items-center space-x-1">
            <span className="text-white">👥</span>
            <Text size="sm">{liveStatus.viewers}</Text>
          </div>

          {/* 点赞数量 */}
          {liveStatus.isLive && (
            <div className="absolute bottom-4 right-4 bg-black/70 rounded-full px-3 py-1 backdrop-blur-sm flex items-center space-x-1">
              <span className="text-pink-500">❤️</span>
              <Text size="sm">{liveStatus.likes}</Text>
            </div>
          )}

          {/* 点赞动画 */}
          {likeAnimationActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-5xl text-pink-500/70 animate-bounce">❤️</span>
            </div>
          )}

          {/* 错误提示 */}
          {connectionError && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900/90 rounded-lg p-4 backdrop-blur-sm">
              <Text className="text-red-100">{connectionError}</Text>
            </div>
          )}

          {/* 主播控制按钮 */}
          {isBroadcaster && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-black/70 rounded-full px-4 py-2 backdrop-blur-sm">
              {liveStatus.isLive ? (
                <Button 
                  color="red" 
                  size="sm" 
                  onClick={handleStopLive}
                  className="rounded-full"
                >
                  Stop Live
                </Button>
              ) : (
                <Button 
                  color="green" 
                  size="sm" 
                  onClick={handleStartLive}
                  disabled={!localStream}
                  className="rounded-full"
                >
                  Go Live
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMic}
                className={`rounded-full ${!isMicEnabled ? 'text-red-500' : ''}`}
                aria-label={isMicEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {isMicEnabled ? <span>🎤</span> : <span className="text-red-500">🎤</span>}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleCamera}
                className={`rounded-full ${!isCameraEnabled ? 'text-red-500' : ''}`}
                aria-label={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {isCameraEnabled ? <span>📹</span> : <span className="text-red-500">📹</span>}
              </Button>
            </div>
          )}

          {/* 观众控制按钮 */}
          {!isBroadcaster && liveStatus.isLive && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-black/70 rounded-full px-4 py-2 backdrop-blur-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleAudioOutput}
                className={`rounded-full ${!isAudioEnabled ? 'text-red-500' : ''}`}
                aria-label={isAudioEnabled ? "Mute audio" : "Unmute audio"}
              >
                {isAudioEnabled ? <span>🔊</span> : <span className="text-red-500">🔇</span>}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowViewerList(!showViewerList)}
                className="rounded-full"
                aria-label={showViewerList ? "Hide viewers" : "Show viewers"}
              >
                <span>👥</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full"
                aria-label="Share"
              >
                <span>🔗</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 聊天和互动区域 */}
      <div className="chat-area border-t border-gray-800 p-3 bg-gray-900">
        <div className="flex space-x-3">
          {/* 聊天消息 */}
          <div className="flex-1">
            <ScrollArea className="h-64 bg-gray-800/50 rounded-lg p-3">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* 消息输入框 */}
            <div className="mt-3 flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <Button onClick={sendChatMessage} className="rounded-full">
              <span>→</span>
            </Button>
            </div>
          </div>

          {/* 互动按钮 */}
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={sendLike} 
              className="rounded-full h-12 w-12 flex items-center justify-center bg-pink-600 hover:bg-pink-700"
              aria-label="Like"
            >
              <span className="text-white">❤️</span>
            </Button>
            <Button 
              onClick={() => sendGift('Guitar', 1)} 
              className="rounded-full h-12 w-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700"
              aria-label="Send gift"
            >
              <span className="text-white">🎁</span>
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-full h-12 w-12 flex items-center justify-center"
              aria-label="More options"
            >
              <span className="text-white">⋮</span>
            </Button>
          </div>

          {/* 观众列表 */}
          {showViewerList && (
            <div className="w-48 bg-gray-800/50 rounded-lg p-3">
              <Text size="sm" className="font-medium mb-2">Viewers ({viewers.length})</Text>
              <ScrollArea className="h-64">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center space-x-2 py-1">
                    <Avatar size={20} src={viewer.avatar} alt={viewer.username} />
                    <div className="flex-1">
                      <Text size="sm" className="truncate">
                        {viewer.username}
                      </Text>
                    </div>
                    {viewer.isBroadcaster && (
                      <Badge size="xs" color="primary">
                        LIVE
                      </Badge>
                    )}
                    {viewer.isModerator && !viewer.isBroadcaster && (
                      <Badge size="xs" color="blue">
                        MOD
                      </Badge>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* 远程视频容器（如果有多个视频流） */}
      {Array.from(remoteStreams.entries()).length > 0 && (
        <div className="remote-videos absolute top-4 right-4 flex flex-col space-y-2">
          {Array.from(remoteStreams.entries()).map(([peerId]) => (
            <video
              key={peerId}
              ref={(el) => el && remoteVideosRef.current.set(peerId, el)}
              autoPlay
              muted
              className="w-32 h-24 object-cover rounded-md border border-gray-700 bg-black"
              playsInline
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LiveRoom