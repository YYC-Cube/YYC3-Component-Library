/**
 * @file 权限管理服务
 * @description 提供系统权限控制和API访问权限管理功能
 * @module permissionService
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { UserRole } from '@/types/auth';

// 定义权限类型
export type Permission = 
  // UI权限
  | 'ui:component:register' 
  | 'ui:component:use'
  | 'ui:dialog:open'
  | 'ui:notification:show'
  
  // AI功能权限
  | 'ai:text:generate'
  | 'ai:text:classify'
  | 'ai:text:summarize'
  | 'ai:image:generate'
  | 'ai:image:analyze'
  | 'ai:chat:use'
  
  // 存储权限
  | 'storage:local:read'
  | 'storage:local:write'
  | 'storage:cloud:read'
  | 'storage:cloud:write'
  
  // 工具权限
  | 'tool:code-review:use'
  | 'tool:translation:use'
  | 'tool:content:use'
  | 'tool:chat:use'
  
  // 管理权限
  | 'admin:user:manage'
  | 'admin:plugin:manage'
  | 'admin:api:manage';

// API密钥类型
export interface ApiKey {
  id: string;
  key: string; // 实际存储时应该是哈希后的
  name: string;
  description?: string;
  ownerId: string;
  permissions: Permission[];
  scopes: string[];
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
  isActive: boolean;
  rateLimit: {
    requests: number;
    period: string; // 例如 'minute', 'hour', 'day'
  };
}

// API密钥使用统计
export interface ApiKeyUsage {
  keyId: string;
  usageCount: number;
  lastUsed: string;
  requestHistory: Array<{
    timestamp: string;
    endpoint: string;
    status: number;
    responseTime: number;
  }>;
}

// 权限请求结果
export interface PermissionRequestResult {
  granted: string[];
  denied: string[];
  pending?: string[];
}

// 权限验证结果
export interface PermissionValidationResult {
  isValid: boolean;
  missingPermissions?: string[];
  error?: string;
}

// 角色权限映射
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    // UI基础权限
    'ui:component:use',
    'ui:dialog:open',
    'ui:notification:show',
    
    // AI基础功能
    'ai:text:generate',
    'ai:text:summarize',
    'ai:chat:use',
    
    // 基础存储权限
    'storage:local:read',
    'storage:local:write',
    
    // 基础工具权限
    'tool:translation:use',
    'tool:chat:use'
  ],
  
  developer: [
    // 继承user的所有权限
    ...ROLE_PERMISSIONS.user,
    
    // 开发人员特有权限
    'ui:component:register',
    'ai:text:classify',
    'ai:image:generate',
    'ai:image:analyze',
    'storage:cloud:read',
    'storage:cloud:write',
    'tool:code-review:use',
    'tool:content:use'
  ],
  
  admin: [
    // 继承developer的所有权限
    ...ROLE_PERMISSIONS.developer,
    
    // 管理员特有权限
    'admin:user:manage',
    'admin:plugin:manage',
    'admin:api:manage'
  ]
};

// 权限描述映射
const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  // UI权限
  'ui:component:register': '注册自定义UI组件',
  'ui:component:use': '使用UI组件',
  'ui:dialog:open': '打开对话框',
  'ui:notification:show': '显示通知',
  
  // AI功能权限
  'ai:text:generate': '文本生成',
  'ai:text:classify': '文本分类',
  'ai:text:summarize': '文本摘要',
  'ai:image:generate': '图像生成',
  'ai:image:analyze': '图像分析',
  'ai:chat:use': 'AI聊天',
  
  // 存储权限
  'storage:local:read': '读取本地存储',
  'storage:local:write': '写入本地存储',
  'storage:cloud:read': '读取云存储',
  'storage:cloud:write': '写入云存储',
  
  // 工具权限
  'tool:code-review:use': '使用代码审查工具',
  'tool:translation:use': '使用翻译工具',
  'tool:content:use': '使用内容生成工具',
  'tool:chat:use': '使用聊天工具',
  
  // 管理权限
  'admin:user:manage': '管理用户',
  'admin:plugin:manage': '管理插件',
  'admin:api:manage': '管理API和密钥'
};

/**
 * 权限管理服务类
 * 提供权限检查、API密钥管理和访问控制功能
 */
export class PermissionService {
  private apiKeys: Map<string, ApiKey> = new Map();
  private apiKeyUsage: Map<string, ApiKeyUsage> = new Map();
  
  /**
   * 检查用户是否具有特定权限
   * @param userRole 用户角色
   * @param permission 权限名称
   * @returns 是否具有权限
   */
  hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  }
  
  /**
   * 检查用户是否具有多个权限中的任意一个
   * @param userRole 用户角色
   * @param permissions 权限列表
   * @returns 是否具有任意一个权限
   */
  hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }
  
  /**
   * 检查用户是否具有所有指定权限
   * @param userRole 用户角色
   * @param permissions 权限列表
   * @returns 是否具有所有权限
   */
  hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }
  
  /**
   * 获取用户角色的所有权限
   * @param userRole 用户角色
   * @returns 权限列表
   */
  getUserPermissions(userRole: UserRole): Permission[] {
    return [...(ROLE_PERMISSIONS[userRole] || [])];
  }
  
  /**
   * 生成新的API密钥
   * @param name 密钥名称
   * @param ownerId 所有者ID
   * @param permissions 权限列表
   * @param options 选项配置
   * @returns 新生成的API密钥信息
   */
  generateApiKey(
    name: string,
    ownerId: string,
    permissions: Permission[],
    options?: {
      description?: string;
      expiresAt?: string;
      rateLimit?: {
        requests: number;
        period: string;
      };
    }
  ): ApiKey {
    const id = `api_key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = `sk_yyc3_${this.generateSecureKey(32)}`;
    
    const apiKey: ApiKey = {
      id,
      key, // 注意：实际使用中应该存储哈希值
      name,
      description: options?.description,
      ownerId,
      permissions,
      scopes: permissions.map(p => p.split(':')[0]),
      createdAt: new Date().toISOString(),
      expiresAt: options?.expiresAt,
      isActive: true,
      rateLimit: options?.rateLimit || { requests: 1000, period: 'hour' }
    };
    
    this.apiKeys.set(id, apiKey);
    this.initializeApiKeyUsage(id);
    
    return apiKey;
  }
  
  /**
   * 验证API密钥
   * @param keyString API密钥字符串
   * @returns 验证结果
   */
  validateApiKey(keyString: string): { valid: boolean; apiKey?: ApiKey; error?: string } {
    // 在实际实现中，这里应该检查密钥的哈希值
    for (const [, apiKey] of this.apiKeys) {
      if (apiKey.key === keyString) {
        // 检查密钥是否过期
        if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
          return { valid: false, error: 'API密钥已过期' };
        }
        
        // 检查密钥是否激活
        if (!apiKey.isActive) {
          return { valid: false, error: 'API密钥已被禁用' };
        }
        
        return { valid: true, apiKey };
      }
    }
    
    return { valid: false, error: '无效的API密钥' };
  }
  
  /**
   * 检查API密钥是否具有特定权限
   * @param apiKeyId API密钥ID
   * @param permission 权限名称
   * @returns 是否具有权限
   */
  hasApiKeyPermission(apiKeyId: string, permission: Permission): boolean {
    const apiKey = this.apiKeys.get(apiKeyId);
    return apiKey ? apiKey.permissions.includes(permission) : false;
  }
  
  /**
   * 记录API密钥使用情况
   * @param apiKeyId API密钥ID
   * @param endpoint 请求的端点
   * @param status 响应状态码
   * @param responseTime 响应时间（毫秒）
   */
  recordApiKeyUsage(apiKeyId: string, endpoint: string, status: number, responseTime: number): void {
    const usage = this.apiKeyUsage.get(apiKeyId);
    if (usage) {
      usage.usageCount++;
      usage.lastUsed = new Date().toISOString();
      usage.requestHistory.push({
        timestamp: new Date().toISOString(),
        endpoint,
        status,
        responseTime
      });
      
      // 限制历史记录长度
      if (usage.requestHistory.length > 1000) {
        usage.requestHistory.shift();
      }
    }
  }
  
  /**
   * 检查API密钥是否超出速率限制
   * @param apiKeyId API密钥ID
   * @returns 是否超出限制
   */
  isRateLimited(apiKeyId: string): boolean {
    const apiKey = this.apiKeys.get(apiKeyId);
    const usage = this.apiKeyUsage.get(apiKeyId);
    
    if (!apiKey || !usage) return false;
    
    const { requests, period } = apiKey.rateLimit;
    const now = new Date();
    let thresholdTime: Date;
    
    switch (period) {
      case 'minute':
        thresholdTime = new Date(now.getTime() - 60 * 1000);
        break;
      case 'hour':
        thresholdTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        thresholdTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        return false;
    }
    
    // 计算指定时间段内的请求次数
    const recentRequests = usage.requestHistory.filter(
      req => new Date(req.timestamp) > thresholdTime
    ).length;
    
    return recentRequests >= requests;
  }
  
  /**
   * 吊销API密钥
   * @param apiKeyId API密钥ID
   * @returns 是否成功吊销
   */
  revokeApiKey(apiKeyId: string): boolean {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (apiKey) {
      apiKey.isActive = false;
      return true;
    }
    return false;
  }
  
  /**
   * 获取权限描述
   * @param permission 权限名称
   * @returns 权限描述
   */
  getPermissionDescription(permission: Permission): string {
    return PERMISSION_DESCRIPTIONS[permission] || '未知权限';
  }
  
  /**
   * 生成安全的密钥字符串
   * @param length 密钥长度
   * @returns 随机密钥字符串
   */
  private generateSecureKey(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }
  
  /**
   * 初始化API密钥使用统计
   * @param apiKeyId API密钥ID
   */
  private initializeApiKeyUsage(apiKeyId: string): void {
    this.apiKeyUsage.set(apiKeyId, {
      keyId: apiKeyId,
      usageCount: 0,
      lastUsed: new Date().toISOString(),
      requestHistory: []
    });
  }
}

// 导出单例实例
export const permissionService = new PermissionService();

export default permissionService;