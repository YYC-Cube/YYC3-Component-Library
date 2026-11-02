"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  User, Settings, CreditCard, Bell, Shield, Activity, 
  Download, Upload, Edit3, Camera, Check, X, AlertCircle,
  Key, Mail, Phone, Building, MapPin, Calendar, Clock,
  TrendingUp, Award, Target, Zap, Crown, Star, Gift,
  FileText, Eye, Trash2, Plus, ExternalLink, RefreshCw
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { SEOHead } from "./SEOHead";

interface AccountDashboardPageProps {
  navigate?: (page: string) => void;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  bio: string;
  avatar: string;
  accountType: 'individual' | 'business' | 'enterprise';
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'trial';
    nextBilling: string;
    features: string[];
  };
  usage: {
    aiConsultations: number;
    toolsAccessed: number;
    reportsGenerated: number;
    storageUsed: number;
  };
  preferences: {
    notifications: {
      email: boolean;
      browser: boolean;
      marketing: boolean;
      security: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'limited';
      dataSharing: boolean;
      analytics: boolean;
    };
    interface: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      timezone: string;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastLogin: string;
    activeSessions: number;
    securityScore: number;
  };
  activity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

export function AccountDashboardPage({ navigate }: AccountDashboardPageProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock user data - in production, this would come from API
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProfile: UserProfile = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Industries',
        position: 'Digital Transformation Director',
        location: 'San Francisco, CA',
        bio: 'Digital transformation leader with 10+ years of experience in enterprise consulting and AI implementation.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        accountType: 'business',
        subscription: {
          plan: 'Professional',
          status: 'active',
          nextBilling: '2024-07-15',
          features: ['Advanced AI Tools', 'Priority Support', 'Custom Reports', 'Team Collaboration']
        },
        usage: {
          aiConsultations: 45,
          toolsAccessed: 12,
          reportsGenerated: 8,
          storageUsed: 2.4
        },
        preferences: {
          notifications: {
            email: true,
            browser: true,
            marketing: false,
            security: true
          },
          privacy: {
            profileVisibility: 'limited',
            dataSharing: false,
            analytics: true
          },
          interface: {
            theme: 'system',
            language: 'en',
            timezone: 'America/Los_Angeles'
          }
        },
        security: {
          twoFactorEnabled: true,
          lastLogin: '2024-06-09T10:30:00Z',
          activeSessions: 2,
          securityScore: 85
        },
        activity: [
          {
            id: '1',
            type: 'consultation',
            description: 'Completed AI Readiness Assessment',
            timestamp: '2024-06-09T09:15:00Z',
            status: 'success'
          },
          {
            id: '2',
            type: 'report',
            description: 'Generated Digital Transformation Report',
            timestamp: '2024-06-08T14:20:00Z',
            status: 'success'
          },
          {
            id: '3',
            type: 'login',
            description: 'Signed in from new device',
            timestamp: '2024-06-08T08:45:00Z',
            status: 'warning'
          },
          {
            id: '4',
            type: 'tool',
            description: 'Used ROI Calculator',
            timestamp: '2024-06-07T16:30:00Z',
            status: 'success'
          },
          {
            id: '5',
            type: 'subscription',
            description: 'Subscription renewed automatically',
            timestamp: '2024-06-07T00:00:00Z',
            status: 'success'
          }
        ]
      };
      
      setUserProfile(mockProfile);
      setIsLoading(false);
    };

    loadUserProfile();
  }, []);

  // Handle profile updates
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    setIsSaving(true);
    setErrors({});

    try {
      // Validate required fields
      const newErrors: Record<string, string> = {};
      
      if (!userProfile.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!userProfile.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!userProfile.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(userProfile.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      
      // Show success message (you could implement toast notifications here)
      console.log('Profile updated successfully');
      
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preference updates
  const handlePreferenceUpdate = async (section: string, key: string, value: any) => {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        [section]: {
          ...userProfile.preferences[section as keyof typeof userProfile.preferences],
          [key]: value
        }
      }
    };

    setUserProfile(updatedProfile);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Preference updated:', section, key, value);
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Account Dashboard - Delibix"
          description="Manage your Delibix account, subscription, preferences, and access AI consulting tools and reports."
        />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="delibix" text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getSubscriptionBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trial': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Account Dashboard - Delibix"
        description="Manage your Delibix account, subscription, preferences, and access AI consulting tools and reports."
      />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-blue-500/20">
                <AvatarImage src={userProfile.avatar} alt={`${userProfile.firstName} ${userProfile.lastName}`} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-lg font-semibold">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome back, {userProfile.firstName}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {userProfile.position} at {userProfile.company}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={getSubscriptionBadgeVariant(userProfile.subscription.status)}>
                    <Crown className="w-3 h-3 mr-1" />
                    {userProfile.subscription.plan}
                  </Badge>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Shield className="w-4 h-4 mr-1" />
                    Security Score: {userProfile.security.securityScore}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate?.('home')}
                className="hidden sm:flex"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </Button>
              <Button
                onClick={() => navigate?.(userProfile.subscription.plan === 'Free' ? 'pricing' : 'billing')}
                className="gradient-bg-blue text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {userProfile.subscription.plan === 'Free' ? 'Upgrade Plan' : 'Manage Billing'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-1 glass-heavy p-1">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Usage</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="glass-heavy">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information and professional details
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({});
                        }}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="gradient-bg-blue text-white"
                      >
                        {isSaving ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-2 ring-blue-500/20">
                        <AvatarImage src={userProfile.avatar} alt="Profile picture" />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl font-semibold">
                          {userProfile.firstName[0]}{userProfile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {isEditing && (
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Photo
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userProfile.firstName}
                        onChange={(e) => setUserProfile({
                          ...userProfile,
                          firstName: e.target.value
                        })}
                        disabled={!isEditing}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userProfile.lastName}
                        onChange={(e) => setUserProfile({
                          ...userProfile,
                          lastName: e.target.value
                        })}
                        disabled={!isEditing}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            email: e.target.value
                          })}
                          disabled={!isEditing}
                          className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="phone"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            phone: e.target.value
                          })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="company"
                          value={userProfile.company}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            company: e.target.value
                          })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={userProfile.position}
                        onChange={(e) => setUserProfile({
                          ...userProfile,
                          position: e.target.value
                        })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="location"
                          value={userProfile.location}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            location: e.target.value
                          })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({
                          ...userProfile,
                          bio: e.target.value
                        })}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-input-background dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                        placeholder="Tell us about yourself and your professional background..."
                      />
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.submit}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Plan */}
                <Card className="glass-heavy lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-blue-500" />
                      Current Subscription
                    </CardTitle>
                    <CardDescription>
                      Manage your subscription plan and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                          {userProfile.subscription.plan} Plan
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Status: <Badge variant={getSubscriptionBadgeVariant(userProfile.subscription.status)}>
                            {userProfile.subscription.status}
                          </Badge>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Next billing</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {new Date(userProfile.subscription.nextBilling).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Plan Features</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {userProfile.subscription.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => navigate?.('pricing')}
                        className="gradient-bg-blue text-white flex-1"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing History
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      Account Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Member since</span>
                        <span className="text-sm font-medium">Jan 2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Total consultations</span>
                        <span className="text-sm font-medium">{userProfile.usage.aiConsultations}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Reports generated</span>
                        <span className="text-sm font-medium">{userProfile.usage.reportsGenerated}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Tools accessed</span>
                        <span className="text-sm font-medium">{userProfile.usage.toolsAccessed}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Storage used</span>
                        <span className="text-sm font-medium">{userProfile.usage.storageUsed}GB / 10GB</span>
                      </div>
                      <Progress value={(userProfile.usage.storageUsed / 10) * 100} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">AI Consultations</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {userProfile.usage.aiConsultations}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tools Accessed</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {userProfile.usage.toolsAccessed}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Reports Generated</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {userProfile.usage.reportsGenerated}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Storage Used</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {userProfile.usage.storageUsed}GB
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                        <Download className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Chart Placeholder */}
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Usage Analytics
                  </CardTitle>
                  <CardDescription>
                    Track your AI consulting tool usage over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Usage analytics chart would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notifications */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-500" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Control how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.email}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate('notifications', 'email', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Browser Notifications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Real-time browser alerts
                        </p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.browser}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate('notifications', 'browser', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Product updates and newsletters
                        </p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.marketing}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate('notifications', 'marketing', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Account security notifications
                        </p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.security}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate('notifications', 'security', checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      Privacy Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Sharing</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Share anonymized data for improvements
                        </p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.privacy.dataSharing}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate('privacy', 'dataSharing', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Tracking</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Help us improve user experience
                        </p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.privacy.analytics}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate('privacy', 'analytics', checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Security Overview
                  </CardTitle>
                  <CardDescription>
                    Monitor and manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Security Score */}
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-green-900 dark:text-green-100">Security Score</h3>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {userProfile.security.securityScore}%
                      </span>
                    </div>
                    <Progress value={userProfile.security.securityScore} className="w-full mb-2" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your account security is strong. Great job!
                    </p>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {userProfile.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {userProfile.security.twoFactorEnabled && (
                          <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Active
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          {userProfile.security.twoFactorEnabled ? 'Manage' : 'Enable'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                          <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Last changed 3 months ago
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">Active Sessions</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {userProfile.security.activeSessions} active sessions
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Last Login</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(userProfile.security.lastLogin).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="glass-heavy">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Track your recent actions and system events
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.activity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status).replace('text-', 'bg-')}`} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {activity.description}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Load More Activity
                    </Button>
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