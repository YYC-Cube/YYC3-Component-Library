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
const getCategoryText = (category: PermissionCategory) =\u003e {
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
const getCategoryColor = (category: PermissionCategory) =\u003e {
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
const getActionText = (action: PermissionAction) =\u003e {
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
const getRoleText = (role: Role) =\u003e {
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
const getRoleColor = (role: Role) =\u003e {
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
const formatDate = (date: Date) =\u003e {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 权限管理组件
const PermissionsManagement: React.FC = () =\u003e {
  const [permissions, setPermissions] = useState\u003cPermission[]\u003e([]);
  const [rolePermissions, setRolePermissions] = useState\u003cRolePermissionConfig[]\u003e([]);
  const [filteredPermissions, setFilteredPermissions] = useState\u003cPermission[]\u003e([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState\u003cstring\u003e('all');
  const [selectedRole, setSelectedRole] = useState\u003cRole\u003e('admin');
  const [sortBy, setSortBy] = useState\u003c'name' | 'category' | 'createdAt'\u003e('name');
  const [sortDirection, setSortDirection] = useState\u003c'asc' | 'desc'\u003e('asc');
  const [isAddPermissionOpen, setIsAddPermissionOpen] = useState(false);
  const [isEditPermissionOpen, setIsEditPermissionOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState\u003cstring[]\u003e([]);
  const [currentPermission, setCurrentPermission] = useState\u003cPermission | null\u003e(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('permissions');
  const [isRoleEditMode, setIsRoleEditMode] = useState(false);
  const [editedRolePermissions, setEditedRolePermissions] = useState\u003cstring[]\u003e([]);

  // 所有角色列表
  const allRoles: Role[] = ['admin', 'manager', 'employee', 'visitor'];

  // 模拟数据和加载效果
  useEffect(() =\u003e {
    // 模拟加载延迟
    const timer = setTimeout(() =\u003e {
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
          permissions: mockPermissions.filter(p =\u003e true).map(p =\u003e p.id),
          description: '系统管理员，拥有所有权限',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          role: 'manager',
          permissions: mockPermissions.filter(p =\u003e 
            p.applicableRoles.includes('manager')
          ).map(p =\u003e p.id),
          description: '部门经理，拥有管理部门的权限',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10')
        },
        {
          role: 'employee',
          permissions: mockPermissions.filter(p =\u003e 
            p.applicableRoles.includes('employee')
          ).map(p =\u003e p.id),
          description: '普通员工，拥有基础操作权限',
          isSystemDefault: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-05')
        },
        {
          role: 'visitor',
          permissions: mockPermissions.filter(p =\u003e 
            p.action === 'view' \u0026\u0026 p.applicableRoles.includes('visitor')
          ).map(p =\u003e p.id),
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

    return () =\u003e clearTimeout(timer);
  }, []);

  // 切换角色编辑模式
  useEffect(() =\u003e {
    if (activeTab === 'roles' \u0026\u0026 rolePermissions.length \u003e 0) {
      const currentRolePerms = rolePermissions.find(rp =\u003e rp.role === selectedRole);
      setEditedRolePermissions(currentRolePerms ? [...currentRolePerms.permissions] : []);
    }
  }, [selectedRole, activeTab, rolePermissions]);

  // 筛选和排序权限
  useEffect(() =\u003e {
    let result = [...permissions];

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        permission =\u003e 
          permission.name.toLowerCase().includes(query) ||
          permission.code.toLowerCase().includes(query) ||
          permission.description.toLowerCase().includes(query)
      );
    }

    // 类别筛选
    if (selectedCategory !== 'all') {
      result = result.filter(permission =\u003e permission.category === selectedCategory);
    }

    // 排序
    result.sort((a, b) =\u003e {
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
  const handlePermissionSelect = (permissionId: string) =\u003e {
    setSelectedPermissions(prev =\u003e
      prev.includes(permissionId) 
        ? prev.filter(id =\u003e id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // 处理全选
  const handleSelectAll = () =\u003e {
    if (selectedPermissions.length === filteredPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(filteredPermissions.map(permission =\u003e permission.id));
    }
  };

  // 处理添加权限
  const handleAddPermission = (permissionData: Omit\u003cPermission, 'id' | 'createdAt' | 'updatedAt'\u003e) =\u003e {
    const newPermission: Permission = {
      ...permissionData,
      id: `perm-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPermissions(prev =\u003e [...prev, newPermission]);
    setIsAddPermissionOpen(false);
  };

  // 处理编辑权限
  const handleEditPermission = (permissionId: string, permissionData: Partial\u003cPermission\u003e) =\u003e {
    setPermissions(prev =\u003e prev.map(permission =\u003e 
      permission.id === permissionId 
        ? { ...permission, ...permissionData, updatedAt: new Date() }
        : permission
    ));
    setIsEditPermissionOpen(false);
    setCurrentPermission(null);
  };

  // 处理删除权限
  const handleDeletePermissions = () =\u003e {
    // 过滤掉系统保留的权限
    const removableIds = selectedPermissions.filter(id =\u003e {
      const permission = permissions.find(p =\u003e p.id === id);
      return permission ? !permission.isSystemReserved : false;
    });

    // 删除权限
    setPermissions(prev =\u003e prev.filter(permission =\u003e !removableIds.includes(permission.id)));
    
    // 从所有角色权限配置中移除被删除的权限
    setRolePermissions(prev =\u003e prev.map(rolePerm =\u003e ({
      ...rolePerm,
      permissions: rolePerm.permissions.filter(id =\u003e !removableIds.includes(id)),
      updatedAt: new Date()
    })));
    
    setSelectedPermissions([]);
    setIsDeleteConfirmOpen(false);
  };

  // 处理权限状态变更
  const handlePermissionToggle = (permissionId: string) =\u003e {
    setPermissions(prev =\u003e prev.map(permission =\u003e 
      permission.id === permissionId 
        ? { ...permission, isEnabled: !permission.isEnabled, updatedAt: new Date() }
        : permission
    ));
  };

  // 处理角色权限变更
  const handleRolePermissionToggle = (permissionId: string) =\u003e {
    setEditedRolePermissions(prev =\u003e
      prev.includes(permissionId)
        ? prev.filter(id =\u003e id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // 保存角色权限配置
  const saveRolePermissions = () =\u003e {
    setRolePermissions(prev =\u003e prev.map(rolePerm =\u003e 
      rolePerm.role === selectedRole 
        ? { ...rolePerm, permissions: [...editedRolePermissions], updatedAt: new Date() }
        : rolePerm
    ));
    setIsRoleEditMode(false);
  };

  // 取消角色权限编辑
  const cancelRolePermissionEdit = () =\u003e {
    const currentRolePerms = rolePermissions.find(rp =\u003e rp.role === selectedRole);
    setEditedRolePermissions(currentRolePerms ? [...currentRolePerms.permissions] : []);
    setIsRoleEditMode(false);
  };

  // 打开编辑权限对话框
  const openEditDialog = (permission: Permission) =\u003e {
    setCurrentPermission(permission);
    setIsEditPermissionOpen(true);
  };

  // 打开删除确认对话框
  const openDeleteConfirm = () =\u003e {
    // 检查是否有系统保留的权限被选中
    const hasSystemReserved = selectedPermissions.some(id =\u003e {
      const permission = permissions.find(p =\u003e p.id === id);
      return permission ? permission.isSystemReserved : false;
    });

    if (hasSystemReserved) {
      // 过滤掉系统保留的权限
      setSelectedPermissions(prev =\u003e prev.filter(id =\u003e {
        const permission = permissions.find(p =\u003e p.id === id);
        return permission ? !permission.isSystemReserved : false;
      }));
      
      if (selectedPermissions.length === 0) {
        return; // 没有可删除的权限
      }
    }

    setIsDeleteConfirmOpen(true);
  };

  // 渲染加载状态
  const renderSkeleton = () =\u003e {
    return Array(8).fill(0).map((_, index) =\u003e (
      \u003cdiv key={index} className="flex items-center space-x-4 p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"\u003e
        \u003cSkeleton className="h-5 w-5 rounded"\u003e\u003c/Skeleton\u003e
        \u003cdiv className="flex-1 space-y-2"\u003e
          \u003cSkeleton className="h-5 w-1/4"\u003e\u003c/Skeleton\u003e
          \u003cSkeleton className="h-4 w-2/3"\u003e\u003c/Skeleton\u003e
        \u003c/div\u003e
        \u003cSkeleton className="h-8 w-24"\u003e\u003c/Skeleton\u003e
      \u003c/div\u003e
    ));
  };

  // 渲染权限列表项
  const renderPermissionItem = (permission: Permission) =\u003e {
    return (
      \u003cdiv 
        key={permission.id}
        className={`flex items-center justify-between p-4 mb-3 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md ${
          !permission.isEnabled ? 'opacity-60' : ''
        }`}
      \u003e
        \u003cdiv className="flex items-start space-x-4"\u003e
          \u003cCheckbox 
            id={`permission-${permission.id}`}
            checked={selectedPermissions.includes(permission.id)}
            onCheckedChange={() =\u003e handlePermissionSelect(permission.id)}
            disabled={permission.isSystemReserved}
            className="mt-0.5 data-[state=checked]:bg-primary"
          /\u003e
          \u003cdiv className="space-y-1 flex-1"\u003e
            \u003cdiv className="flex items-center gap-2"\u003e
              \u003clabel 
                htmlFor={`permission-${permission.id}`}
                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              \u003e
                {permission.name}
              \u003c/label\u003e
              {permission.isSystemReserved \u0026\u0026 (
                \u003cBadge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs"\u003e
                  系统保留
                \u003c/Badge\u003e
              )}
            \u003c/div\u003e
            \u003cdiv className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1"\u003e
              \u003cBadge variant="outline" className={`${getCategoryColor(permission.category)} text-xs font-normal`}\u003e
                {getCategoryText(permission.category)}
              \u003c/Badge\u003e
              \u003cspan\u003e•\u003c/span\u003e
              \u003cspan\u003e{getActionText(permission.action)}\u003c/span\u003e
              \u003cspan\u003e•\u003c/span\u003e
              \u003ccode className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono"\u003e
                {permission.code}
              \u003c/code\u003e
            \u003c/div\u003e
            \u003cp className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2"\u003e
              {permission.description}
            \u003c/p\u003e
            \u003cdiv className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1"\u003e
              \u003cspan\u003e适用角色: {permission.applicableRoles.map(role =\u003e getRoleText(role)).join(', ')}\u003c/span\u003e
              \u003cspan\u003e更新于: {formatDate(permission.updatedAt)}\u003c/span\u003e
            \u003c/div\u003e
          \u003c/div\u003e
        \u003c/div\u003e

        \u003cdiv className="flex flex-col items-end space-y-2"\u003e
          \u003cdiv className="flex items-center gap-2"\u003e
            \u003cLabel htmlFor={`toggle-${permission.id}`} className="text-xs text-gray-500 dark:text-gray-400"\u003e
              {permission.isEnabled ? '启用' : '禁用'}
            \u003c/Label\u003e
            \u003cSwitch 
              id={`toggle-${permission.id}`}
              checked={permission.isEnabled}
              onCheckedChange={() =\u003e handlePermissionToggle(permission.id)}
              disabled={permission.isSystemReserved}
              aria-label={`${permission.name} 的启用状态`}
            /\u003e
          \u003c/div\u003e

          \u003cDropdownMenu\u003e
            \u003cDropdownMenuTrigger asChild\u003e
              \u003cButton variant="ghost" size="icon" className="h-8 w-8"\u003e
                \u003cMoreHorizontal className="h-4 w-4" /\u003e
                \u003cspan className="sr-only"\u003e操作\u003c/span\u003e
              \u003c/Button\u003e
            \u003c/DropdownMenuTrigger\u003e
            \u003cDropdownMenuContent align="end" className="w-48"\u003e
              \u003cDropdownMenuItem 
                onClick={() =\u003e openEditDialog(permission)}
                disabled={permission.isSystemReserved}
              \u003e
                \u003cEdit className="mr-2 h-4 w-4" /\u003e
                \u003cspan\u003e编辑权限\u003c/span\u003e
              \u003c/DropdownMenuItem\u003e
              \u003cDropdownMenuSeparator /\u003e
              \u003cDropdownMenuItem 
                onClick={() =\u003e handlePermissionSelect(permission.id) || openDeleteConfirm()}
                className="text-red-600 dark:text-red-400"
                disabled={permission.isSystemReserved}
              \u003e
                \u003cTrash2 className="mr-2 h-4 w-4" /\u003e
                \u003cspan\u003e删除权限\u003c/span\u003e
              \u003c/DropdownMenuItem\u003e
            \u003c/DropdownMenuContent\u003e
          \u003c/DropdownMenu\u003e
        \u003c/div\u003e
      \u003c/div\u003e
    );
  };

  // 渲染角色权限配置
  const renderRolePermissions = () =\u003e {
    const currentRoleConfig = rolePermissions.find(rp =\u003e rp.role === selectedRole);
    const isSystemDefault = currentRoleConfig?.isSystemDefault || false;

    return (
      \u003cCard className="mt-4"\u003e
        \u003cCardHeader className="pb-2"\u003e
          \u003cdiv className="flex items-center justify-between"\u003e
            \u003cdiv className="flex items-center gap-2"\u003e
              \u003cBadge variant="outline" className={`${getRoleColor(selectedRole)} font-medium`}\u003e
                {getRoleText(selectedRole)}
              \u003c/Badge\u003e
              {isSystemDefault \u0026\u0026 (
                \u003cBadge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"\u003e
                  系统默认
                \u003c/Badge\u003e
              )}
            \u003c/div\u003e
            \u003cdiv className="flex items-center gap-2"\u003e
              {!isRoleEditMode ? (
                \u003cButton
                  size="sm"
                  onClick={() =\u003e setIsRoleEditMode(true)}
                  disabled={selectedRole === 'admin'}
                \u003e
                  \u003cEdit className="h-4 w-4 mr-1" /\u003e
                  编辑权限
                \u003c/Button\u003e
              ) : (
                \u003e
                  \u003cButton
                    size="sm"
                    variant="ghost"
                    onClick={cancelRolePermissionEdit}
                  \u003e
                    \u003cX className="h-4 w-4 mr-1" /\u003e
                    取消
                  \u003c/Button\u003e
                  \u003cButton
                    size="sm"
                    onClick={saveRolePermissions}
                  \u003e
                    \u003cSave className="h-4 w-4 mr-1" /\u003e
                    保存
                  \u003c/Button\u003e
                \u003e
              )}
            \u003c/div\u003e
          \u003c/div\u003e
        \u003c/CardHeader\u003e
        \u003cCardContent\u003e
          \u003cp className="text-sm text-gray-500 dark:text-gray-400 mb-4"\u003e
            {currentRoleConfig?.description}
          \u003c/p\u003e
          \u003cScrollArea className="h-[calc(100vh-400px)] pr-4"\u003e
            {isLoading ? (
              renderSkeleton()
            ) : (
              \u003ediv className="space-y-3"\u003e
                {permissions.map(permission =\u003e (
                  \u003cdiv 
                    key={permission.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  \u003e
                    \u003cdiv className="flex items-center gap-3 flex-1"\u003e
                      \u003cCheckbox 
                        id={`role-perm-${permission.id}`}
                        checked={editedRolePermissions.includes(permission.id)}
                        onCheckedChange={() =\u003e handleRolePermissionToggle(permission.id)}
                        disabled={!isRoleEditMode || selectedRole === 'admin' || !permission.isEnabled}
                        className="data-[state=checked]:bg-primary"
                      /\u003e
                      \u003cdiv className="space-y-1 flex-1"\u003e
                        \u003cdiv className="flex items-center gap-2"\u003e
                          \u003clabel 
                            htmlFor={`role-perm-${permission.id}`}
                            className="font-medium text-sm"
                          \u003e
                            {permission.name}
                          \u003c/label\u003e
                          \u003cBadge variant="outline" className={`${getCategoryColor(permission.category)} text-xs font-normal`}\u003e
                            {getCategoryText(permission.category)}
                          \u003c/Badge\u003e
                        \u003c/div\u003e
                        \u003cp className="text-xs text-gray-500 dark:text-gray-400"\u003e
                          {permission.description}
                        \u003c/p\u003e
                      \u003c/div\u003e
                    \u003c/div\u003e
                  \u003c/div\u003e
                ))}
              \u003c/div\u003e
            )}
          \u003c/ScrollArea\u003e
        \u003c/CardContent\u003e
      \u003c/Card\u003e
    );
  };

  return (
    \u003cdiv className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6"\u003e
      \u003cCard className="max-w-7xl mx-auto"\u003e
        \u003cCardHeader className="pb-2"\u003e
          \u003cdiv className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"\u003e
            \u003cdiv\u003e
              \u003cCardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"\u003e
                \u003cShield className="h-6 w-6" /\u003e
                权限管理
              \u003c/CardTitle\u003e
              \u003cCardDescription className="text-gray-500 dark:text-gray-400"\u003e
                管理系统权限和角色权限配置
              \u003c/CardDescription\u003e
            \u003c/div\u003e
            \u003cdiv className="flex flex-wrap gap-2"\u003e
              \u003cButton
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() =\u003e setIsLoading(true) || setTimeout(() =\u003e setIsLoading(false), 500)}
              \u003e
                \u003cRefreshCcw className="h-4 w-4" /\u003e
                刷新
              \u003c/Button\u003e
              \u003cButton
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              \u003e
                \u003cDownload className="h-4 w-4" /\u003e
                导出
              \u003c/Button\u003e
              \u003cButton
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              \u003e
                \u003cUpload className="h-4 w-4" /\u003e
                导入
              \u003c/Button\u003e
              {activeTab === 'permissions' \u0026\u0026 (
                \u003cButton
                  className="flex items-center gap-1"
                  onClick={() =\u003e setIsAddPermissionOpen(true)}
                \u003e
                  \u003cPlus className="h-4 w-4" /\u003e
                  添加权限
                \u003c/Button\u003e
              )}
            \u003c/div\u003e
          \u003c/div\u003e
        \u003c/CardHeader\u003e

        \u003cCardContent\u003e
          {/* 标签页切换 */}
          \u003cTabs value={activeTab} onValueChange={setActiveTab} className="mb-6"\u003e
            \u003cTabsList className="grid grid-cols-2 w-full max-w-xs"\u003e
              \u003cTabsTrigger value="permissions"\u003e权限列表\u003c/TabsTrigger\u003e
              \u003cTabsTrigger value="roles"\u003e角色权限配置\u003c/TabsTrigger\u003e
            \u003c/TabsList\u003e

            \u003cTabsContent value="permissions" className="mt-4"\u003e
              {/* 权限列表筛选和搜索 */}
              \u003cdiv className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"\u003e
                \u003cdiv className="relative"\u003e
                  \u003cSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" /\u003e
                  \u003cInput
                    placeholder="搜索权限名称、代码或描述..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) =\u003e setSearchQuery(e.target.value)}
                  /\u003e
                \u003c/div\u003e

                \u003cSelect value={selectedCategory} onValueChange={setSelectedCategory}\u003e
                  \u003cSelectTrigger className="w-full"\u003e
                    \u003cSelectValue placeholder="选择类别" /\u003e
                  \u003c/SelectTrigger\u003e
                  \u003cSelectContent\u003e
                    \u003cSelectItem value="all"\u003e所有类别\u003c/SelectItem\u003e
                    \u003cSelectItem value="system"\u003e系统管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="user"\u003e用户管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="department"\u003e部门管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="task"\u003e任务管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="meeting"\u003e会议管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="report"\u003e报表管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="finance"\u003e财务管理\u003c/SelectItem\u003e
                    \u003cSelectItem value="hr"\u003e人力资源\u003c/SelectItem\u003e
                  \u003c/SelectContent\u003e
                \u003c/Select\u003e

                \u003cdiv className="flex items-center gap-2"\u003e
                  \u003cLabel htmlFor="sort-permissions" className="text-sm font-medium"\u003e排序方式：\u003c/Label\u003e
                  \u003cSelect value={sortBy} onValueChange={(value) =\u003e setSortBy(value as any)}\u003e
                    \u003cSelectTrigger id="sort-permissions" className="flex-1"\u003e
                      \u003cSelectValue placeholder="排序方式" /\u003e
                    \u003c/SelectTrigger\u003e
                    \u003cSelectContent\u003e
                      \u003cSelectItem value="name"\u003e按名称\u003c/SelectItem\u003e
                      \u003cSelectItem value="category"\u003e按类别\u003c/SelectItem\u003e
                      \u003cSelectItem value="createdAt"\u003e按创建时间\u003c/SelectItem\u003e
                    \u003c/SelectContent\u003e
                  \u003c/Select\u003e
                  \u003cButton
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() =\u003e setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  \u003e
                    \u003cChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        sortDirection === 'asc' ? 'rotate-180' : ''
                      }`}
                    /\u003e
                  \u003c/Button\u003e
                \u003c/div\u003e
              \u003c/div\u003e

              {/* 批量操作栏 */}
              {selectedPermissions.length \u003e 0 \u0026\u0026 (
                \u003cdiv className="flex items-center justify-between p-3 mb-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/30"\u003e
                  \u003cdiv className="flex items-center gap-2"\u003e
                    \u003cCheckbox 
                      checked={selectedPermissions.length === filteredPermissions.length \u0026\u0026 filteredPermissions.length \u003e 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="全选"
                    /\u003e
                    \u003cspan className="text-sm font-medium text-blue-800 dark:text-blue-400"\u003e
                      已选择 {selectedPermissions.length} 个权限
                    \u003c/span\u003e
                  \u003c/div\u003e
                  \u003cdiv className="flex items-center gap-2"\u003e
                    \u003cButton
                      variant="ghost"
                      size="sm"
                      className="text-sm"
                      onClick={() =\u003e setSelectedPermissions([])}
                    \u003e
                      取消选择
                    \u003c/Button\u003e
                    \u003cButton
                      variant="destructive"
                      size="sm"
                      className="text-sm"
                      onClick={openDeleteConfirm}
                    \u003e
                      批量删除
                    \u003c/Button\u003e
                  \u003c/div\u003e
                \u003c/div\u003e
              )}

              {/* 权限列表 */}
              \u003cScrollArea className="h-[calc(100vh-350px)] pr-4"\u003e
                {isLoading ? (
                  renderSkeleton()
                ) : filteredPermissions.length \u003e 0 ? (
                  filteredPermissions.map(renderPermissionItem)
                ) : (
                  \u003cdiv className="flex flex-col items-center justify-center py-12 text-center"\u003e
                    \u003cLock className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" /\u003e
                    \u003ch3 className="text-lg font-medium text-gray-900 dark:text-white mb-1"\u003e未找到权限\u003c/h3\u003e
                    \u003cp className="text-gray-500 dark:text-gray-400 max-w-md"\u003e
                      没有找到符合当前筛选条件的权限，请尝试调整筛选条件或添加新权限。
                    \u003c/p\u003e
                    \u003cButton
                      className="mt-4"
                      onClick={() =\u003e {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                    \u003e
                      重置筛选条件
                    \u003c/Button\u003e
                  \u003c/div\u003e
                )}
              \u003c/ScrollArea\u003e
            \u003c/TabsContent\u003e

            \u003cTabsContent value="roles" className="mt-4"\u003e
              {/* 角色选择器 */}
              \u003cdiv className="mb-6"\u003e
                \u003cdiv className="flex items-center gap-4"\u003e
                  \u003cLabel htmlFor="role-select" className="text-sm font-medium"\u003e选择角色：\u003c/Label\u003e
                  \u003cSelect 
                    value={selectedRole} 
                    onValueChange={(value) =\u003e setSelectedRole(value as Role)}
                  \u003e
                    \u003cSelectTrigger id="role-select" className="w-64"\u003e
                      \u003cSelectValue placeholder="选择角色" /\u003e
                    \u003c/SelectTrigger\u003e
                    \u003cSelectContent\u003e
                      {allRoles.map(role =\u003e (
                        \u003cSelectItem key={role} value={role}\u003e
                          {getRoleText(role)}
                        \u003c/SelectItem\u003e
                      ))}
                    \u003c/SelectContent\u003e
                  \u003c/Select\u003e
                  {selectedRole === 'admin' \u0026\u0026 (
                    \u003cBadge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 flex items-center gap-1"\u003e
                      \u003cAlertTriangle className="h-3 w-3" /\u003e
                      管理员权限不可修改
                    \u003c/Badge\u003e
                  )}
                \u003c/div\u003e
              \u003c/div\u003e
              
              {/* 角色权限配置 */}
              {renderRolePermissions()}
            \u003c/TabsContent\u003e
          \u003c/Tabs\u003e
        \u003c/CardContent\u003e

        \u003cCardFooter className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 py-4"\u003e
          \u003cdiv className="text-sm text-gray-500 dark:text-gray-400"\u003e
            共 {permissions.length} 个权限
          \u003c/div\u003e
        \u003c/CardFooter\u003e
      \u003c/Card\u003e

      {/* 添加权限对话框 */}
      \u003cDialog open={isAddPermissionOpen} onOpenChange={setIsAddPermissionOpen}\u003e
        \u003cDialogContent className="sm:max-w-md"\u003e
          \u003cDialogHeader\u003e
            \u003cDialogTitle className="flex items-center gap-2"\u003e
              \u003cPlus className="h-5 w-5" /\u003e
              添加新权限
            \u003c/DialogTitle\u003e
            \u003cDialogDescription\u003e
              创建新的系统权限
            \u003c/DialogDescription\u003e
          \u003c/DialogHeader\u003e
          \u003cdiv className="grid gap-4 py-4"\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="name" className="text-right"\u003e
                权限名称
              \u003c/Label\u003e
              \u003cInput id="name" className="col-span-3" /\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="code" className="text-right"\u003e
                权限代码
              \u003c/Label\u003e
              \u003cInput id="code" className="col-span-3" placeholder="例如：system:manage" /\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="category" className="text-right"\u003e
                所属类别
              \u003c/Label\u003e
              \u003cSelect defaultValue="system"\u003e
                \u003cSelectTrigger id="category" className="col-span-3"\u003e
                  \u003cSelectValue placeholder="选择类别" /\u003e
                \u003c/SelectTrigger\u003e
                \u003cSelectContent\u003e
                  \u003cSelectItem value="system"\u003e系统管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="user"\u003e用户管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="department"\u003e部门管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="task"\u003e任务管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="meeting"\u003e会议管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="report"\u003e报表管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="finance"\u003e财务管理\u003c/SelectItem\u003e
                  \u003cSelectItem value="hr"\u003e人力资源\u003c/SelectItem\u003e
                \u003c/SelectContent\u003e
              \u003c/Select\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="action" className="text-right"\u003e
                操作类型
              \u003c/Label\u003e
              \u003cSelect defaultValue="view"\u003e
                \u003cSelectTrigger id="action" className="col-span-3"\u003e
                  \u003cSelectValue placeholder="选择操作类型" /\u003e
                \u003c/SelectTrigger\u003e
                \u003cSelectContent\u003e
                  \u003cSelectItem value="view"\u003e查看\u003c/SelectItem\u003e
                  \u003cSelectItem value="create"\u003e创建\u003c/SelectItem\u003e
                  \u003cSelectItem value="edit"\u003e编辑\u003c/SelectItem\u003e
                  \u003cSelectItem value="delete"\u003e删除\u003c/SelectItem\u003e
                  \u003cSelectItem value="manage"\u003e管理\u003c/SelectItem\u003e
                \u003c/SelectContent\u003e
              \u003c/Select\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-start gap-4"\u003e
              \u003cLabel htmlFor="description" className="text-right mt-2"\u003e
                权限描述
              \u003c/Label\u003e
              \u003cTextarea id="description" className="col-span-3 min-h-[80px]" /\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="enabled" className="text-right"\u003e
                启用
              \u003c/Label\u003e
              \u003cSwitch id="enabled" defaultChecked /\u003c/Switch
            \u003c/div\u003e
          \u003c/div\u003e
          \u003cDialogFooter\u003e
            \u003cButton variant="ghost" onClick={() =\u003e setIsAddPermissionOpen(false)}\u003e
              取消
            \u003c/Button\u003e
            \u003cButton onClick={() =\u003e setIsAddPermissionOpen(false)}\u003e
              添加权限
            \u003c/Button\u003e
          \u003c/DialogFooter\u003e
        \u003c/DialogContent\u003e
      \u003c/Dialog\u003e

      {/* 编辑权限对话框 */}
      \u003cDialog open={isEditPermissionOpen} onOpenChange={setIsEditPermissionOpen}\u003e
        \u003cDialogContent className="sm:max-w-md"\u003e
          \u003cDialogHeader\u003e
            \u003cDialogTitle className="flex items-center gap-2"\u003e
              \u003cEdit className="h-5 w-5" /\u003e
              编辑权限
            \u003c/DialogTitle\u003e
            \u003cDialogDescription\u003e
              修改权限信息
            \u003c/DialogDescription\u003e
          \u003c/DialogHeader\u003e
          \u003cdiv className="grid gap-4 py-4"\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="edit-name" className="text-right"\u003e
                权限名称
              \u003c/Label\u003e
              \u003cInput id="edit-name" className="col-span-3" defaultValue={currentPermission?.name} /\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="edit-code" className="text-right"\u003e
                权限代码
              \u003c/Label\u003e
              \u003cInput 
                id="edit-code" 
                className="col-span-3" 
                defaultValue={currentPermission?.code}
                disabled={currentPermission?.isSystemReserved}
              /\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="edit-description" className="text-right mt-2"\u003e
                权限描述
              \u003c/Label\u003e
              \u003cTextarea 
                id="edit-description" 
                className="col-span-3 min-h-[80px]" 
                defaultValue={currentPermission?.description}
              /\u003e
            \u003c/div\u003e
            \u003cdiv className="grid grid-cols-4 items-center gap-4"\u003e
              \u003cLabel htmlFor="edit-enabled" className="text-right"\u003e
                启用
              \u003c/Label\u003e
              \u003cSwitch 
                id="edit-enabled" 
                defaultChecked={currentPermission?.isEnabled}
                disabled={currentPermission?.isSystemReserved}
              /\u003e
            \u003c/div\u003e
          \u003c/div\u003e
          \u003cDialogFooter\u003e
            \u003cButton variant="ghost" onClick={() => setIsEditPermissionOpen(false)}\u003e
              取消
            \u003c/Button\u003e
            \u003cButton onClick={() => setIsEditPermissionOpen(false)}\u003e
              保存更改
            \u003c/Button\u003e
          \u003c/DialogFooter\u003e
        \u003c/DialogContent\u003e
      \u003c/Dialog\u003e

      {/* 删除确认对话框 */}
      \u003cDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}\u003e
        \u003cDialogContent className="sm:max-w-md"\u003e
          \u003cDialogHeader\u003e
            \u003cDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400"\u003e
              \u003cAlertCircle className="h-5 w-5" /\u003e
              确认删除
            \u003c/DialogTitle\u003e
            \u003cDialogDescription\u003e
              您确定要删除选中的权限吗？此操作无法撤销。
            \u003c/DialogDescription\u003e
          \u003c/DialogHeader\u003e
          \u003cdiv className="py-4"\u003e
            \u003cdiv className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-100 dark:border-red-900/30 mb-4"\u003e
              \u003cdiv className="flex items-start gap-2"\u003e
                \u003cAlertTriangle className="h-5 w-5 text-red-500 mt-0.5" /\u003e
                \u003cp className="text-sm text-red-700 dark:text-red-300"\u003e
                  删除权限将同时移除所有角色对此权限的访问。请确保此操作不会影响系统的正常使用。
                \u003c/p\u003e
              \u003c/div\u003e
            \u003c/div\u003e
            \u003cdiv className="space-y-2"\u003e
              \u003cspan className="text-sm font-medium text-gray-700 dark:text-gray-300 block"\u003e
                将要删除的权限（{selectedPermissions.length}个）：
              \u003c/span\u003e
              \u003cScrollArea className="h-32 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"\u003e
                {selectedPermissions.map(id => {
                  const permission = permissions.find(p => p.id === id);
                  return permission ? (
                    \u003cdiv key={id} className="text-sm text-gray-600 dark:text-gray-400 py-1 border-b border-gray-200 dark:border-gray-700 last:border-0"\u003e
                      {permission.name} ({permission.code})
                    \u003c/div\u003e
                  ) : null;
                })}
              \u003c/ScrollArea\u003e
            \u003c/div\u003e
          \u003c/div\u003e
          \u003cDialogFooter\u003e
            \u003cButton variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}\u003e
              取消
            \u003c/Button\u003e
            \u003cButton variant="destructive" onClick={handleDeletePermissions}\u003e
              确认删除
            \u003c/Button\u003e
          \u003c/DialogFooter\u003e
        \u003c/DialogContent\u003e
      \u003c/Dialog\u003e
    \u003c/div\u003e
  );
};

export default PermissionsManagement;