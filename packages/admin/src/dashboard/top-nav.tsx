"use client"
import { Search, Bell, Moon, MoreVertical } from "lucide-react"
import { Input } from "@yyc3/ui-enterprise/input"
import { Button } from "@yyc3/ui-enterprise/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@yyc3/ui-enterprise/dropdown-menu"
import { Badge } from "@yyc3/ui-enterprise/badge"

export function TopNav() {
  return (
    <header className="border-b bg-card h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="搜索..."
          className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Date Range */}
        <select className="text-sm border rounded-md bg-background px-3 py-2">
          <option>最近7天</option>
          <option>最近30天</option>
          <option>本年度</option>
        </select>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">3</Badge>
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon">
          <Moon className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>个人资料</DropdownMenuItem>
            <DropdownMenuItem>账户设置</DropdownMenuItem>
            <DropdownMenuItem>帮助中心</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
