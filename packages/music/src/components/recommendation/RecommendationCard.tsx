import React, { useState } from 'react'
import { Card, Text, Group, Badge, Tooltip, ActionIcon, Box } from '@mantine/core'
import { IconHeart, IconHeartOff, IconStackForward, IconInbox, IconPlayerPlay } from '@tabler/icons-react'
import { usePlayer } from '../../context/PlayerContext'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  cover: string
  duration: number
  genre: string
  releaseDate: string
  playCount: number
}

interface RecommendationCardProps {
  song: Song
  reason: string
  score: number
  source: 'collaborative' | 'content' | 'hybrid'
  onFeedback?: (songId: string, feedback: 'like' | 'dislike' | 'ignore') => void
  onPlay?: (song: Song) => void
}

/**
 * 推荐歌曲卡片组件
 * 展示推荐歌曲信息、推荐理由和反馈按钮
 */
export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  song,
  reason,
  score,
  source,
  onFeedback,
  onPlay
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [showReason, setShowReason] = useState(false)
  usePlayer()

  // 格式化时长
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 播放歌曲
  const handlePlay = () => {
    // 直接调用onPlay回调
    if (onPlay) {
      onPlay(song)
    }
  }

  // 提交喜欢反馈
  const handleLike = () => {
    if (!isLiked && onFeedback) {
      onFeedback(song.id, 'like')
      setIsLiked(true)
      setIsDisliked(false)
    }
  }

  // 提交不喜欢反馈
  const handleDislike = () => {
    if (!isDisliked && onFeedback) {
      onFeedback(song.id, 'dislike')
      setIsDisliked(true)
      setIsLiked(false)
    }
  }

  // 提交忽略反馈
  const handleIgnore = () => {
    if (onFeedback) {
      onFeedback(song.id, 'ignore')
    }
  }

  // 获取推荐来源的图标和颜色
  const getSourceBadgeProps = () => {
    switch (source) {
      case 'collaborative':
        return {
          label: '协同过滤',
          color: 'blue'
        }
      case 'content':
        return {
          label: '内容推荐',
          color: 'green'
        }
      case 'hybrid':
        return {
          label: '混合推荐',
          color: 'purple'
        }
      default:
        return {
          label: '推荐',
          color: 'gray'
        }
    }
  }

  const sourceProps = getSourceBadgeProps()

  return (
    <Card shadow="md" className="transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <Group gap="md">
          {/* 专辑封面 */}
          <div className="relative" style={{ width: 80, height: 80 }}>
            <img
              src={song.cover || `/placeholder${Math.floor(Math.random() * 20) + 1}.png`}
              alt={`${song.album} cover`}
              className="w-full h-full object-cover rounded-md"
            />
            {/* 播放按钮覆盖层 */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-30 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handlePlay}
            >
              <IconPlayerPlay size={24} color="white" />
            </div>
          </div>

          {/* 歌曲信息 */}
          <div className="flex-1 min-w-0">
            <Text fw={600} className="text-lg truncate">
              {song.title}
            </Text>
            <Text color="gray.600" className="truncate">
              {song.artist} • {song.album}
            </Text>
            <Group gap="xs" mt={1}>
              <Badge variant="outline" size="xs">
                {song.genre}
              </Badge>
              <Badge variant="outline" size="xs">
                {formatDuration(song.duration)}
              </Badge>
              <Badge color={sourceProps.color} size="xs">
                {sourceProps.label}
              </Badge>
            </Group>

            {/* 推荐理由 */}
            <Tooltip 
              label={reason} 
              position="top-start"
              openDelay={500}
              arrowSize={4}
            >
              <div 
                className="flex items-center mt-1 cursor-help"
                onClick={() => setShowReason(!showReason)}
              >
                <IconInbox size={14} color="blue.500" className="mr-1" />
                <Text size="sm" color="blue.500" className="truncate">
                  推荐理由
                </Text>
              </div>
            </Tooltip>

            {showReason && (
              <Text size="sm" color="gray.500" mt={1} className="bg-blue-50 p-2 rounded">
                {reason}
              </Text>
            )}
          </div>

          {/* 反馈按钮 */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <ActionIcon
              size={32}
              onClick={handlePlay}
              className="text-blue-500 hover:bg-blue-100"
            >
              <IconPlayerPlay size={18} />
            </ActionIcon>

            <ActionIcon
              size={24}
              onClick={handleLike}
              className={`${isLiked ? 'text-red-500' : 'text-gray.400'} hover:text-red-500`}
            >
              <IconHeart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </ActionIcon>

            <ActionIcon
              size={24}
              onClick={handleDislike}
              className={`${isDisliked ? 'text-gray.600' : 'text-gray.400'} hover:text-gray.600`}
            >
              <IconHeartOff size={16} />
            </ActionIcon>

            <ActionIcon
              size={24}
              onClick={handleIgnore}
              className="text-gray.400 hover:text-gray.600"
            >
              <IconStackForward size={16} />
            </ActionIcon>
          </div>
        </Group>

        {/* 推荐分数条 */}
        <Box mt={3}>
          <Group justify="space-between" align="center">
            <Text size="sm" color="gray.500">推荐匹配度</Text>
            <Text size="sm" fw={600}>
              {score}%
            </Text>
          </Group>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${score}%`,
                backgroundColor: score > 80 ? '#10b981' : score > 60 ? '#3b82f6' : '#f59e0b'
              }}
            />
          </div>
        </Box>
      </div>
    </Card>
  )
}

export default RecommendationCard