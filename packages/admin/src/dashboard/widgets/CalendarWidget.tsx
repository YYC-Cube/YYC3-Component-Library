"use client"

import { useAppSelector } from "@/store/hooks"
import type { CalendarConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Settings, X } from "lucide-react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

interface CalendarWidgetProps {
  id: string
  title: string
  config: CalendarConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function CalendarWidget({ id, title, config, isEditable, onRemove }: CalendarWidgetProps) {
  const events = useAppSelector((state) => {
    switch (config.dataSource) {
      case "eventsData":
        return state.data.eventsData
      default:
        return []
    }
  })

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
        <div className="h-full w-full">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 300 }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
