"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, 
  CheckCircle, AlertCircle, Building, Star, Zap,
  Check, X, Info
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";

interface SignupPageProps {
  navigate?: (page: any) => void;
}

export function SignupPage({ navigate }: SignupPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true,
    accountType: 'individual' as 'individual' | 'business'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Calculate password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value as string));
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  // Validate current step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (formData.accountType === 'business' && !formData.company.trim()) {
        newErrors.company = 'Company name is required for business accounts';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle signup submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful signup
      console.log('Signup successful:', formData);
      
      // Navigate to welcome or dashboard
      navigate?.('account-dashboard');
      
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = [
    'Account Information',
    'Security & Preferences'
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="glass-heavy border-blue-200 dark:border-blue-800/50">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Join Delibix
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Create your account to access AI-powered digital consulting tools
              </CardDescription>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Step {currentStep} of 2: {stepTitles[currentStep - 1]}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {Math.round((currentStep / 2) * 100)}%
                </span>
              </div>
              <Progress value={(currentStep / 2) * 100} className="w-full" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1 text-amber-500" />
                Free forever plan available
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Account Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('accountType', 'individual')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.accountType === 'individual'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-sm font-medium">Individual</div>
                        <div className="text-xs text-slate-500">Personal use</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('accountType', 'business')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.accountType === 'business'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        <Building className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-sm font-medium">Business</div>
                        <div className="text-xs text-slate-500">Team & enterprise</div>
                      </button>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
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

                  {/* Company Field (Business only) */}
                  {formData.accountType === 'business' && (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className={`pl-10 ${errors.company ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.company && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.company}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Security & Preferences */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Password strength:</span>
                          <span className={`font-medium ${
                            passwordStrength < 30 ? 'text-red-500' :
                            passwordStrength < 60 ? 'text-yellow-500' :
                            passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => navigate?.('terms-service')}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={() => navigate?.('privacy-policy')}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-xs flex items-center gap-1 ml-6">
                        <AlertCircle className="w-3 h-3" />
                        {errors.agreeToTerms}
                      </p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm text-slate-600 dark:text-slate-400">
                        Send me updates about new features and digital transformation insights
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.submit}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}

                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 gradient-bg-blue text-white"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 gradient-bg-blue text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate?.('login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3"
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <p>Your data is protected with enterprise-grade security and encryption</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}