"use client"

import { useEffect, useState } from "react"
import type { WeatherConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Settings, X, Cloud, Sun, CloudRain, CloudSnow } from "lucide-react"

interface WeatherWidgetProps {
  id: string
  title: string
  config: WeatherConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function WeatherWidget({ id, title, config, isEditable, onRemove }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Replace with your actual API key and weather API endpoint
        const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${config.location}&units=${config.units}&appid=${apiKey}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await response.json()
        setWeatherData(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [config.location, config.units])

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "Clouds":
        return <Cloud className="h-6 w-6" />
      case "Clear":
        return <Sun className="h-6 w-6" />
      case "Rain":
        return <CloudRain className="h-6 w-6" />
      case "Snow":
        return <CloudSnow className="h-6 w-6" />
      default:
        return <Cloud className="h-6 w-6" />
    }
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
        {isLoading ? (
          <div>Loading weather data...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : weatherData ? (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">{weatherData.name}</div>
            <div className="flex items-center">
              {getWeatherIcon(weatherData.weather[0].main)}
              <div className="text-xl">{weatherData.main.temp}°C</div>
            </div>
            <div className="text-sm text-muted-foreground">{weatherData.weather[0].description}</div>
          </div>
        ) : (
          <div>No weather data available</div>
        )}
      </CardContent>
    </Card>
  )
}
