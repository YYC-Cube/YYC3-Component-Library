// src/components/spacetime/SpaceTimeSystem.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  Group,
  Button,
  Textarea,
  Select,
  Stack,
  Title,
  Text,
  Badge,
  Modal,
  ActionIcon,
  Grid
} from '@mantine/core'
import {
  IconMapPin,
  IconCalendar,
  IconSend,
  IconPhoto,
  IconVideo,
  IconMap2,
  IconBell
} from '@tabler/icons-react'
// 暂时移除不存在的类型导入

interface SpaceTimeSystemProps {}

export const SpaceTimeSystem: React.FC<SpaceTimeSystemProps> = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [creatingMessage, setCreatingMessage] = useState(false)
  const [messageType, setMessageType] = useState<'text' | 'voice' | 'image' | 'video'>('text')
  const [triggerType, setTriggerType] = useState<'time' | 'location' | 'event'>('time')
  const [messageContent, setMessageContent] = useState('')
  const [scheduledTime, setScheduledTime] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  // map reference will be used when implementing map functionality

  useEffect(() => {
    loadMessages()
    setupGeolocation()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/v1/spacetime/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const setupGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }

  const createSpaceTimeMessage = async () => {
    if (!messageContent.trim() && !audioBlob) return

    try {
      const formData = new FormData()
      formData.append('type', messageType)
      formData.append('triggerType', triggerType)
      
      if (messageType === 'text') {
        formData.append('content', messageContent)
      }
      
      if (triggerType === 'time' && scheduledTime) {
        formData.append('scheduledTime', scheduledTime)
      }
      
      if (triggerType === 'location' && selectedLocation) {
        formData.append('location', JSON.stringify(selectedLocation))
      }
      
      if (triggerType === 'event') {
        formData.append('event', selectedEvent)
      }
      
      if (audioBlob) {
        formData.append('audio', audioBlob, 'voice.wav')
      }
      
      attachments.forEach(file => {
        formData.append('attachments', file)
      })

      const response = await fetch('/api/v1/spacetime/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        setCreatingMessage(false)
        setMessageContent('')
        setScheduledTime(null)
        setSelectedEvent('')
        setAttachments([])
        setAudioBlob(null)
        loadMessages()
      }
    } catch (error) {
      console.error('Failed to create message:', error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // 处理地图点击事件 - 暂时注释未使用的函数
  /*
  const handleMapClick = (e: any) => {
    setSelectedLocation({
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      accuracy: 10
    })
  }
  */

  const availableEvents = [
    '用户生日',
    '纪念日',
    '节日',
    '新歌发布',
    '演唱会开始',
    '自定义事件'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Group mb="xl">
          <IconMap2 size={32} className="text-blue-600" />
          <Title order={2}>时空喊话系统</Title>
        </Group>

        <Grid gutter="xl">
          {/* 消息创建区 */}
          <Grid.Col span={4}>
            <Card className="h-full">
              <Group justify="space-between" mb="md">
                <Text fw={600}>创建时空消息</Text>
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => setCreatingMessage(true)}
                >
                  <IconSend size={16} />
                </ActionIcon>
              </Group>

              <Modal
                opened={creatingMessage}
                onClose={() => setCreatingMessage(false)}
                title="创建时空消息"
                size="lg"
              >
                <Stack gap="md">
                  {/* 消息类型 */}
                  <Select
                    label="消息类型"
                    value={messageType}
                    onChange={(value) => setMessageType(value as any)}
                    data={[
                      { value: 'text', label: '文字消息' },
                      { value: 'voice', label: '语音消息' },
                      { value: 'image', label: '图片消息' },
                      { value: 'video', label: '视频消息' }
                    ]}
                  />

                  {/* 消息内容 */}
                  {messageType === 'text' && (
                    <Textarea
                      label="消息内容"
                      placeholder="写下您的时空寄语..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      minRows={3}
                    />
                  )}

                  {messageType === 'voice' && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <Group justify="center" gap="sm">
                        <Button
                          color={isRecording ? 'red' : 'blue'}
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          {isRecording ? '停止录音' : '开始录音'}
                        </Button>
                        {audioBlob && (
                          <audio src={URL.createObjectURL(audioBlob)} controls />
                        )}
                      </Group>
                    </div>
                  )}

                  {messageType === 'image' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.multiple = true
                        input.onchange = (e) => {
                          const files = Array.from((e.target as HTMLInputElement).files || [])
                          setAttachments(files)
                        }
                        input.click()
                      }}
                    >
                      <IconPhoto size={16} className="mr-2" />
                      选择图片
                    </Button>
                  )}

                  {messageType === 'video' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'video/*'
                        input.multiple = true
                        input.onchange = (e) => {
                          const files = Array.from((e.target as HTMLInputElement).files || [])
                          setAttachments(files)
                        }
                        input.click()
                      }}
                    >
                      <IconVideo size={16} className="mr-2" />
                      选择视频
                    </Button>
                  )}

                  {/* 触发类型 */}
                  <Select
                    label="触发方式"
                    value={triggerType}
                    onChange={(value) => setTriggerType(value as any)}
                    data={[
                      { value: 'time', label: '时间触发' },
                      { value: 'location', label: '位置触发' },
                      { value: 'event', label: '事件触发' }
                    ]}
                  />

                  {/* 时间触发配置 */}
                  {triggerType === 'time' && (
                    <div className="mt-2">
                      <Text size="sm" mb={1}>触发时间</Text>
                      <input 
                        type="datetime-local" 
                        value={scheduledTime || ''}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="border p-2 rounded"
                      />
                    </div>
                  )}

                  {/* 位置触发配置 */}
                  {triggerType === 'location' && (
                    <div className="mt-2">
                      <Text size="sm">选择位置 (地图组件暂时不可用)</Text>
                      <div className="border rounded-lg p-4 bg-gray-100 text-center">
                        <IconMap2 size={32} className="mx-auto mb-2" />
                        <Text>位置选择功能暂未实现</Text>
                      </div>
                    </div>
                  )}

                  {/* 事件触发配置 */}
                  {triggerType === 'event' && (
                    <Select
                      label="触发事件"
                      placeholder="选择触发事件"
                      value={selectedEvent}
                      onChange={(value) => setSelectedEvent(value as string)}
                      data={availableEvents.map(event => ({ value: event, label: event }))}
                    />
                  )}

                  <Group justify="right">
                    <Button
                      variant="outline"
                      onClick={() => setCreatingMessage(false)}
                    >
                      取消
                    </Button>
                    <Button onClick={createSpaceTimeMessage}>
                      <IconSend size={16} className="mr-2" />
                      创建消息
                    </Button>
                  </Group>
                </Stack>
              </Modal>

              {/* 快速触发 */}
              <Stack gap="xs">
                <Text fw={600} size="sm">快速触发</Text>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  <IconCalendar size={14} className="mr-2" />
                  生日祝福
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  <IconMapPin size={14} className="mr-2" />
                  位置留言
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  <IconBell size={14} className="mr-2" />
                  节日提醒
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          {/* 消息展示区 */}
          <Grid.Col span={8}>
            <Card className="h-full">
              <Group justify="space-between" mb="md">
                <Text fw={600}>时空消息</Text>
                <Badge color="blue" variant="light">
                  {messages.length} 条消息
                </Badge>
              </Group>

              <Stack gap="md">
                {messages.map((message) => (
                  <SpaceTimeMessageCard key={message.id} message={message} />
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  )
}

// 时空消息卡片组件
interface SpaceTimeMessageCardProps {
  message: any
}

const SpaceTimeMessageCard: React.FC<SpaceTimeMessageCardProps> = ({ message }) => {
  const [isDelivered] = useState(message.isDelivered)

  const getTriggerText = () => {
    switch (message.triggerType) {
      case 'time':
        return `将在 ${message.scheduledTime?.toLocaleString()} 触发`
      case 'location':
        return `在 ${message.location?.latitude.toFixed(4)}, ${message.location?.longitude.toFixed(4)} 触发`
      case 'event':
        return `事件触发: ${message.event}`
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    if (isDelivered) return 'green'
    if (message.isExpired) return 'red'
    return 'yellow'
  }

  const getStatusText = () => {
    if (isDelivered) return '已送达'
    if (message.isExpired) return '已过期'
    return '等待中'
  }

  return (
    <Card
      className={`border-l-4 ${
        isDelivered ? 'border-green-500' : message.isExpired ? 'border-red-500' : 'border-yellow-500'
      }`}
    >
      <Group justify="space-between" align="flex-start">
        <div className="flex-1">
          <Group gap="xs" mb="xs">
            <Badge color="blue" variant="light" size="sm">
              {message.type}
            </Badge>
            <Badge color={getStatusColor()} variant="light" size="sm">
              {getStatusText()}
            </Badge>
          </Group>

          {/* 消息内容 */}
          {message.type === 'text' && (
            <Text mb="xs">{message.content}</Text>
          )}

          {message.type === 'voice' && (
            <audio src={message.audioUrl} controls className="w-full mb-xs" />
          )}

          {message.type === 'image' && (
            <img src={message.imageUrl} alt="Space message" className="w-full rounded-lg mb-xs" />
          )}

          {message.type === 'video' && (
            <video src={message.videoUrl} controls className="w-full rounded-lg mb-xs" />
          )}

          {/* 触发信息 */}
          <Text size="xs" color="gray.500">
            {getTriggerText()}
          </Text>

          <Text size="xs" color="gray.500">
            创建时间: {message.createdAt.toLocaleString()}
          </Text>
        </div>

        <ActionIcon variant="subtle" color="red">
          <IconBell size={16} />
        </ActionIcon>
      </Group>
    </Card>
  )
}
