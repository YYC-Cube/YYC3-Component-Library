"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CustomerManagement } from "../customer-management"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock local database
const mockLocalDB = {
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  search: vi.fn(),
  count: vi.fn(),
}

vi.mock("../../lib/local-database", () => ({
  localDB: mockLocalDB,
}))

describe("CustomerManagement Component", () => {
  const mockCustomers = [
    {
      id: "1",
      name: "张总",
      company: "华润集团",
      email: "zhang@huarun.com",
      phone: "138-0000-1234",
      status: "active",
      value: 500000,
      lastContact: "2025-06-19",
      assignedTo: "李销售",
      tags: ["VIP", "大客户"],
      notes: "重要客户",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-06-19T00:00:00Z",
    },
    {
      id: "2",
      name: "王经理",
      company: "万科地产",
      email: "wang@vanke.com",
      phone: "139-0000-5678",
      status: "potential",
      value: 300000,
      lastContact: "2025-06-18",
      assignedTo: "陈销售",
      tags: ["潜在客户"],
      notes: "正在洽谈中",
      createdAt: "2025-01-02T00:00:00Z",
      updatedAt: "2025-06-18T00:00:00Z",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalDB.list.mockResolvedValue(mockCustomers)
    mockLocalDB.count.mockResolvedValue(mockCustomers.length)
    mockLocalDB.search.mockResolvedValue([])
  })

  it("应该正确渲染客户管理组件", async () => {
    render(<CustomerManagement />)

    // 检查标题
    expect(screen.getByText("客户管理")).toBeInTheDocument()

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText("张总")).toBeInTheDocument()
      expect(screen.getByText("王经理")).toBeInTheDocument()
    })
  })

  it("应该显示客户统计信息", async () => {
    render(<CustomerManagement />)

    await waitFor(() => {
      // 检查统计卡片
      expect(screen.getByText("总客户数")).toBeInTheDocument()
      expect(screen.getByText("活跃客户")).toBeInTheDocument()
      expect(screen.getByText("潜在客户")).toBeInTheDocument()
    })
  })

  it("搜索功能应该正常工作", async () => {
    mockLocalDB.search.mockResolvedValue([mockCustomers[0]])

    render(<CustomerManagement />)

    // 等待初始数据加载
    await waitFor(() => {
      expect(screen.getByText("张总")).toBeInTheDocument()
    })

    // 执行搜索
    const searchInput = screen.getByPlaceholderText(/搜索客户/i)
    fireEvent.change(searchInput, { target: { value: "张总" } })

    await waitFor(() => {
      expect(mockLocalDB.search).toHaveBeenCalledWith("customers", "张总", ["name", "company", "email", "phone"])
    })
  })

  it("应该能够创建新客户", async () => {
    const newCustomerId = "new-customer-id"
    mockLocalDB.create.mockResolvedValue(newCustomerId)

    render(<CustomerManagement />)

    // 点击添加客户按钮
    const addButton = screen.getByText("添加客户")
    fireEvent.click(addButton)

    // 填写表单
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/客户姓名/i)
      const companyInput = screen.getByLabelText(/公司名称/i)
      const emailInput = screen.getByLabelText(/邮箱/i)

      fireEvent.change(nameInput, { target: { value: "新客户" } })
      fireEvent.change(companyInput, { target: { value: "新公司" } })
      fireEvent.change(emailInput, { target: { value: "new@example.com" } })
    })

    // 提交表单
    const submitButton = screen.getByText("保存")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLocalDB.create).toHaveBeenCalledWith(
        "customers",
        expect.objectContaining({
          name: "新客户",
          company: "新公司",
          email: "new@example.com",
        }),
      )
    })
  })

  it("应该能够编辑客户信息", async () => {
    render(<CustomerManagement />)

    await waitFor(() => {
      expect(screen.getByText("张总")).toBeInTheDocument()
    })

    // 点击编辑按钮
    const editButtons = screen.getAllByText("编辑")
    fireEvent.click(editButtons[0])

    // 修改客户信息
    await waitFor(() => {
      const nameInput = screen.getByDisplayValue("张总")
      fireEvent.change(nameInput, { target: { value: "张总经理" } })
    })

    // 保存修改
    const saveButton = screen.getByText("保存")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockLocalDB.update).toHaveBeenCalledWith(
        "customers",
        "1",
        expect.objectContaining({
          name: "张总经理",
        }),
      )
    })
  })

  it("应该能够删除客户", async () => {
    mockLocalDB.delete.mockResolvedValue(undefined)

    render(<CustomerManagement />)

    await waitFor(() => {
      expect(screen.getByText("张总")).toBeInTheDocument()
    })

    // 点击删除按钮
    const deleteButtons = screen.getAllByText("删除")
    fireEvent.click(deleteButtons[0])

    // 确认删除
    await waitFor(() => {
      const confirmButton = screen.getByText("确认删除")
      fireEvent.click(confirmButton)
    })

    await waitFor(() => {
      expect(mockLocalDB.delete).toHaveBeenCalledWith("customers", "1")
    })
  })

  it("应该正确处理筛选功能", async () => {
    render(<CustomerManagement />)

    await waitFor(() => {
      expect(screen.getByText("张总")).toBeInTheDocument()
    })

    // 选择状态筛选
    const statusFilter = screen.getByRole("combobox", { name: /状态筛选/i })
    fireEvent.click(statusFilter)

    await waitFor(() => {
      const activeOption = screen.getByText("活跃客户")
      fireEvent.click(activeOption)
    })

    // 验证筛选结果
    await waitFor(() => {
      expect(mockLocalDB.list).toHaveBeenCalledWith(
        "customers",
        expect.objectContaining({
          index: "status",
          range: expect.any(Object),
        }),
      )
    })
  })

  it("应该正确处理分页", async () => {
    const manyCustomers = Array.from({ length: 25 }, (_, i) => ({
      ...mockCustomers[0],
      id: `customer-${i}`,
      name: `客户${i}`,
    }))

    mockLocalDB.list.mockResolvedValue(manyCustomers.slice(0, 10))
    mockLocalDB.count.mockResolvedValue(25)

    render(<CustomerManagement />)

    await waitFor(() => {
      expect(screen.getByText("客户0")).toBeInTheDocument()
    })

    // 点击下一页
    const nextPageButton = screen.getByText("下一页")
    fireEvent.click(nextPageButton)

    await waitFor(() => {
      expect(mockLocalDB.list).toHaveBeenCalledWith(
        "customers",
        expect.objectContaining({
          limit: 10,
          offset: 10,
        }),
      )
    })
  })

  it("应该处理错误状态", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockLocalDB.list.mockRejectedValue(new Error("数据库连接失败"))

    render(<CustomerManagement />)

    await waitFor(() => {
      expect(screen.getByText(/加载失败/i)).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it("应该支持批量操作", async () => {
    render(<CustomerManagement />)

    await waitFor(() => {
      expect(screen.getByText("张总")).toBeInTheDocument()
    })

    // 选择多个客户
    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0]) // 全选

    // 执行批量删除
    const batchDeleteButton = screen.getByText("批量删除")
    fireEvent.click(batchDeleteButton)

    // 确认批量删除
    await waitFor(() => {
      const confirmButton = screen.getByText("确认删除")
      fireEvent.click(confirmButton)
    })

    await waitFor(() => {
      expect(mockLocalDB.delete).toHaveBeenCalledTimes(mockCustomers.length)
    })
  })
})
