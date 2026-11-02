// src/components/ai/LyricGenerator.tsx
import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  Card,
  TextInput,
  Select,
  Slider,
  Button,
  Group,
  Textarea,
  Badge,
  Stack,
  Progress,
  Text
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
// import * as tf from '@tensorflow/tfjs'

// 表单值类型定义
export interface LyricFormValues {
  theme: string;
  style: string;
  emotion: number;
  keywords: string;
  length: number;
}

// 生成的歌词类型定义
export interface GeneratedLyric {
  id: string;
  content: string;
  emotion: number;
  theme: string;
  style: string;
  createdAt: Date;
}



export const LyricGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLyrics, setGeneratedLyrics] = useState<GeneratedLyric[]>([])
  const [emotionAnalysis, setEmotionAnalysis] = useState<any>(null)
  // const [model, setModel] = useState<tf.LayersModel | null>(null)
  
  // 表单状态管理
  const [formValues, setFormValues] = useState<LyricFormValues>({
    theme: '',
    style: 'pop',
    emotion: 50,
    keywords: '',
    length: 200
  })

  // 加载TensorFlow.js模型
  useEffect(() => {
    const loadModel = async () => {
      try {
        // 暂时注释掉模型加载，避免错误
        // const loadedModel = await tf.loadLayersModel('/models/lyric-generator/model.json')
        console.log('Model loading would happen here')
      } catch (error) {
        console.error('Failed to load model:', error)
      }
    }
    loadModel()
  }, [])

  const generateLyrics = async () => {
    setIsGenerating(true)
    
    try {
      // 生成歌词内容
      const lyrics = await generateLyricContent(formValues)
      
      // 情感分析
      const emotionScore = await analyzeEmotion(lyrics)
      
      const newLyric = {
        id: Date.now().toString(),
        content: lyrics,
        emotion: emotionScore,
        theme: formValues.theme,
        style: formValues.style,
        createdAt: new Date()
      }
      
      setGeneratedLyrics(prev => [newLyric, ...prev])
      setEmotionAnalysis(emotionScore)
      
      notifications.show({
        title: '歌词生成成功',
        message: '已为您生成新的歌词',
        color: 'green'
      })
    } catch (error) {
      console.error('Generation failed:', error)
      notifications.show({
        title: '生成失败',
        message: '请稍后重试',
        color: 'red'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateLyricContent = async (values: LyricFormValues): Promise<string> => {
    // 模拟歌词生成逻辑
    const templates = {
      love: [
        "月光洒在你的脸上",
        "心跳如鼓点般激荡",
        "爱意如潮水般涌来",
        "你是我的唯一光芒"
      ],
      dream: [
        "追逐梦想的脚步",
        "穿越黑夜的迷雾",
        "心中的火焰不灭",
        "未来在手中绽放"
      ],
      nature: [
        "山川河流如画",
        "风吹过草原",
        "星空璀璨",
        "大自然的美妙"
      ]
    }

    const selectedTemplate = templates[values.theme as keyof typeof templates] || templates.love
    const keywords = values.keywords.split(',').map(k => k.trim())
    
    let lyrics = selectedTemplate.join('\n')
    keywords.forEach(keyword => {
      lyrics = lyrics.replace(/(\w+)/g, (match) => {
        return Math.random() > 0.7 ? keyword : match
      })
    })

    return lyrics
  }

  const analyzeEmotion = async (lyrics: string): Promise<number> => {
    // 简单的情感分析
    const positiveWords = ['爱', '美', '光', '快乐', '幸福', '梦想']
    const negativeWords = ['痛', '伤', '泪', '孤独', '失落', '黑暗']
    
    let positiveScore = 0
    let negativeScore = 0
    
    positiveWords.forEach(word => {
      if (lyrics.includes(word)) positiveScore++
    })
    
    negativeWords.forEach(word => {
      if (lyrics.includes(word)) negativeScore++
    })
    
    const totalScore = positiveScore + negativeScore
    if (totalScore === 0) return 50
    
    return Math.round((positiveScore / totalScore) * 100)
  }

  // const getStyleIndex = (style: string): number => {
  //   const styles = ['pop', 'rock', 'jazz', 'classical', 'electronic']
  //   return styles.indexOf(style)
  // }

  const saveLyrics = async (lyric: GeneratedLyric) => {
    try {
      await fetch('/api/v1/create/lyrics/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(lyric)
      })
      
      notifications.show({
        title: '保存成功',
        message: '歌词已保存到您的创作库',
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: '保存失败',
        message: '请稍后重试',
        color: 'red'
      })
    }
  }

  return (
    <Stack gap="xl">
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>AI歌词生成器</p>
        </Card.Section>

        <form onSubmit={(e) => {
        e.preventDefault();
        generateLyrics();
      }}>
          <Stack>
            <TextInput
              label="主题"
              placeholder="如：爱情、梦想、自然..."
              value={formValues.theme}
              onChange={(e) => setFormValues({...formValues, theme: e.target.value})}
              required
            />

            <Select
              label="音乐风格"
              data={[
                { value: 'pop', label: '流行' },
                { value: 'rock', label: '摇滚' },
                { value: 'jazz', label: '爵士' },
                { value: 'classical', label: '古典' },
                { value: 'electronic', label: '电子' }
              ]}
              value={formValues.style}
              onChange={(value) => setFormValues({...formValues, style: value || 'pop'})}
            />

            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '12px' }}>情感强度</p>
              <Slider
                value={formValues.emotion}
                onChange={(value) => setFormValues({...formValues, emotion: value})}
                marks={[
                  { value: 0, label: '平静' },
                  { value: 50, label: '适中' },
                  { value: 100, label: '激昂' }
                ]}
              />
            </div>

            <TextInput
              label="关键词"
              placeholder="用逗号分隔，如：星空, 徘徊, 温暖"
              value={formValues.keywords}
              onChange={(e) => setFormValues({...formValues, keywords: e.target.value})}
              required
            />

            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '12px' }}>歌词长度</p>
              <Slider
                value={formValues.length}
                onChange={(value) => setFormValues({...formValues, length: value})}
                min={50}
                max={500}
                marks={[
                  { value: 50, label: '短' },
                  { value: 250, label: '中' },
                  { value: 500, label: '长' }
                ]}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isGenerating}
              variant="gradient"
              gradient={{ from: 'violet', to: 'pink' }}
            >
              生成歌词
            </Button>
          </Stack>
        </form>
      </Card>

      {emotionAnalysis && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text color="dimmed" mb="md" style={{ fontWeight: 600 }}>情感分析结果</Text>
          <Progress
                value={emotionAnalysis}
                color={emotionAnalysis > 60 ? 'green' : emotionAnalysis > 40 ? 'yellow' : 'red'}
                size="xl"
              />
              <Text size="sm" mt="sm">
                {emotionAnalysis}%
              </Text>
          <Text size="sm" color="dimmed" mt="sm">
            情感倾向：{emotionAnalysis > 60 ? '积极' : emotionAnalysis > 40 ? '中性' : '消极'}
          </Text>
        </Card>
      )}

      {generatedLyrics.map((lyric) => (
        <Card key={lyric.id} shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Group>
              <Badge color="violet">{lyric.style}</Badge>
              <Badge color="pink">{lyric.theme}</Badge>
            </Group>
            <Button
              size="sm"
              onClick={() => saveLyrics(lyric)}
              variant="default"
              color="violet"
            >
              保存
            </Button>
          </Group>
          
          <Textarea
            value={lyric.content}
            readOnly
            minRows={4}
            styles={{ input: { backgroundColor: 'transparent' } }}
          />
          
          <Text size="xs" color="dimmed" mt="sm">
            生成时间：{lyric.createdAt.toLocaleString()}
          </Text>
        </Card>
      ))}
    </Stack>
  )
}