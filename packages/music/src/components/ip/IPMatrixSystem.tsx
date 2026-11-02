// src/components/ip/IPMatrixSystem.tsx
import { useState, useEffect } from 'react'
import {
  Card,
  Group,
  Button,
  Text,
  Badge,
  Stack,
  Tabs,
  Title,
  Progress,
  Grid,
  Avatar,
  SimpleGrid,
  Modal,
  NumberInput,
  Select,
  Textarea,
  Image
} from '@mantine/core'
import {
  IconTrophy,
  IconUsers,
  IconTrendingUp
} from '@tabler/icons-react'

export const IPMatrixSystem = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'merchandise' | 'analytics' | 'collaboration'>('overview')
  const [ipProfile, setIpProfile] = useState<any | null>(null)
  const [merchandise, setMerchandise] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any | null>(null)
  const [creatingMerch, setCreatingMerch] = useState(false)
  const [selectedMerch, setSelectedMerch] = useState<any | null>(null)

  useEffect(() => {
    loadIPProfile()
    loadMerchandise()
    loadAnalytics()
  }, [])

  const loadIPProfile = async () => {
    try {
      const response = await fetch('/api/v1/ip/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setIpProfile(data.profile)
    } catch (error) {
      console.error('Failed to load IP profile:', error)
    }
  }

  const loadMerchandise = async () => {
    try {
      const response = await fetch('/api/v1/ip/merchandise', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setMerchandise(data.merchandise || [])
    } catch (error) {
      console.error('Failed to load merchandise:', error)
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/v1/ip/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  interface Merchandise { name: string; description: string; price: number; stock: number; category: string; }
  const createMerchandise = async (merchData: Partial<Merchandise>) => {
    try {
      const response = await fetch('/api/v1/ip/merchandise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(merchData)
      })

      if (response.ok) {
        setCreatingMerch(false)
        loadMerchandise()
      }
    } catch (error) {
      console.error('Failed to create merchandise:', error)
    }
  }

  const calculateIPScore = () => {
    if (!ipProfile || !analytics) return 0

    const followersScore = Math.min(100, ipProfile.followers / 1000)
    const engagementScore = analytics.engagementRate * 100
    const revenueScore = Math.min(100, analytics.revenue / 10000)
    const contentScore = Math.min(100, ipProfile.totalContent / 100)

    return Math.round((followersScore + engagementScore + revenueScore + contentScore) / 4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Group mb="xl">
          <IconTrophy size={32} className="text-yellow-600" />
          <Title order={2}>IP矩阵系统</Title>
        </Group>

        {ipProfile && (
          <Grid gutter="xl" mb="xl">
            {/* IP概览卡片 */}
            <Grid.Col span={4}>
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                <Group justify="apart" mb="md">
                  <Avatar src={ipProfile.avatar} size="xl" radius="xl" />
                  <Badge color="white" variant="filled">
                    Lv.{ipProfile.level}
                  </Badge>
                </Group>
                
                <Title order={3} mb="sm">{ipProfile.brandName}</Title>
                <Text size="sm" mb="md" opacity={0.9}>{ipProfile.description}</Text>
                
                <Group gap="xs">
                  <Badge color="white" variant="outline">
                    <Group gap={4}>
                      <IconUsers size={12} />
                      <span>{ipProfile.followers} 粉丝</span>
                    </Group>
                  </Badge>
                  <Badge color="white" variant="outline">
                    <Group gap={4}>
                      <IconTrendingUp size={12} />
                      <span>{ipProfile.growthRate}% 增长</span>
                    </Group>
                  </Badge>
                </Group>
              </Card>
            </Grid.Col>

            {/* 数据统计 */}
            <Grid.Col span={8}>
              <SimpleGrid cols={4} spacing="md">
                <Card>
                  <Stack>
                    <Text size="sm" color="dimmed">总播放量</Text>
                    <Text size="lg" fw={600}>{ipProfile.totalPlays}次</Text>
                  </Stack>
                </Card>
                
                <Card>
                  <Stack>
                    <Text size="sm" color="dimmed">月活用户</Text>
                    <Text size="lg" fw={600}>{ipProfile.monthlyListeners}人</Text>
                  </Stack>
                </Card>
                
                <Card>
                  <Stack>
                    <Text size="sm" color="dimmed">总收入</Text>
                    <Text size="lg" fw={600}>¥{ipProfile.totalRevenue}</Text>
                  </Stack>
                </Card>
                
                <Card>
                  <Stack>
                    <Text size="sm" color="dimmed">IP评分</Text>
                    <Text size="lg" fw={600}>{calculateIPScore()}/100</Text>
                  </Stack>
                </Card>
              </SimpleGrid>
            </Grid.Col>
          </Grid>
        )}

        {/* 功能标签页 */}
        <Card>
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value as any)}>
            <Tabs.List>
              <Tabs.Tab value="overview">
                概览
              </Tabs.Tab>
              <Tabs.Tab value="merchandise">
                周边商品
              </Tabs.Tab>
              <Tabs.Tab value="analytics">
                数据分析
              </Tabs.Tab>
              <Tabs.Tab value="collaboration">
                商业合作
              </Tabs.Tab>
            </Tabs.List>

            {/* 概览 */}
            <Tabs.Panel value="overview" pt="md">
              <Stack gap="md">
                <Group justify="apart">
                  <Title order={4}>IP表现趋势</Title>
                  <Select
                    placeholder="选择时间范围"
                    data={[
                      { value: '7d', label: '最近7天' },
                      { value: '30d', label: '最近30天' },
                      { value: '90d', label: '最近90天' }
                    ]}
                    w={120}
                  />
                </Group>

                {/* 趋势图表 */}
                <Card p="lg">
                  <Text mb="md">粉丝增长趋势</Text>
                  <Progress value={65} size="xl" />
                </Card>

                {/* 最新成就 */}
                <Card p="lg">
                  <Title order={5} mb="md">最新成就</Title>
                  <Group gap="xs">
                    <Badge color="gold" variant="filled">金牌音乐人</Badge>
                    <Badge color="silver" variant="filled">十万播放</Badge>
                    <Badge color="bronze" variant="filled">粉丝过万</Badge>
                  </Group>
                </Card>
              </Stack>
            </Tabs.Panel>

            {/* 周边商品 */}
            <Tabs.Panel value="merchandise" pt="md">
              <Group justify="apart" mb="md">
                <Title order={4}>周边商品</Title>
                <Button

                  onClick={() => setCreatingMerch(true)}
                >
                  添加商品
                </Button>
              </Group>

              <SimpleGrid cols={3} spacing="md">
                {merchandise.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedMerch(item)}
                  >
                    <Image
                      src={item.images[0]}
                      height={150}
                      alt={item.name}
                      className="rounded-t-lg"
                    />
                    
                    <Stack gap="xs" p="md">
                      <Text fw={600} lineClamp={1}>{item.name}</Text>
                      <Text size="sm" color="gray.500" lineClamp={2}>
                        {item.description}
                      </Text>
                      <Group justify="apart">
                        <Text color="orange" fw={600}>¥{item.price}</Text>
                        <Badge
                          color={item.stock === 0 ? 'red' : item.stock < 10 ? 'yellow' : 'green'}
                          variant="light"
                          size="xs"
                        >
                          {item.stock === 0 ? '售罄' : `库存${item.stock}`}
                        </Badge>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>

              {/* 商品详情模态框 */}
              <Modal
                opened={!!selectedMerch}
                onClose={() => setSelectedMerch(null)}
                title={selectedMerch?.name}
                size="md"
              >
                {selectedMerch && (
                  <Stack gap="md">
                    <Image
                      src={selectedMerch.images[0]}
                      alt={selectedMerch.name}
                    />
                    
                    <Text>{selectedMerch.description}</Text>
                    
                    <Group justify="apart">
                      <Text size="xl" color="orange" fw={600}>
                        ¥{selectedMerch.price}
                      </Text>
                      <Text size="sm" color="gray.500">
                        销量: {selectedMerch.sales}
                      </Text>
                    </Group>
                    
                    <Button fullWidth color="orange">
                      立即购买
                    </Button>
                  </Stack>
                )}
              </Modal>

              {/* 创建商品模态框 */}
              <Modal
                opened={creatingMerch}
                onClose={() => setCreatingMerch(false)}
                title="添加商品"
                size="md"
              >
                <Stack gap="md">
                  <Textarea
                    label="商品名称"
                    placeholder="输入商品名称"
                  />
                  
                  <Textarea
                    label="商品描述"
                    placeholder="输入商品描述"
                    minRows={3}
                  />
                  
                  <NumberInput
                    label="价格"
                    placeholder="0.00"
                    min={0}
                  />
                  
                  <NumberInput
                    label="库存"
                    placeholder="0"
                    min={0}
                  />
                  
                  <Select
                    label="商品分类"
                    placeholder="选择分类"
                    data={[
                      { value: 'clothing', label: '服装' },
                      { value: 'accessories', label: '配饰' },
                      { value: 'digital', label: '数字商品' },
                      { value: 'other', label: '其他' }
                    ]}
                  />
                  
                  <Button
                    fullWidth
                    onClick={() => {
                      createMerchandise({
                        name: '新商品',
                        description: '商品描述',
                        price: 99,
                        stock: 100,
                        category: 'other'
                      })
                    }}
                  >
                    创建商品
                  </Button>
                </Stack>
              </Modal>
            </Tabs.Panel>

            {/* 数据分析 */}
            <Tabs.Panel value="analytics" pt="md">
              <Stack gap="md">
                <Title order={4}>数据分析</Title>
                
                {analytics && (
                  <SimpleGrid cols={2}>
                    <Card>
                      <Text fw={600} mb="sm">粉丝画像</Text>
                      <Stack gap="xs">
                        <Group justify="apart">
                          <Text size="sm">年龄分布</Text>
                          <Text size="sm">18-24岁: 45%</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">性别分布</Text>
                          <Text size="sm">男性: 60%, 女性: 40%</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">地域分布</Text>
                          <Text size="sm">一线城市: 35%</Text>
                        </Group>
                      </Stack>
                    </Card>
                    
                    <Card>
                      <Text fw={600} mb="sm">内容表现</Text>
                      <Stack gap="xs">
                        <Group justify="apart">
                          <Text size="sm">平均播放时长</Text>
                          <Text size="sm">3分24秒</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">互动率</Text>
                          <Text size="sm">{(analytics.engagementRate * 100).toFixed(1)}%</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">转化率</Text>
                          <Text size="sm">2.3%</Text>
                        </Group>
                      </Stack>
                    </Card>
                    
                    <Card>
                      <Text fw={600} mb="sm">收入分析</Text>
                      <Stack gap="xs">
                        <Group justify="apart">
                          <Text size="sm">音乐收入</Text>
                          <Text size="sm">¥{analytics.musicRevenue}</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">商品收入</Text>
                          <Text size="sm">¥{analytics.merchRevenue}</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">合作收入</Text>
                          <Text size="sm">¥{analytics.collaborationRevenue}</Text>
                        </Group>
                      </Stack>
                    </Card>
                    
                    <Card>
                      <Text fw={600} mb="sm">增长预测</Text>
                      <Stack gap="xs">
                        <Group justify="apart">
                          <Text size="sm">下月预测粉丝</Text>
                          <Text size="sm">+{analytics.predictedGrowth}</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">预计收入</Text>
                          <Text size="sm">¥{analytics.predictedRevenue}</Text>
                        </Group>
                        <Group justify="apart">
                          <Text size="sm">IP价值评估</Text>
                          <Text size="sm">¥{analytics.ipValue}</Text>
                        </Group>
                      </Stack>
                    </Card>
                  </SimpleGrid>
                )}
              </Stack>
            </Tabs.Panel>

            {/* 商业合作 */}
            <Tabs.Panel value="collaboration" pt="md">
              <Stack gap="md">
                <Group justify="apart">
                  <Title order={4}>商业合作</Title>
                  <Button>申请新合作</Button>
                </Group>

                <Card>
                  <Text fw={600} mb="sm">进行中的合作</Text>
                  <Stack gap="md">
                    <div className="p-4 border rounded-lg">
                      <Group justify="apart" mb="xs">
                        <Text fw={500}>某音乐平台独家合作</Text>
                        <Badge color="green">进行中</Badge>
                      </Group>
                      <Text size="sm" color="gray.500" mb="xs">
                        合作期限: 2024.01.01 - 2024.12.31
                      </Text>
                      <Progress value={75} size="sm" />
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <Group justify="apart" mb="xs">
                        <Text fw={500}>某品牌代言</Text>
                        <Badge color="blue">待确认</Badge>
                      </Group>
                      <Text size="sm" color="gray.500" mb="xs">
                        预计收入: ¥50,000
                      </Text>
                    </div>
                  </Stack>
                </Card>

                <Card>
                  <Text fw={600} mb="sm">合作历史</Text>
                  <Stack gap="md">
                    <Group justify="apart">
                      <Text>某耳机品牌联名</Text>
                      <Text size="sm" color="green">已结束</Text>
                    </Group>
                    <Group justify="apart">
                      <Text>某游戏主题曲</Text>
                      <Text size="sm" color="gray">已结束</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
