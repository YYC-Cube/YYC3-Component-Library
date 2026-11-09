import { apiClient } from "./api-client"

// 数据类型定义
export interface SalesData {
  id: string
  date: string
  amount: number
  productId: string
  productName: string
  customerId: string
  customerName: string
  paymentMethod: string
  status: string
}

export interface ProductData {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerData {
  id: string
  name: string
  email: string
  phone: string
  membershipLevel: string
  totalSpent: number
  lastPurchase: string
  createdAt: string
}

export interface InventoryData {
  id: string
  productId: string
  productName: string
  quantity: number
  location: string
  lastUpdated: string
  status: string
}

export interface DashboardStats {
  dailySales: number
  dailyOrders: number
  activeMembers: number
  averageOrderValue: number
  salesTrend: Array<{ date: string; value: number }>
  ordersTrend: Array<{ date: string; value: number }>
  categoryDistribution: Array<{ category: string; value: number; color: string }>
  recentActivities: Array<{
    id: string
    type: string
    title: string
    description: string
    time: string
  }>
}

// 销售数据服务
export const salesService = {
  // 获取销售列表
  async getSales(params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
    status?: string
    search?: string
  }): Promise<{ data: SalesData[]; total: number; page: number; limit: number }> {
    return apiClient.get("sales", params)
  },

  // 获取销售详情
  async getSale(id: string): Promise<SalesData> {
    return apiClient.get(`sales/${id}`)
  },

  // 创建销售记录
  async createSale(data: Omit<SalesData, "id">): Promise<SalesData> {
    return apiClient.post("sales", data)
  },

  // 更新销售记录
  async updateSale(id: string, data: Partial<SalesData>): Promise<SalesData> {
    return apiClient.patch(`sales/${id}`, data)
  },

  // 删除销售记录
  async deleteSale(id: string): Promise<void> {
    return apiClient.delete(`sales/${id}`)
  },

  // 获取销售统计
  async getSalesStats(params?: {
    startDate?: string
    endDate?: string
    groupBy?: "day" | "week" | "month"
  }): Promise<Array<{ date: string; sales: number; orders: number }>> {
    return apiClient.get("sales/stats", params)
  },
}

// 产品数据服务
export const productService = {
  // 获取产品列表
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<{ data: ProductData[]; total: number; page: number; limit: number }> {
    return apiClient.get("products", params)
  },

  // 获取产品详情
  async getProduct(id: string): Promise<ProductData> {
    return apiClient.get(`products/${id}`)
  },

  // 创建产品
  async createProduct(data: Omit<ProductData, "id" | "createdAt" | "updatedAt">): Promise<ProductData> {
    return apiClient.post("products", data)
  },

  // 更新产品
  async updateProduct(id: string, data: Partial<ProductData>): Promise<ProductData> {
    return apiClient.patch(`products/${id}`, data)
  },

  // 删除产品
  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete(`products/${id}`)
  },

  // 上传产品图片
  async uploadProductImage(id: string, file: File): Promise<{ imageUrl: string }> {
    return apiClient.uploadFile(`products/${id}/image`, file)
  },
}

// 客户数据服务
export const customerService = {
  // 获取客户列表
  async getCustomers(params?: {
    page?: number
    limit?: number
    membershipLevel?: string
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<{ data: CustomerData[]; total: number; page: number; limit: number }> {
    return apiClient.get("customers", params)
  },

  // 获取客户详情
  async getCustomer(id: string): Promise<CustomerData> {
    return apiClient.get(`customers/${id}`)
  },

  // 创建客户
  async createCustomer(
    data: Omit<CustomerData, "id" | "totalSpent" | "lastPurchase" | "createdAt">,
  ): Promise<CustomerData> {
    return apiClient.post("customers", data)
  },

  // 更新客户
  async updateCustomer(id: string, data: Partial<CustomerData>): Promise<CustomerData> {
    return apiClient.patch(`customers/${id}`, data)
  },

  // 删除客户
  async deleteCustomer(id: string): Promise<void> {
    return apiClient.delete(`customers/${id}`)
  },

  // 获取客户购买历史
  async getCustomerPurchaseHistory(
    id: string,
    params?: {
      page?: number
      limit?: number
    },
  ): Promise<{ data: SalesData[]; total: number; page: number; limit: number }> {
    return apiClient.get(`customers/${id}/purchases`, params)
  },
}

// 库存数据服务
export const inventoryService = {
  // 获取库存列表
  async getInventory(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<{ data: InventoryData[]; total: number; page: number; limit: number }> {
    return apiClient.get("inventory", params)
  },

  // 获取库存详情
  async getInventoryItem(id: string): Promise<InventoryData> {
    return apiClient.get(`inventory/${id}`)
  },

  // 更新库存
  async updateInventory(id: string, data: Partial<InventoryData>): Promise<InventoryData> {
    return apiClient.patch(`inventory/${id}`, data)
  },

  // 调整库存数量
  async adjustInventory(id: string, adjustment: number, reason: string): Promise<InventoryData> {
    return apiClient.post(`inventory/${id}/adjust`, { adjustment, reason })
  },

  // 获取库存警告
  async getInventoryAlerts(): Promise<InventoryData[]> {
    return apiClient.get("inventory/alerts")
  },
}

// 仪表盘数据服务
export const dashboardService = {
  // 获取仪表盘统计数据
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get("dashboard/stats")
  },

  // 获取销售趋势
  async getSalesTrend(params: {
    period: "day" | "week" | "month" | "year"
    startDate?: string
    endDate?: string
  }): Promise<Array<{ date: string; value: number }>> {
    return apiClient.get("dashboard/sales-trend", params)
  },

  // 获取订单趋势
  async getOrdersTrend(params: {
    period: "day" | "week" | "month" | "year"
    startDate?: string
    endDate?: string
  }): Promise<Array<{ date: string; value: number }>> {
    return apiClient.get("dashboard/orders-trend", params)
  },

  // 获取类别分布
  async getCategoryDistribution(): Promise<Array<{ category: string; value: number; color: string }>> {
    return apiClient.get("dashboard/category-distribution")
  },

  // 获取最近活动
  async getRecentActivities(limit = 10): Promise<
    Array<{
      id: string
      type: string
      title: string
      description: string
      time: string
    }>
  > {
    return apiClient.get("dashboard/recent-activities", { limit })
  },
}
