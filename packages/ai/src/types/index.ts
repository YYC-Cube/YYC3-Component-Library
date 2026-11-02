/**
 * @file 核心类型定义
 * @description 定义项目中使用的共享数据类型
 * @module types
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

// 基础响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// 用户信息类型
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

// 工具功能类型
export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'medium' | 'complex';
  isImplemented: boolean;
  isAIEnhanced: boolean;
}

// 功能分类类型
export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  tools: Tool[];
}