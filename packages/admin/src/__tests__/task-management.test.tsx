"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskManagement } from "../task-management"
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

describe("TaskManagement Component", () => {
  const mockTasks = [
    {
      id: "1",
      title: "产品原型设计",
      description: "完成新产品的原型设计",
      status: "in-progress",
      priority: "high",
      assignee: "张设计师",
      dueDate: "2025-06-25",
      progress: 65,
      tags: ["设计", "原型"],
      project: "新产品开发",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-06-19T00:00:00Z",
    },
    {
      id: "2",
      title: "数据库优化",
      description: "优化数据库查询性能",
      status: "todo",
      priority: "medium",
      assignee: "李工程师",
      dueDate: "2025-06-30",
      progress: 0,
      tags: ["技术", "优化"],
      project: "系统维护",
      createdAt: "2025-01-02T00:00:00Z",
      updatedAt: "2025-06-18T00:00:00Z",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalDB.list.mockResolvedValue(mockTasks)
    mockLocalDB.count.mockResolvedValue(mockTasks.length)
    mockLocalDB.search.mockResolvedValue([])
  })

  it("应该正确渲染任务管理组件", async () => {
    render(<TaskManagement />)

    expect(screen.getByText("任务管理")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("产品原型设计")).toBeInTheDocument()
      expect(screen.getByText("数据库优化")).toBeInTheDocument()
    })
  })

  it("应该显示任务统计信息", async () => {
    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText("总任务数")).toBeInTheDocument()
      expect(screen.getByText("进行中")).toBeInTheDocument()
      expect(screen.getByText("待开始")).toBeInTheDocument()
      expect(screen.getByText("已完成")).toBeInTheDocument()
    })
  })

  it("应该能够创建新任务", async () => {
    const newTaskId = "new-task-id"
    mockLocalDB.create.mockResolvedValue(newTaskId)

    render(<TaskManagement />)

    const addButton = screen.getByText("创建任务")
    fireEvent.click(addButton)

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/任务标题/i)
      const descInput = screen.getByLabelText(/任务描述/i)

      fireEvent.change(titleInput, { target: { value: "新任务" } })
      fireEvent.change(descInput, { target: { value: "新任务描述" } })
    })

    const submitButton = screen.getByText("保存")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLocalDB.create).toHaveBeenCalledWith(
        "tasks",
        expect.objectContaining({
          title: "新任务",
          description: "新任务描述",
        }),
      )
    })
  })

  it("应该能够更新任务状态", async () => {
    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText("产品原型设计")).toBeInTheDocument()
    })

    // 点击状态下拉菜单
    const statusButtons = screen.getAllByText("进行中")
    fireEvent.click(statusButtons[0])

    await waitFor(() => {
      const completedOption = screen.getByText("已完成")
      fireEvent.click(completedOption)
    })

    await waitFor(() => {
      expect(mockLocalDB.update).toHaveBeenCalledWith(
        "tasks",
        "1",
        expect.objectContaining({
          status: "completed",
          progress: 100,
        }),
      )
    })
  })

  it("应该能够按优先级筛选任务", async () => {
    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText("产品原型设计")).toBeInTheDocument()
    })

    const priorityFilter = screen.getByRole("combobox", { name: /优先级筛选/i })
    fireEvent.click(priorityFilter)

    await waitFor(() => {
      const highPriorityOption = screen.getByText("高优先级")
      fireEvent.click(highPriorityOption)
    })

    await waitFor(() => {
      expect(mockLocalDB.list).toHaveBeenCalledWith(
        "tasks",
        expect.objectContaining({
          index: "priority",
          range: expect.any(Object),
        }),
      )
    })
  })

  it("应该能够按项目筛选任务", async () => {
    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText("产品原型设计")).toBeInTheDocument()
    })

    const projectFilter = screen.getByRole("combobox", { name: /项目筛选/i })
    fireEvent.click(projectFilter)

    await waitFor(() => {
      const projectOption = screen.getByText("新产品开发")
      fireEvent.click(projectOption)
    })

    await waitFor(() => {
      expect(mockLocalDB.list).toHaveBeenCalledWith(
        "tasks",
        expect.objectContaining({
          index: "project",
          range: expect.any(Object),
        }),
      )
    })
  })

  it("应该显示任务进度", async () => {
    render(<TaskManagement />)

    await waitFor(() => {
      // 检查进度条
      const progressBars = screen.getAllByRole("progressbar")
      expect(progressBars).toHaveLength(mockTasks.length)

      // 检查进度百分比
      expect(screen.getByText("65%")).toBeInTheDocument()
      expect(screen.getByText("0%")).toBeInTheDocument()
    })
  })

  it("应该能够删除任务", async () => {
    mockLocalDB.delete.mockResolvedValue(undefined)

    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText("产品原型设计")).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText("删除")
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      const confirmButton = screen.getByText("确认删除")
      fireEvent.click(confirmButton)
    })

    await waitFor(() => {
      expect(mockLocalDB.delete).toHaveBeenCalledWith("tasks", "1")
    })
  })

  it("应该支持拖拽排序", async () => {
    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText("产品原型设计")).toBeInTheDocument()
    })

    // 模拟拖拽操作
    const taskCards = screen.getAllByTestId("task-card")
    const firstTask = taskCards[0]
    const secondTask = taskCards[1]

    // 开始拖拽
    fireEvent.dragStart(firstTask)
    fireEvent.dragEnter(secondTask)
    fireEvent.dragOver(secondTask)
    fireEvent.drop(secondTask)
    fireEvent.dragEnd(firstTask)

    // 验证任务顺序更新
    await waitFor(() => {
      expect(mockLocalDB.update).toHaveBeenCalled()
    })
  })

  it("应该显示任务截止日期提醒", async () => {
    // 创建即将到期的任务
    const urgentTask = {
      ...mockTasks[0],
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 明天到期
    }

    mockLocalDB.list.mockResolvedValue([urgentTask])

    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByText(/即将到期/i)).toBeInTheDocument()
    })
  })

  it("应该支持任务搜索", async () => {
    mockLocalDB.search.mockResolvedValue([mockTasks[0]])

    render(<TaskManagement />)

    const searchInput = screen.getByPlaceholderText(/搜索任务/i)
    fireEvent.change(searchInput, { target: { value: "原型设计" } })

    await waitFor(() => {
      expect(mockLocalDB.search).toHaveBeenCalledWith("tasks", "原型设计", [
        "title",
        "description",
        "assignee",
        "project",
      ])
    })
  })
})
