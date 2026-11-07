"use client"

import { useAppSelector } from "@/store/hooks"
import type { ListConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Settings, X } from "lucide-react"

interface ListWidgetProps {
  id: string
  title: string
  config: ListConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function ListWidget({ id, title, config, isEditable, onRemove }: ListWidgetProps) {
  const data = useAppSelector((state) => {
    switch (config.dataSource) {
      case "productsData":
        return state.data.productsData
      default:
        return []
    }
  })

  // Limit data to maxItems
  const displayData = data.slice(0, config.maxItems)

  // Format item using template
  const formatItem = (item: any) => {
    return config.itemTemplate.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return item[key] || ""
    })
  }

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
        <ul className="space-y-2">
          {displayData.length > 0 ? (
            displayData.map((item, index) => (
              <li key={index} className="p-2 border-b last:border-b-0">
                {formatItem(item)}
              </li>
            ))
          ) : (
            <li className="text-center text-muted-foreground">No items to display</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
