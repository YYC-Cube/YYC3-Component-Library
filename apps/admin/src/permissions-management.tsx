/**
 * @file 权限管理组件
 * @description 提供系统权限的分配、查看和管理功能
 * @module permissions-management
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Users,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  RefreshCcw,
  Download,
  Upload,
  Save,
  X,
  AlertTriangle,
  Eye,
  EyeOff
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Checkbox
} from '@/components/ui/checkbox';
import {
  ScrollArea
} from '@/components/ui/scroll-area';
import {
  Skeleton
} from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// 权限类型定义
type PermissionCategory = 'system' | 'user' | 'department' | 'task' | 'meeting' | 'report' | 'finance' | 'hr';

// 操作类型定义
type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';

// 角色定义
type Role = 'admin' | 'manager' | 'employee' | 'visitor';

// 权限接口
interface Permission {
  id: string;
  name: string;
  code: string;
  category: PermissionCategory;
  action: PermissionAction;
  description: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  applicableRoles: Role[];
  isSystemReserved: boolean;
}

// 角色权限配置接口
interface RolePermissionConfig {
  role: Role;
  permissions: string[];
  description: string;
  isSystemDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 获取权限类别文本
const getCategoryText = (category: PermissionCategory) => {
  switch (category) {
    case 'system':
      return '系统管理';
    case 'user':
      return '用户管理';
    case 'department':
      return '部门管理';
    case 'task':
      return '任务管理';
    case 'meeting':
      return '会议管理';
    case 'report':
      return '报表管理';
    case 'finance':
      return '财务管理';
    case 'hr':
      return '人力资源';
    default:
      return '未知类别';
  }
};

// 获取权限类别颜色
const getCategoryColor = (category: PermissionCategory) => {
  switch (category) {
    case 'system':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    case 'user':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'department':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
    case 'task':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'meeting':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100';
    case 'report':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
    case 'finance':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
    case 'hr':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

// 获取操作文本
const getActionText = (action: PermissionAction) => {
  switch (action) {
    case 'view':
      return '查看';
    case 'create':
      return '创建';
    case 'edit':
      return '编辑';
    case 'delete':
      return '删除';
    case 'manage':
      return '管理';
    default:
      return '未知操作';
  }
};

// 获取角色文本
const getRoleText = (role: Role) => {
  switch (role) {
    case 'admin':
      return '管理员';
    case 'manager':
      return '部门经理';
    case 'employee':
      return '员工';
    case 'visitor':
      return '访客';
    default:
      return '未知角色';
  }
};

// 获取角色颜色
const getRoleColor = (role: Role) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    case 'manager':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'employee':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'visitor':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 权限管理组件
const PermissionsManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionConfig[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'createdAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddPermissionOpen, setIsAddPermissionOpen] = useState(false);
  const [isEditPermissionOpen, setIsEditPermissionOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('permissions');
  const [isRoleEditMode, setIsRoleEditMode] = useState(false);
  const [editedRolePermissions, setEditedRolePermissions] = useState<string[]>([]);

  // 所有角色列表
  const allRoles: Role[] = ['admin', 'manager', 'employee', 'visitor'];

  // 模拟数据和加载效果
  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      // 模拟权限数据
      const mockPermissions: Permission[] = [
        {
          id: '1',
          name: '系统设置管理',
          code: 'system:settings:manage',
          category: 'system',
          action: 'manage',
          description: '管理系统的全局设置和配置',
          isEnabled: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          applicableRoles: ['admin'],
          isSystemReserved: true
        },
        {
          id: '2',
          name: '用户管理',
          code: 'user:manage',
          category: 'user',
          action: 'manage',
          description: '管理所有用户账户和信息',
          isEnabled: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15'),
          applicableRoles: ['admin', 'manager'],
          isSystemReserved: true
        },
        {
          id: '3',
          name: '用户查看',
          code: 'user:view',
          category: 'user',
          action: 'view',
          description: '查看用户信息',
          isEnabled: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          applicableRoles: ['admin', 'manager', 'employee'],
          isSystemReserved: false
        },
        {
          id: '4',
          name: '部门管理',
          code: 'department:manage',
          category: 'department',
          action: 'manage',
          description: '管理部门结构和信息',
          isEnabled: true,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11'),
          applicableRoles: ['admin', 'manager'],
          isSystemReserved: false
        },
        {
          id: '5',
          name: '任务创建',
          code: 'task:create',
          category: 'task',
          action: 'create',
          description: '创建新任务',
          isEnabled: true,
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-12'),
          applicableRoles: ['admin', 'manager', 'employee'],
          isSystemReserved: false
        },
        {
          id: '6',
          name: '任务编辑',
          code: 'task:edit',
          category: 'task',
          action: 'edit',
          description: '编辑任务信息',
          isEnabled: true,
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-20'),
          applicableRoles: ['admin', 'manager', 'employee'],
          isSystemReserved: false
        },
        {
          id: '7',
          name: '任务删除',
          code: 'task:delete',
          category: 'task',
          action: 'delete',
          description: '删除任务',
          isEnabled: true,
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-12'),
          applicableRoles: ['admin', 'manager'],
          isSystemReserved: false
        },
        {
          id: '8',
          name: '会议管理',
          code: 'meeting:manage',
          category: 'meeting',
          action: 'manage',
          description: '管理会议安排和记录',
          isEnabled: true,
          createdAt: new Date('2024-01-13'),
          updatedAt: new Date('2024-01-13'),
          applicableRoles: ['admin', 'manager', 'employee'],
          isSystemReserved: false
        },
        {
          id: '9',
          name: '报表查看',
          code: 'report:view',
          category: 'report',
          action: 'view',
          description: '查看系统生成的报表',
          isEnabled: true,
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14'),
          applicableRoles: ['admin', 'manager'],
          isSystemReserved: false
        },
        {
          id: '10',
          name: '财务查看',
          code: 'finance:view',
          category: 'finance',
          action: 'view',
          description: '查看财务相关信息',
          isEnabled: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          applicableRoles: ['admin', 'manager'],
          isSystemReserved: false
        },
        {
          id: '11',
          name: '人力资源管理',
          code: 'hr:manage',
          category: 'hr',
          action: 'manage',
          description: '管理人力资源相关事务',
          isEnabled: true,
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-16'),
          applicableRoles: ['admin', 'manager'],
          isSystemReserved: false
        },
        {
          id: '12',
          name: '权限管理',
          code: 'permission:manage',
          category: 'system',
          action: 'manage',
          description: '管理系统权限配置',
          isEnabled: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          applicableRoles: ['admin'],
          isSystemReserved: true
        }
      ];

      // 模拟角色权限配置数据
      const mockRolePermissions: RolePermissionConfig[] = [
        {
          role: 'admin',
          permissions: mockPermissions.filter(p => true).map(p => p.id),
          description: '系统管理员，拥有所有权限',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          role: 'manager',
          permissions: mockPermissions.filter(p => 
            p.applicableRoles.includes('manager')
          ).map(p => p.id),
          description: '部门经理，拥有管理部门的权限',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10')
        },
        {
          role: 'employee',
          permissions: mockPermissions.filter(p => 
            p.applicableRoles.includes('employee')
          ).map(p => p.id),
          description: '普通员工，拥有基础操作权限',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-05')
        },
        {
          role: 'visitor',
          permissions: mockPermissions.filter(p => 
            p.action === 'view' && p.applicableRoles.includes('visitor')
          ).map(p => p.id),
          description: '访客，只能查看有限信息',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ];

      setPermissions(mockPermissions);
      setFilteredPermissions(mockPermissions);
      setRolePermissions(mockRolePermissions);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 切换角色编辑模式
  useEffect(() => {
    if (activeTab === 'roles' && rolePermissions.length > 0) {
      const currentRolePerms = rolePermissions.find(rp => rp.role === selectedRole);
      setEditedRolePermissions(currentRolePerms ? [...currentRolePerms.permissions] : []);
    }
  }, [selectedRole, activeTab, rolePermissions]);

  // 筛选和排序权限
  useEffect(() => {
    let result = [...permissions];

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        permission => 
          permission.name.toLowerCase().includes(query) ||
          permission.code.toLowerCase().includes(query) ||
          permission.description.toLowerCase().includes(query)
      );
    }

    // 类别筛选
    if (selectedCategory !== 'all') {
      result = result.filter(permission => permission.category === selectedCategory);
    }

    // 排序
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredPermissions(result);
  }, [permissions, searchQuery, selectedCategory, sortBy, sortDirection]);

  // 处理权限选择
  const handlePermissionSelect = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedPermissions.length === filteredPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(filteredPermissions.map(permission => permission.id));
    }
  };

  // 处理添加权限
  const handleAddPermission = (permissionData: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPermission: Permission = {
      ...permissionData,
      id: `perm-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPermissions(prev => [...prev, newPermission]);
    setIsAddPermissionOpen(false);
  };

  // 处理编辑权限
  const handleEditPermission = (permissionId: string, permissionData: Partial<Permission>) => {
    setPermissions(prev => prev.map(permission => 
      permission.id === permissionId 
        ? { ...permission, ...permissionData, updatedAt: new Date() }
        : permission
    ));
    setIsEditPermissionOpen(false);
    setCurrentPermission(null);
  };

  // 处理删除权限
  const handleDeletePermissions = () => {
    // 过滤掉系统保留的权限
    const removableIds = selectedPermissions.filter(id => {
      const permission = permissions.find(p => p.id === id);
      return permission ? !permission.isSystemReserved : false;
    });

    // 删除权限
    setPermissions(prev => prev.filter(permission => !removableIds.includes(permission.id)));
    
    // 从所有角色权限配置中移除被删除的权限
    setRolePermissions(prev => prev.map(rolePerm => ({
      ...rolePerm,
      permissions: rolePerm.permissions.filter(id => !removableIds.includes(id)),
      updatedAt: new Date()
    })));
    
    setSelectedPermissions([]);
    setIsDeleteConfirmOpen(false);
  };

  // 处理权限状态变更
  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev => prev.map(permission => 
      permission.id === permissionId 
        ? { ...permission, isEnabled: !permission.isEnabled, updatedAt: new Date() }
        : permission
    ));
  };

  // 处理角色权限变更
  const handleRolePermissionToggle = (permissionId: string) => {
    setEditedRolePermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // 保存角色权限配置
  const saveRolePermissions = () => {
    setRolePermissions(prev => prev.map(rolePerm => 
      rolePerm.role === selectedRole 
        ? { ...rolePerm, permissions: [...editedRolePermissions], updatedAt: new Date() }
        : rolePerm
    ));
    setIsRoleEditMode(false);
  };

  // 取消角色权限编辑
  const cancelRolePermissionEdit = () => {
    const currentRolePerms = rolePermissions.find(rp => rp.role === selectedRole);
    setEditedRolePermissions(currentRolePerms ? [...currentRolePerms.permissions] : []);
    setIsRoleEditMode(false);
  };

  // 打开编辑权限对话框
  const openEditDialog = (permission: Permission) => {
    setCurrentPermission(permission);
    setIsEditPermissionOpen(true);
  };

  // 打开删除确认对话框
  const openDeleteConfirm = () => {
    // 检查是否有系统保留的权限被选中
    const hasSystemReserved = selectedPermissions.some(id => {
      const permission = permissions.find(p => p.id === id);
      return permission ? permission.isSystemReserved : false;
    });

    if (hasSystemReserved) {
      // 过滤掉系统保留的权限
      setSelectedPermissions(prev => prev.filter(id => {
        const permission = permissions.find(p => p.id === id);
        return permission ? !permission.isSystemReserved : false;
      }));
      
      if (selectedPermissions.length === 0) {
        return; // 没有可删除的权限
      }
    }

    setIsDeleteConfirmOpen(true);
  };

  // 渲染加载状态
  const renderSkeleton = () => {
    return Array(8).fill(0).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Skeleton className="h-5 w-5 rounded"></Skeleton>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/4"></Skeleton>
          <Skeleton className="h-4 w-2/3"></Skeleton>
        </div>
        <Skeleton className="h-8 w-24"></Skeleton>
      </div>
    ));
  };

  // 渲染权限列表项
  const renderPermissionItem = (permission: Permission) => {
    return (
      <div 
        key={permission.id}
        className={`flex items-center justify-between p-4 mb-3 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md ${
          !permission.isEnabled ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start space-x-4">
          <Checkbox 
            id={`permission-${permission.id}`}
            checked={selectedPermissions.includes(permission.id)}
            onCheckedChange={() => handlePermissionSelect(permission.id)}
            disabled={permission.isSystemReserved}
            className="mt-0.5 data-[state=checked]:bg-primary"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <label 
                htmlFor={`permission-${permission.id}`}
                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.name}
              </label>
              {permission.isSystemReserved && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs">
                  系统保留
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Badge variant="outline" className={`${getCategoryColor(permission.category)} text-xs font-normal`}>
                {getCategoryText(permission.category)}
              </Badge>
              <span>•</span>
              <span>{getActionText(permission.action)}</span>
              <span>•</span>
              <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">
                {permission.code}
              </code>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {permission.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>适用角色: {permission.applicableRoles.map(role => getRoleText(role)).join(', ')}</span>
              <span>更新于: {formatDate(permission.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`toggle-${permission.id}`} className="text-xs text-gray-500 dark:text-gray-400">
              {permission.isEnabled ? '启用' : '禁用'}
            </Label>
            <Switch 
              id={`toggle-${permission.id}`}
              checked={permission.isEnabled}
              onCheckedChange={() => handlePermissionToggle(permission.id)}
              disabled={permission.isSystemReserved}
              aria-label={`${permission.name} 的启用状态`}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">操作</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => openEditDialog(permission)}
                disabled={permission.isSystemReserved}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>编辑权限</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handlePermissionSelect(permission.id) || openDeleteConfirm()}
                className="text-red-600 dark:text-red-400"
                disabled={permission.isSystemReserved}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>删除权限</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  // 渲染角色权限配置
  const renderRolePermissions = () => {
    const currentRoleConfig = rolePermissions.find(rp => rp.role === selectedRole);
    const isSystemDefault = currentRoleConfig?.isSystemDefault || false;

    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getRoleColor(selectedRole)} font-medium`}>
                {getRoleText(selectedRole)}
              </Badge>
              {isSystemDefault && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  系统默认
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isRoleEditMode ? (
                <Button
                  size="sm"
                  onClick={() => setIsRoleEditMode(true)}
                  disabled={selectedRole === 'admin'}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  编辑权限
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelRolePermissionEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveRolePermissions}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {currentRoleConfig?.description}
          </p>
          <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            {isLoading ? (
              renderSkeleton()
            ) : (
              <div className="space-y-3">
                {permissions.map(permission => (
                  <div 
                    key={permission.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox 
                        id={`role-perm-${permission.id}`}
                        checked={editedRolePermissions.includes(permission.id)}
                        onCheckedChange={() => handleRolePermissionToggle(permission.id)}
                        disabled={!isRoleEditMode || selectedRole === 'admin' || !permission.isEnabled}
                        className="data-[state=checked]:bg-primary"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <label 
                            htmlFor={`role-perm-${permission.id}`}
                            className="font-medium text-sm"
                          >
                            {permission.name}
                          </label>
                          <Badge variant="outline" className={`${getCategoryColor(permission.category)} text-xs font-normal`}>
                            {getCategoryText(permission.category)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-6 w-6" />
                权限管理
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                管理系统权限和角色权限配置
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setIsLoading(true) || setTimeout(() => setIsLoading(false), 500)}
              >
                <RefreshCcw className="h-4 w-4" />
                刷新
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Upload className="h-4 w-4" />
                导入
              </Button>
              {activeTab === 'permissions' && (
                <Button
                  className="flex items-center gap-1"
                  onClick={() => setIsAddPermissionOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  添加权限
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 标签页切换 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-xs">
              <TabsTrigger value="permissions">权限列表</TabsTrigger>
              <TabsTrigger value="roles">角色权限配置</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="mt-4">
              {/* 权限列表筛选和搜索 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="搜索权限名称、代码或描述..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类别</SelectItem>
                    <SelectItem value="system">系统管理</SelectItem>
                    <SelectItem value="user">用户管理</SelectItem>
                    <SelectItem value="department">部门管理</SelectItem>
                    <SelectItem value="task">任务管理</SelectItem>
                    <SelectItem value="meeting">会议管理</SelectItem>
                    <SelectItem value="report">报表管理</SelectItem>
                    <SelectItem value="finance">财务管理</SelectItem>
                    <SelectItem value="hr">人力资源</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-permissions" className="text-sm font-medium">排序方式：</Label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger id="sort-permissions" className="flex-1">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">按名称</SelectItem>
                      <SelectItem value="category">按类别</SelectItem>
                      <SelectItem value="createdAt">按创建时间</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        sortDirection === 'asc' ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* 批量操作栏 */}
              {selectedPermissions.length > 0 && (
                <div className="flex items-center justify-between p-3 mb-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedPermissions.length === filteredPermissions.length && filteredPermissions.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="全选"
                    />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                      已选择 {selectedPermissions.length} 个权限
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm"
                      onClick={() => setSelectedPermissions([])}
                    >
                      取消选择
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-sm"
                      onClick={openDeleteConfirm}
                    >
                      批量删除
                    </Button>
                  </div>
                </div>
              )}

              {/* 权限列表 */}
              <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                {isLoading ? (
                  renderSkeleton()
                ) : filteredPermissions.length > 0 ? (
                  filteredPermissions.map(renderPermissionItem)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lock className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到权限</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      没有找到符合当前筛选条件的权限，请尝试调整筛选条件或添加新权限。
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                    >
                      重置筛选条件
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="roles" className="mt-4">
              {/* 角色选择器 */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <Label htmlFor="role-select" className="text-sm font-medium">选择角色：</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={(value) => setSelectedRole(value as Role)}
                  >
                    <SelectTrigger id="role-select" className="w-64">
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {allRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {getRoleText(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRole === 'admin' && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      管理员权限不可修改
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* 角色权限配置 */}
              {renderRolePermissions()}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            共 {permissions.length} 个权限
          </div>
        </CardFooter>
      </Card>

      {/* 添加权限对话框 */}
      <Dialog open={isAddPermissionOpen} onOpenChange={setIsAddPermissionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              添加新权限
            </DialogTitle>
            <DialogDescription>
              创建新的系统权限
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                权限名称
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                权限代码
              </Label>
              <Input id="code" className="col-span-3" placeholder="例如：system:manage" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                所属类别
              </Label>
              <Select defaultValue="system">
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">系统管理</SelectItem>
                  <SelectItem value="user">用户管理</SelectItem>
                  <SelectItem value="department">部门管理</SelectItem>
                  <SelectItem value="task">任务管理</SelectItem>
                  <SelectItem value="meeting">会议管理</SelectItem>
                  <SelectItem value="report">报表管理</SelectItem>
                  <SelectItem value="finance">财务管理</SelectItem>
                  <SelectItem value="hr">人力资源</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="action" className="text-right">
                操作类型
              </Label>
              <Select defaultValue="view">
                <SelectTrigger id="action" className="col-span-3">
                  <SelectValue placeholder="选择操作类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">查看</SelectItem>
                  <SelectItem value="create">创建</SelectItem>
                  <SelectItem value="edit">编辑</SelectItem>
                  <SelectItem value="delete">删除</SelectItem>
                  <SelectItem value="manage">管理</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                权限描述
              </Label>
              <Textarea id="description" className="col-span-3 min-h-[80px]" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enabled" className="text-right">
                启用
              </Label>
              <Switch id="enabled" defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddPermissionOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddPermissionOpen(false)}>
              添加权限
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑权限对话框 */}
      <Dialog open={isEditPermissionOpen} onOpenChange={setIsEditPermissionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              编辑权限
            </DialogTitle>
            <DialogDescription>
              修改权限信息
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                权限名称
              </Label>
              <Input id="edit-name" className="col-span-3" defaultValue={currentPermission?.name} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-code" className="text-right">
                权限代码
              </Label>
              <Input 
                id="edit-code" 
                className="col-span-3" 
                defaultValue={currentPermission?.code}
                disabled={currentPermission?.isSystemReserved}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right mt-2">
                权限描述
              </Label>
              <Textarea 
                id="edit-description" 
                className="col-span-3 min-h-[80px]" 
                defaultValue={currentPermission?.description}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-enabled" className="text-right">
                启用
              </Label>
              <Switch 
                id="edit-enabled" 
                defaultChecked={currentPermission?.isEnabled}
                disabled={currentPermission?.isSystemReserved}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditPermissionOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsEditPermissionOpen(false)}>
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              确认删除
            </DialogTitle>
            <DialogDescription>
              您确定要删除选中的权限吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-100 dark:border-red-900/30 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  删除权限将同时移除所有角色对此权限的访问。请确保此操作不会影响系统的正常使用。
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                将要删除的权限（{selectedPermissions.length}个）：
              </span>
              <ScrollArea className="h-32 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {selectedPermissions.map(id => {
                  const permission = permissions.find(p => p.id === id);
                  return permission ? (
                    <div key={id} className="text-sm text-gray-600 dark:text-gray-400 py-1 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      {permission.name} ({permission.code})
                    </div>
                  ) : null;
                })}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeletePermissions}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsManagement;