"use client"

import { Button } from "@yyc3/ui/button"
import { useBackground } from "@/contexts/background-context"
import { Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@yyc3/ui/dropdown-menu"

export default function BackgroundSwitcher() {
  const { background, setBackground } = useBackground()

  const handleBackgroundChange = (newBackground: "cityscape" | "tech-globe" | "digital-earth") => {
    setBackground(newBackground)
    // 可以添加一个临时的视觉反馈
    const button = document.activeElement as HTMLElement
    if (button) button.blur()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change background</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleBackgroundChange("cityscape")}
          className={background === "cityscape" ? "bg-blue-50 text-blue-600" : ""}
        >
          城市天际线
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleBackgroundChange("tech-globe")}
          className={background === "tech-globe" ? "bg-blue-50 text-blue-600" : ""}
        >
          科技球体
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleBackgroundChange("digital-earth")}
          className={background === "digital-earth" ? "bg-blue-50 text-blue-600" : ""}
        >
          数字地球
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
