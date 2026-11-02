"use client"

import { useAppSelector } from "@/store/hooks"
import type { TableConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Settings, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"

interface TableWidgetProps {
  id: string
  title: string
  config: TableConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function TableWidget({ id, title, config, isEditable, onRemove }: TableWidgetProps) {
  const data = useAppSelector((state) => {
    switch (config.dataSource) {
      case "ordersData":
        return state.data.ordersData
      case "productsData":
        return state.data.productsData
      default:
        return []
    }
  })

  // Limit data to pageSize
  const displayData = data.slice(0, config.pageSize)

  return (
    <Card className="h-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {isEditable && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((column) => (
                  <TableHead key={column.key} style={{ width: column.width }}>
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((row, index) => (
                  <TableRow key={index}>
                    {config.columns.map((column) => (
                      <TableCell key={column.key}>{row[column.key]}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={config.columns.length} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
