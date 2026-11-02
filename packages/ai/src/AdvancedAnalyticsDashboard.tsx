"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  FunnelChart, Funnel, LabelList
} from "recharts";
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Eye, MousePointer,
  Calendar, Download, Share2, Filter, RefreshCw, BarChart3,
  PieChart as PieChartIcon, LineChart as LineChartIcon, Globe,
  Smartphone, Monitor, MapPin, Clock, Target, Zap, Star
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { SEOHead } from "./SEOHead";

interface AdvancedAnalyticsDashboardProps {
  navigate?: (page: string) => void;
}

export function AdvancedAnalyticsDashboard({ navigate }: AdvancedAnalyticsDashboardProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  // Mock data generation
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData(timeRange);
      setChartData(mockData);
      setIsLoading(false);
    };

    loadAnalyticsData();
  }, [timeRange]);

  // Generate comprehensive mock data
  const generateMockData = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const now = new Date();
    
    // Revenue and user data
    const revenueData = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        revenue: Math.floor(Math.random() * 15000) + 5000,
        users: Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 50) + 10,
        pageViews: Math.floor(Math.random() * 2000) + 1000,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120,
        bounceRate: Math.floor(Math.random() * 30) + 20
      };
    });

    // Geographic data
    const geographicData = [
      { country: 'Indonesia', users: 4521, revenue: 125000, flag: '🇮🇩' },
      { country: 'Singapore', users: 2341, revenue: 89000, flag: '🇸🇬' },
      { country: 'Malaysia', users: 1876, revenue: 67000, flag: '🇲🇾' },
      { country: 'Thailand', users: 1432, revenue: 45000, flag: '🇹🇭' },
      { country: 'Vietnam', users: 987, revenue: 32000, flag: '🇻🇳' },
      { country: 'Philippines', users: 756, revenue: 28000, flag: '🇵🇭' },
      { country: 'United States', users: 543, revenue: 78000, flag: '🇺🇸' },
      { country: 'Australia', users: 432, revenue: 56000, flag: '🇦🇺' }
    ];

    // Device data
    const deviceData = [
      { name: 'Desktop', value: 45.2, users: 5420, color: '#3b82f6' },
      { name: 'Mobile', value: 38.7, users: 4635, color: '#10b981' },
      { name: 'Tablet', value: 16.1, users: 1928, color: '#f59e0b' }
    ];

    // Traffic sources
    const trafficSources = [
      { source: 'Organic Search', users: 3542, percentage: 42.3, color: '#3b82f6' },
      { source: 'Direct', users: 2187, percentage: 26.1, color: '#10b981' },
      { source: 'Social Media', users: 1456, percentage: 17.4, color: '#f59e0b' },
      { source: 'Paid Ads', users: 876, percentage: 10.5, color: '#8b5cf6' },
      { source: 'Referral', users: 312, percentage: 3.7, color: '#ef4444' }
    ];

    // Conversion funnel
    const conversionFunnel = [
      { name: 'Visitors', value: 12450, color: '#3b82f6' },
      { name: 'Page Views', value: 8930, color: '#06b6d4' },
      { name: 'Engaged Users', value: 4521, color: '#10b981' },
      { name: 'Leads', value: 1876, color: '#f59e0b' },
      { name: 'Customers', value: 234, color: '#ef4444' }
    ];

    // Content performance
    const contentPerformance = [
      { page: '/ai-playground', views: 12543, avgTime: 342, bounceRate: 23.4 },
      { page: '/pricing', views: 9876, avgTime: 195, bounceRate: 45.6 },
      { page: '/about', views: 8765, avgTime: 267, bounceRate: 35.2 },
      { page: '/services', views: 7654, avgTime: 423, bounceRate: 28.9 },
      { page: '/demo-request', views: 6543, avgTime: 156, bounceRate: 67.3 },
      { page: '/blog', views: 5432, avgTime: 298, bounceRate: 41.7 }
    ];

    // User journey
    const userJourney = [
      { step: 'Homepage', users: 10000, dropOff: 0 },
      { step: 'Services', users: 7500, dropOff: 25 },
      { step: 'Pricing', users: 5000, dropOff: 33.3 },
      { step: 'Demo Request', users: 2500, dropOff: 50 },
      { step: 'Consultation', users: 1250, dropOff: 50 },
      { step: 'Purchase', users: 625, dropOff: 50 }
    ];

    // Performance metrics
    const performanceMetrics = revenueData.map(item => ({
      ...item,
      loadTime: Math.random() * 2 + 1,
      coreWebVitals: Math.random() * 100,
      errorRate: Math.random() * 5
    }));

    return {
      revenueData,
      geographicData,
      deviceData,
      trafficSources,
      conversionFunnel,
      contentPerformance,
      userJourney,
      performanceMetrics
    };
  };

  // Chart colors for dark mode
  const getChartColors = () => ({
    primary: isDark ? '#60a5fa' : '#3b82f6',
    secondary: isDark ? '#34d399' : '#10b981',
    accent: isDark ? '#fbbf24' : '#f59e0b',
    text: isDark ? '#f8fafc' : '#1e293b',
    grid: isDark ? '#334155' : '#e2e8f0'
  });

  const colors = getChartColors();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-heavy p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading || !chartData) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Advanced Analytics - Delibix"
          description="Comprehensive business analytics and data insights dashboard."
        />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="delibix" text="Loading analytics data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Advanced Analytics - Delibix"
        description="Comprehensive business analytics and data insights dashboard."
      />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Advanced Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Comprehensive business intelligence and data insights
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <Button className="gradient-bg-blue text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 gap-1 glass-heavy p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Traffic
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="geographic" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Geographic
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Behavior
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-heavy">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          ${chartData.revenueData.reduce((sum: number, item: any) => sum + item.revenue, 0).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">+12.5%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-heavy">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {chartData.revenueData.reduce((sum: number, item: any) => sum + item.users, 0).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">+8.3%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-heavy">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Page Views</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {chartData.revenueData.reduce((sum: number, item: any) => sum + item.pageViews, 0).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">+5.7%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-heavy">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Conversion Rate</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {((chartData.revenueData.reduce((sum: number, item: any) => sum + item.conversions, 0) / 
                             chartData.revenueData.reduce((sum: number, item: any) => sum + item.users, 0)) * 100).toFixed(1)}%
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingDown className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">-2.1%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue and Users Chart */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChartIcon className="w-5 h-5 text-blue-500" />
                      Revenue Trend
                    </CardTitle>
                    <CardDescription>Daily revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData.revenueData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                        <XAxis dataKey="day" stroke={colors.text} />
                        <YAxis stroke={colors.text} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke={colors.primary} 
                          fillOpacity={1}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      User Growth
                    </CardTitle>
                    <CardDescription>Daily active users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                        <XAxis dataKey="day" stroke={colors.text} />
                        <YAxis stroke={colors.text} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke={colors.secondary} 
                          strokeWidth={3}
                          dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Device and Traffic Sources */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-purple-500" />
                      Device Distribution
                    </CardTitle>
                    <CardDescription>Users by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData.deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.deviceData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      Traffic Sources
                    </CardTitle>
                    <CardDescription>Where your users come from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.trafficSources.map((source: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: source.color }}
                            />
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {source.source}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {source.users.toLocaleString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {source.percentage}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Other tabs would be implemented similarly with different charts and data */}
          <TabsContent value="traffic">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle>Traffic Analytics Implementation</CardTitle>
                  <CardDescription>
                    This would contain detailed traffic analysis including user flow, bounce rates, session duration, and more comprehensive traffic metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Advanced traffic analytics charts would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Add similar implementations for other tabs */}
        </Tabs>
      </div>
    </div>
  );
}