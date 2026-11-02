/**
 * @file YYC³ UI 组件库入口
 * @description 统一导出所有自定义组件并初始化版本控制
 * @module components/ui
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-20
 */

import { ComponentVersionManager } from './versioning';
import { ComponentUpdateManager } from './update-manager';

// 导入所有自定义组件
// 注意：实际项目中需要根据components/ui目录下的文件进行调整
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Avatar } from './avatar';
import { Badge, badgeVariants } from './badge';
import { BrandBadge } from './brand-badge';
import { BrandButton } from './brand-button';
import { BrandCard } from './brand-card';
import { BrandInput } from './brand-input';
import { BrandLogo } from './brand-logo';
import { BrandToggle } from './brand-toggle';
import { Button } from './button';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
import { Checkbox } from './checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { EmojiPopover } from './emoji-popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { Label } from './label';
import { Logo3D } from './logo-3d';
import { MarkdownPreview } from './markdown-preview';
import { Model3DPreview } from './model-3d-preview';
import { MonacoEditor } from './monaco-editor';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Progress } from './progress';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Resizable } from './resizable';
import { ScrollArea } from './scroll-area';
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from './select';
import { Separator } from './separator';
import { Skeleton } from './skeleton';
import { Slider } from './slider';
import { SVGIcon } from './svg-icons';
import { Switch } from './switch';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from './table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Textarea } from './textarea';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';
import { Toaster } from './toaster';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
import { Icons } from './icons';

// 组件列表及其版本信息
const componentVersions = [
  { name: 'Alert', version: '1.0.0', lastUpdated: '2024-10-15', description: '用于显示警告、错误、成功等提示信息' },
  { name: 'Avatar', version: '1.0.0', lastUpdated: '2024-10-15', description: '用户头像组件' },
  { name: 'Badge', version: '1.0.0', lastUpdated: '2024-10-15', description: '徽章组件，用于显示通知或状态' },
  { name: 'BrandBadge', version: '1.0.0', lastUpdated: '2024-10-20', description: '品牌风格徽章组件' },
  { name: 'BrandButton', version: '1.0.0', lastUpdated: '2024-10-20', description: '品牌风格按钮组件' },
  { name: 'BrandCard', version: '1.0.0', lastUpdated: '2024-10-20', description: '品牌风格卡片组件' },
  { name: 'BrandInput', version: '1.0.0', lastUpdated: '2024-10-20', description: '品牌风格输入框组件' },
  { name: 'BrandLogo', version: '1.0.0', lastUpdated: '2024-10-20', description: '品牌标志组件' },
  { name: 'BrandToggle', version: '1.0.0', lastUpdated: '2024-10-20', description: '品牌风格开关组件' },
  { name: 'Button', version: '1.0.0', lastUpdated: '2024-10-15', description: '通用按钮组件' },
  { name: 'Card', version: '1.0.0', lastUpdated: '2024-10-15', description: '卡片容器组件' },
  { name: 'Checkbox', version: '1.0.0', lastUpdated: '2024-10-15', description: '复选框组件' },
  { name: 'Command', version: '1.0.0', lastUpdated: '2024-10-15', description: '命令菜单组件' },
  { name: 'Dialog', version: '1.0.0', lastUpdated: '2024-10-15', description: '对话框组件' },
  { name: 'DropdownMenu', version: '1.0.0', lastUpdated: '2024-10-15', description: '下拉菜单组件' },
  { name: 'EmojiPopover', version: '1.0.0', lastUpdated: '2024-10-15', description: '表情选择弹出框组件' },
  { name: 'Form', version: '1.0.0', lastUpdated: '2024-10-15', description: '表单组件' },
  { name: 'Input', version: '1.0.0', lastUpdated: '2024-10-15', description: '输入框组件' },
  { name: 'Label', version: '1.0.0', lastUpdated: '2024-10-15', description: '标签组件' },
  { name: 'Logo3D', version: '1.0.0', lastUpdated: '2024-10-15', description: '3D标志组件' },
  { name: 'MarkdownPreview', version: '1.0.0', lastUpdated: '2024-10-15', description: 'Markdown预览组件' },
  { name: 'Model3DPreview', version: '1.0.0', lastUpdated: '2024-10-15', description: '3D模型预览组件' },
  { name: 'MonacoEditor', version: '1.0.0', lastUpdated: '2024-10-15', description: '代码编辑器组件' },
  { name: 'Pagination', version: '1.0.0', lastUpdated: '2024-10-15', description: '分页组件' },
  { name: 'Popover', version: '1.0.0', lastUpdated: '2024-10-15', description: '弹出框组件' },
  { name: 'Progress', version: '1.0.0', lastUpdated: '2024-10-15', description: '进度条组件' },
  { name: 'RadioGroup', version: '1.0.0', lastUpdated: '2024-10-15', description: '单选按钮组组件' },
  { name: 'Resizable', version: '1.0.0', lastUpdated: '2024-10-15', description: '可调整大小组件' },
  { name: 'ScrollArea', version: '1.0.0', lastUpdated: '2024-10-15', description: '滚动区域组件' },
  { name: 'Select', version: '1.0.0', lastUpdated: '2024-10-15', description: '选择器组件' },
  { name: 'Separator', version: '1.0.0', lastUpdated: '2024-10-15', description: '分隔线组件' },
  { name: 'Skeleton', version: '1.0.0', lastUpdated: '2024-10-15', description: '骨架屏组件' },
  { name: 'Slider', version: '1.0.0', lastUpdated: '2024-10-15', description: '滑块组件' },
  { name: 'SVGIcon', version: '1.0.0', lastUpdated: '2024-10-15', description: 'SVG图标组件' },
  { name: 'Switch', version: '1.0.0', lastUpdated: '2024-10-15', description: '开关组件' },
  { name: 'Table', version: '1.0.0', lastUpdated: '2024-10-15', description: '表格组件' },
  { name: 'Tabs', version: '1.0.0', lastUpdated: '2024-10-20', description: '选项卡组件' },
  { name: 'Textarea', version: '1.0.0', lastUpdated: '2024-10-15', description: '文本域组件' },
  { name: 'Toast', version: '1.0.0', lastUpdated: '2024-10-15', description: '消息提示组件' },
  { name: 'Toaster', version: '1.0.0', lastUpdated: '2024-10-15', description: '消息提示容器组件' },
  { name: 'Tooltip', version: '1.0.0', lastUpdated: '2024-10-15', description: '悬停提示组件' },
  { name: 'Icons', version: '1.0.0', lastUpdated: '2024-10-15', description: '图标库组件' }
];

/**
 * 初始化组件库版本控制
 */
function initializeComponentLibrary(): void {
  const versionManager = ComponentVersionManager.getInstance();
  
  // 注册所有组件版本信息
  componentVersions.forEach(component => {
    versionManager.registerComponent(component);
  });

  // 初始化更新管理器
  const updateManager = ComponentUpdateManager.getInstance();
  
  // 配置自动检查更新（开发环境下每30分钟检查一次）
  if (process.env.NODE_ENV !== 'production') {
    updateManager.startAutoUpdateCheck(30);
  }

  console.log(`✅ YYC³ UI 组件库 v1.0.0 已初始化`);
  console.log(`📦 已注册 ${componentVersions.length} 个组件`);
}

// 初始化组件库
initializeComponentLibrary();

// 导出所有组件
export {
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  Badge,
  badgeVariants,
  BrandBadge,
  BrandButton,
  BrandCard,
  BrandInput,
  BrandLogo,
  BrandToggle,
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmojiPopover,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Logo3D,
  MarkdownPreview,
  Model3DPreview,
  MonacoEditor,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Resizable,
  ScrollArea,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  Separator,
  Skeleton,
  Slider,
  SVGIcon,
  Switch,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Icons,
  ComponentVersionManager,
  ComponentUpdateManager
};

// 导出类型
export type {
  ComponentVersion,
  ComponentLibraryInfo
} from './versioning';

export type {
  UpdateNotificationConfig,
  UpdateEventType,
  UpdateEventListener
} from './update-manager';