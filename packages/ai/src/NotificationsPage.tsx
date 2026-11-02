"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Bell, BellOff, Check, X, Trash2, Settings, Filter,
  AlertCircle, Info, CheckCircle, XCircle, Zap, Crown,
  Mail, MessageSquare, Calendar, TrendingUp, Shield,
  Users, Gift, Star, Clock, Archive, RefreshCw, Search,
  Eye, EyeOff, Volume2, VolumeX, Smartphone, Monitor
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { SEOHead } from "./SEOHead";

interface NotificationsPageProps {
  navigate?: (page: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'update' | 'promotion' | 'security' | 'system';
  category: 'system' | 'account' | 'billing' | 'security' | 'updates' | 'marketing' | 'activity';
  timestamp: string;
  read: boolean;
  important: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    source?: string;
    userId?: string;
    relatedEntity?: string;
  };
}

interface NotificationPreferences {
  email: {
    enabled: boolean;
    categories: string[];
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  browser: {
    enabled: boolean;
    categories: string[];
    sound: boolean;
  };
  mobile: {
    enabled: boolean;
    categories: string[];
    quiet_hours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
}

export function NotificationsPage({ navigate }: NotificationsPageProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock data - in production, this would come from API
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Welcome to Delibix Professional!',
          message: 'Your subscription has been activated. Explore our advanced AI consulting tools and premium features.',
          type: 'success',
          category: 'account',
          timestamp: '2024-06-09T10:30:00Z',
          read: false,
          important: true,
          actionUrl: '#dashboard',
          actionText: 'Get Started',
          metadata: { source: 'subscription_service' }
        },
        {
          id: '2',
          title: 'New AI Tool Available: Market Research Analyzer',
          message: 'Discover market opportunities with our latest AI-powered market research tool. Available now in your toolkit.',
          type: 'update',
          category: 'updates',
          timestamp: '2024-06-09T09:15:00Z',
          read: false,
          important: false,
          actionUrl: '#market-research',
          actionText: 'Try Now',
          metadata: { source: 'product_updates' }
        },
        {
          id: '3',
          title: 'Security Alert: New Login Detected',
          message: 'We detected a new sign-in to your account from San Francisco, CA. If this wasn\'t you, please secure your account.',
          type: 'warning',
          category: 'security',
          timestamp: '2024-06-09T08:45:00Z',
          read: true,
          important: true,
          actionUrl: '#security',
          actionText: 'Review Activity',
          metadata: { source: 'security_service', userId: 'user_123' }
        },
        {
          id: '4',
          title: 'Monthly Report Ready',
          message: 'Your Digital Transformation Progress Report for May 2024 is ready for download.',
          type: 'info',
          category: 'activity',
          timestamp: '2024-06-08T16:00:00Z',
          read: true,
          important: false,
          actionUrl: '#reports',
          actionText: 'Download',
          metadata: { source: 'reporting_service' }
        },
        {
          id: '5',
          title: 'Payment Successful',
          message: 'Your payment of $99 for Professional Plan has been processed successfully. Next billing: July 9, 2024.',
          type: 'success',
          category: 'billing',
          timestamp: '2024-06-08T14:20:00Z',
          read: true,
          important: false,
          metadata: { source: 'billing_service' }
        },
        {
          id: '6',
          title: 'Limited Time: 20% Off Enterprise Plan',
          message: 'Upgrade to Enterprise and save 20% for the first 6 months. Advanced features, priority support, and team collaboration.',
          type: 'promotion',
          category: 'marketing',
          timestamp: '2024-06-07T12:00:00Z',
          read: false,
          important: false,
          actionUrl: '#pricing',
          actionText: 'View Offer',
          metadata: { source: 'marketing_service' }
        },
        {
          id: '7',
          title: 'System Maintenance Scheduled',
          message: 'Scheduled maintenance on June 15, 2024, from 2:00 AM to 4:00 AM UTC. Some features may be temporarily unavailable.',
          type: 'info',
          category: 'system',
          timestamp: '2024-06-07T10:00:00Z',
          read: true,
          important: true,
          metadata: { source: 'system_admin' }
        },
        {
          id: '8',
          title: 'New Team Member Invitation',
          message: 'Sarah Johnson has been invited to join your team workspace. They will have access to shared projects and reports.',
          type: 'info',
          category: 'account',
          timestamp: '2024-06-06T15:30:00Z',
          read: true,
          important: false,
          metadata: { source: 'team_service', relatedEntity: 'team_456' }
        }
      ];

      const mockPreferences: NotificationPreferences = {
        email: {
          enabled: true,
          categories: ['security', 'billing', 'account', 'updates'],
          frequency: 'immediate'
        },
        browser: {
          enabled: true,
          categories: ['security', 'system', 'activity'],
          sound: true
        },
        mobile: {
          enabled: true,
          categories: ['security', 'billing'],
          quiet_hours: {
            enabled: true,
            start: '22:00',
            end: '08:00'
          }
        }
      };
      
      setNotifications(mockNotifications);
      setPreferences(mockPreferences);
      setIsLoading(false);
    };

    loadNotifications();
  }, []);

  // Filter notifications based on active tab and search
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'important' && notification.important) ||
      notification.category === activeTab;

    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' || notification.type === filterType;

    return matchesTab && matchesSearch && matchesFilter;
  });

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
  };

  // Delete selected notifications
  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
  };

  // Toggle notification selection
  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all filtered notifications
  const selectAll = () => {
    const allIds = filteredNotifications.map(notif => notif.id);
    setSelectedNotifications(allIds);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  // Update preferences
  const updatePreferences = async (section: keyof NotificationPreferences, key: string, value: any) => {
    if (!preferences) return;

    const updatedPreferences = {
      ...preferences,
      [section]: {
        ...preferences[section],
        [key]: value
      }
    };

    setPreferences(updatedPreferences);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Preferences updated:', section, key, value);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return XCircle;
      case 'update': return Zap;
      case 'promotion': return Gift;
      case 'security': return Shield;
      case 'system': return Settings;
      default: return Info;
    }
  };

  // Get notification color
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'error': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'update': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'promotion': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'security': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'system': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
      default: return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(notif => !notif.read).length;
  const importantCount = notifications.filter(notif => notif.important && !notif.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Notifications - Delibix"
          description="Manage your notifications, alerts, and communication preferences."
        />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="delibix" text="Loading notifications..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Notifications - Delibix"
        description="Manage your notifications, alerts, and communication preferences."
      />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Notifications
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Stay updated with your account activity and system updates
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  {unreadCount > 0 && (
                    <Badge variant="default" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {unreadCount} Unread
                    </Badge>
                  )}
                  {importantCount > 0 && (
                    <Badge variant="destructive">
                      {importantCount} Important
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {selectedNotifications.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear Selection
                  </Button>
                  <Button variant="destructive" size="sm" onClick={deleteSelected}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedNotifications.length})
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button onClick={() => setActiveTab('preferences')} className="gradient-bg-blue text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 gap-1 glass-heavy p-1">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">All</span>
              <Badge variant="secondary" className="ml-1">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <BellOff className="w-4 h-4" />
              <span className="hidden sm:inline">Unread</span>
              {unreadCount > 0 && <Badge variant="default" className="ml-1">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="important" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Important</span>
              {importantCount > 0 && <Badge variant="destructive" className="ml-1">{importantCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Lists */}
          {['all', 'unread', 'important', 'security', 'billing', 'updates', 'activity'].includes(activeTab) && (
            <TabsContent value={activeTab}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Search and Filters */}
                <Card className="glass-secondary">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search notifications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background text-slate-900 dark:text-slate-100"
                        >
                          <option value="all">All Types</option>
                          <option value="info">Info</option>
                          <option value="success">Success</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                          <option value="update">Updates</option>
                          <option value="promotion">Promotions</option>
                          <option value="security">Security</option>
                          <option value="system">System</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={selectAll}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications List */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification, index) => {
                        const IconComponent = getNotificationIcon(notification.type);
                        const colorClasses = getNotificationColor(notification.type);
                        
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className={`glass-heavy cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              !notification.read ? 'ring-2 ring-blue-500/20' : ''
                            } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  {/* Selection Checkbox */}
                                  <input
                                    type="checkbox"
                                    checked={selectedNotifications.includes(notification.id)}
                                    onChange={() => toggleSelection(notification.id)}
                                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />

                                  {/* Icon */}
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className={`font-semibold text-slate-900 dark:text-slate-100 truncate ${
                                            !notification.read ? 'font-bold' : ''
                                          }`}>
                                            {notification.title}
                                          </h3>
                                          {notification.important && (
                                            <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />
                                          )}
                                          {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                          )}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                          {notification.message}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                          <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(notification.timestamp).toLocaleString()}
                                          </span>
                                          <Badge variant="outline" className="text-xs capitalize">
                                            {notification.category}
                                          </Badge>
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {notification.actionUrl && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              markAsRead(notification.id);
                                              navigate?.(notification.actionUrl!.replace('#', ''));
                                            }}
                                          >
                                            {notification.actionText || 'View'}
                                          </Button>
                                        )}
                                        {!notification.read && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => markAsRead(notification.id)}
                                          >
                                            <Eye className="w-4 h-4" />
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => deleteNotification(notification.id)}
                                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <BellOff className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          No notifications found
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {searchQuery || filterType !== 'all' 
                            ? 'Try adjusting your search or filters'
                            : 'You\'re all caught up! No new notifications.'
                          }
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {preferences && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Email Preferences */}
                  <Card className="glass-heavy">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        Email Notifications
                      </CardTitle>
                      <CardDescription>
                        Control how you receive email notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={preferences.email.enabled}
                          onCheckedChange={(checked) => 
                            updatePreferences('email', 'enabled', checked)
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <p className="font-medium text-sm">Email Categories</p>
                        {['security', 'billing', 'account', 'updates', 'marketing', 'activity'].map((category) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-400">
                              {category}
                            </span>
                            <Switch
                              checked={preferences.email.categories.includes(category)}
                              onCheckedChange={(checked) => {
                                const updatedCategories = checked
                                  ? [...preferences.email.categories, category]
                                  : preferences.email.categories.filter(c => c !== category);
                                updatePreferences('email', 'categories', updatedCategories);
                              }}
                              disabled={!preferences.email.enabled}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium text-sm">Email Frequency</p>
                        <select
                          value={preferences.email.frequency}
                          onChange={(e) => updatePreferences('email', 'frequency', e.target.value)}
                          disabled={!preferences.email.enabled}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background text-slate-900 dark:text-slate-100 disabled:opacity-50"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Browser Preferences */}
                  <Card className="glass-heavy">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-blue-500" />
                        Browser Notifications
                      </CardTitle>
                      <CardDescription>
                        Control browser push notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Browser Notifications</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Show browser push notifications
                          </p>
                        </div>
                        <Switch
                          checked={preferences.browser.enabled}
                          onCheckedChange={(checked) => 
                            updatePreferences('browser', 'enabled', checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notification Sound</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Play sound for notifications
                          </p>
                        </div>
                        <Switch
                          checked={preferences.browser.sound}
                          onCheckedChange={(checked) => 
                            updatePreferences('browser', 'sound', checked)
                          }
                          disabled={!preferences.browser.enabled}
                        />
                      </div>

                      <div className="space-y-3">
                        <p className="font-medium text-sm">Browser Categories</p>
                        {['security', 'system', 'activity', 'billing'].map((category) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-400">
                              {category}
                            </span>
                            <Switch
                              checked={preferences.browser.categories.includes(category)}
                              onCheckedChange={(checked) => {
                                const updatedCategories = checked
                                  ? [...preferences.browser.categories, category]
                                  : preferences.browser.categories.filter(c => c !== category);
                                updatePreferences('browser', 'categories', updatedCategories);
                              }}
                              disabled={!preferences.browser.enabled}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mobile Preferences */}
                  <Card className="glass-heavy">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                        Mobile Notifications
                      </CardTitle>
                      <CardDescription>
                        Control mobile push notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mobile Notifications</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Receive mobile push notifications
                          </p>
                        </div>
                        <Switch
                          checked={preferences.mobile.enabled}
                          onCheckedChange={(checked) => 
                            updatePreferences('mobile', 'enabled', checked)
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <p className="font-medium text-sm">Mobile Categories</p>
                        {['security', 'billing', 'account'].map((category) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-400">
                              {category}
                            </span>
                            <Switch
                              checked={preferences.mobile.categories.includes(category)}
                              onCheckedChange={(checked) => {
                                const updatedCategories = checked
                                  ? [...preferences.mobile.categories, category]
                                  : preferences.mobile.categories.filter(c => c !== category);
                                updatePreferences('mobile', 'categories', updatedCategories);
                              }}
                              disabled={!preferences.mobile.enabled}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Quiet Hours</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Disable notifications during specified hours
                            </p>
                          </div>
                          <Switch
                            checked={preferences.mobile.quiet_hours.enabled}
                            onCheckedChange={(checked) => 
                              updatePreferences('mobile', 'quiet_hours', {
                                ...preferences.mobile.quiet_hours,
                                enabled: checked
                              })
                            }
                            disabled={!preferences.mobile.enabled}
                          />
                        </div>

                        {preferences.mobile.quiet_hours.enabled && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-slate-600 dark:text-slate-400">From</label>
                              <input
                                type="time"
                                value={preferences.mobile.quiet_hours.start}
                                onChange={(e) => 
                                  updatePreferences('mobile', 'quiet_hours', {
                                    ...preferences.mobile.quiet_hours,
                                    start: e.target.value
                                  })
                                }
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background text-slate-900 dark:text-slate-100 mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-slate-600 dark:text-slate-400">To</label>
                              <input
                                type="time"
                                value={preferences.mobile.quiet_hours.end}
                                onChange={(e) => 
                                  updatePreferences('mobile', 'quiet_hours', {
                                    ...preferences.mobile.quiet_hours,
                                    end: e.target.value
                                  })
                                }
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background text-slate-900 dark:text-slate-100 mt-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Settings */}
                  <Card className="glass-heavy">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-500" />
                        Additional Settings
                      </CardTitle>
                      <CardDescription>
                        Advanced notification preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Archive className="w-4 h-4 mr-2" />
                          View Archived Notifications
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Export Notification History
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 dark:text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Notifications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}