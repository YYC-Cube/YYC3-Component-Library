/**
 * @file API密钥管理服务
 * @description 提供API密钥的生成、验证、撤销和使用统计功能
 * @module apiKeyService
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { ApiKey, ApiKeyUsage, Permission } from '@/lib/permissionService';
import { ApiKeyRequestParams, ApiKeyResponse, ApiKeyListItem } from '@/types/auth';

// API密钥存储接口
interface ApiKeyStorage {
  save(key: ApiKey): Promise<void>;
  getById(id: string): Promise<ApiKey | null>;
  getByKey(key: string): Promise<ApiKey | null>;
  getAllByOwner(ownerId: string): Promise<ApiKey[]>;
  update(key: ApiKey): Promise<void>;
  delete(id: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// 模拟存储实现（在真实环境中应该使用数据库）
class MockApiKeyStorage implements ApiKeyStorage {
  private keys: Map<string, ApiKey> = new Map();
  
  async save(key: ApiKey): Promise<void> {
    this.keys.set(key.id, key);
    // 在真实环境中，这里应该将密钥哈希后存储
    console.log(`保存API密钥: ${key.id} 给用户: ${key.ownerId}`);
  }
  
  async getById(id: string): Promise<ApiKey | null> {
    return this.keys.get(id) || null;
  }
  
  async getByKey(key: string): Promise<ApiKey | null> {
    // 注意：在真实环境中，应该使用哈希比较
    for (const storedKey of this.keys.values()) {
      if (storedKey.key === key) {
        return storedKey;
      }
    }
    return null;
  }
  
  async getAllByOwner(ownerId: string): Promise<ApiKey[]> {
    return Array.from(this.keys.values()).filter(key => key.ownerId === ownerId);
  }
  
  async update(key: ApiKey): Promise<void> {
    if (this.keys.has(key.id)) {
      this.keys.set(key.id, key);
    }
  }
  
  async delete(id: string): Promise<void> {
    this.keys.delete(id);
  }
  
  async exists(key: string): Promise<boolean> {
    // 在真实环境中，应该使用哈希比较
    for (const storedKey of this.keys.values()) {
      if (storedKey.key === key) {
        return true;
      }
    }
    return false;
  }
}

/**
 * API密钥管理服务
 * 提供完整的API密钥生命周期管理功能
 */
export class ApiKeyService {
  private storage: ApiKeyStorage;
  private usageData: Map<string, ApiKeyUsage> = new Map();
  
  constructor(storage?: ApiKeyStorage) {
    this.storage = storage || new MockApiKeyStorage();
  }
  
  /**
   * 创建新的API密钥
   * @param ownerId 密钥所有者ID
   * @param params API密钥参数
   * @returns 新创建的API密钥响应
   */
  async createApiKey(ownerId: string, params: ApiKeyRequestParams): Promise<ApiKeyResponse> {
    // 验证权限列表（可以在这里添加额外的验证逻辑）
    const validPermissions = this.validatePermissions(params.permissions);
    
    // 生成唯一ID和密钥
    const id = `api_key_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const keyValue = this.generateSecureKey();
    
    // 创建API密钥对象
    const apiKey: ApiKey = {
      id,
      key: keyValue, // 注意：在真实环境中应该存储哈希值
      name: params.name,
      description: params.description,
      ownerId,
      permissions: validPermissions,
      scopes: validPermissions.map(p => p.split(':')[0]),
      createdAt: new Date().toISOString(),
      expiresAt: params.expirationDate,
      isActive: true,
      rateLimit: params.rateLimit || { requests: 1000, period: 'hour' }
    };
    
    // 保存到存储
    await this.storage.save(apiKey);
    
    // 初始化使用统计
    this.initializeUsageData(id);
    
    // 返回响应（注意只返回一次完整密钥）
    return {
      keyId: id,
      keyValue,
      name: params.name,
      createdAt: apiKey.createdAt,
      expiresAt: params.expirationDate,
      permissions: validPermissions
    };
  }
  
  /**
   * 验证API密钥
   * @param apiKey 要验证的API密钥
   * @returns 验证结果，包含API密钥信息（如果有效）
   */
  async validateApiKey(apiKey: string): Promise<{ valid: boolean; apiKey?: ApiKey; error?: string }> {
    // 从存储中查找密钥
    const storedKey = await this.storage.getByKey(apiKey);
    
    if (!storedKey) {
      return { valid: false, error: '无效的API密钥' };
    }
    
    // 检查密钥是否已禁用
    if (!storedKey.isActive) {
      return { valid: false, error: 'API密钥已被禁用' };
    }
    
    // 检查密钥是否已过期
    if (storedKey.expiresAt && new Date(storedKey.expiresAt) < new Date()) {
      return { valid: false, error: 'API密钥已过期' };
    }
    
    // 检查速率限制
    if (this.isRateLimited(storedKey.id)) {
      return { valid: false, error: '超出API调用速率限制' };
    }
    
    return { valid: true, apiKey: storedKey };
  }
  
  /**
   * 检查API密钥是否具有特定权限
   * @param apiKeyId API密钥ID
   * @param permission 权限名称
   * @returns 是否具有权限
   */
  async hasPermission(apiKeyId: string, permission: Permission): Promise<boolean> {
    const apiKey = await this.storage.getById(apiKeyId);
    return apiKey ? apiKey.permissions.includes(permission) : false;
  }
  
  /**
   * 记录API密钥使用情况
   * @param apiKeyId API密钥ID
   * @param endpoint 访问的端点
   * @param status 响应状态码
   * @param responseTime 响应时间（毫秒）
   */
  async recordUsage(apiKeyId: string, endpoint: string, status: number, responseTime: number): Promise<void> {
    const usage = this.usageData.get(apiKeyId);
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
   * 吊销API密钥
   * @param apiKeyId API密钥ID
   * @param ownerId 所有者ID（用于验证所有权）
   * @returns 是否成功吊销
   */
  async revokeApiKey(apiKeyId: string, ownerId: string): Promise<boolean> {
    const apiKey = await this.storage.getById(apiKeyId);
    
    if (!apiKey || apiKey.ownerId !== ownerId) {
      return false;
    }
    
    // 将密钥标记为无效而不是删除，以便保留历史记录
    apiKey.isActive = false;
    await this.storage.update(apiKey);
    
    return true;
  }
  
  /**
   * 获取用户的所有API密钥列表
   * @param ownerId 所有者ID
   * @returns API密钥列表
   */
  async getUserApiKeys(ownerId: string): Promise<ApiKeyListItem[]> {
    const keys = await this.storage.getAllByOwner(ownerId);
    
    return keys.map(key => ({
      id: key.id,
      name: key.name,
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
      lastUsed: this.usageData.get(key.id)?.lastUsed,
      usageCount: this.usageData.get(key.id)?.usageCount || 0,
      isActive: key.isActive
    }));
  }
  
  /**
   * 生成API密钥使用报告
   * @param apiKeyId API密钥ID
   * @returns 使用报告数据
   */
  getApiKeyUsageReport(apiKeyId: string): ApiKeyUsage | undefined {
    return this.usageData.get(apiKeyId);
  }
  
  /**
   * 验证权限列表的有效性
   * @param permissions 权限列表
   * @returns 有效的权限列表
   */
  private validatePermissions(permissions: string[]): Permission[] {
    // 这里应该有更严格的权限验证逻辑
    // 现在简单返回所有权限
    return permissions as Permission[];
  }
  
  /**
   * 生成安全的API密钥
   * @returns 随机生成的安全密钥
   */
  private generateSecureKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk_yyc3_';
    
    // 生成32个随机字符
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
  
  /**
   * 检查API密钥是否超出速率限制
   * @param apiKeyId API密钥ID
   * @returns 是否已超出限制
   */
  private isRateLimited(apiKeyId: string): boolean {
    const usage = this.usageData.get(apiKeyId);
    if (!usage) return false;
    
    // 这里应该实现完整的速率限制逻辑
    // 当前简单实现，实际应该基于apiKey的rateLimit配置
    return false;
  }
  
  /**
   * 初始化API密钥使用数据
   * @param apiKeyId API密钥ID
   */
  private initializeUsageData(apiKeyId: string): void {
    this.usageData.set(apiKeyId, {
      keyId: apiKeyId,
      usageCount: 0,
      lastUsed: new Date().toISOString(),
      requestHistory: []
    });
  }
}

// 导出单例实例
export const apiKeyService = new ApiKeyService();

export default apiKeyService;