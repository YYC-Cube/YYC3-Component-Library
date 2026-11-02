import { 
  PieChart, Briefcase, Users, Wallet, Layout, LayoutDashboard,
  Brain, Settings, BarChart3, LineChart, Globe, 
  ShoppingCart, Truck, Factory, UserPlus, 
  FileText, Shield, Search, Zap, MessageSquare,
  Database, Lock, Share2, Plus, Edit3, Trash2,
  Download, Printer, Sparkles, TrendingUp, AlertTriangle,
  Target, ShoppingBag, Package, Building2, Building, Box, FolderOpen,
  ClipboardCheck, ShieldAlert, CheckCircle, Store, BookOpen,
  DollarSign, Clock, Plane, UserCircle, Calendar, GitBranch,
  Calculator, CreditCard, Landmark, Receipt, Cpu, ClipboardList,
  RefreshCw, CheckSquare, Wrench, FileEdit, Video, Palette,
  Image, Star, Headphones, Pickaxe, Bot, Smartphone, TestTube,
  PenTool, User, UserCog, Monitor, Archive, HelpCircle, Sliders,
  Settings2, Megaphone, Code2, Puzzle, Code, Package as PackageIcon
} from 'lucide-react';

export type NavLevel4 = {
  id: string;
  label: string;
  icon: any;
  action?: string;
};

export type NavLevel3 = {
  id: string;
  label: string;
  content?: string;
};

export type NavLevel2 = {
  id: string;
  label: string;
  icon: any;
  tabs: NavLevel3[];
  color?: string; // e.g. "text-blue-500"
};

export type NavLevel1 = {
  id: string;
  label: string;
  icon: any;
  description: string;
  color: string; // Theme color for the module
  children: NavLevel2[];
};

// Common Level 4 Actions (Reused for consistency)
const commonActions: NavLevel4[] = [
  { id: 'create', label: '新建', icon: Plus },
  { id: 'edit', label: '编辑', icon: Edit3 },
  { id: 'ai-analyze', label: 'AI 分析', icon: Sparkles },
  { id: 'share', label: '分享', icon: Share2 },
  { id: 'export', label: '导出', icon: Download },
];

export const yycNavigationConfig: NavLevel1[] = [
  {
    id: 'data-center',
    label: '数据中心',
    icon: PieChart,
    description: '企业数据总览与决策支持',
    color: 'blue',
    children: [
      {
        id: 'ai-data-screen',
        label: 'AI数据屏',
        icon: BarChart3,
        tabs: [{id: 'overview', label: '总览'}, {id: 'realtime', label: '实时'}]
      },
      {
        id: 'data-overview',
        label: '数据总览',
        icon: LayoutDashboard,
        tabs: [{id: 'kpi', label: '关键指标'}, {id: 'trends', label: '趋势'}]
      },
      {
        id: 'data-analytics',
        label: '数据分析',
        icon: PieChart,
        tabs: [{id: 'multidim', label: '多维分析'}, {id: 'mining', label: '数据挖掘'}]
      },
      {
        id: 'smart-prediction',
        label: '智能预测',
        icon: TrendingUp,
        tabs: [{id: 'trend-pred', label: '趋势预测'}, {id: 'modeling', label: '数据建模'}]
      },
      {
        id: 'smart-alert',
        label: '智能预警',
        icon: AlertTriangle,
        tabs: [{id: 'risk-alert', label: '风险预警'}, {id: 'realtime-alarm', label: '实时报警'}]
      },
      {
        id: 'data-reports',
        label: '数据报表',
        icon: FileText,
        tabs: [{id: 'custom-report', label: '自定义报表'}, {id: 'templates', label: '报表模板'}]
      },
      {
        id: 'data-governance',
        label: '数据治理',
        icon: Database,
        tabs: [{id: 'master-data', label: '主数据'}, {id: 'quality', label: '数据质量'}]
      }
    ]
  },
  {
    id: 'core-business',
    label: '核心业务',
    icon: Briefcase,
    description: '全流程业务管理',
    color: 'green',
    children: [
      {
        id: 'market-info',
        label: '市场信息',
        icon: TrendingUp,
        tabs: [{id: 'market-trend', label: '行情趋势'}, {id: 'metal-price', label: '金属价格'}]
      },
      {
        id: 'customer-mgmt',
        label: '客户管理',
        icon: Users,
        tabs: [{id: 'archives', label: '客户档案'}, {id: 'relations', label: '关系维护'}]
      },
      {
        id: 'smart-sales',
        label: '智能销售',
        icon: ShoppingCart,
        tabs: [{id: 'orders', label: '销售订单'}, {id: 'tracking', label: '跟单管理'}]
      },
      {
        id: 'lead-mgmt',
        label: '线索管理',
        icon: Target,
        tabs: [{id: 'capture', label: '线索捕捉'}, {id: 'conversion', label: '转化分析'}]
      },
      {
        id: 'contract-mgmt',
        label: '合同管理',
        icon: FileText,
        tabs: [{id: 'lifecycle', label: '全生命周期'}, {id: 'signing', label: '电子签约'}]
      },
      {
        id: 'order-mgmt',
        label: '订单管理',
        icon: ShoppingBag,
        tabs: [{id: 'execution', label: '订单执行'}, {id: 'status', label: '状态追踪'}]
      },
      {
        id: 'smart-procurement',
        label: '智能采购',
        icon: Package,
        tabs: [{id: 'supplier', label: '供应商'}, {id: 'purchase', label: '采购执行'}]
      },
      {
        id: 'supplier-portal',
        label: '供应商门户',
        icon: Building2,
        tabs: [{id: 'collab', label: '协同'}, {id: 'evaluation', label: '绩效评估'}]
      },
      {
        id: 'smart-logistics',
        label: '智能物流',
        icon: Truck,
        tabs: [{id: 'tracking', label: '物流追踪'}, {id: 'fleet', label: '车队管理'}]
      },
      {
        id: 'inventory-mgmt',
        label: '库存管理',
        icon: Box,
        tabs: [{id: 'monitor', label: '库存监控'}, {id: 'check', label: '盘点'}]
      },
      {
        id: 'smart-production',
        label: '智能生产',
        icon: Factory,
        tabs: [{id: 'planning', label: '生产计划'}, {id: 'processing', label: '加工管理'}]
      },
      {
        id: 'project-mgmt',
        label: '项目管理',
        icon: FolderOpen,
        tabs: [{id: 'progress', label: '进度'}, {id: 'cost', label: '成本控制'}]
      },
      {
        id: 'work-orders',
        label: '工单管理',
        icon: ClipboardCheck,
        tabs: [{id: 'dispatch', label: '任务分配'}, {id: 'feedback', label: '执行反馈'}]
      },
      {
        id: 'smart-acquisition',
        label: '智能获客',
        icon: UserPlus,
        tabs: [{id: 'channel', label: '渠道分析'}, {id: 'acquisition', label: '获客'}]
      },
      {
        id: 'smart-risk',
        label: '智能风控',
        icon: ShieldAlert,
        tabs: [{id: 'risk-id', label: '风险识别'}, {id: 'warning', label: '预警'}]
      },
      {
        id: 'smart-fulfillment',
        label: '智能履约',
        icon: CheckCircle,
        tabs: [{id: 'process', label: '全流程监控'}, {id: 'delivery', label: '交付'}]
      },
      {
        id: 'store-mgmt',
        label: '门店管理',
        icon: Store,
        tabs: [{id: 'store-info', label: '门店信息'}, {id: 'operation', label: '门店运营'}]
      }
    ]
  },
  {
    id: 'hr',
    label: '人力资源',
    icon: Users,
    description: '人才与组织管理',
    color: 'purple',
    children: [
      {
        id: 'employee-mgmt',
        label: '员工管理',
        icon: User,
        tabs: [{id: 'profile', label: '员工档案'}, {id: 'lifecycle', label: '生命周期'}]
      },
      {
        id: 'smart-recruitment',
        label: '智能招聘',
        icon: UserPlus,
        tabs: [{id: 'process', label: '招聘流程'}, {id: 'talent-pool', label: '人才库'}]
      },
      {
        id: 'smart-training',
        label: '智能培训',
        icon: BookOpen,
        tabs: [{id: 'plan', label: '培训计划'}, {id: 'exam', label: '考核'}]
      },
      {
        id: 'payroll-mgmt',
        label: '薪酬管理',
        icon: DollarSign,
        tabs: [{id: 'calc', label: '薪资计算'}, {id: 'distribute', label: '发放'}]
      },
      {
        id: 'performance-mgmt',
        label: '绩效管理',
        icon: Target,
        tabs: [{id: 'assessment', label: '绩效考核'}, {id: 'eval', label: '评估'}]
      },
      {
        id: 'attendance-mgmt',
        label: '考勤管理',
        icon: Clock,
        tabs: [{id: 'schedule', label: '排班'}, {id: 'stats', label: '考勤统计'}]
      },
      {
        id: 'business-mgmt',
        label: '商务管理',
        icon: Plane,
        tabs: [{id: 'travel', label: '商务差旅'}, {id: 'expense', label: '费用'}]
      },
      {
        id: 'talent-profile',
        label: '人才画像',
        icon: UserCircle,
        tabs: [{id: 'model', label: '能力模型'}, {id: 'analysis', label: '分析'}]
      },
      {
        id: 'smart-scheduling',
        label: '智能排班',
        icon: Calendar,
        tabs: [{id: 'auto-schedule', label: '自动排班'}, {id: 'optimize', label: '优化'}]
      },
      {
        id: 'org-structure',
        label: '组织架构',
        icon: GitBranch,
        tabs: [{id: 'dept', label: '部门设置'}, {id: 'chart', label: '架构图'}]
      }
    ]
  },
  {
    id: 'finance',
    label: '财务资产',
    icon: Wallet,
    description: '资金与资产管控',
    color: 'orange',
    children: [
      {
        id: 'smart-accounting',
        label: '智能记账',
        icon: Calculator,
        tabs: [{id: 'auto-account', label: '自动核算'}, {id: 'vouchers', label: '凭证'}]
      },
      {
        id: 'invoice-mgmt',
        label: '发票管理',
        icon: FileText,
        tabs: [{id: 'input', label: '进项'}, {id: 'output', label: '销项'}]
      },
      {
        id: 'payment-mgmt',
        label: '支付管理',
        icon: CreditCard,
        tabs: [{id: 'fund', label: '资金收付'}, {id: 'flow', label: '流水'}]
      },
      {
        id: 'loan-mgmt',
        label: '贷款管理',
        icon: Landmark,
        tabs: [{id: 'financing', label: '融资'}, {id: 'credit', label: '信贷'}]
      },
      {
        id: 'smart-tax',
        label: '智能税务',
        icon: Receipt,
        tabs: [{id: 'declare', label: '申报'}, {id: 'compliance', label: '合规'}]
      },
      {
        id: 'smart-budget',
        label: '智能预算',
        icon: PieChart,
        tabs: [{id: 'compile', label: '编制'}, {id: 'control', label: '控制'}]
      },
      {
        id: 'smart-reimbursement',
        label: '智能报销',
        icon: Wallet,
        tabs: [{id: 'process', label: '报销流程'}, {id: 'audit', label: '审核'}]
      },
      {
        id: 'asset-mgmt',
        label: '资产管理',
        icon: Building,
        tabs: [{id: 'lifecycle', label: '全生命周期'}, {id: 'registry', label: '台账'}]
      },
      {
        id: 'equipment-mgmt',
        label: '设备管理',
        icon: Cpu,
        tabs: [{id: 'maintain', label: '维护'}, {id: 'depreciation', label: '折旧'}]
      },
      {
        id: 'smart-audit',
        label: '智能审计',
        icon: Search,
        tabs: [{id: 'internal', label: '财务审计'}, {id: 'compliance-check', label: '合规检查'}]
      },
      {
        id: 'asset-inventory',
        label: '资产盘点',
        icon: ClipboardList,
        tabs: [{id: 'physical', label: '实物盘点'}, {id: 'result', label: '盘点结果'}]
      },
      {
        id: 'smart-reconciliation',
        label: '智能对账',
        icon: RefreshCw,
        tabs: [{id: 'bank', label: '银企对账'}, {id: 'current', label: '往来对账'}]
      }
    ]
  },
  {
    id: 'office',
    label: '办公协同',
    icon: Layout,
    description: '流程与协同效率',
    color: 'cyan',
    children: [
      {
        id: 'office-mgmt',
        label: '办公管理',
        icon: Building2,
        tabs: [{id: 'admin', label: '行政事务'}, {id: 'resource', label: '资源'}]
      },
      {
        id: 'smart-approval',
        label: '智能审批',
        icon: CheckSquare,
        tabs: [{id: 'center', label: '审批中心'}, {id: 'my-approval', label: '我的审批'}]
      },
      {
        id: 'document-mgmt',
        label: '文档管理',
        icon: FileText,
        tabs: [{id: 'kb', label: '知识库'}, {id: 'disk', label: '网盘'}]
      },
      {
        id: 'workflow-mgmt',
        label: '流程管理',
        icon: GitBranch,
        tabs: [{id: 'design', label: '流程设计'}, {id: 'optimize', label: '优化'}]
      },
      {
        id: 'permission-mgmt',
        label: '权限管理',
        icon: Shield,
        tabs: [{id: 'role', label: '角色'}, {id: 'config', label: '权限配置'}]
      },
      {
        id: 'data-mgmt',
        label: '数据管理',
        icon: Database,
        tabs: [{id: 'master', label: '主数据'}, {id: 'governance', label: '治理'}]
      },
      {
        id: 'tool-mgmt',
        label: '工具管理',
        icon: Wrench,
        tabs: [{id: 'toolbox', label: '工具箱'}, {id: 'config', label: '配置'}]
      },
      {
        id: 'enterprise-mgmt',
        label: '企业管理',
        icon: Briefcase,
        tabs: [{id: 'business', label: '工商'}, {id: 'qualification', label: '资质'}]
      },
      {
        id: 'smart-docs',
        label: '智能文档',
        icon: FileEdit,
        tabs: [{id: 'collab', label: '协作文档'}, {id: 'history', label: '历史'}]
      },
      {
        id: 'smart-collaboration',
        label: '智能协同',
        icon: Users,
        tabs: [{id: 'task', label: '任务协作'}, {id: 'comm', label: '沟通'}]
      },
      {
        id: 'smart-meetings',
        label: '智能会议',
        icon: Video,
        tabs: [{id: 'reserve', label: '会议预定'}, {id: 'minutes', label: '纪要'}]
      },
      {
        id: 'smart-search',
        label: '智能搜索',
        icon: Search,
        tabs: [{id: 'global', label: '全局检索'}, {id: 'filter', label: '筛选'}]
      },
      {
        id: 'creative-collaboration',
        label: '创意协作',
        icon: Palette,
        tabs: [{id: 'ai-creative', label: 'AI创意'}, {id: 'platform', label: '平台'}]
      }
    ]
  },
  {
    id: 'ai-center',
    label: 'AI 智能',
    icon: Brain,
    description: '企业级 AI 能力中心',
    color: 'pink',
    children: [
      {
        id: 'smart-decision',
        label: '智能决策',
        icon: Brain,
        tabs: [{id: 'advise', label: '辅助建议'}, {id: 'analysis', label: '决策分析'}]
      },
      {
        id: 'ai-analytics',
        label: '数据分析',
        icon: BarChart3,
        tabs: [{id: 'report', label: '分析报表'}, {id: 'multi-dim', label: '多维分析'}]
      },
      {
        id: 'ai-prediction',
        label: '智能预测',
        icon: TrendingUp,
        tabs: [{id: 'trend', label: '趋势预测'}, {id: 'model', label: '模型'}]
      },
      {
        id: 'natural-language',
        label: '自然语言',
        icon: MessageSquare,
        tabs: [{id: 'nlp', label: '文本处理'}, {id: 'semantic', label: '语义分析'}]
      },
      {
        id: 'image-recognition',
        label: '图像识别',
        icon: Image,
        tabs: [{id: 'ocr', label: '票据识别'}, {id: 'object', label: '实物识别'}]
      },
      {
        id: 'smart-recommendation',
        label: '智能推荐',
        icon: Star,
        tabs: [{id: 'opportunity', label: '机会推荐'}, {id: 'product', label: '产品推荐'}]
      },
      {
        id: 'process-automation',
        label: '流程自动化',
        icon: Zap,
        tabs: [{id: 'rpa', label: 'RPA执行'}, {id: 'monitor', label: '监控'}]
      },
      {
        id: 'smart-customer-service',
        label: '智能客服',
        icon: Headphones,
        tabs: [{id: 'bot', label: 'AI应答'}, {id: 'human', label: '人工接入'}]
      },
      {
        id: 'data-mining',
        label: '数据挖掘',
        icon: Pickaxe,
        tabs: [{id: 'deep', label: '深层挖掘'}, {id: 'value', label: '价值发现'}]
      },
      {
        id: 'ai-assistant',
        label: 'AI助手',
        icon: Bot,
        tabs: [{id: 'qa', label: '智能问答'}, {id: 'task', label: '任务辅助'}]
      },
      {
        id: 'advanced-bi',
        label: '高级BI',
        icon: PieChart,
        tabs: [{id: 'bi-analysis', label: '商业智能'}, {id: 'visual', label: '可视化'}]
      },
      {
        id: 'tenant-mgmt',
        label: '租户管理',
        icon: Building2,
        tabs: [{id: 'multi', label: '多租户'}, {id: 'isolation', label: '隔离'}]
      },
      {
        id: 'mobile-app',
        label: '移动应用',
        icon: Smartphone,
        tabs: [{id: 'config', label: 'APP配置'}, {id: 'mgmt', label: '管理'}]
      },
      {
        id: 'performance-optimization',
        label: '性能优化',
        icon: Zap,
        tabs: [{id: 'system', label: '系统性能'}, {id: 'resource', label: '资源优化'}]
      },
      {
        id: 'user-training',
        label: '用户培训',
        icon: BookOpen,
        tabs: [{id: 'course', label: '课程'}, {id: 'resource', label: '资源'}]
      },
      {
        id: 'system-testing',
        label: '系统测试',
        icon: TestTube,
        tabs: [{id: 'func', label: '功能测试'}, {id: 'perf', label: '性能测试'}]
      },
      {
        id: 'ai-content-creator',
        label: 'AI内容创作',
        icon: PenTool,
        tabs: [{id: 'writing', label: 'AI写作'}, {id: 'design', label: 'AI设计'}]
      }
    ]
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: Settings,
    description: '系统配置与安全',
    color: 'gray',
    children: [
      {
        id: 'system-settings',
        label: '系统设置',
        icon: Settings,
        tabs: [{id: 'params', label: '参数设置'}, {id: 'personal', label: '个性化'}]
      },
      {
        id: 'user-mgmt',
        label: '用户管理',
        icon: UserCog,
        tabs: [{id: 'users', label: '用户列表'}, {id: 'roles', label: '角色'}]
      },
      {
        id: 'role-permission',
        label: '角色权限',
        icon: Shield,
        tabs: [{id: 'config', label: '权限配置'}, {id: 'matrix', label: '权限矩阵'}]
      },
      {
        id: 'log-mgmt',
        label: '日志管理',
        icon: FileText,
        tabs: [{id: 'op-log', label: '操作日志'}, {id: 'sys-log', label: '系统日志'}]
      },
      {
        id: 'system-monitor',
        label: '系统监控',
        icon: Monitor,
        tabs: [{id: 'perf', label: '性能监控'}, {id: 'resource', label: '资源监控'}]
      },
      {
        id: 'backup-recovery',
        label: '备份恢复',
        icon: Archive,
        tabs: [{id: 'backup', label: '数据备份'}, {id: 'recover', label: '数据恢复'}]
      },
      {
        id: 'help-center',
        label: '帮助中心',
        icon: HelpCircle,
        tabs: [{id: 'docs', label: '文档'}, {id: 'faq', label: '常见问题'}]
      },
      {
        id: 'parameter-settings',
        label: '参数设置',
        icon: Sliders,
        tabs: [{id: 'biz', label: '业务参数'}, {id: 'rules', label: '规则'}]
      },
      {
        id: 'platform-settings',
        label: '平台设置',
        icon: Settings2,
        tabs: [{id: 'config', label: '平台配置'}, {id: 'interface', label: '接口'}]
      },
      {
        id: 'wechat-config',
        label: '微信配置',
        icon: MessageSquare,
        tabs: [{id: 'oa', label: '公众号'}, {id: 'mini', label: '小程序'}]
      },
      {
        id: 'channel-center',
        label: '渠道中心',
        icon: Megaphone,
        tabs: [{id: 'mgmt', label: '渠道管理'}, {id: 'analysis', label: '渠道分析'}]
      },
      {
        id: 'data-integration',
        label: '数据集成',
        icon: Database,
        tabs: [{id: 'source', label: '数据源'}, {id: 'sync', label: '同步'}]
      },
      {
        id: 'api-integration',
        label: 'API集成',
        icon: Code2,
        tabs: [{id: 'keys', label: '密钥'}, {id: 'config', label: '集成配置'}]
      },
      {
        id: 'plugin-market',
        label: '插件市场',
        icon: Puzzle,
        tabs: [{id: 'browse', label: '浏览'}, {id: 'install', label: '安装'}]
      },
      {
        id: 'developer-center',
        label: '开发者中心',
        icon: Code,
        tabs: [{id: 'docs', label: 'API文档'}, {id: 'sdk', label: 'SDK下载'}]
      },
      {
        id: 'app-market',
        label: '应用市场',
        icon: PackageIcon,
        tabs: [{id: 'browse', label: '应用浏览'}, {id: 'install', label: '应用安装'}]
      }
    ]
  }
];

export const level4Actions = commonActions;
