"use client"

import { useState, useEffect, useCallback } from "react"
import {
  salesService,
  productService,
  customerService,
  inventoryService,
  dashboardService,
  type SalesData,
  type ProductData,
  type CustomerData,
  type InventoryData,
  type DashboardStats,
} from "@/lib/api/data-services"

// 通用数据加载状态
interface DataState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

// 通用分页数据
interface PaginatedData<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// 通用分页参数
interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// 销售数据钩子
export function useSales(
  params?: PaginationParams & {
    startDate?: string
    endDate?: string
    status?: string
  },
) {
  const [state, setState] = useState<DataState<PaginatedData<SalesData>>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchSales = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await salesService.getSales(params)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [params])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  return {
    ...state,
    refetch: fetchSales,
  }
}

// 销售详情钩子
export function useSaleDetails(id: string) {
  const [state, setState] = useState<DataState<SalesData>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchSaleDetails = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await salesService.getSale(id)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [id])

  useEffect(() => {
    fetchSaleDetails()
  }, [fetchSaleDetails])

  return {
    ...state,
    refetch: fetchSaleDetails,
  }
}

// 产品数据钩子
export function useProducts(
  params?: PaginationParams & {
    category?: string
  },
) {
  const [state, setState] = useState<DataState<PaginatedData<ProductData>>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await productService.getProducts(params)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [params])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    ...state,
    refetch: fetchProducts,
  }
}

// 产品详情钩子
export function useProductDetails(id: string) {
  const [state, setState] = useState<DataState<ProductData>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchProductDetails = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await productService.getProduct(id)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [id])

  useEffect(() => {
    fetchProductDetails()
  }, [fetchProductDetails])

  return {
    ...state,
    refetch: fetchProductDetails,
  }
}

// 客户数据钩子
export function useCustomers(
  params?: PaginationParams & {
    membershipLevel?: string
  },
) {
  const [state, setState] = useState<DataState<PaginatedData<CustomerData>>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchCustomers = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await customerService.getCustomers(params)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [params])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return {
    ...state,
    refetch: fetchCustomers,
  }
}

// 客户详情钩子
export function useCustomerDetails(id: string) {
  const [state, setState] = useState<DataState<CustomerData>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchCustomerDetails = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await customerService.getCustomer(id)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [id])

  useEffect(() => {
    fetchCustomerDetails()
  }, [fetchCustomerDetails])

  return {
    ...state,
    refetch: fetchCustomerDetails,
  }
}

// 库存数据钩子
export function useInventory(
  params?: PaginationParams & {
    status?: string
  },
) {
  const [state, setState] = useState<DataState<PaginatedData<InventoryData>>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchInventory = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await inventoryService.getInventory(params)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [params])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  return {
    ...state,
    refetch: fetchInventory,
  }
}

// 仪表盘数据钩子
export function useDashboardStats() {
  const [state, setState] = useState<DataState<DashboardStats>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchDashboardStats = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await dashboardService.getDashboardStats()
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  return {
    ...state,
    refetch: fetchDashboardStats,
  }
}

// 销售趋势钩子
export function useSalesTrend(params: {
  period: "day" | "week" | "month" | "year"
  startDate?: string
  endDate?: string
}) {
  const [state, setState] = useState<DataState<Array<{ date: string; value: number }>>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchSalesTrend = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await dashboardService.getSalesTrend(params)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [params])

  useEffect(() => {
    fetchSalesTrend()
  }, [fetchSalesTrend])

  return {
    ...state,
    refetch: fetchSalesTrend,
  }
}

// 类别分布钩子
export function useCategoryDistribution() {
  const [state, setState] = useState<DataState<Array<{ category: string; value: number; color: string }>>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchCategoryDistribution = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await dashboardService.getCategoryDistribution()
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [])

  useEffect(() => {
    fetchCategoryDistribution()
  }, [fetchCategoryDistribution])

  return {
    ...state,
    refetch: fetchCategoryDistribution,
  }
}

// 最近活动钩子
export function useRecentActivities(limit = 10) {
  const [state, setState] = useState<
    DataState<
      Array<{
        id: string
        type: string
        title: string
        description: string
        time: string
      }>
    >
  >({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchRecentActivities = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await dashboardService.getRecentActivities(limit)
      setState({ data: result, isLoading: false, error: null })
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error })
    }
  }, [limit])

  useEffect(() => {
    fetchRecentActivities()
  }, [fetchRecentActivities])

  return {
    ...state,
    refetch: fetchRecentActivities,
  }
}
