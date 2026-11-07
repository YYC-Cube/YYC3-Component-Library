"use client"

import { useEffect, useRef } from "react"
import type { MapConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Settings, X } from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

interface MapWidgetProps {
  id: string
  title: string
  config: MapConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function MapWidget({ id, title, config, isEditable, onRemove }: MapWidgetProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const map = L.map(mapRef.current!).setView([config.latitude, config.longitude], config.zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    L.marker([config.latitude, config.longitude]).addTo(map).bindPopup(config.title).openPopup()

    // Cleanup function
    return () => {
      map.remove()
    }
  }, [config.latitude, config.longitude, config.zoom, config.title])

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
        <div ref={mapRef} style={{ height: "300px" }} />
      </CardContent>
    </Card>
  )
}
