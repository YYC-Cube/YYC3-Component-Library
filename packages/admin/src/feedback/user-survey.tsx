"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Input } from "@yyc3/ui-enterprise/input"
import { Textarea } from "@yyc3/ui-enterprise/textarea"
import { RadioGroup, RadioGroupItem } from "@yyc3/ui-enterprise/radio-group"
import { Checkbox } from "@yyc3/ui-enterprise/checkbox"
import { Label } from "@yyc3/ui-enterprise/label"
import { Progress } from "@yyc3/ui-enterprise/progress"
import { Alert, AlertDescription, AlertTitle } from "@yyc3/ui-enterprise/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui-enterprise/dialog"
import { CheckCircle, AlertCircle, ChevronRight, ChevronLeft, X } from 'lucide-react'
import { cn } from "@yyc3/lib/utils"

// 问题类型
type QuestionType = "radio" | "checkbox" | "text" | "textarea" | "rating"

// 问题选项
interface QuestionOption {
  value: string
  label: string
}

// 问题定义
interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required?: boolean
  options?: QuestionOption[]
  min?: number
  max?: number
}

// 答案类型
type Answer = string | string[] | number

// 调查属性
interface UserSurveyProps {
  title: string
  description?: string
  questions: Question[]
  onSubmit?: (answers: Record<string, Answer>) => Promise<void>
  className?: string
  compact?: boolean
  triggerButton?: React.ReactNode
}

export function UserSurvey({
  title,
  description,
  questions,
  onSubmit,
  className,
  compact = false,
  triggerButton,
}: UserSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 计算进度
  const progress = Math.round(((currentStep + 1) / questions.length) * 100);

  // 更新答案
  const updateAnswer = (questionId: string, value: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
    
    // 清除错误
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // 验证当前问题
  const validateCurrentQuestion = (): boolean => {
    const question = questions[currentStep];
    
    if (!question.required) return true;
    
    const answer = answers[question.id];
    
    if (answer === undefined || answer === null || answer === '') {
      setErrors(prev => ({
        ...prev,
        [question.id]: '此问题为必答题',
      }));
      return false;
    }
    
    if (question.type === 'checkbox' && Array.isArray(answer) && answer.length === 0) {
      setErrors(prev => ({
        ...prev,
        [question.id]: '请至少选择一项',
      }));
      return false;
    }
    
    return true;
  };

  // 下一步
  const handleNext = () => {
    if (!validateCurrentQuestion()) return;
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 提交调查
  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit?.(answers);
      setIsSuccess(true);
      
      // 重置表单
      setTimeout(() => {
        setAnswers({});
        setCurrentStep(0);
        setIsSuccess(false);
        
        if (compact) {
          setIsDialogOpen(false);
        }
      }, 3000);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: '提交失败，请稍后重试',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染问题
  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];
    
    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup
            value={answer as string}
            onValueChange={(value) => updateAnswer(question.id, value)}
          >
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={(answer as string[] || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = (answer as string[] || []);
                    if (checked) {
                      updateAnswer(question.id, [...currentAnswers, option.value]);
                    } else {
                      updateAnswer(
                        question.id,
                        currentAnswers.filter((value) => value !== option.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
        
      case 'text':
        return (
          <Input
            value={answer as string || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="请输入您的回答"
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            value={answer as string || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="请输入您的回答"
            className="min-h-[100px]"
          />
        );
        
      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{question.min || 1}</span>
              <span>{question.max || 5}</span>
            </div>
            <div className="flex justify-between gap-2">
              {Array.from({ length: (question.max || 5) - (question.min || 1) + 1 }).map((_, index) => {
                const value = (question.min || 1) + index;
                return (
                  <Button
                    key={value}
                    type="button"
                    variant={answer === value ? "default" : "outline"}
                    className={cn(
                      "flex-1 h-12",
                      answer === value && "border-primary"
                    )}
                    onClick={() => updateAnswer(question.id, value)}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // 当前问题
  const currentQuestion = questions[currentStep];

  // 紧凑版调查组件
  if (compact) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {triggerButton || (
            <Button variant="outline" className={className}>
              参与调查
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                问题 {currentStep + 1} / {questions.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progress} className="mb-4" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">
                  {currentQuestion.title}
                  {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {currentQuestion.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentQuestion.description}
                  </p>
                )}
              </div>
              
              <div className="py-2">
                {renderQuestion(currentQuestion)}
              </div>
              
              {errors[currentQuestion.id] && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors[currentQuestion.id]}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          
          {isSuccess ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>提交成功</AlertTitle>
              <AlertDescription>感谢您参与调查！</AlertDescription>
            </Alert>
          ) : (
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一题
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    提交中...
                  </>
                ) : currentStep === questions.length - 1 ? (
                  "提交"
                ) : (
                  <>
                    下一题
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // 完整版调查组件
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            问题 {currentStep + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progress} className="mb-6" />
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium">
              {currentQuestion.title}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {currentQuestion.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentQuestion.description}
              </p>
            )}
          </div>
          
          <div className="py-2">
            {renderQuestion(currentQuestion)}
          </div>
          
          {errors[currentQuestion.id] && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors[currentQuestion.id]}</AlertDescription>
            </Alert>
          )}
          
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
          
          {isSuccess ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>提交成功</AlertTitle>
              <AlertDescription>感谢您参与调查！</AlertDescription>
            </Alert>
          ) : (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一题
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    提交中...
                  </>
                ) : currentStep === questions.length - 1 ? (
                  "提交"
                ) : (
                  <>
                    下一题
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
