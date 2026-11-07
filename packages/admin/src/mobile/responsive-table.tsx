"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui-enterprise/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Input } from "@yyc3/ui-enterprise/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@yyc3/ui-enterprise/pagination"
import { cn } from "@yyc3/lib/utils"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

interface Column<T> {
  header: string
  accessorKey: keyof T | ((row: T) => any)
  cell?: (row: T) => React.ReactNode
  enableSorting?: boolean
  meta?: {
    className?: string
    headerClassName?: string
  }
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  title?: string
  description?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
    onPageChange: (page: number) => void
  }
  className?: string
  rowClassName?: (row: T) => string
  emptyMessage?: string
  actions?: React.ReactNode
  enableRowSelection?: boolean
  onRowSelectionChange?: (selectedRows: T[]) => void
}

export function ResponsiveTable<T>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "搜索...",
  onSearch,
  pagination,
  className,
  rowClassName,
  emptyMessage = "没有数据",
  actions,
  enableRowSelection = false,
  onRowSelectionChange,
}: ResponsiveTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  // 处理排序
  const handleSort = (column: Column<T>) => {
    if (!column.enableSorting) return

    const accessorKey = typeof column.accessorKey === "function" ? null : column.accessorKey

    if (!accessorKey) return

    if (sortColumn === accessorKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(accessorKey)
      setSortDirection("asc")
    }
  }

  // 处理行选择
  const handleRowSelect = (row: T) => {
    if (!enableRowSelection) return

    const isSelected = selectedRows.includes(row)
    let newSelectedRows: T[]

    if (isSelected) {
      newSelectedRows = selectedRows.filter((r) => r !== row)
    } else {
      newSelectedRows = [...selectedRows, row]
    }

    setSelectedRows(newSelectedRows)
    onRowSelectionChange?.(newSelectedRows)
  }

  // 获取单元格值
  const getCellValue = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row)
    }

    if (typeof column.accessorKey === "function") {
      return column.accessorKey(row)
    }

    return row[column.accessorKey] as React.ReactNode
  }

  return (
    <Card className={cn("w-full", className)}>
      {(title || description || onSearch) && (
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {onSearch && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-8 w-full sm:w-[200px] md:w-[250px]"
                  />
                </div>
              )}
              {actions}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {isMobile ? (
          // 移动端卡片视图
          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
            ) : (
              data.map((row, rowIndex) => (
                <Card
                  key={rowIndex}
                  className={cn(
                    "overflow-hidden",
                    enableRowSelection && selectedRows.includes(row) && "border-primary",
                    rowClassName && rowClassName(row),
                  )}
                  onClick={() => handleRowSelect(row)}
                >
                  <CardContent className="p-4 space-y-3">
                    {columns.map((column, colIndex) => (
                      <div key={colIndex} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-muted-foreground">{column.header}:</span>
                        <div className={cn("text-right", column.meta?.className)}>{getCellValue(row, column)}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          // 桌面端表格视图
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={cn(column.enableSorting && "cursor-pointer select-none", column.meta?.headerClassName)}
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center gap-1">
                        {column.header}
                        {column.enableSorting &&
                          sortColumn === column.accessorKey &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className={cn(
                        enableRowSelection && "cursor-pointer",
                        enableRowSelection && selectedRows.includes(row) && "bg-muted",
                        rowClassName && rowClassName(row),
                      )}
                      onClick={() => handleRowSelect(row)}
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex} className={column.meta?.className}>
                          {getCellValue(row, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {pagination && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            显示 {pagination.pageSize * pagination.pageIndex + 1} 到{" "}
            {Math.min(pagination.pageSize * (pagination.pageIndex + 1), data.length)} 条， 共 {data.length} 条
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.onPageChange(Math.max(0, pagination.pageIndex - 1))}
                  disabled={pagination.pageIndex === 0}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, pagination.pageCount) }).map((_, i) => {
                const pageNumber =
                  pagination.pageIndex < 2
                    ? i
                    : pagination.pageIndex > pagination.pageCount - 3
                      ? pagination.pageCount - 5 + i
                      : pagination.pageIndex - 2 + i

                if (pageNumber < 0 || pageNumber >= pagination.pageCount) return null

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pagination.pageIndex === pageNumber}
                      onClick={() => pagination.onPageChange(pageNumber)}
                    >
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.onPageChange(Math.min(pagination.pageCount - 1, pagination.pageIndex + 1))}
                  disabled={pagination.pageIndex === pagination.pageCount - 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  )
}
