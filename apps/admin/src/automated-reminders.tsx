/**
 * @file 自动化提醒组件
 * @description 提供任务、会议、截止日期等各类提醒的管理和设置功能
 * @module reminders
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  Star,
  Filter,
  ChevronDown
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
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Badge
} from '@/components/ui/badge';
import {
  Label
} from '@/components/ui/label';

// 提醒类型定义
type ReminderType = 'task' | 'meeting' | 'deadline' | 'birthday' | 'announcement';

// 提醒状态定义
type ReminderStatus = 'pending' | 'completed' | 'dismissed' | 'expired';

// 提醒频率定义
type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// 提醒数据接口
interface Reminder {
  id: string;
  title: string;
  description: string;
  type: ReminderType;
  status: ReminderStatus;
  startTime: Date;
  endTime?: Date;
  frequency: ReminderFrequency;
  priority: 'low' | 'medium' | 'high';
  assignees: string[];
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 获取提醒图标
const getReminderIcon = (type: ReminderType) => {
  switch (type) {
    case 'task':
      return <FileText size={18} />;
    case 'meeting':
      return <Users size={18} />;
    case 'deadline':
      return <Clock size={18} />;
    case 'birthday':
      return <Star size={18} />;
    case 'announcement':
      return <Bell size={18} />;
    default:
      return <AlertCircle size={18} />;
  }
};

// 获取提醒状态标签
const getStatusBadge = (status: ReminderStatus) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          待处理
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          已完成
        </Badge>
      );
    case 'dismissed':
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          已忽略
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          已过期
        </Badge>
      );
    default:
      return null;
  }
};

// 获取优先级颜色
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

// 格式化日期时间
const formatDateTime = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 自动化提醒组件
const AutomatedReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isNewReminderOpen, setIsNewReminderOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: 'task' as ReminderType,
    startTime: new Date(),
    endTime: undefined as Date | undefined,
    frequency: 'once' as ReminderFrequency,
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignees: [] as string[],
    department: undefined as string | undefined,
    sendEmail: false,
    sendSms: false
  });

  // 模拟数据初始化
  useEffect(() => {
    const mockData: Reminder[] = [
      {
        id: '1',
        title: '季度绩效评估截止',
        description: '请在本周内完成团队成员的季度绩效评估',
        type: 'deadline',
        status: 'pending',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        frequency: 'quarterly',
        priority: 'high',
        assignees: ['张三', '李四'],
        department: '人力资源部',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: '产品需求评审会议',
        description: '讨论新版本的功能需求和实现方案',
        type: 'meeting',
        status: 'pending',
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        frequency: 'once',
        priority: 'medium',
        assignees: ['王五', '赵六'],
        department: '产品部',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: '项目进度跟踪',
        description: '检查项目开发进度，解决遇到的问题',
        type: 'task',
        status: 'completed',
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        frequency: 'weekly',
        priority: 'medium',
        assignees: ['孙七', '周八'],
        department: '技术部',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        title: '张三生日',
        description: '团队成员张三的生日',
        type: 'birthday',
        status: 'pending',
        startTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        frequency: 'yearly',
        priority: 'low',
        assignees: ['张三'],
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        title: '新员工入职培训',
        description: '为新入职员工提供系统操作培训',
        type: 'announcement',
        status: 'pending',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        frequency: 'monthly',
        priority: 'high',
        assignees: ['新人组'],
        department: '全公司',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    setReminders(mockData);
    setFilteredReminders(mockData);
  }, []);

  // 筛选提醒
  useEffect(() => {
    let result = [...reminders];

    // 搜索筛选
    if (searchQuery) {
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 类型筛选
    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType);
    }

    // 状态筛选
    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }

    // 按时间排序
    result.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    setFilteredReminders(result);
  }, [searchQuery, selectedType, selectedStatus, reminders]);

  // 切换提醒状态
  const toggleReminderStatus = (id: string) => {
    setReminders(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
          : item
      )
    );
  };

  // 创建新提醒
  const handleCreateReminder = () => {
    if (!newReminder.title.trim()) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      type: newReminder.type,
      status: 'pending',
      startTime: newReminder.startTime,
      endTime: newReminder.endTime,
      frequency: newReminder.frequency,
      priority: newReminder.priority,
      assignees: newReminder.assignees,
      department: newReminder.department,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setReminders(prev => [...prev, reminder]);
    setIsNewReminderOpen(false);
    resetNewReminder();
  };

  // 重置新提醒表单
  const resetNewReminder = () => {
    setNewReminder({
      title: '',
      description: '',
      type: 'task',
      startTime: new Date(),
      endTime: undefined,
      frequency: 'once',
      priority: 'medium',
      assignees: [],
      department: undefined,
      sendEmail: false,
      sendSms: false
    });
  };

  // 删除提醒
  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(item => item.id !== id));
  };

  // 提醒卡片组件
  const ReminderCard = ({ reminder }: { reminder: Reminder }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full bg-primary/10 text-primary`}>
              {getReminderIcon(reminder.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">{reminder.title}</CardTitle>
                <div className={getPriorityColor(reminder.priority)}>
                  {'●'.repeat(reminder.priority === 'high' ? 3 : reminder.priority === 'medium' ? 2 : 1)}
                </div>
              </div>
              <CardDescription>{reminder.department}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleReminderStatus(reminder.id)}>
                {reminder.status === 'completed' ? '标记为未完成' : '标记为完成'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => deleteReminder(reminder.id)}>
                删除提醒
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{reminder.description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {reminder.assignees.map((assignee, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {assignee}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} />
          <span>{formatDateTime(reminder.startTime)}</span>
          {reminder.endTime && (
            <>
              <span> - </span>
              <span>{formatDateTime(reminder.endTime)}</span>
            </>
          )}
          {reminder.frequency !== 'once' && (
            <>
              <span> · </span>
              <span>
                {reminder.frequency === 'daily' && '每日'}
                {reminder.frequency === 'weekly' && '每周'}
                {reminder.frequency === 'monthly' && '每月'}
                {reminder.frequency === 'quarterly' && '每季度'}
                {reminder.frequency === 'yearly' && '每年'}
              </span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 justify-between">
        <div>{getStatusBadge(reminder.status)}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1"
                onClick={() => toggleReminderStatus(reminder.id)}
              >
                <CheckCircle size={14} />
                <span className="text-xs">{reminder.status === 'completed' ? '取消完成' : '标记完成'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{reminder.status === 'completed' ? '取消完成' : '标记为已完成'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">自动化提醒</h1>
          <p className="text-gray-500 dark:text-gray-400">管理和设置各类提醒事项</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dialog open={isNewReminderOpen} onOpenChange={setIsNewReminderOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus size={16} />
                <span>新建提醒</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>新建提醒</DialogTitle>
                <DialogDescription>设置提醒内容和时间，系统将按时通知相关人员</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="reminder-title">标题</Label>
                  <Input
                    id="reminder-title"
                    placeholder="输入提醒标题"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder-description">描述</Label>
                  <Input
                    id="reminder-description"
                    placeholder="输入提醒描述"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-type">类型</Label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value) => setNewReminder({ ...newReminder, type: value as ReminderType })}
                    >
                      <SelectTrigger id="reminder-type">
                        <SelectValue placeholder="选择提醒类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">任务</SelectItem>
                        <SelectItem value="meeting">会议</SelectItem>
                        <SelectItem value="deadline">截止日期</SelectItem>
                        <SelectItem value="birthday">生日</SelectItem>
                        <SelectItem value="announcement">公告</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-priority">优先级</Label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value) =>
                        setNewReminder({ ...newReminder, priority: value as 'low' | 'medium' | 'high' })
                      }
                    >
                      <SelectTrigger id="reminder-priority">
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-start-time">开始时间</Label>
                    <Input
                      id="reminder-start-time"
                      type="datetime-local"
                      value={new Date(newReminder.startTime).toISOString().slice(0, 16)}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, startTime: new Date(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-frequency">频率</Label>
                    <Select
                      value={newReminder.frequency}
                      onValueChange={(value) =>
                        setNewReminder({ ...newReminder, frequency: value as ReminderFrequency })
                      }
                    >
                      <SelectTrigger id="reminder-frequency">
                        <SelectValue placeholder="选择频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">仅一次</SelectItem>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                        <SelectItem value="quarterly">每季度</SelectItem>
                        <SelectItem value="yearly">每年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="send-email" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    发送邮件通知
                  </Label>
                  <Switch
                    id="send-email"
                    checked={newReminder.sendEmail}
                    onCheckedChange={(checked) =>
                      setNewReminder({ ...newReminder, sendEmail: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="send-sms" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    发送短信通知
                  </Label>
                  <Switch
                    id="send-sms"
                    checked={newReminder.sendSms}
                    onCheckedChange={(checked) =>
                      setNewReminder({ ...newReminder, sendSms: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsNewReminderOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateReminder}>创建提醒</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-1">
                <Filter size={16} />
                <span>筛选</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-3 space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="filter-type">提醒类型</Label>
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger id="filter-type" className="w-full">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="task">任务</SelectItem>
                      <SelectItem value="meeting">会议</SelectItem>
                      <SelectItem value="deadline">截止日期</SelectItem>
                      <SelectItem value="birthday">生日</SelectItem>
                      <SelectItem value="announcement">公告</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="filter-status">状态</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger id="filter-status" className="w-full">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="dismissed">已忽略</SelectItem>
                      <SelectItem value="expired">已过期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="搜索提醒..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery('')}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* 提醒标签页 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="expired">已过期</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredReminders.length > 0 ? (
            filteredReminders.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无提醒</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  当前没有符合条件的提醒。点击上方按钮创建新的提醒事项。
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {filteredReminders.filter(r => r.status === 'pending').length > 0 ? (
            filteredReminders
              .filter(r => r.status === 'pending')
              .map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无待处理提醒</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  当前没有待处理的提醒事项
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {filteredReminders.filter(r => r.status === 'completed').length > 0 ? (
            filteredReminders
              .filter(r => r.status === 'completed')
              .map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无已完成提醒</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  当前没有已完成的提醒事项
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          {filteredReminders.filter(r => r.status === 'expired').length > 0 ? (
            filteredReminders
              .filter(r => r.status === 'expired')
              .map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Clock size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无过期提醒</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  当前没有过期的提醒事项
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 提醒设置卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            <CardTitle>提醒设置</CardTitle>
          </div>
          <CardDescription>配置提醒通知偏好</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-email-notifications">启用邮件通知</Label>
            <Switch id="enable-email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-sms-notifications">启用短信通知</Label>
            <Switch id="enable-sms-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-app-notifications">启用应用内通知</Label>
            <Switch id="enable-app-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="remind-in-advance">提前提醒</Label>
            <Select defaultValue="30">
              <SelectTrigger>
                <SelectValue placeholder="选择提前时间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">准时</SelectItem>
                <SelectItem value="5">提前5分钟</SelectItem>
                <SelectItem value="15">提前15分钟</SelectItem>
                <SelectItem value="30">提前30分钟</SelectItem>
                <SelectItem value="60">提前1小时</SelectItem>
                <SelectItem value="1440">提前1天</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedReminders;