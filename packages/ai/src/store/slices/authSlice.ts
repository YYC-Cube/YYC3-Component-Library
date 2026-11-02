import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// 用户认证状态接口
interface AuthState {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  } | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// 登录请求参数接口
interface LoginCredentials {
  email: string
  password: string
}

// 注册请求参数接口
interface RegisterData extends LoginCredentials {
  name: string
}

// 初始状态
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

// 异步thunk: 登录
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // 实际项目中这里应该调用API
      // const response = await api.post('/auth/login', credentials)
      // return response.data
      
      // 模拟API响应
      return {
        user: {
          id: 'user_123',
          name: 'YanYu',
          email: credentials.email,
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=YanYu',
        },
        token: 'mock_token_123',
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '登录失败，请稍后重试'
      )
    }
  }
)

// 异步thunk: 注册
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // 实际项目中这里应该调用API
      // const response = await api.post('/auth/register', userData)
      // return response.data
      
      // 模拟API响应
      return {
        user: {
          id: `user_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: 'user',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.name,
        },
        token: 'mock_token_' + Date.now(),
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '注册失败，请稍后重试'
      )
    }
  }
)

// 创建认证状态管理slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 登出
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null
    },
    
    // 更新用户信息
    updateUser: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    // 登录处理
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
    // 注册处理
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// 导出actions
export const { logout, clearError, updateUser } = authSlice.actions

// 导出reducer
export default authSlice.reducer

/**
 * @file 认证状态管理
 * @description 处理用户登录、注册、登出等认证相关状态
 * @module store/slices/authSlice
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */
