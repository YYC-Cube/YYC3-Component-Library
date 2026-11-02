import React, { createContext, useEffect, useContext, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register, logout, initializeAuth, clearError } from '../store/slices/authSlice'
import type { RootState, AppDispatch } from '../store'

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  token: string | null
  loading: boolean
  error: string | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: { username: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * 认证上下文提供者，用于管理全局认证状态
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    isAuthenticated,
    user,
    token,
    loading,
    error
  } = useSelector((state: RootState) => state.auth || {})

  // 初始化认证状态
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // 登录方法
  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await dispatch(login(credentials)).unwrap()
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  // 注册方法
  const handleRegister = async (userData: { username: string; email: string; password: string }) => {
    try {
      await dispatch(register(userData)).unwrap()
    } catch (err) {
      console.error('Registration failed:', err)
      throw err
    }
  }

  // 登出方法
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // 清除错误方法
  const handleClearError = () => {
    dispatch(clearError())
  }

  const value: AuthContextType = {
    isAuthenticated: !!isAuthenticated,
    user,
    token,
    loading: !!loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 自定义钩子，用于在组件中使用认证上下文
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}