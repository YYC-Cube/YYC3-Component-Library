// src/components/community/CommunitySystem.tsx
import React, { useState, useEffect } from 'react'
import {
  Card,
  Group,
  Button,
  Textarea,
  Avatar,
  Text,
  Badge,
  Stack,
  Tabs,
  ScrollArea,
  ActionIcon,
  Menu,
  Divider,
  Image,
  Input,
  SimpleGrid
} from '@mantine/core'
import {
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconBookmark,
  IconDots,
  IconSend,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconTrendingUp,
  IconClock,
  IconUsers
} from '@tabler/icons-react'
import { ContentModerator } from './ContentModerator.tsx'

interface CommunityPostProps {
  post: any
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  onShare: (postId: string) => void
  onReport: (postId: string, reason: string) => void
}

const CommunityPost: React.FC<CommunityPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onReport
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<any[]>(post.comments)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1)
    onLike(post.id)
  }

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: any = {
        id: `comment_${Date.now()}`,
        author: 'current-user',
        content: commentText,
        createdAt: new Date(),
        likes: []
      }
      
      setComments((prev: any[]) => [newComment, ...prev])
      onComment(post.id, commentText)
      setCommentText('')
    }
  }

  return (
    <Card shadow="sm" p="md" radius="md" withBorder>
      {/* 帖子头部 */}
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar src={post.authorAvatar} radius="xl" />
          <div>
            <Text fw="bold">{post.authorName}</Text>
            <Text size="xs" color="gray.500">
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </div>
        </Group>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>收藏</Menu.Item>
            <Menu.Item onClick={() => onShare(post.id)}>分享</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onClick={() => onReport(post.id, '违规内容')}>
              举报
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {/* 帖子内容 */}
      <Text mb="md" fw="normal">{post.content}</Text>

      {/* 媒体内容 */}
      {post.attachments && post.attachments.length > 0 && (
        <SimpleGrid cols={post.attachments.length === 1 ? 1 : 2} mb="md">
          {post.attachments.map((attachment: any, index: number) => (
            <div key={index} className="relative">
              {attachment.type.startsWith('image/') ? (
                <Image
                  src={attachment.url}
                  radius="md"
                  alt={`Attachment ${index + 1}`}
                />
              ) : attachment.type.startsWith('video/') ? (
                <video
                  src={attachment.url}
                  controls
                  className="w-full rounded-md"
                />
              ) : attachment.type.startsWith('audio/') ? (
                <audio
                  src={attachment.url}
                  controls
                  className="w-full"
                />
              ) : null}
            </div>
          ))}
        </SimpleGrid>
      )}

      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <Group gap="xs" mb="md">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="light" color="blue" size="sm">
              #{tag}
            </Badge>
          ))}
        </Group>
      )}

      {/* 互动按钮 */}
      <Group justify="space-between">
        <Group gap="xs">
          <Button
            variant="subtle"
            color={isLiked ? 'red' : 'gray'}
            onClick={handleLike}
          >
            <IconHeart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </Button>
          
          <Button
            variant="subtle"
            color="gray"
            onClick={() => setShowComments(!showComments)}
          >
            <IconMessageCircle size={16} />
            <span>{comments.length}</span>
          </Button>
          
          <Button
            variant="subtle"
            color="gray"
            onClick={() => onShare(post.id)}
          >
            <IconShare size={16} />
            <span>分享</span>
          </Button>
        </Group>

        <Button
          variant="subtle"
          color="gray"
        >
          <IconBookmark size={16} />
          <span>收藏</span>
        </Button>
      </Group>

      {/* 评论区 */}
      {showComments && (
        <>
          <Divider my="md" />
          
          {/* 评论输入 */}
          <Group gap="xs" mb="md">
            <Input
              placeholder="写下你的评论..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleComment} disabled={!commentText.trim()}>
              <IconSend size={16} />
            </Button>
          </Group>

          {/* 评论列表 */}
          <ScrollArea.Autosize mah={300}>
            <Stack gap="md">
              {comments.map(comment => (
                <Group key={comment.id} gap="xs">
                  <Avatar size="sm" radius="xl" />
                  <div className="flex-1">
                    <Text size="sm" fw={600}>{comment.author}</Text>
                    <Text size="sm">{comment.content}</Text>
                  </div>
                </Group>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </>
      )}
    </Card>
  )
}

export const CommunitySystem: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'following'>('trending')
  const [creatingPost, setCreatingPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [attachments, setAttachments] = useState<File[]>([])

  const contentModerator = new ContentModerator()

  useEffect(() => {
    loadPosts()
  }, [activeTab])

  const loadPosts = async () => {
    try {
      const response = await fetch(`/api/v1/community/posts?type=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  const createPost = async () => {
    if (!newPostContent.trim()) return

    // 内容审核
    const moderation = await contentModerator.moderateContent(newPostContent)
    if (!moderation.approved) {
      alert(`内容审核未通过: ${moderation.reason}`)
      return
    }

    try {
      const formData = new FormData()
      formData.append('content', newPostContent)
      formData.append('tags', JSON.stringify(selectedTags))
      
      attachments.forEach(file => {
        formData.append('attachments', file)
      })

      const response = await fetch('/api/v1/community/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        setNewPostContent('')
        setSelectedTags([])
        setAttachments([])
        setCreatingPost(false)
        loadPosts()
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleFileSelect = (files: File[]) => {
    setAttachments(prev => [...prev, ...files])
  }

  const trendingTags = [
    '#原创音乐', '#AI创作', '#翻唱', '#音乐推荐', '#创作分享'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 创建帖子 */}
        <Card mb="xl">
          <Textarea
            placeholder="分享您的音乐故事..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onFocus={() => setCreatingPost(true)}
            minRows={creatingPost ? 4 : 1}
          />

          {creatingPost && (
            <Stack gap="md" mt="md">
              {/* 标签选择 */}
        <Group gap="xs">
                {trendingTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outline'}
                    color="blue"
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(prev => prev.filter(t => t !== tag))
                      } else {
                        setSelectedTags(prev => [...prev, tag])
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>

              {/* 附件上传 */}
              <Group gap="xs">
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.multiple = true
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || [])
                      handleFileSelect(files)
                    }
                    input.click()
                  }}
                >
                  <IconPhoto size={16} />
                  <span>图片</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'video/*'
                    input.multiple = true
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || [])
                      handleFileSelect(files)
                    }
                    input.click()
                  }}
                >
                  <IconVideo size={16} />
                  <span>视频</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'audio/*'
                    input.multiple = true
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || [])
                      handleFileSelect(files)
                    }
                    input.click()
                  }}
                >
                  <IconMusic size={16} />
                  <span>音频</span>
                </Button>
              </Group>

              {/* 附件预览 */}
              {attachments.length > 0 && (
                <SimpleGrid cols={4}>
                  {attachments.map((file, index) => (
                    <div key={index} className="relative">
                      {file.type.startsWith('image/') ? (
                        <Image
                          src={URL.createObjectURL(file)}
                          height={60}
                          radius="md"
                        />
                      ) : (
                        <div className="h-15 bg-gray-200 rounded-md flex items-center justify-center">
                          <Text size="xs">{file.type.split('/')[0]}</Text>
                        </div>
                      )}
                      <ActionIcon
                        size="xs"
                        className="absolute top-0 right-0 bg-red-500 text-white"
                        onClick={() => {
                          setAttachments(prev => prev.filter((_, i) => i !== index))
                        }}
                      >
                        ×
                      </ActionIcon>
                    </div>
                  ))}
                </SimpleGrid>
              )}

              <Group justify="flex-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreatingPost(false)
                    setNewPostContent('')
                    setSelectedTags([])
                    setAttachments([])
                  }}
                >
                  取消
                </Button>
                <Button onClick={createPost} disabled={!newPostContent.trim()}>
                  发布
                </Button>
              </Group>
            </Stack>
          )}
        </Card>

        {/* 内容标签页 */}
        <Tabs value={activeTab} onChange={(value: string | null) => value && setActiveTab(value as 'trending' | 'latest' | 'following')}>
          <Tabs.List>
            <Tabs.Tab value="trending">
              <IconTrendingUp size={14} />
              热门
            </Tabs.Tab>
            <Tabs.Tab value="latest">
              <IconClock size={14} />
              最新
            </Tabs.Tab>
            <Tabs.Tab value="following">
              <IconUsers size={14} />
              关注
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="trending" pt="md">
            <Stack gap="md">
              {posts.map(post => (
                <CommunityPost
                  key={post.id}
                  post={post}
                  onLike={(postId) => console.log('Like:', postId)}
                  onComment={(postId, content) => console.log('Comment:', postId, content)}
                  onShare={(postId) => console.log('Share:', postId)}
                  onReport={(postId, reason) => console.log('Report:', postId, reason)}
                />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="latest" pt="md">
            <Stack gap="md">
              {posts.map(post => (
                <CommunityPost
                  key={post.id}
                  post={post}
                  onLike={(postId) => console.log('Like:', postId)}
                  onComment={(postId, content) => console.log('Comment:', postId, content)}
                  onShare={(postId) => console.log('Share:', postId)}
                  onReport={(postId, reason) => console.log('Report:', postId, reason)}
                />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="following" pt="md">
            <Stack gap="md">
              {posts.map(post => (
                <CommunityPost
                  key={post.id}
                  post={post}
                  onLike={(postId) => console.log('Like:', postId)}
                  onComment={(postId, content) => console.log('Comment:', postId, content)}
                  onShare={(postId) => console.log('Share:', postId)}
                  onReport={(postId, reason) => console.log('Report:', postId, reason)}
                />
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}
