import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

// 创建认证上下文
const AuthContext = createContext();

// 自定义Hook，用于使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};

// 认证提供者组件，包裹应用以提供认证功能
export const AuthProvider = ({ children }) => {
  // 状态定义
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 检查本地存储中是否有认证信息
        const currentUser = authService.getUserInfo();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          // 尝试刷新用户信息
          try {
            const updatedUser = await authService.getCurrentUser();
            if (updatedUser) {
              setUser(updatedUser);
            }
          } catch (error) {
            console.warn('刷新用户信息失败，但使用本地存储的用户信息:', error);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('初始化认证状态失败:', err);
        setError(err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  // 登录方法
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      const userData = response.userInfo || response.data?.user || response.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      console.error('登录失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 注册方法
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      console.error('注册失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 登出方法
  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      // 登出后重定向到登录页
      window.location.href = '/login';
    } catch (err) {
      console.error('登出失败:', err);
    }
  };
  
  // 更新用户信息
  const updateUserProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.updateUserProfile(userData);
      const updatedUser = response.userInfo || response.data?.user || response.data;
      
      setUser(updatedUser);
      
      return response;
    } catch (err) {
      console.error('更新用户信息失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 更改密码
  const changePassword = async (passwordData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (err) {
      console.error('更改密码失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 发送验证码
  const sendVerificationCode = async (verificationData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.sendVerificationCode(verificationData);
      return response;
    } catch (err) {
      console.error('发送验证码失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 忘记密码
  const forgotPassword = async (forgotData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.forgotPassword(forgotData);
      return response;
    } catch (err) {
      console.error('忘记密码操作失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 重置密码
  const resetPassword = async (resetData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.resetPassword(resetData);
      return response;
    } catch (err) {
      console.error('重置密码失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 刷新用户信息
  const refreshUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        // 如果获取用户信息失败，清除认证状态
        logout();
      }
    } catch (err) {
      console.error('刷新用户信息失败:', err);
      setError(err);
      // 刷新失败不强制登出，保留当前状态
    } finally {
      setIsLoading(false);
    }
  };
  
  // 第三方登录
  const thirdPartyLogin = async (provider, code) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.thirdPartyLogin(provider, code);
      const userData = response.userInfo || response.data?.user || response.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      console.error('第三方登录失败:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 上下文值
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
    sendVerificationCode,
    forgotPassword,
    resetPassword,
    refreshUserInfo,
    thirdPartyLogin,
    authService: authService // 暴露authService以便在需要时直接使用
  };
  
  // 优化加载状态处理
  if (isLoading) {
    // 简化处理，直接返回null，允许渲染继续
    return null;
  }
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 默认导出上下文
export default AuthContext;