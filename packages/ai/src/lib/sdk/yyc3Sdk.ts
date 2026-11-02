/**
 * @file YYC³ Easy❤️AI SDK
 * @description 提供与YYC³ Easy❤️AI API交互的客户端SDK
 * @module lib/sdk/yyc3Sdk
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}

/**
 * 工具信息接口
 */
export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
}

/**
 * 工具执行结果接口
 */
export interface ToolExecutionResult {
  toolId: string;
  output: string;
  parameters: Record<string, any>;
  timestamp: string;
}

/**
 * API密钥接口
 */
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  permissions: string[];
}

/**
 * 创建API密钥参数接口
 */
export interface CreateApiKeyParams {
  name: string;
  permissions: string[];
  expiresAt?: string;
}

/**
 * 系统健康状态接口
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  uptime: string;
  memory: {
    rss: string;
    heapUsed: string;
    heapTotal: string;
  };
  services: {
    [key: string]: {
      status: string;
      latency: number;
    };
  };
}

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

/**
 * 认证响应接口
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 登录参数接口
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * 注册参数接口
 */
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  name?: string;
}

/**
 * SDK配置接口
 */
export interface Yyc3SdkConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * YYC³ Easy❤️AI SDK类
 */
export class Yyc3Sdk {
  private apiKey?: string;
  private baseUrl: string;
  private timeout: number;
  
  /**
   * 构造函数
   * @param config SDK配置
   */
  constructor(config: Yyc3SdkConfig = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.yyc3.ai/v1';
    this.timeout = config.timeout || 30000; // 默认30秒超时
  }
  
  /**
   * 设置API密钥
   * @param apiKey API密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * 设置基础URL
   * @param baseUrl 基础URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 构建请求头
   * @param customHeaders 自定义请求头
   * @returns 请求头对象
   */
  private buildHeaders(customHeaders: HeadersInit = {}): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    
    return headers;
  }
  
  /**
   * 发送HTTP请求
   * @param endpoint API端点
   * @param options 请求选项
   * @returns Promise<T>
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // 创建带超时的请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.buildHeaders(options.headers),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // 检查响应状态
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `API错误: ${response.status}`);
        } catch (e) {
          throw new Error(`API错误: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      // 检查业务层面的成功状态
      if ('success' in data && !data.success) {
        throw new Error(data.error || '请求失败');
      }
      
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      
      throw error;
    }
  }
  
  /**
   * 健康检查
   * @returns Promise<HealthStatus>
   */
  async healthCheck(): Promise<HealthStatus> {
    const response = await this.request<ApiResponse<HealthStatus>>('/health');
    return response.data!;
  }
  
  /**
   * 获取所有工具
   * @returns Promise<Tool[]>
   */
  async getAllTools(): Promise<Tool[]> {
    const response = await this.request<ApiResponse<Tool[]>>('/tools');
    return response.data!;
  }
  
  /**
   * 根据ID获取工具
   * @param id 工具ID
   * @returns Promise<Tool>
   */
  async getToolById(id: string): Promise<Tool> {
    const response = await this.request<ApiResponse<Tool>>(`/tools?id=${encodeURIComponent(id)}`);
    return response.data!;
  }
  
  /**
   * 根据分类获取工具
   * @param category 工具分类
   * @returns Promise<Tool[]>
   */
  async getToolsByCategory(category: string): Promise<Tool[]> {
    const response = await this.request<ApiResponse<Tool[]>>(`/tools?category=${encodeURIComponent(category)}`);
    return response.data!;
  }
  
  /**
   * 搜索工具
   * @param keyword 搜索关键词
   * @returns Promise<Tool[]>
   */
  async searchTools(keyword: string): Promise<Tool[]> {
    const response = await this.request<ApiResponse<Tool[]>>(`/tools?search=${encodeURIComponent(keyword)}`);
    return response.data!;
  }
  
  /**
   * 执行工具
   * @param toolId 工具ID
   * @param parameters 工具参数
   * @returns Promise<ToolExecutionResult>
   */
  async executeTool(toolId: string, parameters: Record<string, any> = {}): Promise<ToolExecutionResult> {
    if (!this.apiKey) {
      throw new Error('执行工具需要设置API密钥');
    }
    
    const response = await this.request<ApiResponse<ToolExecutionResult>>('/tools', {
      method: 'POST',
      body: JSON.stringify({ toolId, parameters }),
    });
    
    return response.data!;
  }
  
  /**
   * 用户登录
   * @param params 登录参数
   * @returns Promise<AuthResponse>
   */
  async login(params: LoginParams): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return response.data!;
  }
  
  /**
   * 用户注册
   * @param params 注册参数
   * @returns Promise<AuthResponse>
   */
  async register(params: RegisterParams): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return response.data!;
  }
  
  /**
   * 获取API密钥列表
   * @returns Promise<ApiKey[]>
   */
  async getApiKeys(): Promise<ApiKey[]> {
    if (!this.apiKey) {
      throw new Error('获取API密钥列表需要设置API密钥');
    }
    
    const response = await this.request<ApiResponse<ApiKey[]>>('/api-keys');
    return response.data!;
  }
  
  /**
   * 创建API密钥
   * @param params 创建API密钥参数
   * @returns Promise<ApiKey>
   */
  async createApiKey(params: CreateApiKeyParams): Promise<ApiKey> {
    if (!this.apiKey) {
      throw new Error('创建API密钥需要设置API密钥');
    }
    
    const response = await this.request<ApiResponse<ApiKey>>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return response.data!;
  }
  
  /**
   * 删除API密钥
   * @param id API密钥ID
   * @returns Promise<void>
   */
  async deleteApiKey(id: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('删除API密钥需要设置API密钥');
    }
    
    await this.request<ApiResponse>(`/api-keys?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }
}

/**
 * 创建SDK实例的工厂函数
 * @param config SDK配置
 * @returns Yyc3Sdk实例
 */
export function createYyc3Sdk(config?: Yyc3SdkConfig): Yyc3Sdk {
  return new Yyc3Sdk(config);
}

// 默认导出
export default Yyc3Sdk;