"use client"

import type { TextConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Settings, X } from "lucide-react"

interface TextWidgetProps {
  id: string
  title: string
  config: TextConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function TextWidget({ id, title, config, isEditable, onRemove }: TextWidgetProps) {
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
        <div
          className={`prose max-w-none ${
            config.textAlign === "center" ? "text-center" : config.textAlign === "right" ? "text-right" : "text-left"
          }`}
        >
          {config.content}
        </div>
      </CardContent>
    </Card>
  )
}
