'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@yyc3/ui-enterprise';
import { Badge } from '@yyc3/ui-enterprise';
import { Button } from '@yyc3/ui-enterprise';
import { Input } from '@yyc3/ui-enterprise';
import { Progress } from '@yyc3/ui-enterprise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yyc3/ui-enterprise';
import { Avatar, AvatarFallback, AvatarImage } from '@yyc3/ui-enterprise';
import { 
  User, 
  Crown, 
  Star, 
  Gift, 
  Award, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Settings,
  Download,
  Trophy,
  Coins,
  Clock,
  Copy,
  Check
} from 'lucide-react';

interface CommunityCenterProps {
  language: 'zh' | 'en';
}

export function CommunityCenter({ language }: CommunityCenterProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState({ code: false, link: false });

  const content = {
    zh: {
      title: '会员中心',
      subtitle: '管理您的会员资料和权益',
      tabs: {
        profile: '个人资料',
        subscription: '订阅管理',
        rewards: '积分奖励',
        achievements: '成就徽章',
        community: '社区互动',
        referral: '推荐计划'
      },
      profile: {
        title: '个人资料',
        memberSince: '注册时间',
        lastActive: '最后活跃',
        level: '等级',
        points: '积分',
        editProfile: '编辑资料',
        userStats: '用户统计',
        stats: {
          totalTrades: '总交易次数',
          totalProfit: '总收益',
          winRate: '胜率',
          followers: '关注者'
        }
      },
      subscription: {
        title: '订阅管理',
        currentPlan: '当前方案',
        planExpiry: '到期时间',
        usageStats: '使用统计',
        upgrade: '升级',
        manage: '管理订阅',
        features: '功能权限',
        billing: '账单历史',
        renewalDate: '续费日期',
        autoRenewal: '自动续费',
        enabled: '已启用',
        apiCalls: 'API调用次数',
        aiQueries: 'AI查询次数',
        unlimited: '无限制'
      },
      rewards: {
        title: '积分奖励',
        currentPoints: '当前积分',
        pointsHistory: '积分历史',
        redeemRewards: '兑换奖励',
        dailyCheckin: '每日签到',
        taskProgress: '任务进度',
        availableRewards: '可兑换奖励',
        pointsEarned: '获得积分',
        pointsSpent: '消费积分',
        thisMonth: '本月',
        earned: '获得',
        spent: '消费',
        redeem: '兑换',
        rewards: [
          { name: '高级功能7天', cost: 500, type: 'feature' },
          { name: '专属徽章', cost: 1000, type: 'badge' },
          { name: '优先客服', cost: 2000, type: 'service' },
          { name: '定制报告', cost: 5000, type: 'report' }
        ]
      },
      achievements: {
        title: '成就徽章',
        totalAchievements: '总成就',
        recentAchievements: '最近获得',
        categories: '成就分类',
        unlocked: '已解锁',
        locked: '未解锁',
        progress: '进度',
        list: [
          { name: '交易新手', description: '完成首次交易', icon: '🎯', unlocked: true },
          { name: '连胜王者', description: '连续10次盈利交易', icon: '🏆', unlocked: true },
          { name: '数据分析师', description: '使用AI分析100次', icon: '📊', unlocked: true },
          { name: '社区贡献者', description: '发布10个有用帖子', icon: '💬', unlocked: false },
          { name: '推荐达人', description: '推荐5个新用户', icon: '👥', unlocked: false },
          { name: '忠实用户', description: '连续登录30天', icon: '⭐', unlocked: true }
        ]
      },
      community: {
        title: '社区互动',
        posts: '我的帖子',
        comments: '评论',
        likes: '点赞',
        shares: '分享',
        followers: '关注者',
        following: '关注中',
        reputation: '声誉值',
        activity: '活动记录'
      },
      referral: {
        title: '推荐计划',
        referralCode: '推荐码',
        referralLink: '推荐链接',
        totalReferrals: '总推荐数',
        referralRewards: '推荐奖励',
        copy: '复制',
        copied: '已复制',
        share: '分享',
        viewDetails: '查看详情',
        points: '积分'
      },
      membershipTiers: [
        {
          name: '青铜会员',
          level: 1,
          color: 'from-amber-600 to-amber-800',
          minPoints: 0,
          maxPoints: 1000,
          benefits: ['基础功能', '社区访问', '邮件支持']
        },
        {
          name: '白银会员',
          level: 2,
          color: 'from-slate-400 to-slate-600',
          minPoints: 1000,
          maxPoints: 5000,
          benefits: ['高级功能', '优先支持', '专属标识']
        },
        {
          name: '黄金会员',
          level: 3,
          color: 'from-yellow-400 to-yellow-600',
          minPoints: 5000,
          maxPoints: 15000,
          benefits: ['全部功能', '专属客服', '独家内容']
        },
        {
          name: '钻石会员',
          level: 4,
          color: 'from-cyan-400 to-cyan-600',
          minPoints: 15000,
          maxPoints: Infinity,
          benefits: ['顶级权限', '1对1服务', '内测权限']
        }
      ],
      upgradeToNext: '升级到'
    },
    en: {
      title: 'Member Center',
      subtitle: 'Manage your membership profile and benefits',
      tabs: {
        profile: 'Profile',
        subscription: 'Subscription',
        rewards: 'Points & Rewards',
        achievements: 'Achievements',
        community: 'Community',
        referral: 'Referral Program'
      },
      profile: {
        title: 'User Profile',
        memberSince: 'Member Since',
        lastActive: 'Last Active',
        level: 'Level',
        points: 'Points',
        editProfile: 'Edit Profile',
        userStats: 'User Statistics',
        stats: {
          totalTrades: 'Total Trades',
          totalProfit: 'Total Profit',
          winRate: 'Win Rate',
          followers: 'Followers'
        }
      },
      subscription: {
        title: 'Subscription Management',
        currentPlan: 'Current Plan',
        planExpiry: 'Expiry Date',
        usageStats: 'Usage Statistics',
        upgrade: 'Upgrade',
        manage: 'Manage Subscription',
        features: 'Feature Permissions',
        billing: 'Billing History',
        renewalDate: 'Renewal Date',
        autoRenewal: 'Auto Renewal',
        enabled: 'Enabled',
        apiCalls: 'API Calls',
        aiQueries: 'AI Queries',
        unlimited: 'Unlimited'
      },
      rewards: {
        title: 'Points & Rewards',
        currentPoints: 'Current Points',
        pointsHistory: 'Points History',
        redeemRewards: 'Redeem Rewards',
        dailyCheckin: 'Daily Check-in',
        taskProgress: 'Task Progress',
        availableRewards: 'Available Rewards',
        pointsEarned: 'Points Earned',
        pointsSpent: 'Points Spent',
        thisMonth: 'This Month',
        earned: 'Earned',
        spent: 'Spent',
        redeem: 'Redeem',
        rewards: [
          { name: 'Premium Features 7 Days', cost: 500, type: 'feature' },
          { name: 'Exclusive Badge', cost: 1000, type: 'badge' },
          { name: 'Priority Support', cost: 2000, type: 'service' },
          { name: 'Custom Report', cost: 5000, type: 'report' }
        ]
      },
      achievements: {
        title: 'Achievements',
        totalAchievements: 'Total Achievements',
        recentAchievements: 'Recent Achievements',
        categories: 'Categories',
        unlocked: 'Unlocked',
        locked: 'Locked',
        progress: 'Progress',
        list: [
          { name: 'Trading Novice', description: 'Complete first trade', icon: '🎯', unlocked: true },
          { name: 'Winning Streak', description: '10 consecutive profitable trades', icon: '🏆', unlocked: true },
          { name: 'Data Analyst', description: 'Use AI analysis 100 times', icon: '📊', unlocked: true },
          { name: 'Community Contributor', description: 'Post 10 helpful posts', icon: '💬', unlocked: false },
          { name: 'Referral Expert', description: 'Refer 5 new users', icon: '👥', unlocked: false },
          { name: 'Loyal User', description: 'Login for 30 consecutive days', icon: '⭐', unlocked: true }
        ]
      },
      community: {
        title: 'Community Interaction',
        posts: 'My Posts',
        comments: 'Comments',
        likes: 'Likes',
        shares: 'Shares',
        followers: 'Followers',
        following: 'Following',
        reputation: 'Reputation',
        activity: 'Activity Log'
      },
      referral: {
        title: 'Referral Program',
        referralCode: 'Referral Code',
        referralLink: 'Referral Link',
        totalReferrals: 'Total Referrals',
        referralRewards: 'Referral Rewards',
        copy: 'Copy',
        copied: 'Copied',
        share: 'Share',
        viewDetails: 'View Details',
        points: 'Points'
      },
      membershipTiers: [
        {
          name: 'Bronze Member',
          level: 1,
          color: 'from-amber-600 to-amber-800',
          minPoints: 0,
          maxPoints: 1000,
          benefits: ['Basic Features', 'Community Access', 'Email Support']
        },
        {
          name: 'Silver Member',
          level: 2,
          color: 'from-slate-400 to-slate-600',
          minPoints: 1000,
          maxPoints: 5000,
          benefits: ['Advanced Features', 'Priority Support', 'Exclusive Badge']
        },
        {
          name: 'Gold Member',
          level: 3,
          color: 'from-yellow-400 to-yellow-600',
          minPoints: 5000,
          maxPoints: 15000,
          benefits: ['All Features', 'Dedicated Support', 'Exclusive Content']
        },
        {
          name: 'Diamond Member',
          level: 4,
          color: 'from-cyan-400 to-cyan-600',
          minPoints: 15000,
          maxPoints: Infinity,
          benefits: ['Premium Access', '1-on-1 Service', 'Beta Testing']
        }
      ],
      upgradeToNext: 'Upgrade to'
    }
  };

  const t = content[language];

  const currentPoints = 8750;
  const currentTier = t.membershipTiers.find(tier => 
    currentPoints >= tier.minPoints && currentPoints < tier.maxPoints
  ) || t.membershipTiers[0];

  const nextTier = t.membershipTiers.find(tier => tier.level === currentTier.level + 1);
  const progressToNextTier = nextTier 
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-slate-400 text-lg">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
            <Settings className="w-4 h-4 mr-2" />
            {language === 'zh' ? '设置' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Membership Level Card */}
      <Card className="bg-slate-800/80 border-slate-700 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentTier.color} flex items-center justify-center shadow-lg`}>
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">{currentTier.name}</h3>
                <p className="text-slate-400 text-base">{language === 'zh' ? '等级' : 'Level'} {currentTier.level}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentTier.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right lg:text-left">
              <p className="text-slate-400 text-sm">{t.profile.points}</p>
              <p className="text-3xl font-bold text-white">{currentPoints.toLocaleString()}</p>
            </div>
          </div>
          
          {nextTier && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{t.upgradeToNext} {nextTier.name}</span>
                <span className="text-blue-400 font-medium">{(nextTier.minPoints - currentPoints).toLocaleString()} {language === 'zh' ? '积分' : 'points'}</span>
              </div>
              <Progress value={progressToNextTier} className="h-3 bg-slate-700" />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-slate-800/80 h-auto p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm py-3">
            {t.tabs.profile}
          </TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm py-3">
            {t.tabs.subscription}
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm py-3">
            {t.tabs.rewards}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm py-3">
            {t.tabs.achievements}
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-sm py-3">
            {t.tabs.community}
          </TabsTrigger>
          <TabsTrigger value="referral" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-sm py-3">
            {t.tabs.referral}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  {t.profile.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/api/placeholder/64/64" />
                    <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">VIP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white text-lg font-semibold">VIP{language === 'zh' ? '用户' : ' User'}</h3>
                    <p className="text-slate-400 text-sm">premium@chaincoven.com</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">{t.profile.memberSince}</span>
                    <span className="text-white">2023-06-15</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">{t.profile.lastActive}</span>
                    <span className="text-white">{language === 'zh' ? '2分钟前' : '2 min ago'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">{t.profile.level}</span>
                    <span className="text-white">{currentTier.name}</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  {t.profile.editProfile}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white text-lg">{t.profile.userStats}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">{t.profile.stats.totalTrades}</p>
                    <p className="text-2xl font-bold text-white">1,247</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">{t.profile.stats.totalProfit}</p>
                    <p className="text-2xl font-bold text-green-400">+$45,678</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">{t.profile.stats.winRate}</p>
                    <p className="text-2xl font-bold text-white">68.5%</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">{t.profile.stats.followers}</p>
                    <p className="text-2xl font-bold text-white">234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                {t.subscription.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">{t.subscription.currentPlan}</p>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-lg font-semibold">VIP{language === 'zh' ? '会员' : ' Member'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">{t.subscription.planExpiry}</p>
                  <p className="text-white text-lg">2024-02-15</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">{t.subscription.autoRenewal}</p>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    {t.subscription.enabled}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-white text-lg font-semibold mb-4">{t.subscription.usageStats}</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{t.subscription.apiCalls}</span>
                      <span className="text-white font-medium">8,456 / 10,000</span>
                    </div>
                    <Progress value={84.56} className="h-3 bg-slate-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{t.subscription.aiQueries}</span>
                      <span className="text-white font-medium">{t.subscription.unlimited}</span>
                    </div>
                    <Progress value={100} className="h-3 bg-slate-700" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  {t.subscription.manage}
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  {t.subscription.upgrade}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                  <Coins className="w-5 h-5 mr-2 text-purple-400" />
                  {t.rewards.currentPoints}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white mb-4">{currentPoints.toLocaleString()}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t.rewards.thisMonth}{t.rewards.earned}</span>
                    <span className="text-green-400 font-medium">+1,250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t.rewards.thisMonth}{t.rewards.spent}</span>
                    <span className="text-red-400 font-medium">-500</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                  <Gift className="w-4 h-4 mr-2" />
                  {t.rewards.dailyCheckin}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white text-lg">{t.rewards.availableRewards}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {t.rewards.rewards.map((reward, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">{reward.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">{reward.cost.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                        disabled={currentPoints < reward.cost}
                      >
                        {t.rewards.redeem}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <Trophy className="w-5 h-5 mr-2 text-orange-400" />
                {t.achievements.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.achievements.list.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked 
                        ? 'bg-green-500/10 border-green-500/30 shadow-lg' 
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <h4 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                          {achievement.name}
                        </h4>
                        <Badge className={`text-xs ${achievement.unlocked ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                          {achievement.unlocked ? t.achievements.unlocked : t.achievements.locked}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{t.community.posts}</p>
                    <p className="text-2xl font-bold text-white">23</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{t.community.likes}</p>
                    <p className="text-2xl font-bold text-white">156</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{t.community.followers}</p>
                    <p className="text-2xl font-bold text-white">234</p>
                  </div>
                  <Users className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{t.community.reputation}</p>
                    <p className="text-2xl font-bold text-white">1,847</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral" className="space-y-6">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <Share2 className="w-5 h-5 mr-2 text-cyan-400" />
                {t.referral.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">{t.referral.referralCode}</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value="CHAIN2024"
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-3"
                        onClick={() => handleCopy('CHAIN2024', 'code')}
                      >
                        {copied.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">{t.referral.referralLink}</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value="https://chaincoven.com/invite/CHAIN2024"
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-3"
                        onClick={() => handleCopy('https://chaincoven.com/invite/CHAIN2024', 'link')}
                      >
                        {copied.link ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">{t.referral.totalReferrals}</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-slate-400 text-sm mb-1">{t.referral.referralRewards}</p>
                    <p className="text-2xl font-bold text-green-400">2,400 {t.referral.points}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}