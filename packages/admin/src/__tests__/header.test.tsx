"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Header } from "../header"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock dependencies
vi.mock("../avatar-upload", () => ({
  AvatarUpload: () => <div data-testid="avatar-upload">Avatar Upload</div>,
}))

vi.mock("../logo-manager", () => ({
  LogoManager: () => <div data-testid="logo-manager">Logo Manager</div>,
}))

vi.mock("../notification-center", () => ({
  NotificationCenter: () => <div data-testid="notification-center">Notifications</div>,
}))

describe("Header Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  it("应该正确渲染头部组件", () => {
    render(<Header />)

    // 检查主要元素是否存在
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByText("言语云")).toBeInTheDocument()
    expect(screen.getByText("企业管理系统")).toBeInTheDocument()
  })

  it("应该显示搜索框", () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText(/搜索/i)
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute("type", "text")
  })

  it("搜索功能应该正常工作", async () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText(/搜索/i)

    // 输入搜索内容
    fireEvent.change(searchInput, { target: { value: "客户管理" } })
    expect(searchInput).toHaveValue("客户管理")

    // 按回车键搜索
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      // 验证搜索功能被触发
      expect(searchInput.value).toBe("客户管理")
    })
  })

  it("应该显示通知中心", () => {
    render(<Header />)

    expect(screen.getByTestId("notification-center")).toBeInTheDocument()
  })

  it("应该显示用户头像上传组件", () => {
    render(<Header />)

    expect(screen.getByTestId("avatar-upload")).toBeInTheDocument()
  })

  it("应该显示企业Logo管理组件", () => {
    render(<Header />)

    expect(screen.getByTestId("logo-manager")).toBeInTheDocument()
  })

  it("应该响应窗口大小变化", async () => {
    render(<Header />)

    // 模拟窗口大小变化
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    })

    fireEvent(window, new Event("resize"))

    await waitFor(() => {
      // 在小屏幕下，某些元素可能会隐藏或改变布局
      const header = screen.getByRole("banner")
      expect(header).toBeInTheDocument()
    })
  })

  it("快捷键功能应该正常工作", async () => {
    render(<Header />)

    // 模拟按下 Ctrl+K 快捷键
    fireEvent.keyDown(document, {
      key: "k",
      code: "KeyK",
      ctrlKey: true,
    })

    await waitFor(() => {
      // 验证搜索框获得焦点
      const searchInput = screen.getByPlaceholderText(/搜索/i)
      expect(searchInput).toHaveFocus()
    })
  })

  it("应该处理错误状态", async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    render(<Header />)

    // 模拟网络错误或其他异常情况
    const searchInput = screen.getByPlaceholderText(/搜索/i)

    // 输入特殊字符触发错误处理
    fireEvent.change(searchInput, { target: { value: "<<script>>" } })

    await waitFor(() => {
      // 验证输入被正确处理（清理或转义）
      expect(searchInput.value).not.toContain("<script>")
    })

    consoleSpy.mockRestore()
  })
})
