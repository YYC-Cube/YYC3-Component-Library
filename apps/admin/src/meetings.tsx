/**
 * @file 会议管理组件
 * @description 提供会议的创建、查看、编辑、删除和管理功能
 * @module meetings
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  ArrowUpDown,
  Grid,
  List
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
  Input,
  Textarea
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// 会议类型定义
type MeetingType = 'in-person' | 'online' | 'hybrid';

// 会议状态定义
type MeetingStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

// 会议重要性定义
type MeetingImportance = 'low' | 'medium' | 'high';

// 参与者接口
interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'accepted' | 'pending' | 'declined';
}

// 会议接口
interface Meeting {
  id: string;
  title: string;
  description: string;
  type: MeetingType;
  status: MeetingStatus;
  importance: MeetingImportance;
  startTime: Date;
  endTime: Date;
  location: string;
  meetingLink?: string;
  organizer: string;
  participants: Participant[];
  agenda?: string[];
  attachments?: string[];
  recurring: boolean;
  recurrencePattern?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 获取会议类型图标
const getMeetingTypeIcon = (type: MeetingType) => {
  switch (type) {
    case 'in-person':
      return <MapPin size={18} />;
    case 'online':
      return <Video size={18} />;
    case 'hybrid':
      return <Users size={18} />;
    default:
      return <CalendarIcon size={18} />;
  }
};

// 获取会议状态标签
const getStatusBadge = (status: MeetingStatus) => {
  switch (status) {
    case 'scheduled':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          已安排
        </Badge>
      );
    case 'ongoing':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          进行中
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          已完成
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          已取消
        </Badge>
      );
    default:
      return null;
  }
};

// 获取会议重要性颜色
const getImportanceColor = (importance: MeetingImportance) => {
  switch (importance) {
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

// 格式化日期范围
const formatDateRange = (startTime: Date, endTime: Date) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // 计算持续时间（分钟）
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  let durationText = '';
  
  if (durationMinutes < 60) {
    durationText = `${durationMinutes}分钟`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    durationText = `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ''}`;
  }
  
  return `${formatDateTime(start)} - ${formatDateTime(end)} (${durationText})`;
};

// 获取参与者状态标签
const getParticipantStatusBadge = (status: string) => {
  switch (status) {
    case 'accepted':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          已接受
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          待确认
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          已拒绝
        </Badge>
      );
    default:
      return null;
  }
};

// 会议管理组件
const Meetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [sortField, setSortField] = useState<'startTime' | 'title' | 'importance'>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isEditMeetingOpen, setIsEditMeetingOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 新会议表单状态
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    type: 'in-person' as MeetingType,
    importance: 'medium' as MeetingImportance,
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 默认1小时后结束
    location: '',
    meetingLink: '',
    organizer: '当前用户',
    participants: [] as Participant[],
    agenda: [] as string[],
    attachments: [] as string[],
    recurring: false,
    recurrencePattern: 'weekly'
  });

  // 模拟数据初始化
  useEffect(() => {
    const mockParticipants = [
      {
        id: 'p1',
        name: '张三',
        role: '产品经理',
        email: 'zhangsan@example.com',
        status: 'accepted' as const
      },
      {
        id: 'p2',
        name: '李四',
        role: '设计师',
        email: 'lisi@example.com',
        status: 'pending' as const
      },
      {
        id: 'p3',
        name: '王五',
        role: '前端开发',
        email: 'wangwu@example.com',
        status: 'accepted' as const
      },
      {
        id: 'p4',
        name: '赵六',
        role: '后端开发',
        email: 'zhaoliu@example.com',
        status: 'declined' as const
      }
    ];

    const mockData: Meeting[] = [
      {
        id: '1',
        title: '产品需求评审会议',
        description: '讨论新版本的功能需求和实现方案',
        type: 'hybrid',
        status: 'scheduled',
        importance: 'high',
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: '会议室A',
        meetingLink: 'https://meeting.example.com/123',
        organizer: '产品经理',
        participants: mockParticipants,
        agenda: ['需求介绍', '功能讨论', '时间规划', '任务分配'],
        recurring: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: '周例会',
        description: '团队周进度汇报和问题讨论',
        type: 'online',
        status: 'ongoing',
        importance: 'medium',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        endTime: new Date(Date.now() + 30 * 60 * 1000),
        location: '线上会议',
        meetingLink: 'https://meeting.example.com/456',
        organizer: '项目经理',
        participants: mockParticipants.slice(0, 3),
        agenda: ['上周工作总结', '本周工作计划', '问题讨论', '其他事项'],
        recurring: true,
        recurrencePattern: 'weekly',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: '客户演示会议',
        description: '向客户展示产品原型和功能',
        type: 'in-person',
        status: 'scheduled',
        importance: 'high',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000),
        location: '客户办公室',
        organizer: '销售经理',
        participants: [mockParticipants[0], mockParticipants[2]],
        agenda: ['产品演示', '客户反馈', '合作讨论'],
        recurring: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        title: '技术分享会',
        description: '团队内部技术经验分享',
        type: 'online',
        status: 'completed',
        importance: 'low',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        location: '线上会议',
        meetingLink: 'https://meeting.example.com/789',
        organizer: '技术负责人',
        participants: mockParticipants,
        agenda: ['技术分享', 'Q&A环节'],
        recurring: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        title: '项目启动会议',
        description: '新项目启动和团队分工',
        type: 'in-person',
        status: 'cancelled',
        importance: 'high',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        location: '会议室B',
        organizer: '项目经理',
        participants: mockParticipants,
        agenda: ['项目介绍', '团队分工', '时间规划', '风险评估'],
        recurring: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    setMeetings(mockData);
    setFilteredMeetings(mockData);
  }, []);

  // 筛选和排序会议
  useEffect(() => {
    let result = [...meetings];

    // 搜索筛选
    if (searchQuery) {
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.organizer.toLowerCase().includes(searchQuery.toLowerCase())
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

    // 重要性筛选
    if (selectedImportance !== 'all') {
      result = result.filter(item => item.importance === selectedImportance);
    }

    // 排序
    result.sort((a, b) => {
      let compareValue = 0;
      
      if (sortField === 'startTime') {
        compareValue = a.startTime.getTime() - b.startTime.getTime();
      } else if (sortField === 'title') {
        compareValue = a.title.localeCompare(b.title);
      } else if (sortField === 'importance') {
        const importanceOrder = { high: 3, medium: 2, low: 1 };
        compareValue = importanceOrder[b.importance] - importanceOrder[a.importance];
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    setFilteredMeetings(result);
    // 重置到第一页
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedStatus, selectedImportance, sortField, sortDirection, meetings]);

  // 处理排序
  const handleSort = (field: 'startTime' | 'title' | 'importance') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 处理创建新会议
  const handleCreateMeeting = () => {
    if (!newMeeting.title.trim()) return;

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      description: newMeeting.description,
      type: newMeeting.type,
      status: 'scheduled',
      importance: newMeeting.importance,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      location: newMeeting.location,
      meetingLink: newMeeting.meetingLink,
      organizer: newMeeting.organizer,
      participants: newMeeting.participants,
      agenda: newMeeting.agenda,
      attachments: newMeeting.attachments,
      recurring: newMeeting.recurring,
      recurrencePattern: newMeeting.recurrencePattern,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMeetings(prev => [...prev, meeting]);
    setIsNewMeetingOpen(false);
    resetNewMeeting();
  };

  // 重置新会议表单
  const resetNewMeeting = () => {
    setNewMeeting({
      title: '',
      description: '',
      type: 'in-person',
      importance: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      location: '',
      meetingLink: '',
      organizer: '当前用户',
      participants: [],
      agenda: [],
      attachments: [],
      recurring: false,
      recurrencePattern: 'weekly'
    });
  };

  // 处理编辑会议
  const handleEditMeeting = (meeting: Meeting) => {
    setCurrentMeeting(meeting);
    setNewMeeting({
      title: meeting.title,
      description: meeting.description,
      type: meeting.type,
      importance: meeting.importance,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      location: meeting.location,
      meetingLink: meeting.meetingLink || '',
      organizer: meeting.organizer,
      participants: meeting.participants,
      agenda: meeting.agenda || [],
      attachments: meeting.attachments || [],
      recurring: meeting.recurring,
      recurrencePattern: meeting.recurrencePattern || 'weekly'
    });
    setIsEditMeetingOpen(true);
  };

  // 保存编辑后的会议
  const handleSaveEditMeeting = () => {
    if (!currentMeeting || !newMeeting.title.trim()) return;

    const updatedMeeting: Meeting = {
      ...currentMeeting,
      title: newMeeting.title,
      description: newMeeting.description,
      type: newMeeting.type,
      importance: newMeeting.importance,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      location: newMeeting.location,
      meetingLink: newMeeting.meetingLink,
      organizer: newMeeting.organizer,
      participants: newMeeting.participants,
      agenda: newMeeting.agenda,
      attachments: newMeeting.attachments,
      recurring: newMeeting.recurring,
      recurrencePattern: newMeeting.recurrencePattern,
      updatedAt: new Date()
    };

    setMeetings(prev => prev.map(item => item.id === currentMeeting.id ? updatedMeeting : item));
    setIsEditMeetingOpen(false);
    setCurrentMeeting(null);
    resetNewMeeting();
  };

  // 删除会议
  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(item => item.id !== id));
  };

  // 取消会议
  const cancelMeeting = (id: string) => {
    setMeetings(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'cancelled' as MeetingStatus, updatedAt: new Date() }
          : item
      )
    );
  };

  // 标记会议为进行中
  const startMeeting = (id: string) => {
    setMeetings(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'ongoing' as MeetingStatus, updatedAt: new Date() }
          : item
      )
    );
  };

  // 标记会议为已完成
  const completeMeeting = (id: string) => {
    setMeetings(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'completed' as MeetingStatus, updatedAt: new Date() }
          : item
      )
    );
  };

  // 分页处理
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMeetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

  // 会议卡片组件
  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className={`p-1.5 rounded-full bg-primary/10 text-primary flex-shrink-0`}>
              {getMeetingTypeIcon(meeting.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold truncate">{meeting.title}</CardTitle>
                <div className={getImportanceColor(meeting.importance)}>
                  {'●'.repeat(meeting.importance === 'high' ? 3 : meeting.importance === 'medium' ? 2 : 1)}
                </div>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDateRange(meeting.startTime, meeting.endTime)}</span>
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditMeeting(meeting)}>
                <Edit size={14} className="mr-2" />
                编辑会议
              </DropdownMenuItem>
              {meeting.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => startMeeting(meeting.id)}>
                  开始会议
                </DropdownMenuItem>
              )}
              {meeting.status === 'ongoing' && (
                <DropdownMenuItem onClick={() => completeMeeting(meeting.id)}>
                  结束会议
                </DropdownMenuItem>
              )}
              {(meeting.status === 'scheduled' || meeting.status === 'ongoing') && (
                <DropdownMenuItem className="text-red-500" onClick={() => cancelMeeting(meeting.id)}>
                  取消会议
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => deleteMeeting(meeting.id)}>
                <Trash2 size={14} className="mr-2" />
                删除会议
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{meeting.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Users size={12} className="mr-1" />
            {meeting.participants.length} 人
          </Badge>
          <Badge variant="outline" className="text-xs">
            <MapPin size={12} className="mr-1" />
            {meeting.location}
          </Badge>
          {meeting.meetingLink && (
            <Badge variant="outline" className="text-xs">
              <Video size={12} className="mr-1" />
              线上会议
            </Badge>
          )}
          {meeting.recurring && (
            <Badge variant="outline" className="text-xs">
              周期性会议
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {meeting.participants.slice(0, 4).map((participant) => (
            <TooltipProvider key={participant.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="px-2 py-1 text-xs">
                    {participant.name.charAt(0)}
                    {getParticipantStatusBadge(participant.status)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{participant.name} - {participant.role}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {meeting.participants.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{meeting.participants.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 justify-between items-center">
        <div className="flex items-center gap-2">
          {getStatusBadge(meeting.status)}
          <span className="text-xs text-gray-500">组织者: {meeting.organizer}</span>
        </div>
        <div className="flex gap-1">
          {(meeting.status === 'scheduled' || meeting.status === 'ongoing') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1"
              onClick={() => {
                if (meeting.status === 'scheduled') {
                  startMeeting(meeting.id);
                } else {
                  completeMeeting(meeting.id);
                }
              }}
            >
              {meeting.status === 'scheduled' ? (
                <>
                  <Video size={14} />
                  <span className="text-xs">开始</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  <span className="text-xs">结束</span>
                </>
              )}
            </Button>
          )}
          {(meeting.status === 'scheduled' || meeting.status === 'ongoing') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-red-500"
              onClick={() => cancelMeeting(meeting.id)}
            >
              <X size={14} />
              <span className="text-xs">取消</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  // 会议列表项组件
  const MeetingListItem = ({ meeting }: { meeting: Meeting }) => (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <TableCell className="w-[30px]">
        <div className="p-1 rounded-full bg-primary/10 text-primary">
          {getMeetingTypeIcon(meeting.type)}
        </div>
      </TableCell>
      <TableCell className="font-medium">{meeting.title}</TableCell>
      <TableCell className="text-sm">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDateRange(meeting.startTime, meeting.endTime)}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {meeting.location}
        </Badge>
      </TableCell>
      <TableCell>{meeting.participants.length} 人</TableCell>
      <TableCell>{getStatusBadge(meeting.status)}</TableCell>
      <TableCell>
        <div className={getImportanceColor(meeting.importance)}>
          {'●'.repeat(meeting.importance === 'high' ? 3 : meeting.importance === 'medium' ? 2 : 1)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleEditMeeting(meeting)}
          >
            <Edit size={14} />
          </Button>
          {meeting.status === 'scheduled' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => startMeeting(meeting.id)}
            >
              <Video size={14} />
            </Button>
          )}
          {meeting.status === 'ongoing' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => completeMeeting(meeting.id)}
            >
              <CheckCircle size={14} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500"
            onClick={() => deleteMeeting(meeting.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">会议管理</h1>
          <p className="text-gray-500 dark:text-gray-400">创建、查看和管理所有会议</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus size={16} />
                <span>新建会议</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>新建会议</DialogTitle>
                <DialogDescription>设置会议的详细信息和参与者</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label htmlFor="meeting-title">会议标题</Label>
                  <Input
                    id="meeting-title"
                    placeholder="输入会议标题"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-description">会议描述</Label>
                  <Textarea
                    id="meeting-description"
                    placeholder="输入会议描述"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-type">会议类型</Label>
                    <Select
                      value={newMeeting.type}
                      onValueChange={(value) => setNewMeeting({ ...newMeeting, type: value as MeetingType })}
                    >
                      <SelectTrigger id="meeting-type">
                        <SelectValue placeholder="选择会议类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">线下会议</SelectItem>
                        <SelectItem value="online">线上会议</SelectItem>
                        <SelectItem value="hybrid">混合会议</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-importance">重要性</Label>
                    <Select
                      value={newMeeting.importance}
                      onValueChange={(value) =>
                        setNewMeeting({ ...newMeeting, importance: value as MeetingImportance })
                      }
                    >
                      <SelectTrigger id="meeting-importance">
                        <SelectValue placeholder="选择重要性" />
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
                    <Label htmlFor="meeting-start-time">开始时间</Label>
                    <Input
                      id="meeting-start-time"
                      type="datetime-local"
                      value={new Date(newMeeting.startTime).toISOString().slice(0, 16)}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, startTime: new Date(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-end-time">结束时间</Label>
                    <Input
                      id="meeting-end-time"
                      type="datetime-local"
                      value={new Date(newMeeting.endTime).toISOString().slice(0, 16)}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, endTime: new Date(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-location">地点</Label>
                  <Input
                    id="meeting-location"
                    placeholder="输入会议地点"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  />
                </div>
                {(newMeeting.type === 'online' || newMeeting.type === 'hybrid') && (
                  <div className="space-y-2">
                    <Label htmlFor="meeting-link">会议链接</Label>
                    <Input
                      id="meeting-link"
                      placeholder="输入会议链接"
                      value={newMeeting.meetingLink}
                      onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="meeting-organizer">组织者</Label>
                  <Input
                    id="meeting-organizer"
                    placeholder="输入组织者姓名"
                    value={newMeeting.organizer}
                    onChange={(e) => setNewMeeting({ ...newMeeting, organizer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>周期性会议</Label>
                    <Switch
                      checked={newMeeting.recurring}
                      onCheckedChange={(checked) =>
                        setNewMeeting({ ...newMeeting, recurring: checked })
                      }
                    />
                  </div>
                  {newMeeting.recurring && (
                    <Select
                      value={newMeeting.recurrencePattern}
                      onValueChange={(value) =>
                        setNewMeeting({ ...newMeeting, recurrencePattern: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择重复周期" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">每天</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                        <SelectItem value="yearly">每年</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsNewMeetingOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateMeeting}>创建会议</Button>
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
                  <Label htmlFor="filter-meeting-type">会议类型</Label>
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger id="filter-meeting-type" className="w-full">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="in-person">线下会议</SelectItem>
                      <SelectItem value="online">线上会议</SelectItem>
                      <SelectItem value="hybrid">混合会议</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="filter-meeting-status">状态</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger id="filter-meeting-status" className="w-full">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="scheduled">已安排</SelectItem>
                      <SelectItem value="ongoing">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="filter-meeting-importance">重要性</Label>
                  <Select
                    value={selectedImportance}
                    onValueChange={setSelectedImportance}
                  >
                    <SelectTrigger id="filter-meeting-importance" className="w-full">
                      <SelectValue placeholder="全部重要性" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部重要性</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'card' ? 'default' : 'secondary'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('card')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'secondary'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="搜索会议标题、描述、地点或组织者..."
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

      {/* 会议标签页 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="scheduled">已安排</TabsTrigger>
          <TabsTrigger value="ongoing">进行中</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="cancelled">已取消</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {currentItems.length > 0 ? (
            <>
              {viewMode === 'card' ? (
                currentItems.map(meeting => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead onClick={() => handleSort('title')} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex items-center gap-1">
                            <span>标题</span>
                            {sortField === 'title' && <ArrowUpDown size={14} />}
                          </div>
                        </TableHead>
                        <TableHead onClick={() => handleSort('startTime')} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex items-center gap-1">
                            <span>时间</span>
                            {sortField === 'startTime' && <ArrowUpDown size={14} />}
                          </div>
                        </TableHead>
                        <TableHead>地点</TableHead>
                        <TableHead>参与人数</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead onClick={() => handleSort('importance')} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex items-center gap-1">
                            <span>重要性</span>
                            {sortField === 'importance' && <ArrowUpDown size={14} />}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map(meeting => (
                        <MeetingListItem key={meeting.id} meeting={meeting} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* 分页控制 */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    显示 {indexOfFirstItem + 1} 到 {Math.min(indexOfLastItem, filteredMeetings.length)} 条，共 {filteredMeetings.length} 条
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无会议</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  当前没有符合条件的会议。点击上方按钮创建新的会议。
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* 其他状态的标签页内容，结构类似 */}
        {['scheduled', 'ongoing', 'completed', 'cancelled'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filteredMeetings.filter(m => m.status === status).length > 0 ? (
              viewMode === 'card' ? (
                filteredMeetings
                  .filter(m => m.status === status)
                  .map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead>标题</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>地点</TableHead>
                        <TableHead>参与人数</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>重要性</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMeetings
                        .filter(m => m.status === status)
                        .map(meeting => (
                          <MeetingListItem key={meeting.id} meeting={meeting} />
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    暂无{status === 'scheduled' ? '已安排' : status === 'ongoing' ? '进行中' : status === 'completed' ? '已完成' : '已取消'}会议
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    当前没有{status === 'scheduled' ? '已安排' : status === 'ongoing' ? '进行中' : status === 'completed' ? '已完成' : '已取消'}的会议
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* 编辑会议对话框 */}
      <Dialog open={isEditMeetingOpen} onOpenChange={setIsEditMeetingOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>编辑会议</DialogTitle>
            <DialogDescription>修改会议的详细信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="edit-meeting-title">会议标题</Label>
              <Input
                id="edit-meeting-title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-meeting-description">会议描述</Label>
              <Textarea
                id="edit-meeting-description"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-meeting-type">会议类型</Label>
                <Select
                  value={newMeeting.type}
                  onValueChange={(value) => setNewMeeting({ ...newMeeting, type: value as MeetingType })}
                >
                  <SelectTrigger id="edit-meeting-type">
                    <SelectValue placeholder="选择会议类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">线下会议</SelectItem>
                    <SelectItem value="online">线上会议</SelectItem>
                    <SelectItem value="hybrid">混合会议</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-meeting-importance">重要性</Label>
                <Select
                  value={newMeeting.importance}
                  onValueChange={(value) =>
                    setNewMeeting({ ...newMeeting, importance: value as MeetingImportance })
                  }
                >
                  <SelectTrigger id="edit-meeting-importance">
                    <SelectValue placeholder="选择重要性" />
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
                <Label htmlFor="edit-meeting-start-time">开始时间</Label>
                <Input
                  id="edit-meeting-start-time"
                  type="datetime-local"
                  value={new Date(newMeeting.startTime).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, startTime: new Date(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-meeting-end-time">结束时间</Label>
                <Input
                  id="edit-meeting-end-time"
                  type="datetime-local"
                  value={new Date(newMeeting.endTime).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, endTime: new Date(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-meeting-location">地点</Label>
              <Input
                id="edit-meeting-location"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              />
            </div>
            {(newMeeting.type === 'online' || newMeeting.type === 'hybrid') && (
              <div className="space-y-2">
                <Label htmlFor="edit-meeting-link">会议链接</Label>
                <Input
                  id="edit-meeting-link"
                  value={newMeeting.meetingLink}
                  onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setIsEditMeetingOpen(false);
              setCurrentMeeting(null);
              resetNewMeeting();
            }}>
              取消
            </Button>
            <Button onClick={handleSaveEditMeeting}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;