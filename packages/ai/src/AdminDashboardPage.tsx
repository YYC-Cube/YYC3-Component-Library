"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { 
  Settings, Users, TrendingUp, Shield, AlertTriangle, CheckCircle,
  BarChart3, PieChart, LineChart, Activity, Database, Server,
  Monitor, Globe, Mail, MessageSquare, Bell, Calendar,
  FileText, Download, Upload, Edit, Trash2, Plus, Search,
  Filter, MoreHorizontal, Eye, EyeOff, Lock, Unlock,
  UserPlus, UserMinus, Crown, Star, Zap, Target,
  RefreshCw, Clock, ArrowUp, ArrowDown, Minus,
  DollarSign, ShoppingCart, CreditCard, Percent,
  Map, Flag, Building, Phone, MapPin, ExternalLink
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { SEOHead } from "./SEOHead";

interface AdminDashboardPageProps {
  navigate?: (page: string) => void;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  conversions: number;
  pageViews: number;
  newSignups: number;
  support_tickets: number;
  server_uptime: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'enterprise' | 'partner';
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  signupDate: string;
  lastLogin: string;
  avatar?: string;
}

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  bandwidth_usage: number;
  active_sessions: number;
  api_calls: number;
}

interface ContentMetrics {
  total_pages: number;
  published_posts: number;
  pending_reviews: number;
  knowledge_base_articles: number;
  downloads: number;
  support_tickets: number;
}

export function AdminDashboardPage({ navigate }: AdminDashboardPageProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockStats: DashboardStats = {
        totalUsers: 12847,
        activeUsers: 8392,
        revenue: 187542,
        conversions: 342,
        pageViews: 45783,
        newSignups: 127,
        support_tickets: 23,
        server_uptime: 99.8
      };

      const mockSystemMetrics: SystemMetrics = {
        cpu_usage: 45,
        memory_usage: 62,
        storage_usage: 78,
        bandwidth_usage: 34,
        active_sessions: 1247,
        api_calls: 156789
      };

      const mockContentMetrics: ContentMetrics = {
        total_pages: 135,
        published_posts: 89,
        pending_reviews: 7,
        knowledge_base_articles: 245,
        downloads: 15638,
        support_tickets: 23
      };

      const mockUsers: UserData[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@techcorp.com',
          role: 'enterprise',
          status: 'active',
          plan: 'Enterprise',
          signupDate: '2024-01-15',
          lastLogin: '2024-06-09T10:30:00Z',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@startup.ai',
          role: 'user',
          status: 'active',
          plan: 'Professional',
          signupDate: '2024-02-20',
          lastLogin: '2024-06-09T09:15:00Z',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b123?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '3',
          name: 'Michael Chen',
          email: 'mchen@digitalagency.com',
          role: 'partner',
          status: 'active',
          plan: 'Partner',
          signupDate: '2024-03-10',
          lastLogin: '2024-06-08T16:45:00Z'
        },
        {
          id: '4',
          name: 'Emma Wilson',
          email: 'emma.wilson@consultant.co',
          role: 'user',
          status: 'inactive',
          plan: 'Free',
          signupDate: '2024-04-05',
          lastLogin: '2024-05-28T14:20:00Z'
        },
        {
          id: '5',
          name: 'David Rodriguez',
          email: 'david.r@enterprise.org',
          role: 'admin',
          status: 'active',
          plan: 'Admin',
          signupDate: '2023-12-01',
          lastLogin: '2024-06-09T11:00:00Z'
        }
      ];
      
      setDashboardStats(mockStats);
      setSystemMetrics(mockSystemMetrics);
      setContentMetrics(mockContentMetrics);
      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'enterprise': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'partner': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'user': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (isLoading || !dashboardStats || !systemMetrics || !contentMetrics) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Admin Dashboard - Delibix"
          description="Administrative dashboard for managing Delibix platform, users, content, and business metrics."
        />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="delibix" text="Loading admin dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Admin Dashboard - Delibix"
        description="Administrative dashboard for managing Delibix platform, users, content, and business metrics."
      />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Comprehensive platform management and analytics
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="default" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    All Systems Operational
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Last updated: {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button onClick={() => navigate?.('system-status')} className="gradient-bg-blue text-white">
                <Monitor className="w-4 h-4 mr-2" />
                System Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-1 glass-heavy p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
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
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-heavy">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {dashboardStats.totalUsers.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">+12.5%</span>
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
                        <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          ${dashboardStats.revenue.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">+8.3%</span>
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
                        <p className="text-sm text-slate-600 dark:text-slate-400">Active Sessions</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {dashboardStats.activeUsers.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">+5.7%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-heavy">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Conversions</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {dashboardStats.conversions}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowDown className="w-3 h-3 text-red-500" />
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

              {/* Quick Actions & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="glass-heavy lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Common administrative tasks and shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <UserPlus className="w-6 h-6 text-blue-500" />
                      <span className="text-sm">Add User</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Mail className="w-6 h-6 text-green-500" />
                      <span className="text-sm">Send Newsletter</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Download className="w-6 h-6 text-purple-500" />
                      <span className="text-sm">Export Data</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Shield className="w-6 h-6 text-amber-500" />
                      <span className="text-sm">Security Scan</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* System Alerts */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          Backup Complete
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          2 minutes ago
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                          Maintenance Due
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          In 3 days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Bell className="w-4 h-4 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {dashboardStats.support_tickets} Open Tickets
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Requires attention
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest system and user activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'user', action: 'New user registration', details: 'john.doe@company.com', time: '5 minutes ago', status: 'success' },
                      { type: 'payment', action: 'Payment processed', details: '$299 Enterprise Plan', time: '12 minutes ago', status: 'success' },
                      { type: 'system', action: 'System backup completed', details: 'Database backup successful', time: '1 hour ago', status: 'success' },
                      { type: 'security', action: 'Failed login attempt', details: 'Multiple failed attempts detected', time: '2 hours ago', status: 'warning' },
                      { type: 'content', action: 'Blog post published', details: 'AI Trends in 2024', time: '3 hours ago', status: 'success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                          activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {activity.type === 'user' && <Users className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          {activity.type === 'payment' && <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          {activity.type === 'system' && <Server className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          {activity.type === 'security' && <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                          {activity.type === 'content' && <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100">{activity.action}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{activity.details}</p>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Users Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    User Management
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Manage users, roles, and permissions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedUsers.length > 0 && (
                    <Badge variant="outline">
                      {selectedUsers.length} selected
                    </Badge>
                  )}
                  <Button className="gradient-bg-blue text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <Card className="glass-secondary">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background text-slate-900 dark:text-slate-100"
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="partner">Partner</option>
                        <option value="user">User</option>
                      </select>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        More Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card className="glass-heavy">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(filteredUsers.map(u => u.id));
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                              className="rounded"
                            />
                          </th>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">User</th>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">Role</th>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">Status</th>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">Plan</th>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">Last Login</th>
                          <th className="text-left p-4 font-medium text-slate-900 dark:text-slate-100">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <AnimatePresence>
                          {filteredUsers.map((user, index) => (
                            <motion.tr
                              key={user.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                              <td className="p-4">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => toggleUserSelection(user.id)}
                                  className="rounded"
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`capitalize ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge className={`capitalize ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <span className="text-slate-900 dark:text-slate-100">{user.plan}</span>
                              </td>
                              <td className="p-4">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {new Date(user.lastLogin).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-blue-500" />
                      Revenue Trends
                    </CardTitle>
                    <CardDescription>Monthly revenue over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">
                          Revenue analytics chart would be displayed here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Growth Chart Placeholder */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      User Growth
                    </CardTitle>
                    <CardDescription>User registration trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">
                          User growth chart would be displayed here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Pages</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {contentMetrics.total_pages}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Published Posts</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {contentMetrics.published_posts}
                        </p>
                      </div>
                      <Globe className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pending Reviews</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {contentMetrics.pending_reviews}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Metrics */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-blue-500" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>{systemMetrics.cpu_usage}%</span>
                      </div>
                      <Progress value={systemMetrics.cpu_usage} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{systemMetrics.memory_usage}%</span>
                      </div>
                      <Progress value={systemMetrics.memory_usage} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage Usage</span>
                        <span>{systemMetrics.storage_usage}%</span>
                      </div>
                      <Progress value={systemMetrics.storage_usage} className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bandwidth Usage</span>
                        <span>{systemMetrics.bandwidth_usage}%</span>
                      </div>
                      <Progress value={systemMetrics.bandwidth_usage} className="w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Server Statistics */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-green-500" />
                      Server Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-sm">Uptime</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {dashboardStats.server_uptime}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-sm">Active Sessions</span>
                      <span className="font-medium">
                        {systemMetrics.active_sessions.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-sm">API Calls (24h)</span>
                      <span className="font-medium">
                        {systemMetrics.api_calls.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-sm">Last Backup</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        2 hours ago
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure global system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enable maintenance mode for system updates
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">User Registration</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Allow new user registrations
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Send system email notifications
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Security Logs</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enable detailed security logging
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto Backup</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Automatic daily system backups
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">API Rate Limiting</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enable API rate limiting protection
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}