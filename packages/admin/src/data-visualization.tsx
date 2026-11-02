/**
 * @file 数据可视化组件
 * @description 提供多样化的图表展示和数据分析功能
 * @module data-visualization
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Download,
  Share2,
  Settings,
  RefreshCcw,
  Filter,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Info
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Slider
} from '@/components/ui/slider';
import {
  Switch
} from '@/components/ui/switch';
import {
  Checkbox
} from '@/components/ui/checkbox';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import {
  Input
} from '@/components/ui/input';
import {
  Label
} from '@/components/ui/label';
import {
  Separator
} from '@/components/ui/separator';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// 类型定义

// 通用图表数据类型
interface ChartDataItem {
  name: string;
  [key: string]: number | string | Date;
}

// 图表配置类型
interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'scatter';
  title: string;
  description?: string;
  dataKey: string;
  xAxisKey: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  height?: number;
  responsive?: boolean;
  options?: Record<string, any>;
}

// 主题颜色配置
type ThemeColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  [key: string]: string;
};

// 预设颜色方案
const COLOR_SCHEMES: Record<string, string[]> = {
  default: ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#22c55e', '#f59e0b'],
  pastel: ['#a5b4fc', '#c4b5fd', '#f9a8d4', '#fdba74', '#67e8f9', '#86efac', '#fcd34d'],
  vibrant: ['#2563eb', '#7c3aed', '#be185d', '#ea580c', '#0e7490', '#16a34a', '#d97706'],
  monochrome: ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc']
};

// 默认主题颜色
const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  tertiary: '#ec4899',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9'
};

// 预设图表配置
const PRESET_CHART_CONFIGS: Record<string, ChartConfig> = {
  taskCompletion: {
    type: 'bar',
    title: '任务完成统计',
    description: '各部门任务完成情况对比',
    dataKey: 'completed',
    xAxisKey: 'department',
    showLegend: true,
    showGrid: true,
    height: 300
  },
  performanceTrend: {
    type: 'line',
    title: '绩效趋势',
    description: '近6个月绩效指标变化趋势',
    dataKey: 'performance',
    xAxisKey: 'month',
    showLegend: true,
    showGrid: true,
    height: 300
  },
  resourceAllocation: {
    type: 'pie',
    title: '资源分配',
    description: '各项目资源分配比例',
    dataKey: 'value',
    xAxisKey: 'name',
    showLegend: true,
    height: 300
  },
  projectProgress: {
    type: 'area',
    title: '项目进度',
    description: '项目完成度随时间变化',
    dataKey: 'progress',
    xAxisKey: 'date',
    showLegend: true,
    showGrid: true,
    height: 300
  },
  skillsRadar: {
    type: 'radar',
    title: '技能评估雷达图',
    description: '团队成员技能水平评估',
    dataKey: 'score',
    xAxisKey: 'skill',
    showLegend: true,
    height: 400
  },
  performanceScatter: {
    type: 'scatter',
    title: '绩效散点图',
    description: '效率与质量关系分析',
    dataKey: 'quality',
    xAxisKey: 'efficiency',
    showLegend: true,
    showGrid: true,
    height: 300
  }
};

// 模拟数据生成器
const generateMockData = (type: string, count: number = 7): ChartDataItem[] => {
  const data: ChartDataItem[] = [];
  
  switch (type) {
    case 'bar':
      const departments = ['研发部', '市场部', '销售部', '财务部', '人事部', '客服部'];
      return departments.map(dept => ({
        department: dept,
        completed: Math.floor(Math.random() * 80) + 20,
        pending: Math.floor(Math.random() * 30) + 5,
        overdue: Math.floor(Math.random() * 10),
        total: Math.floor(Math.random() * 100) + 25
      }));
      
    case 'line':
      const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
      return months.map(month => ({
        month,
        performance: Math.floor(Math.random() * 30) + 70,
        efficiency: Math.floor(Math.random() * 25) + 75,
        satisfaction: Math.floor(Math.random() * 20) + 80
      }));
      
    case 'pie':
      const projects = ['项目A', '项目B', '项目C', '项目D', '项目E'];
      return projects.map(project => ({
        name: project,
        value: Math.floor(Math.random() * 100) + 50
      }));
      
    case 'area':
      const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      });
      return dates.map(date => ({
        date,
        progress: Math.min(100, Math.floor(Math.random() * 10) + (dates.indexOf(date) * 3))
      }));
      
    case 'radar':
      const skills = ['前端开发', '后端开发', '数据库', 'UI设计', '项目管理', '沟通能力'];
      return skills.map(skill => ({
        skill,
        score: Math.floor(Math.random() * 40) + 60
      }));
      
    case 'scatter':
      return Array.from({ length: 20 }, (_, i) => ({
        name: `团队${i + 1}`,
        efficiency: Math.floor(Math.random() * 50) + 50,
        quality: Math.floor(Math.random() * 40) + 60,
        value: Math.floor(Math.random() * 50) + 10
      }));
      
    default:
      return [];
  }
};

// 数据可视化组件
const DataVisualization: React.FC<{
  initialConfig?: ChartConfig;
  initialData?: ChartDataItem[];
  className?: string;
}> = ({ initialConfig, initialData, className = '' }) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('bar');
  const [chartConfig, setChartConfig] = useState<ChartConfig>(
    initialConfig || PRESET_CHART_CONFIGS.taskCompletion
  );
  const [chartData, setChartData] = useState<ChartDataItem[]>(
    initialData || generateMockData('bar')
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(COLOR_SCHEMES.default);
  const [colorScheme, setColorScheme] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [themeColors, setThemeColors] = useState<ThemeColors>(DEFAULT_THEME_COLORS);
  const [chartHeight, setChartHeight] = useState(chartConfig.height || 300);
  const [customTitle, setCustomTitle] = useState(chartConfig.title);
  const [customDescription, setCustomDescription] = useState(chartConfig.description || '');
  const [showLegend, setShowLegend] = useState(chartConfig.showLegend ?? true);
  const [showGrid, setShowGrid] = useState(chartConfig.showGrid ?? true);
  const [animation, setAnimation] = useState(chartConfig.animate ?? true);
  const [presetConfig, setPresetConfig] = useState('taskCompletion');

  // 响应式调整图表高度
  const responsiveHeight = useMemo(() => {
    if (typeof window === 'undefined') return chartHeight;
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.min(chartHeight, 250) : chartHeight;
  }, [chartHeight]);

  // 获取数据中的数值字段
  const dataFields = useMemo(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter(key => 
      typeof chartData[0][key] === 'number' && key !== 'value'
    );
  }, [chartData]);

  // 处理图表类型切换
  const handleChartTypeChange = (type: ChartConfig['type']) => {
    setActiveTab(type);
    setIsLoading(true);
    
    // 生成对应类型的模拟数据
    setTimeout(() => {
      const newData = generateMockData(type);
      setChartData(newData);
      
      // 更新图表配置
      const newConfig: ChartConfig = {
        ...chartConfig,
        type,
        // 根据数据自动设置xAxisKey和dataKey
        xAxisKey: Object.keys(newData[0])[0],
        dataKey: typeof newData[0][Object.keys(newData[0])[1]] === 'number' 
          ? Object.keys(newData[0])[1]
          : Object.keys(newData[0]).find(key => typeof newData[0][key] === 'number') || 'value'
      };
      
      setChartConfig(newConfig);
      setPresetConfig('');
      setIsLoading(false);
    }, 500);
  };

  // 切换预设配置
  const handlePresetChange = (preset: string) => {
    setPresetConfig(preset);
    const config = PRESET_CHART_CONFIGS[preset];
    if (config) {
      setChartConfig(config);
      setChartData(generateMockData(config.type));
      setActiveTab(config.type);
      setCustomTitle(config.title);
      setCustomDescription(config.description || '');
      setShowLegend(config.showLegend ?? true);
      setShowGrid(config.showGrid ?? true);
      setChartHeight(config.height || 300);
    }
  };

  // 切换颜色方案
  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
    setSelectedColors(COLOR_SCHEMES[scheme]);
  };

  // 导出图表数据
  const handleExportData = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${chartConfig.title || 'chart-data'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 刷新数据
  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setChartData(generateMockData(chartConfig.type));
      setIsLoading(false);
    }, 800);
  };

  // 渲染图表
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">加载中...</span>
        </div>
      );
    }

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataFields.map((field, index) => (
                <Bar 
                  key={field} 
                  dataKey={field} 
                  name={field} 
                  fill={selectedColors[index % selectedColors.length]}
                  animationDuration={animation ? 1000 : 0}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataFields.map((field, index) => (
                <Line 
                  key={field} 
                  type="monotone" 
                  dataKey={field} 
                  name={field}
                  stroke={selectedColors[index % selectedColors.length]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={animation ? 1000 : 0}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={chartConfig.dataKey}
                animationDuration={animation ? 1000 : 0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={selectedColors[index % selectedColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {dataFields.map((field, index) => (
                <Area 
                  key={field}
                  type="monotone" 
                  dataKey={field}
                  name={field}
                  stroke={selectedColors[index % selectedColors.length]}
                  fill={selectedColors[index % selectedColors.length]} 
                  fillOpacity={0.3}
                  animationDuration={animation ? 1000 : 0}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey={chartConfig.xAxisKey} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataFields.map((field, index) => (
                <Radar
                  key={field}
                  name={field}
                  dataKey={field}
                  stroke={selectedColors[index % selectedColors.length]}
                  fill={selectedColors[index % selectedColors.length]}
                  fillOpacity={0.5}
                  animationDuration={animation ? 1000 : 0}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis type="number" dataKey={dataFields[0]} name={dataFields[0]} />
              <YAxis type="number" dataKey={dataFields[1]} name={dataFields[1]} />
              <ZAxis type="number" range={[60, 400]} name="value" dataKey="value" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {showLegend && <Legend />
              <Scatter 
                name="团队绩效" 
                data={chartData} 
                fill={selectedColors[0]}
                animationDuration={animation ? 1000 : 0}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-center text-gray-500">不支持的图表类型</div>;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* 图表标题和控制栏 */}
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl">
              {customTitle}
            </CardTitle>
            {customDescription && (
              <CardDescription>{customDescription}</CardDescription>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowControls(!showControls)}
              title={showControls ? '隐藏控制选项' : '显示控制选项'}
            >
              {showControls ? (
                <MinusCircle className="h-4 w-4" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefreshData}
              title="刷新数据"
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleExportData}
              title="导出数据"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="更多选项">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url).then(() => {
                    alert('链接已复制到剪贴板');
                  });
                }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  复制链接
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  导出图片
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  高级设置
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* 图表类型选择标签 */}
      <CardContent className="p-0 pb-4">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => handleChartTypeChange(value as ChartConfig['type'])}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-6 sm:grid-cols-6 mb-4">
            <TabsTrigger value="bar">
              <BarChart2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">柱状图</span>
            </TabsTrigger>
            <TabsTrigger value="line">
              <LineChartIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">折线图</span>
            </TabsTrigger>
            <TabsTrigger value="pie">
              <PieChartIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">饼图</span>
            </TabsTrigger>
            <TabsTrigger value="area">
              <AreaChart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">面积图</span>
            </TabsTrigger>
            <TabsTrigger value="radar">
              <RadarChart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">雷达图</span>
            </TabsTrigger>
            <TabsTrigger value="scatter">
              <Activity className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">散点图</span>
            </TabsTrigger>
          </TabsList>

          {/* 图表控制选项 */}
          {showControls && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md mb-4 mx-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 预设配置 */}
                <div className="space-y-2">
                  <Label htmlFor="preset">预设配置</Label>
                  <Select 
                    value={presetConfig} 
                    onValueChange={handlePresetChange}
                  >
                    <SelectTrigger id="preset">
                      <SelectValue placeholder="选择预设" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="taskCompletion">任务完成统计</SelectItem>
                      <SelectItem value="performanceTrend">绩效趋势</SelectItem>
                      <SelectItem value="resourceAllocation">资源分配</SelectItem>
                      <SelectItem value="projectProgress">项目进度</SelectItem>
                      <SelectItem value="skillsRadar">技能评估雷达图</SelectItem>
                      <SelectItem value="performanceScatter">绩效散点图</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 颜色方案 */}
                <div className="space-y-2">
                  <Label htmlFor="color-scheme">颜色方案</Label>
                  <Select 
                    value={colorScheme} 
                    onValueChange={handleColorSchemeChange}
                  >
                    <SelectTrigger id="color-scheme">
                      <SelectValue placeholder="选择颜色方案" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(COLOR_SCHEMES).map(scheme => (
                        <SelectItem key={scheme} value={scheme}>
                          {scheme === 'default' && '默认'}
                          {scheme === 'pastel' && '柔和'} 
                          {scheme === 'vibrant' && '鲜艳'}
                          {scheme === 'monochrome' && '单色'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 动画开关 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animation">启用动画</Label>
                    <p className="text-xs text-gray-500">图表加载动画效果</p>
                  </div>
                  <Switch 
                    id="animation" 
                    checked={animation} 
                    onCheckedChange={setAnimation}
                  />
                </div>

                {/* 显示图例 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-legend">显示图例</Label>
                    <p className="text-xs text-gray-500">在图表上显示图例</p>
                  </div>
                  <Switch 
                    id="show-legend" 
                    checked={showLegend} 
                    onCheckedChange={setShowLegend}
                  />
                </div>

                {/* 显示网格 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-grid">显示网格</Label>
                    <p className="text-xs text-gray-500">在图表上显示网格线</p>
                  </div>
                  <Switch 
                    id="show-grid" 
                    checked={showGrid} 
                    onCheckedChange={setShowGrid}
                  />
                </div>

                {/* 图表高度调整 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chart-height">图表高度</Label>
                    <span className="text-sm font-medium">{chartHeight}px</span>
                  </div>
                  <Slider 
                    id="chart-height" 
                    min={200} 
                    max={600} 
                    step={50} 
                    value={[chartHeight]} 
                    onValueChange={(value) => setChartHeight(value[0])}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 图表显示区域 */}
          <div className="h-[300px] sm:h-[350px] md:h-[400px]" style={{ height: `${responsiveHeight}px` }}>
            {renderChart()}
          </div>
        </Tabs>
      </CardContent>

      {/* 图表信息和底部操作 */}
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Info className="h-4 w-4" />
          <span>数据基于 {chartData.length} 个记录生成</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <RotateCcw className="h-4 w-4 mr-2" />
            重置视图
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Filter className="h-4 w-4 mr-2" />
                数据筛选
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>数据筛选</AlertDialogTitle>
                <AlertDialogDescription>
                  筛选图表中显示的数据内容
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>显示字段</Label>
                  <div className="space-y-2">
                    {dataFields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox id={`field-${field}`} defaultChecked />
                        <Label htmlFor={`field-${field}`}>{field}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>排序方式</Label>
                  <RadioGroup defaultValue="ascending">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ascending" id="ascending" />
                      <Label htmlFor="ascending">升序</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="descending" id="descending" />
                      <Label htmlFor="descending">降序</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">不排序</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction>应用筛选</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataVisualization;