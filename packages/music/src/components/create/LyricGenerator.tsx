import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Textarea, Select, Slider, Text, Progress, Badge, Switch, Box } from '@mantine/core'
import { IconSparkles, IconMusic } from '@tabler/icons-react'
import * as tf from '@tensorflow/tfjs'
// @ts-ignore
import { aiService } from '../../services/aiService'

interface LyricGeneratorProps {
  onLyricsGenerated?: (lyrics: string) => void
}

/**
 * AI歌词生成器组件
 * 使用TensorFlow.js加载模型并生成歌词
 * 支持情感分析和多种音乐风格
 */
export const LyricGenerator: React.FC<LyricGeneratorProps> = ({ onLyricsGenerated }) => {
  // const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [lyrics, setLyrics] = useState('')
  const [modelLoaded, setModelLoaded] = useState(false)
  const [theme, setTheme] = useState('love')
  const [musicStyle, setMusicStyle] = useState('pop')
  const [emotionIntensity, setEmotionIntensity] = useState(70)
  const [includeChorus, setIncludeChorus] = useState(true)
  const [includeVerse, setIncludeVerse] = useState(true)
  const [includeBridge, setIncludeBridge] = useState(false)
  const [emotionScore, setEmotionScore] = useState<Record<string, number | string>>({})
  const modelRef = useRef<tf.LayersModel | null>(null)

  // 加载TensorFlow.js模型
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true)
        // 在实际应用中，这里应该加载真实的TensorFlow模型
        // 由于是演示，我们模拟模型加载
        await new Promise(resolve => setTimeout(resolve, 2000))
        setModelLoaded(true)
      } catch (error) {
        console.error('Failed to load model:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModel()

    return () => {
      // 清理模型
      if (modelRef.current) {
        modelRef.current.dispose()
        modelRef.current = null
      }
    }
  }, [])

  // 生成歌词内容
  const generateLyricContent = (theme: string, style: string, emotion: number): string => {
    // 这里是一个简化的歌词生成逻辑
    // 在实际应用中，应该使用TensorFlow模型进行真实的文本生成
    const templates = {
      love: {
        pop: [
          `[Verse 1]\n当我第一次看到你\n世界仿佛停止了转动\n你的笑容像阳光\n照亮了我的整个宇宙\n\n[Chorus]\n我爱你，就像星星爱月亮\n永远不会改变方向\n无论晴天还是雨天\n我都会在你身边\n\n[Verse 2]\n每一个夜晚和清晨\n想的都是你的样子\n你的声音像旋律\n在我耳边不断回响\n\n[Chorus]\n我爱你，就像星星爱月亮\n永远不会改变方向\n无论晴天还是雨天\n我都会在你身边`
        ],
        rock: [
          `[Verse 1]\n你的爱像火焰\n燃烧在我心中\n无法扑灭的热情\n让我为之疯狂\n\n[Chorus]\n我爱你，爱的如此热烈\n就像摇滚的节奏\n无法停止，无法抗拒\n你是我生命的主题\n\n[Verse 2]\n每一次拥抱，每一次亲吻\n都让我沉醉其中\n你的温度，你的心跳\n是我最美的旋律\n\n[Chorus]\n我爱你，爱的如此热烈\n就像摇滚的节奏\n无法停止，无法抗拒\n你是我生命的主题`
        ]
      },
      freedom: {
        pop: [
          `[Verse 1]\n张开双手，拥抱天空\n自由的感觉如此美妙\n没有束缚，没有烦恼\n我要飞向更远的地方\n\n[Chorus]\n自由，是我的信仰\n勇敢地追逐梦想\n不再犹豫，不再彷徨\n我的世界我做主\n\n[Verse 2]\n海阔天空，任我翱翔\n前方的路充满希望\n带着笑容，带着坚强\n我要创造属于我的天堂\n\n[Chorus]\n自由，是我的信仰\n勇敢地追逐梦想\n不再犹豫，不再彷徨\n我的世界我做主`
        ],
        rap: [
          `[Verse 1]\nYo, 我想要自由，不想被束缚\n生活像牢笼，我想要逃出\n打破规则，走出舒适区\n我的未来，我自己定义\n\n[Chorus]\n自由，自由，我要自由\n不被任何人左右\n用我的方式，活出精彩\n这就是我的态度\n\n[Verse 2]\n每一天都是新的开始\n每一步都充满挑战\n不怕失败，不怕困难\n我要勇敢地向前看\n\n[Chorus]\n自由，自由，我要自由\n不被任何人左右\n用我的方式，活出精彩\n这就是我的态度`
        ]
      }
    }

    // 基于情感强度调整歌词
    const themeTemplates = templates[theme as keyof typeof templates] || templates.love;
    const baseTemplate = themeTemplates[style as keyof typeof themeTemplates] || templates.love.pop;
    const template = baseTemplate[0]
    
    // 根据情感强度调整歌词中的形容词
    let adjustedTemplate = template
    if (emotion > 70) {
      adjustedTemplate = adjustedTemplate.replace(/热烈/g, '炽热').replace(/喜欢/g, '深爱')
    } else if (emotion < 40) {
      adjustedTemplate = adjustedTemplate.replace(/热烈/g, '温暖').replace(/喜欢/g, '欣赏')
    }

    // 根据用户选择的段落类型调整歌词结构
    let finalLyrics = adjustedTemplate
    if (!includeVerse) {
      finalLyrics = finalLyrics.replace(/\[Verse \d\].*?\n\n/g, '')
    }
    if (!includeChorus) {
      finalLyrics = finalLyrics.replace(/\[Chorus\].*?\n\n/g, '')
    }
    if (!includeBridge && finalLyrics.includes('[Bridge]')) {
      finalLyrics = finalLyrics.replace(/\[Bridge\].*?\n\n/g, '')
    }

    return finalLyrics
  }

  // 情感分析
  const analyzeEmotion = (lyrics: string): Record<string, number | string> => {
    // 这里是一个简化的情感分析逻辑
    // 在实际应用中，应该使用NLP模型进行真实的情感分析
    const positiveWords = ['爱', '幸福', '快乐', '温暖', '美好', '阳光']
    const negativeWords = ['悲伤', '孤独', '痛苦', '失去', '眼泪', '离开']
    const neutralWords = ['时间', '世界', '生活', '梦想', '希望', '未来']

    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

    const words = lyrics.split(/\s+/)
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) {
        positiveCount++
      } else if (negativeWords.some(nw => word.includes(nw))) {
        negativeCount++
      } else if (neutralWords.some(nw => word.includes(nw))) {
        neutralCount++
      }
    })

    const total = positiveCount + negativeCount + neutralCount
    
    return {
      positive: total > 0 ? Math.round((positiveCount / total) * 100) : 0,
      negative: total > 0 ? Math.round((negativeCount / total) * 100) : 0,
      neutral: total > 0 ? Math.round((neutralCount / total) * 100) : 0,
      sentiment: positiveCount > negativeCount ? 'positive' : positiveCount < negativeCount ? 'negative' : 'neutral'
    }
  }

  // 生成歌词
  const generateLyrics = async () => {
    if (!modelLoaded) return

    setGenerating(true)
    try {
      // 模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedLyrics = generateLyricContent(theme, musicStyle, emotionIntensity)
      setLyrics(generatedLyrics)
      
      // 分析歌词情感
      const emotion = analyzeEmotion(generatedLyrics)
      setEmotionScore(emotion)
      
      // 通知父组件
      if (onLyricsGenerated) {
        onLyricsGenerated(generatedLyrics)
      }
    } catch (error) {
      console.error('Failed to generate lyrics:', error)
    } finally {
      setGenerating(false)
    }
  }

  // 保存歌词
  const saveLyrics = async () => {
    if (!lyrics) return

    try {
      await aiService.saveGeneratedLyrics({
        content: lyrics,
        theme,
        style: musicStyle,
        emotionScore
      })
      // 显示成功提示
      alert('歌词已保存到您的创作库！')
    } catch (error) {
      console.error('Failed to save lyrics:', error)
      alert('保存失败，请稍后重试')
    }
  }

  if (loading) {
    return (
      <Card>
        <Card.Section>
          <Text>正在加载AI模型，请稍候...</Text>
          <Progress value={50} mt={4} />
        </Card.Section>
      </Card>
    )
  }

  return (
    <Card shadow="lg">
      <Card.Section p={6}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <Text size="lg" fw={600}>AI歌词生成器</Text>
                <Text size="sm" color="gray.500">
                  {modelLoaded ? '模型已加载完成' : '模型加载中...'}
                </Text>
              </div>
              <IconSparkles size={28} color="blue.500" />
        </Box>

        {/* 控制面板 */}
        <Card.Section mb={6}>
          <Text size="md" fw={500} mb={4}>歌词设置</Text>
          
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <Text size="sm" mb="sm">主题</Text>
              <Select
                value={theme}
                onChange={(value) => value && setTheme(value)}
                data={[
                  { value: 'love', label: '爱情' },
                  { value: 'freedom', label: '自由' },
                  { value: 'dreams', label: '梦想' },
                  { value: 'memories', label: '回忆' },
                  { value: 'hope', label: '希望' }
                ]}
                placeholder="选择歌词主题"
              />
            </div>

            <div>
              <Text size="sm" mb="sm">音乐风格</Text>
              <Select
                value={musicStyle}
                onChange={(value) => value && setMusicStyle(value)}
                data={[
                  { value: 'pop', label: '流行' },
                  { value: 'rock', label: '摇滚' },
                  { value: 'hiphop', label: '嘻哈' },
                  { value: 'folk', label: '民谣' },
                  { value: 'electronic', label: '电子' }
                ]}
                placeholder="选择音乐风格"
              />
            </div>

            <div>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size="sm">情感强度</Text>
                <Text size="sm" color="blue.500">{emotionIntensity}%</Text>
              </Box>
              <Slider
                value={emotionIntensity}
                onChange={setEmotionIntensity}
                min={0}
                max={100}
                step={1}
                mt="sm"
              />
            </div>

            <div>
              <Text size="sm" mb="sm">歌词结构</Text>
              <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={includeVerse}
                    onChange={(e) => setIncludeVerse(e.currentTarget.checked)}
                    label="包含主歌"
                  />
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                      checked={includeChorus}
                      onChange={(e) => setIncludeChorus(e.currentTarget.checked)}
                      label="包含副歌"
                    />
                  </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                      checked={includeBridge}
                      onChange={(e) => setIncludeBridge(e.currentTarget.checked)}
                      label="包含桥段"
                    />
                  </Box>
              </Box>
            </div>
            </Box>
        </Card.Section>

        {/* 生成按钮 */}
        <Button
          fullWidth
          onClick={generateLyrics}
          disabled={!modelLoaded || generating}
          loading={generating}
          leftSection={<IconMusic size={18} />}
          className="bg-blue-600 hover:bg-blue-700 mb-6"
        >
          {generating ? '生成中...' : '生成歌词'}
        </Button>

        {/* 生成结果 */}
        {lyrics && (
            <Card mt={4} bg="gray.50">
                <Card.Section>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <Text size="md" fw={500}>生成的歌词</Text>
              <Button
                size="sm"
                variant="secondary"
                onClick={saveLyrics}
              >
                保存歌词
              </Button>
            </Box>
                
                <Textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                  readOnly
                />

                {/* 情感分析结果 */}
                {Object.keys(emotionScore).length > 0 && (
                  <Box mt={4}>
                    <Text size="sm" fw={500} mb="sm">情感分析</Text>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text size="sm">积极</Text>
                      <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Text size="sm" fw={600} color="green.600">
                          {emotionScore.positive}%
                        </Text>
                        <Badge color="green" size="xs">+</Badge>
                      </Box>
                    </Box>
                    <Progress value={typeof emotionScore.positive === 'number' ? emotionScore.positive : 0} color="green" size="xs" />
                        
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text size="sm">中性</Text>
                      <Text size="sm" fw={600}>
                        {emotionScore.neutral}%
                      </Text>
                    </Box>
                    <Progress value={typeof emotionScore.neutral === 'number' ? emotionScore.neutral : 0} color="gray" size="xs" />
                        
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text size="sm">消极</Text>
                      <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Text size="sm" fw={600} color="red.600">
                          {emotionScore.negative}%
                        </Text>
                        <Badge color="red" size="xs">-</Badge>
                      </Box>
                    </Box>
                    <Progress value={typeof emotionScore.negative === 'number' ? emotionScore.negative : 0} color="red" size="xs" />
                    </Box>
                  </Box>
                )}
              </Card.Section>
            </Card>
        )}
      </Card.Section>
    </Card>
  )
}

export default LyricGenerator