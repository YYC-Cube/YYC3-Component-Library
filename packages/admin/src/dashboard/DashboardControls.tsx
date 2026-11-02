"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@yyc3/ui/dropdown-menu"
import { Edit, Save, Trash, Settings, Download, Upload, ChevronDown } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { loadDashboard } from "@/store/dashboardSlice"

interface DashboardControlsProps {
  dashboardName: string
  editMode: boolean
  onToggleEditMode: () => void
  onSaveDashboard: () => void
  onResetDashboard: () => void
  onChangeName: (name: string) => void
}

export function DashboardControls({
  dashboardName,
  editMode,
  onToggleEditMode,
  onSaveDashboard,
  onResetDashboard,
  onChangeName,
}: DashboardControlsProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(dashboardName)
  const savedDashboards = useAppSelector((state) => state.dashboard.savedDashboards)
  const dispatch = useAppDispatch()

  const handleNameChange = () => {
    onChangeName(nameInput)
    setIsEditingName(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameChange()
    } else if (e.key === "Escape") {
      setIsEditingName(false)
      setNameInput(dashboardName)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center">
        {isEditingName ? (
          <div className="flex items-center">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameChange}
              onKeyDown={handleKeyDown}
              className="mr-2 w-64"
              autoFocus
            />
            <Button size="sm" onClick={handleNameChange}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-2">{dashboardName}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsEditingName(true)
                setNameInput(dashboardName)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant={editMode ? "default" : "outline"} onClick={onToggleEditMode}>
          <Settings className="mr-2 h-4 w-4" />
          {editMode ? "Exit Edit Mode" : "Edit Dashboard"}
        </Button>

        <Button variant="outline" onClick={onSaveDashboard}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ChevronDown className="h-4 w-4 mr-2" />
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onResetDashboard}>
              <Trash className="mr-2 h-4 w-4" />
              Reset Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export Configuration
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload className="mr-2 h-4 w-4" />
              Import Configuration
            </DropdownMenuItem>
          </DropdownMenuContent>

          {savedDashboards.length > 0 && (
            <>
              <DropdownMenuItem className="font-medium text-sm px-2 py-1.5 text-muted-foreground" disabled>
                Saved Dashboards
              </DropdownMenuItem>
              {savedDashboards.map((dashboard) => (
                <DropdownMenuItem key={dashboard.id} onClick={() => dispatch(loadDashboard(dashboard.id))}>
                  {dashboard.name}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenu>
      </div>
    </div>
  )
}
