/**
 * @file 通知管理组件
 * @description 提供系统通知的展示、筛选、管理和互动功能
 * @module notifications
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Calendar,
  Users,
  Star,
  MessageSquare,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
  User,
  Settings,
  Bell as BellIcon,
  AlertTriangle,
  Gift,
  Activity,
  Plus,
  RefreshCcw
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
  Badge
} from '@/components/ui/badge';
import {
  Label
} from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Checkbox
} from '@/components/ui/checkbox';
import {
  ScrollArea
} from '@/components/ui/scroll-area';
import {
  Skeleton
} from '@/components/ui/skeleton';

// 通知类型定义
type NotificationType = 'system' | 'task' | 'meeting' | 'message' | 'reminder' | 'announcement' | 'achievement';

// 通知优先级定义
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// 通知状态定义
type NotificationStatus = 'read' | 'unread';

// 通知接口
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  isStarred: boolean;
  relatedId?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  actions?: Array<{
    id: string;
    label: string;
    actionType: 'primary' | 'secondary' | 'danger';
  }>;
  metadata?: Record<string, any>;
}

// 获取通知类型图标
const getNotificationIcon = (type: NotificationType, isUnread: boolean) => {
  const baseClasses = isUnread ? 'text-primary' : 'text-gray-500 dark:text-gray-400';
  
  switch (type) {
    case 'system':
      return <Settings className={baseClasses} size={18} />;
    case 'task':
      return <CheckCircle className={baseClasses} size={18} />;
    case 'meeting':
      return <Calendar className={baseClasses} size={18} />;
    case 'message':
      return <MessageSquare className={baseClasses} size={18} />;
    case 'reminder':
      return <Clock className={baseClasses} size={18} />;
    case 'announcement':
      return <Activity className={baseClasses} size={18} />;
    case 'achievement':
      return <Gift className={baseClasses} size={18} />;
    default:
      return <BellIcon className={baseClasses} size={18} />;
  }
};

// 获取通知优先级颜色
const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

// 获取通知优先级文本
const getPriorityText = (priority: NotificationPriority) => {
  switch (priority) {
    case 'urgent':
      return '紧急';
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return '未知';
  }
};

// 格式化时间显示
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths > 0) {
    return `${diffMonths}个月前`;
  } else if (diffWeeks > 0) {
    return `${diffWeeks}周前`;
  } else if (diffDays > 0) {
    return `${diffDays}天前`;
  } else if (diffHours > 0) {
    return `${diffHours}小时前`;
  } else if (diffMins > 0) {
    return `${diffMins}分钟前`;
  } else {
    return '刚刚';
  }
};

// 通知管理组件
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority'>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isMarkAllAsReadOpen, setIsMarkAllAsReadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    system: true,
    task: true,
    meeting: true,
    message: true,
    reminder: true,
    announcement: true,
    achievement: true,
    emailEnabled: true,
    pushEnabled: true,
    soundEnabled: true,
    highPriorityOnly: false
  });

  // 模拟数据和加载效果
  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      const mockData: Notification[] = [
        {
          id: '1',
          type: 'system',
          title: '系统维护通知',
          content: '系统将于明天凌晨2:00-4:00进行例行维护，期间部分功能可能暂时不可用。',
          priority: 'high',
          status: 'unread',
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
          isStarred: false
        },
        {
          id: '2',
          type: 'task',
          title: '任务即将到期',
          content: '您有3个任务将在24小时内到期，请及时处理。',
          priority: 'medium',
          status: 'unread',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
          isStarred: true,
          relatedId: 'task-123',
          actions: [
            { id: 'view', label: '查看任务', actionType: 'primary' },
            { id: 'snooze', label: '稍后提醒', actionType: 'secondary' }
          ]
        },
        {
          id: '3',
          type: 'meeting',
          title: '新会议邀请',
          content: '张三邀请您参加"产品需求评审会议"，明天10:00-12:00在会议室A。',
          priority: 'high',
          status: 'unread',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4小时前
          isStarred: false,
          sender: {
            id: 'user-1',
            name: '张三',
            avatar: 'https://ui-avatars.com/api/?name=张三&background=random'
          },
          relatedId: 'meeting-456',
          actions: [
            { id: 'accept', label: '接受', actionType: 'primary' },
            { id: 'decline', label: '拒绝', actionType: 'danger' },
            { id: 'tentative', label: '暂定', actionType: 'secondary' }
          ]
        },
        {
          id: '4',
          type: 'message',
          title: '收到新消息',
          content: '李四给您发送了一条新消息："请问项目进度如何了？"',
          priority: 'medium',
          status: 'read',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
          readAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          isStarred: false,
          sender: {
            id: 'user-2',
            name: '李四',
            avatar: 'https://ui-avatars.com/api/?name=李四&background=random'
          },
          relatedId: 'message-789',
          actions: [
            { id: 'reply', label: '回复', actionType: 'primary' },
            { id: 'view', label: '查看对话', actionType: 'secondary' }
          ]
        },
        {
          id: '5',
          type: 'reminder',
          title: '日历提醒',
          content: '距离"客户演示会议"还有30分钟，请做好准备。',
          priority: 'urgent',
          status: 'unread',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
          isStarred: false,
          relatedId: 'event-321'
        },
        {
          id: '6',
          type: 'announcement',
          title: '新功能上线通知',
          content: '系统新增了数据分析功能，您可以在"数据看板"中查看详细信息。',
          priority: 'low',
          status: 'read',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
          readAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
          isStarred: false
        },
        {
          id: '7',
          type: 'achievement',
          title: '恭喜！您达成了一个里程碑',
          content: '您已完成100个任务，解锁了"高效达人"徽章！',
          priority: 'low',
          status: 'read',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
          readAt: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000),
          isStarred: true,
          metadata: {
            badgeName: '高效达人',
            badgeIcon: '🏆'
          },
          actions: [
            { id: 'view', label: '查看成就', actionType: 'primary' }
          ]
        },
        {
          id: '8',
          type: 'task',
          title: '任务已分配给您',
          content: '管理员将任务"优化首页性能"分配给您。',
          priority: 'high',
          status: 'read',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4天前
          readAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000),
          isStarred: false,
          relatedId: 'task-456',
          actions: [
            { id: 'view', label: '查看任务', actionType: 'primary' },
            { id: 'complete', label: '标记完成', actionType: 'secondary' }
          ]
        },
        {
          id: '9',
          type: 'system',
          title: '安全提醒',
          content: '您的账户在新设备上登录，请确认是否是您本人操作。',
          priority: 'urgent',
          status: 'unread',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8小时前
          isStarred: false,
          metadata: {
            device: 'MacOS 14.0',
            location: '北京市',
            ip: '192.168.1.1'
          },
          actions: [
            { id: 'confirm', label: '确认是我', actionType: 'primary' },
            { id: 'deny', label: '不是我', actionType: 'danger' }
          ]
        },
        {
          id: '10',
          type: 'meeting',
          title: '会议已更新',
          content: '"周例会"的时间已从周一上午10:00改为周一上午11:00。',
          priority: 'medium',
          status: 'read',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
          readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          isStarred: false,
          relatedId: 'meeting-123'
        }
      ];

      setNotifications(mockData);
      setFilteredNotifications(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 筛选和排序通知
  useEffect(() => {
    let result = [...notifications];

    // 搜索筛选
    if (searchQuery) {
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.sender && item.sender.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 类型筛选
    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType);
    }

    // 优先级筛选
    if (selectedPriority !== 'all') {
      result = result.filter(item => item.priority === selectedPriority);
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'time') {
        return sortDirection === 'asc' 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return sortDirection === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    setFilteredNotifications(result);
  }, [searchQuery, selectedType, selectedPriority, sortBy, sortDirection, notifications]);

  // 标记通知为已读/未读
  const toggleReadStatus = (id: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: item.status === 'read' ? 'unread' as NotificationStatus : 'read' as NotificationStatus,
              readAt: item.status === 'unread' ? new Date() : undefined 
            } 
          : item
      )
    );
  };

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(item => ({
        ...item,
        status: 'read' as NotificationStatus,
        readAt: new Date()
      }))
    );
    setIsMarkAllAsReadOpen(false);
  };

  // 切换星标状态
  const toggleStarred = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isStarred: !item.isStarred }
          : item
      )
    );
  };

  // 选择/取消选择通知
  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(item => item.id));
    }
  };

  // 删除通知
  const deleteNotifications = (ids: string[]) => {
    setNotifications(prev => prev.filter(item => !ids.includes(item.id)));
    setSelectedNotifications([]);
    setIsDeleteConfirmOpen(false);
  };

  // 暂停/恢复通知
  const togglePauseNotifications = () => {
    setIsPaused(!isPaused);
    // 这里可以添加实际的暂停逻辑，如调用API等
  };

  // 处理通知操作
  const handleNotificationAction = (notificationId: string, actionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // 在实际应用中，这里会根据actionId执行相应的操作
    console.log(`Notification ${notificationId}: action ${actionId} clicked`);
    
    // 示例：将操作后的通知标记为已读
    toggleReadStatus(notificationId);
  };

  // 更新通知设置
  const updateNotificationSettings = (key: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  // 通知卡片组件
  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const isUnread = notification.status === 'unread';
    
    return (
      <div 
        className={`
          p-3 rounded-lg border transition-all duration-200
          ${isUnread ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
          ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-gray-900' : ''}
        `}
        onClick={() => toggleReadStatus(notification.id)}
      >
        <div className="flex gap-3">
          {/* 选择框 */}
          <div className="flex-shrink-0 pt-0.5">
            <Checkbox 
              checked={selectedNotifications.includes(notification.id)}
              onCheckedChange={() => toggleSelectNotification(notification.id)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* 图标 */}
          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0`}>
            {getNotificationIcon(notification.type, isUnread)}
          </div>
          
          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h4 className={`font-medium text-sm ${isUnread ? 'text-primary' : ''}`}>
                {notification.title}
                {isUnread && (
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">未读</Badge>
                )}
              </h4>
              <div className="flex items-center gap-1.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={`p-0.5 rounded-full ${notification.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        onClick={(e) => toggleStarred(notification.id, e)}
                      >
                        <Star size={16} fill={notification.isStarred ? 'currentColor' : 'none'} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{notification.isStarred ? '取消星标' : '添加星标'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTimeAgo(notification.createdAt)}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
              {notification.content}
            </p>
            
            <div className="flex flex-wrap gap-1.5 items-center">
              {notification.sender && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User size={12} />
                  <span>{notification.sender.name}</span>
                </div>
              )}
              
              <Badge variant="secondary" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                {getPriorityText(notification.priority)}
              </Badge>
              
              {notification.metadata?.badgeName && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {notification.metadata.badgeIcon} {notification.metadata.badgeName}
                </div>
              )}
            </div>
            
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {notification.actions.map(action => (
                  <button
                    key={action.id}
                    className={`text-xs px-2 py-1 rounded transition-colors ${getActionButtonClass(action.actionType)}`}
                    onClick={(e) => handleNotificationAction(notification.id, action.id, e)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 获取操作按钮样式
  const getActionButtonClass = (actionType: string) => {
    switch (actionType) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'secondary':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700';
      case 'danger':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/40';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
  };

  // 通知卡片骨架屏
  const NotificationSkeleton = () => (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="h-4 w-full rounded mb-2" />
          <Skeleton className="h-4 w-3/4 rounded mb-2" />
          <div className="flex gap-2 mt-1">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BellIcon />
            通知中心
            <Badge className="bg-primary hover:bg-primary">
              {notifications.filter(n => n.status === 'unread').length}
            </Badge>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">管理和查看所有系统通知</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          {/* 暂停/恢复通知 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className={`h-9 w-9 ${isPaused ? 'text-gray-500' : ''}`}
                  onClick={togglePauseNotifications}
                >
                  {isPaused ? <BellOff size={18} /> : <Bell size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPaused ? '恢复通知' : '暂停通知'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* 标记所有已读 */}
          <Dialog open={isMarkAllAsReadOpen} onOpenChange={setIsMarkAllAsReadOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" disabled={!notifications.some(n => n.status === 'unread')}>
                全部已读
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>标记所有为已读</DialogTitle>
                <DialogDescription>
                  确定要将所有通知标记为已读吗？此操作不可撤销。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsMarkAllAsReadOpen(false)}>
                  取消
                </Button>
                <Button onClick={markAllAsRead}>
                  确认
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* 删除选中 */}
          <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={selectedNotifications.length === 0}
              >
                <Trash2 size={16} className="mr-1" />
                删除选中
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>删除通知</DialogTitle>
                <DialogDescription>
                  确定要删除选中的 {selectedNotifications.length} 条通知吗？此操作不可撤销。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>
                  取消
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => deleteNotifications(selectedNotifications)}
                >
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* 通知设置 */}
          <Dialog open={isSettingsOpen} onOpenChange={isSettingsOpen => {
            setIsSettingsOpen(isSettingsOpen);
            // 重置选中状态
            if (!isSettingsOpen) setSelectedNotifications([]);
          }}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <Settings size={16} className="mr-1" />
                设置
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>通知设置</DialogTitle>
                <DialogDescription>
                  自定义您希望接收的通知类型和方式
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">通知类型</h3>
                  
                  <div className="space-y-2">
                    {[
                      { key: 'system' as const, label: '系统通知' },
                      { key: 'task' as const, label: '任务通知' },
                      { key: 'meeting' as const, label: '会议通知' },
                      { key: 'message' as const, label: '消息通知' },
                      { key: 'reminder' as const, label: '提醒通知' },
                      { key: 'announcement' as const, label: '公告通知' },
                      { key: 'achievement' as const, label: '成就通知' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`notify-${key}`}>{label}</Label>
                        <Switch 
                          id={`notify-${key}`}
                          checked={notificationSettings[key]}
                          onCheckedChange={(checked) => updateNotificationSettings(key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">通知方式</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-enabled">电子邮件通知</Label>
                      <Switch 
                        id="email-enabled"
                        checked={notificationSettings.emailEnabled}
                        onCheckedChange={(checked) => updateNotificationSettings('emailEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-enabled">推送通知</Label>
                      <Switch 
                        id="push-enabled"
                        checked={notificationSettings.pushEnabled}
                        onCheckedChange={(checked) => updateNotificationSettings('pushEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-enabled">声音提醒</Label>
                      <Switch 
                        id="sound-enabled"
                        checked={notificationSettings.soundEnabled}
                        onCheckedChange={(checked) => updateNotificationSettings('soundEnabled', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">其他选项</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-priority-only">仅显示高优先级通知</Label>
                    <Switch 
                      id="high-priority-only"
                      checked={notificationSettings.highPriorityOnly}
                      onCheckedChange={(checked) => updateNotificationSettings('highPriorityOnly', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>
                  关闭
                </Button>
                <Button onClick={() => setIsSettingsOpen(false)}>
                  保存设置
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 搜索框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="搜索通知标题、内容或发送者..."
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
        
        {/* 排序和筛选 */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: 'time' | 'priority') => setSortBy(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">按时间</SelectItem>
              <SelectItem value="priority">按优先级</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-gray-600 ${sortDirection === 'desc' ? 'opacity-50' : 'opacity-100'}`}></div>
              <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-600 ${sortDirection === 'asc' ? 'opacity-50' : 'opacity-100'}`}></div>
            </div>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter size={16} />
                <span className="hidden sm:inline">筛选</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <div className="p-3 space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="filter-type">通知类型</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="filter-type" className="w-full">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="system">系统通知</SelectItem>
                      <SelectItem value="task">任务通知</SelectItem>
                      <SelectItem value="meeting">会议通知</SelectItem>
                      <SelectItem value="message">消息通知</SelectItem>
                      <SelectItem value="reminder">提醒通知</SelectItem>
                      <SelectItem value="announcement">公告通知</SelectItem>
                      <SelectItem value="achievement">成就通知</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="filter-priority">优先级</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger id="filter-priority" className="w-full">
                      <SelectValue placeholder="全部优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部优先级</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedPriority('all');
                  }}
                >
                  重置筛选
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 通知列表 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="unread">未读</TabsTrigger>
          <TabsTrigger value="read">已读</TabsTrigger>
          <TabsTrigger value="starred">星标</TabsTrigger>
        </TabsList>
        
        {/* 全选和通知数量 */}
        {(filteredNotifications.length > 0) && (
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={filteredNotifications.length > 0 && selectedNotifications.length === filteredNotifications.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-gray-500">
                共 {filteredNotifications.length} 条通知
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => {
              // 刷新或重新加载通知
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}>
              <RefreshCcw size={16} className="mr-1" />
              刷新
            </Button>
          </div>
        )}
        
        {/* 通知内容区域 */}
        <TabsContent value="all" className="space-y-2 mt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-2">
                {filteredNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BellOff size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无通知</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  当前没有符合条件的通知。{searchQuery || selectedType !== 'all' || selectedPriority !== 'all' ? '请尝试调整筛选条件。' : '系统将在有新通知时通知您。'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="unread" className="space-y-2 mt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : filteredNotifications.filter(n => n.status === 'unread').length > 0 ? (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-2">
                {filteredNotifications
                  .filter(n => n.status === 'unread')
                  .map(notification => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
              </div>
            </ScrollArea>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={48} className="text-green-300 dark:text-green-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">没有未读通知</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  您的所有通知都已阅读。继续关注新通知的到来！
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="read" className="space-y-2 mt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : filteredNotifications.filter(n => n.status === 'read').length > 0 ? (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-2">
                {filteredNotifications
                  .filter(n => n.status === 'read')
                  .map(notification => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
              </div>
            </ScrollArea>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Eye size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">没有已读通知</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  您还没有阅读过任何通知。点击通知可以将其标记为已读。
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="starred" className="space-y-2 mt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : filteredNotifications.filter(n => n.isStarred).length > 0 ? (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-2">
                {filteredNotifications
                  .filter(n => n.isStarred)
                  .map(notification => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
              </div>
            </ScrollArea>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Star size={48} className="text-yellow-300 dark:text-yellow-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">没有星标通知</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  您还没有将任何通知标记为星标。点击通知右上角的星标图标可以将其添加到星标。
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 通知暂停提示 */}
      {isPaused && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2 shadow-lg animate-fade-in">
          <AlertTriangle size={20} className="text-yellow-500" />
          <div className="text-sm">
            <span className="font-medium">通知已暂停</span>
            <p className="text-yellow-600 dark:text-yellow-300">您将不会收到新的通知提醒，点击铃铛图标恢复。</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 ml-2"
            onClick={togglePauseNotifications}
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;