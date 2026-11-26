// ============================================================
// YYC³ · @yyc3/ui table + pagination + breadcrumb 渲染冒烟
// （批次 5 · 2026-11-27）
// 表格全家桶；分页 active/size/省略号；面包屑 link asChild/省略号
// ============================================================
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '../pagination'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../breadcrumb'

describe('Table · 数据表', () => {
  it('全家桶渲染 + sticky 行为属性透传', () => {
    render(
      <Table>
        <TableCaption>月度账单</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>项目</TableHead>
            <TableHead>金额</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>服务器</TableCell>
            <TableCell>¥199</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>合计</TableCell>
            <TableCell>¥199</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('月度账单')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '项目' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '服务器' })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /合计/ })).toBeInTheDocument()
  })
})

describe('Pagination · 分页', () => {
  it('Previous/页码/active/Next/Ellipsis 渲染', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#prev" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#1" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#2" size="default">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    expect(screen.getByRole('link', { name: /1/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument()
    // 省略号为 svg + sr-only 文案
    expect(document.querySelector('[data-slot="pagination-ellipsis"]')).toBeInTheDocument()
    expect(screen.getByText('More pages')).toBeInTheDocument()
  })
})

describe('Breadcrumb · 面包屑', () => {
  it('List/Item/Link/Page/Separator/Ellipsis 渲染', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#home">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#lib">组件库</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>—</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>当前页</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '首页' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '组件库' })).toBeInTheDocument()
    expect(screen.getByText('当前页')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="breadcrumb-ellipsis"]')).toBeInTheDocument()
  })
})
