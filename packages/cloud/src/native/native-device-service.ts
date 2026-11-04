// ============================================================
// YYC³ · 原生设备服务（Phase 7 精度抽取补建 · 浏览器原生实现）
// 源用法反推：device-features.tsx 的 @yyc3/lib/services/native-device-service
// 相机（getUserMedia）/定位（geolocation）/运动传感器（DeviceMotion）/设备信息
// 完整服务实现待 @yyc3/lib services 批次并入；本实现覆盖 device-features 消费面
// ============================================================

export interface CameraCapture {
  dataUrl: string
  timestamp: number
}

export interface GeolocationData {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  altitude?: number | null
  speed?: number | null
  heading?: number | null
}

export interface DeviceMotionData {
  acceleration: { x: number | null; y: number | null; z: number | null }
  rotationRate: { alpha: number | null; beta: number | null; gamma: number | null }
}

export interface DeviceInfo {
  userAgent: string
  platform: string
  screen: { width: number; height: number }
  language?: string
  onLine?: boolean
  hardwareConcurrency?: number
  maxTouchPoints?: number
  deviceMemory?: number
  connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean }
}

type PermissionState = 'granted' | 'prompt' | 'denied'

// ── 相机服务 ──
class CameraService {
  async checkPermission(): Promise<PermissionState> {
    try {
      const r = await navigator.permissions?.query({ name: 'camera' as PermissionName })
      return (r?.state as PermissionState) ?? 'prompt'
    } catch {
      return 'prompt'
    }
  }

  async startCamera(opts?: { facingMode?: string; width?: number; height?: number }): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: opts?.facingMode ?? 'environment',
        ...(opts?.width ? { width: { ideal: opts.width } } : {}),
        ...(opts?.height ? { height: { ideal: opts.height } } : {}),
      },
      audio: false,
    })
  }

  stopCamera(stream?: MediaStream): void {
    stream?.getTracks().forEach((t) => t.stop())
  }

  async capturePhoto(video: HTMLVideoElement, opts?: { quality?: number }): Promise<CameraCapture> {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    return {
      dataUrl: canvas.toDataURL('image/jpeg', opts?.quality ?? 0.8),
      timestamp: Date.now(),
    }
  }
}

// ── 定位服务 ──
class LocationService {
  async checkPermission(): Promise<PermissionState> {
    try {
      const r = await navigator.permissions?.query({ name: 'geolocation' as PermissionName })
      return (r?.state as PermissionState) ?? 'prompt'
    } catch {
      return 'prompt'
    }
  }

  getCurrentPosition(opts?: { enableHighAccuracy?: boolean; timeout?: number }): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude, timestamp: p.timestamp }),
        reject,
        { enableHighAccuracy: opts?.enableHighAccuracy ?? true, timeout: opts?.timeout },
      )
    })
  }

  watchPosition(
    onUpdate: (data: GeolocationData) => void,
    onError?: (err: Error) => void,
    opts?: { enableHighAccuracy?: boolean },
  ): number {
    return navigator.geolocation.watchPosition(
      (p) => onUpdate({ latitude: p.coords.latitude, longitude: p.coords.longitude, timestamp: p.timestamp }),
      (e) => onError?.(new Error(e.message)),
      { enableHighAccuracy: opts?.enableHighAccuracy ?? true },
    )
  }

  clearWatch(id?: number): void {
    if (id !== undefined) navigator.geolocation.clearWatch(id)
  }
}

// ── 传感器服务 ──
class SensorService {
  async requestPermission(): Promise<boolean> {
    try {
      const DM = window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<PermissionState> }
      if (DM?.requestPermission) {
        const r = await DM.requestPermission()
        return r === 'granted'
      }
      return true // 无需显式授权的环境
    } catch {
      return false
    }
  }

  detectShake(threshold = 15): Promise<boolean> {
    return new Promise((resolve) => {
      const handler = (e: DeviceMotionEvent) => {
        const total = Math.abs(e.accelerationIncludingGravity?.x ?? 0) + Math.abs(e.accelerationIncludingGravity?.y ?? 0) + Math.abs(e.accelerationIncludingGravity?.z ?? 0)
        if (total > threshold) {
          window.removeEventListener('devicemotion', handler)
          resolve(true)
        }
      }
      window.addEventListener('devicemotion', handler as EventListener)
      setTimeout(() => resolve(false), 3000)
    })
  }

  private motionHandler: ((e: DeviceMotionEvent) => void) | null = null
  private orientationHandler: ((e: DeviceOrientationEvent) => void) | null = null

  startMotionDetection(onData: (data: DeviceMotionData) => void): void {
    this.motionHandler = (e: DeviceMotionEvent) => {
      onData({
        acceleration: {
          x: e.acceleration?.x ?? e.accelerationIncludingGravity?.x ?? null,
          y: e.acceleration?.y ?? e.accelerationIncludingGravity?.y ?? null,
          z: e.acceleration?.z ?? e.accelerationIncludingGravity?.z ?? null,
        },
        rotationRate: {
          alpha: e.rotationRate?.alpha ?? null,
          beta: e.rotationRate?.beta ?? null,
          gamma: e.rotationRate?.gamma ?? null,
        },
      })
    }
    window.addEventListener('devicemotion', this.motionHandler as EventListener)
  }

  startOrientationDetection(onData: (data: DeviceOrientationEvent) => void): void {
    this.orientationHandler = onData
    window.addEventListener('deviceorientation', this.orientationHandler as EventListener)
  }

  stopMotionDetection(): void {
    if (this.motionHandler) {
      window.removeEventListener('devicemotion', this.motionHandler as EventListener)
      this.motionHandler = null
    }
  }

  stopOrientationDetection(): void {
    if (this.orientationHandler) {
      window.removeEventListener('deviceorientation', this.orientationHandler as EventListener)
      this.orientationHandler = null
    }
  }
}

// ── 设备信息服务 ──
class DeviceInfoService {
  getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screen: { width: window.screen.width, height: window.screen.height },
      language: navigator.language,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
      connection: (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }).connection,
    }
  }

  getDeviceCapabilities(): string[] {
    const caps: string[] = []
    if (navigator.mediaDevices?.getUserMedia) caps.push('camera')
    if ('geolocation' in navigator) caps.push('geolocation')
    if ('DeviceMotionEvent' in window) caps.push('motion')
    if ('vibrate' in navigator) caps.push('vibration')
    if ('serviceWorker' in navigator) caps.push('pwa')
    return caps
  }

  async getBatteryInfo(): Promise<{ level: number; charging: boolean } | null> {
    try {
      const nav = navigator as Navigator & {
        getBattery?: () => Promise<{ level: number; charging: boolean }>
      }
      const b = await nav.getBattery?.()
      return b ? { level: b.level, charging: b.charging } : null
    } catch {
      return null
    }
  }
}

export const cameraService = new CameraService()
export const locationService = new LocationService()
export const sensorService = new SensorService()
export const deviceInfoService = new DeviceInfoService()
