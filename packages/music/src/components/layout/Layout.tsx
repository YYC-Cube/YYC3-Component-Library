import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdvancedAudioPlayer } from '../Player/AdvancedAudioPlayer'
import type { ReactNode } from 'react'

interface LayoutProps {
  children?: ReactNode
}

/**
 * 应用布局组件
 * 包含导航、主内容区和音乐播放器
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  
  // 某些页面可能不需要显示播放器
  const shouldShowPlayer = !['/login', '/register', '/404', '/500'].includes(location.pathname)
  
  return (
    <div className="app-layout">
      {/* 主内容区域 */}
      <main className="main-content">
        {children || <Outlet />}
      </main>
      
      {/* 音乐播放器 */}
      {shouldShowPlayer && <AdvancedAudioPlayer tracks={[]} />}
    </div>
  )
}

export default Layout