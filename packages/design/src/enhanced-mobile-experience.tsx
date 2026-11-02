"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Switch } from "@yyc3/ui/switch"
import { Slider } from "@yyc3/ui/slider"
import {
  Smartphone,
  Vibrate,
  HandIcon as Gesture,
  ContactIcon as Touch,
  Zap,
  Settings,
  Monitor,
  Battery,
  Wifi,
} from "lucide-react"

interface GestureConfig {
  swipeLeft: string
  swipeRight: string
  swipeUp: string
  swipeDown: string
  pinchIn: string
  pinchOut: string
  doubleTap: string
  longPress: string
}

interface MobileSettings {
  hapticFeedback: boolean
  gestureNavigation: boolean
  autoRotation: boolean
  darkModeAuto: boolean
  fontSize: number
  touchSensitivity: number
  animationSpeed: number
  batteryOptimization: boolean
}

export function EnhancedMobileExperience() {
  const [mobileSettings, setMobileSettings] = useState<MobileSettings>({
    hapticFeedback: true,
    gestureNavigation: true,
    autoRotation: true,
    darkModeAuto: false,
    fontSize: 16,
    touchSensitivity: 75,
    animationSpeed: 100,
    batteryOptimization: true,
  })

  const [gestureConfig, setGestureConfig] = useState<GestureConfig>({
    swipeLeft: "返回上一页",
    swipeRight: "前进下一页",
    swipeUp: "显示菜单",
    swipeDown: "刷新页面",
    pinchIn: "缩小视图",
    pinchOut: "放大视图",
    doubleTap: "快速操作",
    longPress: "显示选项",
  })

  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    screenSize: { width: 0, height: 0 },
    pixelRatio: 1,
    orientation: "portrait",
    touchSupport: false,
    batteryLevel: 100,
    networkType: "wifi",
  })

  const touchAreaRef = useRef<HTMLDivElement>(null)
  const [touchEvents, setTouchEvents] = useState<string[]>([])

  useEffect(() => {
    // 检测设备信息
    const updateDeviceInfo = () => {
      setDeviceInfo({
        userAgent: navigator.userAgent,
        screenSize: {
          width: window.screen.width,
          height: window.screen.height,
        },
        pixelRatio: window.devicePixelRatio || 1,
        orientation: window.innerHeight > window.innerWidth ? "portrait" : "landscape",
        touchSupport: "ontouchstart" in window,
        batteryLevel: 85, // 模拟电池电量
        networkType: (navigator as any).connection?.effectiveType || "wifi",
      })
    }

    updateDeviceInfo()
    window.addEventListener("resize", updateDeviceInfo)
    window.addEventListener("orientationchange", updateDeviceInfo)

    return () => {
      window.removeEventListener("resize", updateDeviceInfo)
      window.removeEventListener("orientationchange", updateDeviceInfo)
    }
  }, [])

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mobileSettings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10)
    }
    addTouchEvent("触摸开始")
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // 处理滑动手势
    const touch = e.touches[0]
    if (touch) {
      // 这里可以添加手势识别逻辑
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    addTouchEvent("触摸结束")
  }

  const addTouchEvent = (event: string) => {
    setTouchEvents((prev) => {
      const newEvents = [event, ...prev].slice(0, 5)
      return newEvents
    })
  }

  // 手势处理函数
  const handleGesture = (gestureType: keyof GestureConfig) => {
    if (mobileSettings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }
    addTouchEvent(`手势: ${gestureConfig[gestureType]}`)
  }

  const updateSetting = <K extends keyof MobileSettings>(key: K, value: MobileSettings[K]) => {
    setMobileSettings((prev) => ({ ...prev, [key]: value }))

    // 应用设置到实际界面
    if (key === "fontSize") {
      document.documentElement.style.fontSize = `${value}px`
    }

    if (key === "darkModeAuto") {
      // 这里可以切换主题
      console.log("切换主题模式:", value)
    }
  }

  const isMobile = deviceInfo.screenSize.width < 768

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-sky-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">增强移动端体验</h1>
          <p className="text-slate-600 mt-2">优化移动设备交互和用户体验</p>
        </div>
        <Badge className={`${isMobile ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
          <Smartphone className="w-4 h-4 mr-1" />
          {isMobile ? "移动设备" : "桌面设备"}
        </Badge>
      </div>

      {/* 设备信息卡片 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-blue-600" />
            设备信息检测
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">屏幕尺寸</span>
                <span className="text-sm font-medium">
                  {deviceInfo.screenSize.width} × {deviceInfo.screenSize.height}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">像素比</span>
                <span className="text-sm font-medium">{deviceInfo.pixelRatio}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">方向</span>
                <span className="text-sm font-medium">{deviceInfo.orientation === "portrait" ? "竖屏" : "横屏"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">触摸支持</span>
                <Badge className={deviceInfo.touchSupport ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {deviceInfo.touchSupport ? "支持" : "不支持"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">网络类型</span>
                <Badge className="bg-blue-100 text-blue-800">
                  <Wifi className="w-3 h-3 mr-1" />
                  {deviceInfo.networkType}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">电池电量</span>
                <Badge className="bg-green-100 text-green-800">
                  <Battery className="w-3 h-3 mr-1" />
                  {deviceInfo.batteryLevel}%
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-800">最近触摸事件</h4>
              <div className="space-y-1">
                {touchEvents.map((event, index) => (
                  <div key={index} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {event}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 移动端设置 */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-green-600" />
              移动端设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">触觉反馈</label>
                  <p className="text-xs text-slate-500">触摸时提供震动反馈</p>
                </div>
                <Switch
                  checked={mobileSettings.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting("hapticFeedback", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">手势导航</label>
                  <p className="text-xs text-slate-500">启用滑动手势操作</p>
                </div>
                <Switch
                  checked={mobileSettings.gestureNavigation}
                  onCheckedChange={(checked) => updateSetting("gestureNavigation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">自动旋转</label>
                  <p className="text-xs text-slate-500">根据设备方向自动调整</p>
                </div>
                <Switch
                  checked={mobileSettings.autoRotation}
                  onCheckedChange={(checked) => updateSetting("autoRotation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">自动深色模式</label>
                  <p className="text-xs text-slate-500">根据时间自动切换主题</p>
                </div>
                <Switch
                  checked={mobileSettings.darkModeAuto}
                  onCheckedChange={(checked) => updateSetting("darkModeAuto", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">电池优化</label>
                  <p className="text-xs text-slate-500">低电量时减少动画效果</p>
                </div>
                <Switch
                  checked={mobileSettings.batteryOptimization}
                  onCheckedChange={(checked) => updateSetting("batteryOptimization", checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  字体大小 ({mobileSettings.fontSize}px)
                </label>
                <Slider
                  value={[mobileSettings.fontSize]}
                  onValueChange={([value]) => updateSetting("fontSize", value)}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  触摸灵敏度 ({mobileSettings.touchSensitivity}%)
                </label>
                <Slider
                  value={[mobileSettings.touchSensitivity]}
                  onValueChange={([value]) => updateSetting("touchSensitivity", value)}
                  max={100}
                  min={25}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  动画速度 ({mobileSettings.animationSpeed}%)
                </label>
                <Slider
                  value={[mobileSettings.animationSpeed]}
                  onValueChange={([value]) => updateSetting("animationSpeed", value)}
                  max={200}
                  min={50}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 手势配置 */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gesture className="w-5 h-5 mr-2 text-purple-600" />
              手势配置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(gestureConfig).map(([gesture, action]) => (
              <div key={gesture} className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    {gesture === "swipeLeft" && "左滑"}
                    {gesture === "swipeRight" && "右滑"}
                    {gesture === "swipeUp" && "上滑"}
                    {gesture === "swipeDown" && "下滑"}
                    {gesture === "pinchIn" && "双指缩放"}
                    {gesture === "pinchOut" && "双指放大"}
                    {gesture === "doubleTap" && "双击"}
                    {gesture === "longPress" && "长按"}
                  </span>
                  <p className="text-xs text-slate-500">{action}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGesture(gesture as keyof GestureConfig)}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  测试
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 触摸测试区域 */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Touch className="w-5 h-5 mr-2 text-orange-600" />
            触摸交互测试
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={touchAreaRef}
            className="w-full h-64 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 flex items-center justify-center cursor-pointer select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => addTouchEvent("点击事件")}
            onDoubleClick={() => handleGesture("doubleTap")}
          >
            <div className="text-center">
              <Touch className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-orange-800">触摸测试区域</p>
              <p className="text-sm text-orange-600 mt-2">在此区域进行触摸、滑动、双击等操作</p>
              {mobileSettings.hapticFeedback && (
                <Badge className="bg-orange-100 text-orange-800 mt-2">
                  <Vibrate className="w-3 h-3 mr-1" />
                  触觉反馈已启用
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 性能优化建议 */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-indigo-600" />
            移动端性能优化
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 mb-3">已启用优化</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  图片懒加载
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  代码分割
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  缓存优化
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  压缩资源
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-800 mb-3">建议优化</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-orange-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                  Service Worker缓存
                </div>
                <div className="flex items-center text-sm text-orange-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                  预加载关键资源
                </div>
                <div className="flex items-center text-sm text-orange-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                  减少重绘重排
                </div>
                <div className="flex items-center text-sm text-orange-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                  优化触摸响应
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
