"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Alert, AlertDescription } from "@yyc3/ui/alert"
import { Progress } from "@yyc3/ui/progress"
import {
  Camera,
  MapPin,
  Smartphone,
  Battery,
  Vibrate,
  Compass,
  Zap,
  Eye,
  EyeOff,
  Square,
  Circle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react"
import {
  cameraService,
  locationService,
  sensorService,
  deviceInfoService,
  type CameraCapture,
  type GeolocationData,
  type DeviceMotionData,
  type DeviceInfo,
} from "./native-device-service"

export function DeviceFeatures() {
  // 相机状态
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<PermissionState>("prompt")
  const [capturedPhotos, setCapturedPhotos] = useState<CameraCapture[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // GPS状态
  const [locationPermission, setLocationPermission] = useState<PermissionState>("prompt")
  const [currentLocation, setCurrentLocation] = useState<GeolocationData | null>(null)
  const [locationHistory, setLocationHistory] = useState<GeolocationData[]>([])
  const [isWatchingLocation, setIsWatchingLocation] = useState(false)

  // 传感器状态
  const [motionData, setMotionData] = useState<DeviceMotionData | null>(null)
  const [orientationData, setOrientationData] = useState<DeviceOrientationEvent | null>(null)
  const [isMotionActive, setIsMotionActive] = useState(false)
  const [shakeDetected, setShakeDetected] = useState(false)

  // 设备信息
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [batteryInfo, setBatteryInfo] = useState<any>(null)
  const [capabilities, setCapabilities] = useState<any>(null)

  // 初始化设备信息
  useEffect(() => {
    const initDeviceInfo = async () => {
      setDeviceInfo(deviceInfoService.getDeviceInfo())
      setCapabilities(deviceInfoService.getDeviceCapabilities())

      const battery = await deviceInfoService.getBatteryInfo()
      setBatteryInfo(battery)

      // 检查权限
      const cameraPermState = await cameraService.checkPermission()
      setCameraPermission(cameraPermState)

      const locationPermState = await locationService.checkPermission()
      setLocationPermission(locationPermState)
    }

    initDeviceInfo()
  }, [])

  // 相机功能
  const startCamera = async () => {
    try {
      const stream = await cameraService.startCamera({
        facingMode: "environment",
        width: 1280,
        height: 720,
      })
      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("启动相机失败:", error)
    }
  }

  const stopCamera = () => {
    cameraService.stopCamera()
    setCameraStream(null)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && cameraStream) {
      try {
        const photo = await cameraService.capturePhoto(videoRef.current, { quality: 0.8 })
        setCapturedPhotos((prev) => [photo, ...prev.slice(0, 4)]) // 保留最近5张照片

        // 触觉反馈
        if ("vibrate" in navigator) {
          navigator.vibrate(100)
        }
      } catch (error) {
        console.error("拍照失败:", error)
      }
    }
  }

  // GPS功能
  const getCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      })
      setCurrentLocation(location)
      setLocationHistory((prev) => [location, ...prev.slice(0, 9)]) // 保留最近10个位置
    } catch (error) {
      console.error("获取位置失败:", error)
    }
  }

  const startWatchingLocation = () => {
    const watchId = locationService.watchPosition(
      (location) => {
        setCurrentLocation(location)
        setLocationHistory((prev) => [location, ...prev.slice(0, 9)])
      },
      (error) => {
        console.error("位置监听失败:", error)
      },
      { enableHighAccuracy: true },
    )
    setIsWatchingLocation(true)
  }

  const stopWatchingLocation = () => {
    locationService.clearWatch()
    setIsWatchingLocation(false)
  }

  // 传感器功能
  const startMotionDetection = async () => {
    const hasPermission = await sensorService.requestPermission()
    if (!hasPermission) {
      console.error("传感器权限被拒绝")
      return
    }

    sensorService.startMotionDetection((data) => {
      setMotionData(data)
    })

    sensorService.startOrientationDetection((data) => {
      setOrientationData(data)
    })

    setIsMotionActive(true)
  }

  const stopMotionDetection = () => {
    sensorService.stopMotionDetection()
    sensorService.stopOrientationDetection()
    setIsMotionActive(false)
    setMotionData(null)
    setOrientationData(null)
  }

  const detectShake = async () => {
    try {
      await sensorService.detectShake(15)
      setShakeDetected(true)
      setTimeout(() => setShakeDetected(false), 2000)

      // 触觉反馈
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (error) {
      console.error("摇一摇检测失败:", error)
    }
  }

  const formatLocation = (location: GeolocationData) => {
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* 设备能力概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>设备能力检测</span>
          </CardTitle>
          <CardDescription>检测当前设备支持的原生功能</CardDescription>
        </CardHeader>
        <CardContent>
          {capabilities && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(capabilities).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  {value ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace("has", "")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 相机功能 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>相机功能</span>
            </div>
            <Badge variant={cameraPermission === "granted" ? "default" : "secondary"}>{cameraPermission}</Badge>
          </CardTitle>
          <CardDescription>使用设备相机拍照和录像</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 相机控制 */}
          <div className="flex space-x-2">
            {!cameraStream ? (
              <Button onClick={startCamera} disabled={!capabilities?.hasCamera}>
                <Camera className="w-4 h-4 mr-2" />
                启动相机
              </Button>
            ) : (
              <>
                <Button onClick={stopCamera} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  停止相机
                </Button>
                <Button onClick={capturePhoto}>
                  <Circle className="w-4 h-4 mr-2" />
                  拍照
                </Button>
              </>
            )}
          </div>

          {/* 相机预览 */}
          {cameraStream && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md rounded-lg border"
                style={{ transform: "scaleX(-1)" }} // 镜像显示
              />
            </div>
          )}

          {/* 拍摄的照片 */}
          {capturedPhotos.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">最近拍摄的照片</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {capturedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.dataUrl || "/placeholder.svg"}
                      alt={`照片 ${index + 1}`}
                      className="w-full aspect-square object-cover rounded border"
                    />
                    <Badge className="absolute top-1 right-1 text-xs">{formatTimestamp(photo.timestamp)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPS定位功能 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>GPS定位</span>
            </div>
            <Badge variant={locationPermission === "granted" ? "default" : "secondary"}>{locationPermission}</Badge>
          </CardTitle>
          <CardDescription>获取设备位置信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 定位控制 */}
          <div className="flex space-x-2">
            <Button onClick={getCurrentLocation} disabled={!capabilities?.hasGeolocation}>
              <MapPin className="w-4 h-4 mr-2" />
              获取当前位置
            </Button>
            {!isWatchingLocation ? (
              <Button onClick={startWatchingLocation} variant="outline" disabled={!capabilities?.hasGeolocation}>
                <Eye className="w-4 h-4 mr-2" />
                开始监听
              </Button>
            ) : (
              <Button onClick={stopWatchingLocation} variant="outline">
                <EyeOff className="w-4 h-4 mr-2" />
                停止监听
              </Button>
            )}
          </div>

          {/* 当前位置 */}
          {currentLocation && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div>
                    <strong>坐标:</strong> {formatLocation(currentLocation)}
                  </div>
                  <div>
                    <strong>精度:</strong> {currentLocation.accuracy?.toFixed(0) ?? "—"}米
                  </div>
                  {currentLocation.altitude && (
                    <div>
                      <strong>海拔:</strong> {currentLocation.altitude.toFixed(0)}米
                    </div>
                  )}
                  {currentLocation.speed && (
                    <div>
                      <strong>速度:</strong> {(currentLocation.speed * 3.6).toFixed(1)}km/h
                    </div>
                  )}
                  <div>
                    <strong>时间:</strong> {formatTimestamp(currentLocation.timestamp)}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 位置历史 */}
          {locationHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">位置历史</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {locationHistory.map((location, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span>{formatLocation(location)}</span>
                    <span className="text-gray-500">{formatTimestamp(location.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 传感器功能 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Compass className="w-5 h-5" />
            <span>设备传感器</span>
          </CardTitle>
          <CardDescription>监听设备运动和方向传感器</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 传感器控制 */}
          <div className="flex space-x-2">
            {!isMotionActive ? (
              <Button
                onClick={startMotionDetection}
                disabled={!capabilities?.hasMotionSensors && !capabilities?.hasOrientationSensors}
              >
                <Compass className="w-4 h-4 mr-2" />
                启动传感器
              </Button>
            ) : (
              <Button onClick={stopMotionDetection} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                停止传感器
              </Button>
            )}
            <Button onClick={detectShake} disabled={!capabilities?.hasMotionSensors}>
              <Vibrate className="w-4 h-4 mr-2" />
              摇一摇检测
            </Button>
          </div>

          {/* 摇一摇状态 */}
          {shakeDetected && (
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>检测到摇一摇手势！</AlertDescription>
            </Alert>
          )}

          {/* 运动数据 */}
          {motionData && (
            <div className="space-y-3">
              <h4 className="font-medium">运动传感器数据</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">加速度 (m/s²)</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>X轴:</span>
                      <span>{motionData.acceleration.x?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Y轴:</span>
                      <span>{motionData.acceleration.y?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Z轴:</span>
                      <span>{motionData.acceleration.z?.toFixed(2) || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">旋转速率 (°/s)</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Alpha:</span>
                      <span>{motionData.rotationRate.alpha?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beta:</span>
                      <span>{motionData.rotationRate.beta?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gamma:</span>
                      <span>{motionData.rotationRate.gamma?.toFixed(2) || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 方向数据 */}
          {orientationData && (
            <div className="space-y-3">
              <h4 className="font-medium">方向传感器数据</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{orientationData.alpha?.toFixed(0) || "N/A"}°</div>
                  <div className="text-sm text-gray-500">方位角 (Alpha)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{orientationData.beta?.toFixed(0) || "N/A"}°</div>
                  <div className="text-sm text-gray-500">俯仰角 (Beta)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{orientationData.gamma?.toFixed(0) || "N/A"}°</div>
                  <div className="text-sm text-gray-500">翻滚角 (Gamma)</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 设备信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>设备信息</span>
          </CardTitle>
          <CardDescription>显示设备的详细信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deviceInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">基本信息</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>平台:</span>
                    <span>{deviceInfo.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>语言:</span>
                    <span>{deviceInfo.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>在线状态:</span>
                    <Badge variant={deviceInfo.onLine ? "default" : "destructive"}>
                      {deviceInfo.onLine ? "在线" : "离线"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU核心:</span>
                    <span>{deviceInfo.hardwareConcurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>触摸点:</span>
                    <span>{deviceInfo.maxTouchPoints}</span>
                  </div>
                  {deviceInfo.deviceMemory && (
                    <div className="flex justify-between">
                      <span>设备内存:</span>
                      <span>{deviceInfo.deviceMemory}GB</span>
                    </div>
                  )}
                </div>
              </div>

              {deviceInfo.connection && (
                <div className="space-y-2">
                  <h4 className="font-medium">网络信息</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>网络类型:</span>
                      <span>{deviceInfo.connection.effectiveType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>下行速度:</span>
                      <span>{deviceInfo.connection.downlink}Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span>往返时间:</span>
                      <span>{deviceInfo.connection.rtt}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>省流模式:</span>
                      <Badge variant={deviceInfo.connection.saveData ? "default" : "outline"}>
                        {deviceInfo.connection.saveData ? "开启" : "关闭"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 电池信息 */}
          {batteryInfo && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <Battery className="w-4 h-4" />
                <span>电池信息</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">电量:</span>
                  <Progress value={batteryInfo.level} className="flex-1" />
                  <span className="text-sm font-medium">{batteryInfo.level}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>充电状态:</span>
                  <Badge variant={batteryInfo.charging ? "default" : "outline"}>
                    {batteryInfo.charging ? "充电中" : "未充电"}
                  </Badge>
                </div>
                {batteryInfo.chargingTime !== Number.POSITIVE_INFINITY && (
                  <div className="flex justify-between text-sm">
                    <span>充满时间:</span>
                    <span>{Math.round(batteryInfo.chargingTime / 60)}分钟</span>
                  </div>
                )}
                {batteryInfo.dischargingTime !== Number.POSITIVE_INFINITY && (
                  <div className="flex justify-between text-sm">
                    <span>续航时间:</span>
                    <span>{Math.round(batteryInfo.dischargingTime / 3600)}小时</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
