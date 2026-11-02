// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { refreshAuthToken } from '../../store/slices/authSlice'
import { Loader } from '@mantine/core'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = [] 
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const { isAuthenticated, user, token, loading = false } = useSelector(
    (state: RootState) => state.auth || {}
  )
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !isAuthenticated && !loading) {
        setIsRefreshing(true)
        try {
          await dispatch(refreshAuthToken()).unwrap()
        } catch (error) {
          console.error('Token refresh failed:', error)
        } finally {
          setIsRefreshing(false)
        }
      }
    }

    checkAuth()
  }, [token, isAuthenticated, loading, dispatch])

  if (loading || isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="xl" color="violet" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 角色权限检查
  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}