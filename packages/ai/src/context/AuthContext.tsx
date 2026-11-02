/**
 * @file 认证上下文
 * @description 管理用户认证状态和提供认证相关方法
 * @context AuthContext
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthState, AuthCredentials, RegisterData, User } from '@/types/auth';
import { permissionService, Permission } from '@/lib/permissionService';

// 初始认证状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// 认证操作类型
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'RESTORE_AUTH'; payload: User | null }
  | { type: 'CLEAR_ERROR' };

// 认证状态 reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'RESTORE_AUTH':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: !!action.payload,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟 API 调用函数
const mockAuthApi = {
  // 模拟登录
  login: async (credentials: AuthCredentials): Promise<{ token: string; user: User }> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟验证逻辑
    if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-1',
          name: '演示用户',
          email: 'demo@example.com',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: 'system',
            language: 'zh-CN',
          },
        },
      };
    }
    throw new Error('邮箱或密码不正确');
  },
  
  // 模拟注册
  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟验证逻辑
    if (data.password !== data.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-' + Date.now(),
        name: data.name,
        email: data.email,
        role: 'user',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'zh-CN',
        },
      },
    };
  },
  
  // 模拟从本地存储恢复认证状态
  restoreAuth: async (): Promise<User | null> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');
    
    if (token && userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        return null;
      }
    }
    return null;
  },
};

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 检查用户是否具有特定权限
  const hasPermission = (permission: Permission): boolean => {
    if (!state.user) return false;
    return permissionService.hasPermission(state.user.role, permission);
  };

  // 检查用户是否具有所有指定权限
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!state.user) return false;
    return permissionService.hasAllPermissions(state.user.role, permissions);
  };

  // 检查用户是否具有任意一个权限
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!state.user) return false;
    return permissionService.hasAnyPermission(state.user.role, permissions);
  };

  // 获取用户的所有权限
  const getUserPermissions = (): Permission[] => {
    if (!state.user) return [];
    return permissionService.getUserPermissions(state.user.role);
  };

  // 初始化时从本地存储恢复认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await mockAuthApi.restoreAuth();
        dispatch({ type: 'RESTORE_AUTH', payload: user });
      } catch (error) {
        console.error('恢复认证状态失败:', error);
        dispatch({ type: 'RESTORE_AUTH', payload: null });
      }
    };

    initAuth();
  }, []);

  // 登录方法
  const login = async (credentials: AuthCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { token, user } = await mockAuthApi.login(credentials);
      
      // 存储认证信息到本地存储
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  // 注册方法
  const register = async (data: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const { token, user } = await mockAuthApi.register(data);
      
      // 存储认证信息到本地存储
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    }
  };

  // 登出方法
  const logout = async () => {
    // 清除本地存储中的认证信息
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    dispatch({ type: 'LOGOUT' });
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      
      // 更新本地存储
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  // 刷新令牌
  const refreshToken = async () => {
    // 实际项目中这里应该调用API刷新令牌
    // 目前只是一个占位实现
    console.log('刷新令牌');
  };

  // 提供的上下文值
  const contextValue = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    // 添加权限相关方法到上下文
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getUserPermissions,
  } as AuthContextType & {
    hasPermission: (permission: Permission) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    getUserPermissions: () => Permission[];
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，用于在组件中使用认证上下文
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}

// 导出认证上下文，供特殊情况使用
export { AuthContext };