/**
 * @file 数据看板组件
 * @description 展示系统关键数据指标和可视化图表
 * @module dashboard
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  CheckSquare,
  Clock,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Star,
  FileText,
  MessageSquare,
  Bell,
  Search,
  RefreshCcw,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  PlusCircle
} from 'lucide-react';

import {
  Button
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Input
} from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Badge
} from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import {
  Progress
} from '@/components/ui/progress';
import {
  Skeleton
} from '@/components/ui/skeleton';
import {
  Separator
} from '@/components/ui/separator';
import {
  ScrollArea
} from '@/components/ui/scroll-area';
import {
  Switch
} from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// 类型定义
interface KPIItem {
  id: string;
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface TaskStatusData {
  name: string;
  value: number;
  color: string;
}

interface DepartmentPerformance {
  name: string;
  completed: number;
  pending: number;
  total: number;
  completionRate: number;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'task' | 'meeting' | 'notification' | 'user';
  user?: { name: string; avatar: string };
  read?: boolean;
}

interface ActivityChartData {
  name: string;
  tasks: number;
  meetings: number;
  notifications: number;
}

interface PerformanceTrendData {
  name: string;
  completionRate: number;
  efficiency: number;
  satisfaction: number;
}

// 数据看板组件
const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [KPIs, setKPIs] = useState<KPIItem[]>([]);
  const [taskStatusData, setTaskStatusData] = useState<TaskStatusData[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [activityChartData, setActivityChartData] = useState<ActivityChartData[]>([]);
  const [performanceTrendData, setPerformanceTrendData] = useState<PerformanceTrendData[]>([]);
  const [unreadCount, setUnreadCount] = useState(5);

  // 模拟数据加载
  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      // 关键绩效指标数据
      const mockKPIs: KPIItem[] = [
        {
          id: 'tasks',
          title: '任务完成率',
          value: '87.5%',
          change: 5.2,
          isPositive: true,
          icon: <CheckSquare className="h-5 w-5" />,
          color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
          description: '较上周提升5.2%'
        },
        {
          id: 'users',
          title: '活跃用户',
          value: '128',
          change: 12,
          isPositive: true,
          icon: <Users className="h-5 w-5" />,
          color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
          description: '较上周新增12人'
        },
        {
          id: 'overdue',
          title: '逾期任务',
          value: '4',
          change: -3,
          isPositive: true,
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
          description: '较上周减少3个'
        },
        {
          id: 'meetings',
          title: '今日会议',
          value: '6',
          change: 2,
          isPositive: false,
          icon: <Calendar className="h-5 w-5" />,
          color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
          description: '较昨日增加2个'
        }
      ];

      // 任务状态分布数据
      const mockTaskStatusData: TaskStatusData[] = [
        { name: '已完成', value: 264, color: '#22c55e' },
        { name: '进行中', value: 78, color: '#3b82f6' },
        { name: '待开始', value: 42, color: '#64748b' },
        { name: '已逾期', value: 16, color: '#ef4444' }
      ];

      // 部门绩效数据
      const mockDepartmentPerformance: DepartmentPerformance[] = [
        { name: '研发部', completed: 89, pending: 11, total: 100, completionRate: 89 },
        { name: '市场部', completed: 76, pending: 24, total: 100, completionRate: 76 },
        { name: '销售部', completed: 92, pending: 8, total: 100, completionRate: 92 },
        { name: '财务部', completed: 95, pending: 5, total: 100, completionRate: 95 },
        { name: '人事部', completed: 82, pending: 18, total: 100, completionRate: 82 }
      ];

      // 最近活动时间线数据
      const mockTimelineEvents: TimelineEvent[] = [
        {
          id: '1',
          title: '张三完成了任务',
          description: '优化首页加载性能，提升用户体验',
          time: '刚刚',
          type: 'task',
          user: { name: '张三', avatar: 'ZS' },
          read: false
        },
        {
          id: '2',
          title: '系统通知',
          description: '系统将于今晚23:00-次日凌晨1:00进行维护',
          time: '2小时前',
          type: 'notification',
          read: false
        },
        {
          id: '3',
          title: '李四创建了会议',
          description: '产品迭代讨论会议，明天上午10:00-12:00',
          time: '3小时前',
          type: 'meeting',
          user: { name: '李四', avatar: 'LS' },
          read: true
        },
        {
          id: '4',
          title: '王五加入系统',
          description: '职位：前端开发工程师',
          time: '今天 10:23',
          type: 'user',
          read: true
        },
        {
          id: '5',
          title: '赵六评论了您的任务',
          description: '这个功能的实现方式可以再优化一下',
          time: '昨天 16:45',
          type: 'task',
          user: { name: '赵六', avatar: 'ZL' },
          read: false
        },
        {
          id: '6',
          title: '系统通知',
          description: '您有3个任务即将到期，请及时处理',
          time: '昨天 09:30',
          type: 'notification',
          read: true
        },
        {
          id: '7',
          title: '钱七完成了项目',
          description: '企业官网改版项目已全部完成',
          time: '2天前',
          type: 'task',
          user: { name: '钱七', avatar: 'QQ' },
          read: true
        }
      ];

      // 活动趋势图表数据
      const mockActivityChartData: ActivityChartData[] = [
        { name: '周一', tasks: 45, meetings: 5, notifications: 12 },
        { name: '周二', tasks: 62, meetings: 3, notifications: 15 },
        { name: '周三', tasks: 58, meetings: 7, notifications: 18 },
        { name: '周四', tasks: 49, meetings: 4, notifications: 14 },
        { name: '周五', tasks: 55, meetings: 6, notifications: 16 },
        { name: '周六', tasks: 18, meetings: 1, notifications: 8 },
        { name: '周日', tasks: 12, meetings: 0, notifications: 5 }
      ];

      // 绩效趋势数据
      const mockPerformanceTrendData: PerformanceTrendData[] = [
        { name: '1月', completionRate: 76, efficiency: 82, satisfaction: 85 },
        { name: '2月', completionRate: 79, efficiency: 84, satisfaction: 86 },
        { name: '3月', completionRate: 82, efficiency: 85, satisfaction: 87 },
        { name: '4月', completionRate: 80, efficiency: 83, satisfaction: 85 },
        { name: '5月', completionRate: 84, efficiency: 86, satisfaction: 88 },
        { name: '6月', completionRate: 87, efficiency: 89, satisfaction: 90 }
      ];

      // 设置状态
      setKPIs(mockKPIs);
      setTaskStatusData(mockTaskStatusData);
      setDepartmentPerformance(mockDepartmentPerformance);
      setTimelineEvents(mockTimelineEvents);
      setActivityChartData(mockActivityChartData);
      setPerformanceTrendData(mockPerformanceTrendData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 处理时间范围变更
  const handleTimeRangeChange = (range: string) => {
    setIsLoading(true);
    setTimeRange(range);
    // 模拟数据重新加载
    setTimeout(() => setIsLoading(false), 600);
  };

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setTimelineEvents(prev => prev.map(event => ({ ...event, read: true })));
    setUnreadCount(0);
  };

  // 获取通知图标
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'notification':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'user':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // 渲染KPI骨架屏
  const renderKPIShimmer = () => {
    return Array(4).fill(0).map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <CardHeader className="p-4 pb-0">
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardContent>
      </Card>
    ));
  };

  // 渲染图表骨架屏
  const renderChartShimmer = () => {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  };

  // 渲染活动时间线骨架屏
  const renderTimelineShimmer = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={index} className="flex gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-10 w-10 rounded-full mt-1" />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-900/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">打开菜单</span>
            </Button>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">数据看板</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">今日</SelectItem>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="quarter">本季度</SelectItem>
                  <SelectItem value="year">本年</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 800);
                }}
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="sr-only">刷新数据</span>
              </Button>
            </div>

            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">通知</span>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://picsum.photos/200/200" alt="用户头像" />
                    <AvatarFallback>YY</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>个人资料</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>设置</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>帮助中心</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="container py-6 px-4">
        {/* 数据概览和筛选 */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">数据概览</h1>
            <p className="text-gray-500 dark:text-gray-400">
              实时监控系统关键指标和业务数据
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input placeholder="搜索..." className="pl-8" />
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">导出</span>
            </Button>
          </div>
        </div>

        {/* 关键绩效指标卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? renderKPIShimmer() : KPIs.map((kpi) => (
            <Card key={kpi.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {kpi.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className={`p-2 rounded-full ${kpi.color} group-hover:scale-110 transition-transform`}>
                    {kpi.icon}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  {kpi.isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5 text-red-500 mr-1 rotate-180" />
                  )}
                  <span className={kpi.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {kpi.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 主要图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 活动趋势图表 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">活动趋势分析</CardTitle>
              <CardDescription>最近7天的任务、会议和通知数量</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                renderChartShimmer()
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" name="任务" fill="#3b82f6" />
                      <Bar dataKey="meetings" name="会议" fill="#8b5cf6" />
                      <Bar dataKey="notifications" name="通知" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 任务状态分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">任务状态分布</CardTitle>
              <CardDescription>按状态统计的任务数量</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                renderChartShimmer()
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2">
              {taskStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </CardFooter>
          </Card>
        </div>

        {/* 底部数据区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 部门绩效对比 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">部门绩效对比</CardTitle>
              <CardDescription>各部门任务完成情况</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                renderChartShimmer()
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceTrendData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completionRate" name="完成率" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" name="效率" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="satisfaction" name="满意度" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="w-full space-y-3">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="font-medium">{dept.completionRate}%</span>
                    </div>
                    <Progress value={dept.completionRate} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>已完成: {dept.completed}</span>
                      <span>待完成: {dept.pending}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardFooter>
          </Card>

          {/* 最近活动 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">最近活动</CardTitle>
                  <CardDescription>系统内的最新动态</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    全部已读
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                {isLoading ? (
                  renderTimelineShimmer()
                ) : (
                  <div className="px-4 py-2">
                    {timelineEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className={`flex gap-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0 ${!event.read ? 'bg-blue-50 dark:bg-blue-950/30' : ''}`}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            {event.user ? (
                              <>
                                <AvatarImage src={`https://picsum.photos/seed/${event.user.avatar}/200/200`} alt={event.user.name} />
                                <AvatarFallback>{event.user.avatar}</AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="flex items-center justify-center">
                                {getEventIcon(event.type)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          {!event.read && (
                            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{event.description}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 justify-center">
              <Button variant="ghost" size="sm">
                查看更多
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-4">
        <div className="container px-4 mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>数据看板 © 2024 版权所有</p>
          <p className="mt-1">最后更新时间: {new Date().toLocaleString()}</p>
        </div>
      </footer>

      {/* 移动端侧边菜单 */}
      <div className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 shadow-xl p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-bold">数据看板</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              数据概览
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CheckSquare className="h-4 w-4 mr-2" />
              任务管理
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              用户管理
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              会议管理
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              报表中心
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              消息通知
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              系统设置
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;