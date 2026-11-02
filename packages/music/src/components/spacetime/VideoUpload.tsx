import React, { useState, useRef } from 'react'
import { Card, Button, Text, Progress, Avatar, Input, Badge, Alert } from '@mantine/core'
import { IconUpload, IconVideo, IconPlayerPlay, IconPlayerPause, IconTrash, IconFileX, IconCheck, IconAlertCircle } from '@tabler/icons-react'

interface VideoUploadProps {
  onUploadComplete?: (videoUrl: string, thumbnailUrl: string) => void
  maxSize?: number
  supportedFormats?: string[]
}

/**
 * 视频上传组件
 * 支持拖拽上传、预览、进度显示和上传状态管理
 */
export const VideoUpload: React.FC<VideoUploadProps> = ({
  onUploadComplete,
  maxSize = 100, // 默认100MB
  supportedFormats = ['mp4', 'webm', 'mov']
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  // 处理拖拽文件
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }

  // 阻止拖拽默认行为
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  // 处理文件
  const handleFile = (selectedFile: File) => {
    // 重置状态
    setErrorMessage(null)
    setUploadStatus('idle')

    // 验证文件类型
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      setErrorMessage(`不支持的文件格式。请上传 ${supportedFormats.join(', ')} 格式的视频文件。`)
      setUploadStatus('error')
      return
    }

    // 验证文件大小
    const fileSizeInMB = selectedFile.size / (1024 * 1024)
    if (fileSizeInMB > maxSize) {
      setErrorMessage(`文件大小超过限制。最大支持 ${maxSize}MB。`)
      setUploadStatus('error')
      return
    }

    // 设置文件和预览
    setFile(selectedFile)
    setVideoTitle(selectedFile.name.split('.').slice(0, -1).join('.'))

    // 创建视频预览
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    // 清理URL以避免内存泄漏
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }

  // 生成缩略图
  const generateThumbnail = () => {
    if (!videoRef.current || !canvasRef.current || !previewUrl) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // 设置canvas尺寸
    canvas.width = video.videoWidth || 320
    canvas.height = video.videoHeight || 240

    // 播放视频到第一帧并绘制到canvas
    video.currentTime = 1 // 1秒处的帧通常已经加载
    video.addEventListener('seeked', () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // 将canvas内容转换为DataURL
      const thumbnail = canvas.toDataURL('image/jpeg')
      setThumbnailUrl(thumbnail)
    }, { once: true })
  }

  // 处理视频加载完成
  const handleVideoLoaded = () => {
    generateThumbnail()
  }

  // 切换视频播放/暂停
  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // 上传视频
  const uploadVideo = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)
    setErrorMessage(null)

    try {
      // 创建FormData
      const formData = new FormData()
      formData.append('video', file)
      if (videoTitle) {
        formData.append('title', videoTitle)
      }
      if (thumbnailUrl) {
        // 将dataURL转换为Blob并添加到formData
        const blob = dataURItoBlob(thumbnailUrl)
        formData.append('thumbnail', blob, 'thumbnail.jpg')
      }

      // 获取用户token
      const token = localStorage.getItem('token')

      // 创建XMLHttpRequest以跟踪进度
      const xhr = new XMLHttpRequest()
      const uploadUrl = `${process.env.REACT_APP_API_URL}/api/spacetime/videos`

      // 设置进度监听
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })

      // 设置完成监听
      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText)
          setUploadStatus('success')
          setUploading(false)
          
          // 通知父组件上传完成
          if (onUploadComplete) {
            onUploadComplete(response.videoUrl, response.thumbnailUrl)
          }
        } else {
          throw new Error(`上传失败: ${xhr.statusText}`)
        }
      })

      // 设置错误监听
      xhr.addEventListener('error', () => {
        throw new Error('网络错误，上传失败')
      })

      // 发送请求
      xhr.open('POST', uploadUrl)
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(formData)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '上传失败，请稍后重试')
      setUploadStatus('error')
      setUploading(false)
    }
  }

  // 清除选择的文件
  const clearFile = () => {
    setFile(null)
    setPreviewUrl(null)
    setThumbnailUrl(null)
    setUploadProgress(0)
    setUploadStatus('idle')
    setVideoTitle('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // DataURL转Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    
    return new Blob([ab], { type: mimeString })
  }

  return (
      <Card shadow="lg" className="p-6">
        <Text size="lg" fw={600} mb={4}>上传视频消息</Text>
        
        {/* 错误提示 */}
        {errorMessage && (
          <Alert color="red" mb={4} variant="light">
            <IconFileX className="mr-2" size={18} />
            {errorMessage}
          </Alert>
        )}

        {/* 上传状态提示 */}
        {uploadStatus === 'success' && (
          <Alert color="green" mb={4} variant="light">
            <IconCheck className="mr-2" size={24} color="green" />
            视频上传成功！
          </Alert>
        )}

        {/* 上传区域 */}
        {!file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <IconUpload size={48} color="gray.400" className="mb-4" />
            <Text size="md" mb={2}>拖拽视频文件到此处，或点击上传</Text>
            <Text size="sm" color="gray.500" mb={4}>
              支持格式: {supportedFormats.join(', ')} • 最大 {maxSize}MB
            </Text>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <IconVideo size={18} className="mr-2" />
              选择视频文件
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={supportedFormats.map(format => `video/${format}`).join(',')}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* 视频预览 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                src={previewUrl || undefined}
                controls={false}
                className="w-full h-auto max-h-64 object-contain"
                onLoadedData={handleVideoLoaded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {!uploading && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <IconPlayerPause size={48} color="white" /> : <IconPlayerPlay size={48} color="white" />}
                </div>
              )}
              {/* 上传中覆盖层 */}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                  <Text color="white" mb={2}>上传中...</Text>
                  <Progress value={uploadProgress} color="blue" w={200} />
                  <Text color="white" size="sm" mt={2}>{uploadProgress}%</Text>
                </div>
              )}
            </div>

            {/* 视频信息 */}
            <div className="space-y-3">
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="视频标题"
                disabled={uploading}
              />
              <div className="flex justify-between items-center">
                <div>
                  <Text size="sm" color="gray.500">
                    文件名: {file.name}
                  </Text>
                  <Text size="sm" color="gray.500">
                    大小: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </div>
                {thumbnailUrl && (
                  <div className="flex items-center space-x-2">
                    <Avatar src={thumbnailUrl} alt="缩略图" size={40} />
                    <Badge color="green">缩略图已生成</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex gap-4">
              <Button
                fullWidth
                onClick={uploadVideo}
                disabled={uploading || uploadStatus === 'success'}
                loading={uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? '上传中...' : '开始上传'}
              </Button>
              <Button
                variant="secondary"
                onClick={clearFile}
                disabled={uploading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                <IconTrash size={18} className="mr-2" />
                取消
              </Button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <IconAlertCircle size={16} color="blue.500" className="mr-2 mb-2" />
            <Text size="sm" fw={600}>使用说明</Text>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>视频上传后将保存在您的时空消息库中</li>
            <li>您可以在时空动态中查看和分享已上传的视频</li>
            <li>视频会自动进行压缩优化以提升加载速度</li>
            <li>请确保上传的视频内容符合社区规范</li>
          </ul>
        </div>

        {/* 隐藏的canvas用于生成缩略图 */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
     </Card>
  )
}

export default VideoUpload