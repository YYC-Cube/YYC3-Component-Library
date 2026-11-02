// src/components/ai/AICreationStudio.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  Group,
  Button,
  // Select,
  // Slider,
  Stack,
  Tabs,
  Title,
  Text,
  Badge,
  Progress,
  ActionIcon,
  Divider,
  Grid,
  // Box,
  Alert
} from '@mantine/core'
import {
  IconBrush,
  IconMusic,
  IconMicrophone,
  IconVideo,
  IconSparkles,
  IconRefresh,
  IconDownload,
  IconShare
} from '@tabler/icons-react'
import { LyricGenerator } from './LyricGenerator'
import { notifications } from '@mantine/notifications'

// 占位符组件
const MelodyComposer: React.FC<{ onSave?: (melody: any) => void }> = () => {
  return <Alert color="orange">功能开发中</Alert>;
}

const VideoGenerator: React.FC<{ onSave?: (video: any) => void }> = () => {
  return <Alert color="orange">功能开发中</Alert>;
}

const VoiceSynthesizer: React.FC<{ onSave?: (voice: any) => void }> = () => {
  return <Alert color="orange">功能开发中</Alert>;
}

interface CreationProject {
  id: string
  name: string
  type: 'lyrics' | 'melody' | 'video' | 'voice' | 'full'
  content: any
  createdAt: Date
  updatedAt: Date
}

export const AICreationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'melody' | 'video' | 'voice'>('lyrics')
  const [projects, setProjects] = useState<CreationProject[]>([])
  const [currentProject, setCurrentProject] = useState<CreationProject | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [aiCredits, setAiCredits] = useState(100)

  const studioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadProjects()
    loadAICredits()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/v1/creation/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const loadAICredits = async () => {
    try {
      const response = await fetch('/api/v1/user/credits', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setAiCredits(data.credits || 0)
    } catch (error) {
      console.error('Failed to load AI credits:', error)
    }
  }

  const createNewProject = (type: CreationProject['type']) => {
    const newProject: CreationProject = {
      id: `project_${Date.now()}`,
      name: `未命名项目-${Date.now()}`,
      type,
      content: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setCurrentProject(newProject)
    setProjects(prev => [newProject, ...prev])
  }

  const saveProject = async (project: CreationProject) => {
    try {
      const response = await fetch('/api/v1/creation/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(project)
      })
      
      if (response.ok) {
        notifications.show({
          title: '保存成功',
          message: '项目已保存到云端',
          color: 'green'
        })
        
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, updatedAt: new Date() } : p))
      }
    } catch (error) {
      notifications.show({
        title: '保存失败',
        message: '请检查网络连接',
        color: 'red'
      })
    }
  }

  const generateFullSong = async () => {
    if (aiCredits < 50) {
      notifications.show({
        title: 'AI积分不足',
        message: '完整歌曲生成需要50积分',
        color: 'orange'
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // 模拟生成过程
      const steps = [
        { name: '分析主题', duration: 1000 },
        { name: '生成歌词', duration: 2000 },
        { name: '创作旋律', duration: 3000 },
        { name: '编曲配器', duration: 2000 },
        { name: '音频合成', duration: 3000 },
        { name: '后期处理', duration: 1000 }
      ]

      let totalProgress = 0
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.duration))
        totalProgress += 100 / steps.length
        setGenerationProgress(totalProgress)
      }

      const newProject: CreationProject = {
        id: `full_${Date.now()}`,
        name: `AI完整歌曲-${Date.now()}`,
        type: 'full',
        content: {
          lyrics: '生成的歌词内容...',
          melody: '生成的旋律数据...',
          arrangement: '编曲信息...',
          audioUrl: '/generated-song.mp3'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setCurrentProject(newProject)
      setProjects(prev => [newProject, ...prev])
      setAiCredits(prev => prev - 50)

      notifications.show({
        title: '生成完成',
        message: 'AI已为您创作完整歌曲',
        color: 'green'
      })

    } catch (error) {
      notifications.show({
        title: '生成失败',
        message: '请稍后重试',
        color: 'red'
      })
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const renderCreationTool = () => {
    switch (activeTab) {
      case 'lyrics':
        return <LyricGenerator />
      case 'melody':
        return <MelodyComposer onSave={(melody) => {
          if (currentProject) {
            setCurrentProject({
              ...currentProject,
              content: { ...currentProject.content, melody }
            })
          }
        }} />
      case 'video':
        return <VideoGenerator onSave={(video) => {
          if (currentProject) {
            setCurrentProject({
              ...currentProject,
              content: { ...currentProject.content, video }
            })
          }
        }} />
      case 'voice':
        return <VoiceSynthesizer onSave={(voice) => {
          if (currentProject) {
            setCurrentProject({
              ...currentProject,
              content: { ...currentProject.content, voice }
            })
          }
        }} />
      default:
        return null
    }
  }

  return (
    <div ref={studioRef} className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      {/* 顶部工具栏 */}
      <Group justify="space-between" mb="xl">
        <Group>
          <IconSparkles size={32} className="text-purple-600" />
          <Title order={2}>AI创作工作室</Title>
        </Group>
        
        <Group>
          <Badge color="purple" variant="filled" size="lg">
            AI积分: {aiCredits}
          </Badge>
          
          <Button
            leftSection={<IconSparkles size={16} />}
            onClick={generateFullSong}
            loading={isGenerating}
            disabled={aiCredits < 50}
            variant="gradient"
            gradient={{ from: 'purple', to: 'pink' }}
          >
            一键生成完整歌曲
          </Button>
        </Group>
      </Group>

      {/* 生成进度 */}
      {isGenerating && (
        <Card mb="xl" className="bg-white">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>AI正在创作中...</Text>
            <Text size="sm" color="gray.600">{Math.round(generationProgress)}%</Text>
          </Group>
          <Progress value={generationProgress} color="purple" size="md" />
        </Card>
      )}

      <Grid gutter="xl">
        {/* 左侧：创作工具 */}
        <Grid.Col span={8}>
          <Card className="bg-white h-full">
            <Tabs value={activeTab} onChange={setActiveTab as any}>
              <Tabs.List>
                <Tabs.Tab value="lyrics" leftSection={<IconBrush size={14} />}>
                  AI写词
                </Tabs.Tab>
                <Tabs.Tab value="melody" leftSection={<IconMusic size={14} />}>
                  AI作曲
                </Tabs.Tab>
                <Tabs.Tab value="video" leftSection={<IconVideo size={14} />}>
                  AI视频
                </Tabs.Tab>
                <Tabs.Tab value="voice" leftSection={<IconMicrophone size={14} />}>
                  AI语音
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="lyrics" pt="md">
                {renderCreationTool()}
              </Tabs.Panel>
              <Tabs.Panel value="melody" pt="md">
                {renderCreationTool()}
              </Tabs.Panel>
              <Tabs.Panel value="video" pt="md">
                {renderCreationTool()}
              </Tabs.Panel>
              <Tabs.Panel value="voice" pt="md">
                {renderCreationTool()}
              </Tabs.Panel>
            </Tabs>

            {/* 项目操作按钮 */}
            {currentProject && (
              <Group justify="flex-end" mt="md">
                <ActionIcon
                  variant="outline"
                  onClick={() => saveProject(currentProject)}
                >
                  <IconShare size={16} />
                </ActionIcon>
                <ActionIcon variant="outline">
                  <IconDownload size={16} />
                </ActionIcon>
                <ActionIcon variant="outline">
                  <IconShare size={16} />
                </ActionIcon>
              </Group>
            )}
          </Card>
        </Grid.Col>

        {/* 右侧：项目列表 */}
        <Grid.Col span={4}>
          <Card className="bg-white h-full">
            <Group justify="space-between" mb="md">
              <Text fw={600}>我的项目</Text>
              <ActionIcon size="sm" onClick={loadProjects}>
                <IconRefresh size={14} />
              </ActionIcon>
            </Group>

            <Stack gap="sm">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  p="sm"
                  withBorder
                  className={`cursor-pointer transition-all ${currentProject?.id === project.id ? 'border-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                  onClick={() => setCurrentProject(project)}
                >
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} size="sm" lineClamp={1}>
                        {project.name}
                      </Text>
                      <Text size="xs" color="gray.500">
                        {project.type} • {project.updatedAt.toLocaleDateString()}
                      </Text>
                    </div>
                    <Badge color="purple" variant="light" size="xs">
                      {project.type}
                    </Badge>
                  </Group>
                </Card>
              ))}

              {projects.length === 0 && (
                <Alert color="gray" variant="light">
                  <Text size="sm" color="gray.600" className="text-center">
                    还没有项目<br />
                    开始创作您的第一个作品吧！
                  </Text>
                </Alert>
              )}
            </Stack>

            <Divider my="md" />

            {/* 快速创建 */}
            <Stack gap="xs">
              <Text fw={600} size="sm">快速创建</Text>
              <Button
                leftSection={<IconBrush size={14} />}
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => createNewProject('lyrics')}
              >
                歌词创作
              </Button>
              <Button
                leftSection={<IconMusic size={14} />}
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => createNewProject('melody')}
              >
                旋律创作
              </Button>
              <Button
                leftSection={<IconVideo size={14} />}
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => createNewProject('video')}
              >
                视频创作
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  )
}
