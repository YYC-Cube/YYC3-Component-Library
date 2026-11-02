/**
 * @file 用户认证类型定义
 * @description 定义认证相关的数据结构和接口
 * @module auth
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

/**
 * 用户认证信息接口
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * 用户注册信息接口
 */
export interface RegisterData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

/**
 * 认证响应接口
 */
export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: number; // 过期时间戳
}

/**
 * 用户接口
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

/**
 * 用户角色枚举
 */
export type UserRole = 'user' | 'admin' | 'developer';

/**
 * 用户偏好设置接口
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  defaultToolCategory?: string;
  notificationPreferences?: NotificationPreferences;
}

/**
 * 通知偏好设置接口
 */
export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  marketingEmails: boolean;
  toolUpdates: boolean;
}

/**
 * 认证状态接口
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * 认证上下文接口
 */
export interface AuthContextType extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

/**
 * 密码重置请求接口
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * 密码重置确认接口
 */
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}