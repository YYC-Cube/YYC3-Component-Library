"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Mail, ArrowLeft, CheckCircle, AlertCircle, Shield, 
  Clock, RefreshCw, Key, Lock
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { SEOHead } from "./SEOHead";

interface ForgotPasswordPageProps {
  navigate?: (page: string) => void;
}

export function ForgotPasswordPage({ navigate }: ForgotPasswordPageProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setResendCount(prev => prev + 1);
      
      // Start cooldown timer for resend
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000); // 1 minute cooldown
      
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend
  const handleResend = () => {
    if (!canResend) return;
    handleSubmit(new Event('submit') as any);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <SEOHead 
          title="Password Reset Email Sent - Delibix"
          description="Check your email for password reset instructions."
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="glass-heavy border-green-200 dark:border-green-800/50">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                  We've sent password reset instructions to your email address
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                    Reset email sent to:
                  </p>
                  <p className="text-sm font-mono text-green-700 dark:text-green-300 break-all">
                    {email}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>The link will expire in 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Check your spam folder if you don't see it</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Didn't receive the email?
                  </p>
                  <Button
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Sending...' : canResend ? 'Resend Email' : 'Wait 1 minute to resend'}
                  </Button>
                  
                  {resendCount > 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Email sent {resendCount} {resendCount === 1 ? 'time' : 'times'}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    onClick={() => navigate?.('login')}
                    variant="ghost"
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEOHead 
        title="Reset Password - Delibix"
        description="Reset your Delibix account password. Enter your email to receive reset instructions."
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-heavy border-blue-200 dark:border-blue-800/50">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center"
            >
              <Key className="w-8 h-8 text-white" />
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Enter your email address and we'll send you instructions to reset your password
              </CardDescription>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Lock className="w-3 h-3 mr-1 text-blue-500" />
                Secure password recovery
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`pl-10 ${error ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg-blue text-white py-6 text-lg font-semibold rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Mail className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Remember your password?{' '}
                <button
                  onClick={() => navigate?.('login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Sign in instead
                </button>
              </p>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate?.('signup')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Sign up for free
                </button>
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3"
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <p>We'll never share your email address or send spam</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}