"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Progress } from "@yyc3/ui-enterprise/progress"
import { ChevronRight, ChevronLeft, Check, X, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@yyc3/ui-enterprise/tooltip"
import { cn } from "@yyc3/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  content: React.ReactNode
  optional?: boolean
  completed?: boolean
}

interface GuidedWorkflowProps {
  title: string
  description?: string
  steps: Step[]
  onComplete: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export function GuidedWorkflow({
  title,
  description,
  steps,
  onComplete,
  onCancel,
  initialData = {},
}: GuidedWorkflowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState(initialData)
  const [stepsState, setStepsState] = useState(steps.map((step) => ({ ...step, completed: step.completed || false })))

  const currentStep = stepsState[currentStepIndex]
  const progress = Math.round((stepsState.filter((step) => step.completed).length / stepsState.length) * 100)

  const handleNext = () => {
    // Mark current step as completed
    const updatedSteps = [...stepsState]
    updatedSteps[currentStepIndex].completed = true
    setStepsState(updatedSteps)

    // Move to next step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      // All steps completed
      onComplete(data)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleSkip = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const updateData = (newData) => {
    setData({ ...data, ...newData })
  }

  const isLastStep = currentStepIndex === steps.length - 1
  const isFirstStep = currentStepIndex === 0

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>获取此工作流程的帮助</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="flex mb-6">
          {stepsState.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
                  index < currentStepIndex || step.completed
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStepIndex
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground",
                )}
              >
                {index < currentStepIndex || step.completed ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < stepsState.length - 1 && (
                <div className={cn("h-[2px] w-10", index < currentStepIndex ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium flex items-center">
            {currentStep.title}
            {currentStep.optional && (
              <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">可选</span>
            )}
          </h3>
          {currentStep.description && <p className="text-sm text-muted-foreground mt-1">{currentStep.description}</p>}
        </div>

        <div className="py-4">
          {/* Render the current step content and pass the data and update function */}
          {React.isValidElement(currentStep.content)
            ? React.cloneElement(currentStep.content as React.ReactElement, {
                data,
                updateData,
              })
            : currentStep.content}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            取消
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevious} disabled={isFirstStep}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            上一步
          </Button>

          {currentStep.optional && (
            <Button variant="ghost" onClick={handleSkip}>
              跳过
            </Button>
          )}

          <Button onClick={handleNext}>
            {isLastStep ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                完成
              </>
            ) : (
              <>
                下一步
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
