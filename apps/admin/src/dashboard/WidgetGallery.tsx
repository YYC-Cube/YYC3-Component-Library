"use client"

import type { Widget } from "@/store/widgetsSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { X } from "lucide-react"

interface WidgetGalleryProps {
  templates: Widget[]
  onSelectTemplate: (templateId: string) => void
  onClose: () => void
}

export function WidgetGallery({ templates, onSelectTemplate, onClose }: WidgetGalleryProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Widget Gallery</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                  <CardDescription>
                    {template.type === "chart" && `${template.config.chartType} chart`}
                    {template.type === "stats" && "Statistics card"}
                    {template.type === "table" && "Data table"}
                    {template.type === "text" && "Text content"}
                    {template.type === "list" && "List view"}
                    {template.type === "map" && "Map"}
                    {template.type === "calendar" && "Calendar"}
                    {template.type === "weather" && "Weather"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center mb-4">
                    {/* Widget preview placeholder */}
                    <span className="text-muted-foreground">{template.type.toUpperCase()}</span>
                  </div>
                  <Button className="w-full" onClick={() => onSelectTemplate(template.id)}>
                    Add to Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
