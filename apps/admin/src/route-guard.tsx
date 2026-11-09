/**
 * @file 路由守卫组件
 * @description 用于保护需要认证和权限的应用路由
 * @module components
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { useEffect, useState } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { useAuth, useProtectedRoute } from '../hooks/useAuth';
import { SkeletonLoader } from './ui/skeleton-loader';
import { ErrorPage } from './error-page';

// 路由守卫Props接口
interface RouteGuardProps {
  /** 需要的权限（可选） */
  permission?: string | string[];
  /** 需要的角色（可选） */
  role?: string | string[];
  /** 未登录时重定向的路径，默认为'/login' */
  loginRedirect?: string;
  /** 无权限时重定向的路径，默认为'/unauthorized' */
  unauthorizedRedirect?: string;
  /** 加载中的自定义组件 */
  loadingComponent?: React.ReactNode;
  /** 子组件 */
  children: React.ReactNode;
}

// 权限状态类型
type PermissionStatus = 'loading' | 'granted' | 'denied' | 'unauthenticated';

/**
 * 路由守卫组件
 * 用于保护需要认证和权限的路由
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  permission,
  role,
  loginRedirect = '/login',
  unauthorizedRedirect = '/unauthorized',
  loadingComponent,
  children
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, hasPermission, hasRole } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('loading');
  const [redirecting, setRedirecting] = useState(false);

  // 检查权限并处理重定向
  useEffect(() => {
    const checkPermissionsAndRedirect = async () => {
      if (authLoading) {
        return;
      }

      // 检查认证状态
      if (!isAuthenticated) {
        setPermissionStatus('unauthenticated');
        // 避免重复重定向
        if (!redirecting) {
          setRedirecting(true);
          // 保存当前路径，便于登录后返回
          const returnUrl = router.asPath;
          await router.replace(`${loginRedirect}?returnUrl=${encodeURIComponent(returnUrl)}`);
        }
        return;
      }

      // 检查角色权限
      let hasRequiredRole = true;
      if (role) {
        hasRequiredRole = hasRole(role as any);
      }

      // 检查具体权限
      let hasRequiredPermission = true;
      if (permission) {
        hasRequiredPermission = hasPermission(permission);
      }

      // 权限检查结果
      if (hasRequiredRole && hasRequiredPermission) {
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
        // 避免重复重定向
        if (!redirecting) {
          setRedirecting(true);
          await router.replace(unauthorizedRedirect);
        }
      }
    };

    checkPermissionsAndRedirect();
  }, [isAuthenticated, authLoading, user, permission, role, router, loginRedirect, unauthorizedRedirect, redirecting, hasPermission, hasRole]);

  // 渲染加载状态
  if (authLoading || permissionStatus === 'loading') {
    if (loadingComponent) {
      return loadingComponent;
    }
    return <SkeletonLoader />;
  }

  // 如果权限已授予，渲染子组件
  if (permissionStatus === 'granted') {
    return <>{children}</>;
  }

  // 其他情况不应该渲染任何内容，因为会被重定向
  return null;
};

// 认证路由守卫Props接口
interface AuthRouteGuardProps extends Omit<RouteGuardProps, 'permission' | 'role'> {}

/**
 * 认证路由守卫
 * 只检查用户是否登录，不检查具体权限
 */
export const AuthRouteGuard: React.FC<AuthRouteGuardProps> = ({
  loginRedirect = '/login',
  loadingComponent,
  children
}) => {
  return (
    <RouteGuard
      loginRedirect={loginRedirect}
      loadingComponent={loadingComponent}
    >
      {children}
    </RouteGuard>
  );
};

// 管理员路由守卫Props接口
interface AdminRouteGuardProps extends Omit<RouteGuardProps, 'role'> {}

/**
 * 管理员路由守卫
 * 确保用户已登录且拥有管理员角色
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  loginRedirect = '/login',
  unauthorizedRedirect = '/unauthorized',
  loadingComponent,
  children
}) => {
  return (
    <RouteGuard
      role="admin"
      loginRedirect={loginRedirect}
      unauthorizedRedirect={unauthorizedRedirect}
      loadingComponent={loadingComponent}
    >
      {children}
    </RouteGuard>
  );
};

// 管理者路由守卫Props接口
interface ManagerRouteGuardProps extends Omit<RouteGuardProps, 'role'> {}

/**
 * 管理者路由守卫
 * 确保用户已登录且拥有管理员或经理角色
 */
export const ManagerRouteGuard: React.FC<ManagerRouteGuardProps> = ({
  loginRedirect = '/login',
  unauthorizedRedirect = '/unauthorized',
  loadingComponent,
  children
}) => {
  return (
    <RouteGuard
      role={['admin', 'manager']}
      loginRedirect={loginRedirect}
      unauthorizedRedirect={unauthorizedRedirect}
      loadingComponent={loadingComponent}
    >
      {children}
    </RouteGuard>
  );
};

// 权限路由守卫HOC (高阶组件) - 用于Next.js页面组件
export const withAuth = (options?: Omit<RouteGuardProps, 'children'>) => {
  return (WrappedComponent: React.ComponentType<any>) => {
    const WithAuthComponent: React.FC<any> = (props) => {
      return (
        <RouteGuard {...options}>
          <WrappedComponent {...props} />
        </RouteGuard>
      );
    };

    // 保留原始组件的静态属性
    Object.keys(WrappedComponent).forEach(key => {
      (WithAuthComponent as any)[key] = (WrappedComponent as any)[key];
    });

    // 为Next.js添加名称
    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithAuthComponent;
  };
};

// 管理员权限路由守卫HOC
export const withAdminAuth = () => {
  return withAuth({
    role: 'admin'
  });
};

// 管理者权限路由守卫HOC
export const withManagerAuth = () => {
  return withAuth({
    role: ['admin', 'manager']
  });
};

// 权限检查Hook - 用于客户端组件
interface PermissionCheckResult {
  hasPermission: boolean;
  isLoading: boolean;
  redirectIfNeeded: () => Promise<void>;
}

export const usePermissionGuard = (
  permission?: string | string[],
  role?: string | string[],
  loginRedirect = '/login',
  unauthorizedRedirect = '/unauthorized'
): PermissionCheckResult => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, hasPermission: checkPermission, hasRole: checkRole } = useAuth();

  const redirectIfNeeded = async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      const returnUrl = router.asPath;
      await router.replace(`${loginRedirect}?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    let hasRequiredRole = true;
    if (role) {
      hasRequiredRole = checkRole(role as any);
    }

    let hasRequiredPermission = true;
    if (permission) {
      hasRequiredPermission = checkPermission(permission);
    }

    if (!hasRequiredRole || !hasRequiredPermission) {
      await router.replace(unauthorizedRedirect);
    }
  };

  // 计算最终的权限状态
  const hasPermission = !authLoading && isAuthenticated &&
    (role ? checkRole(role as any) : true) &&
    (permission ? checkPermission(permission) : true);

  return {
    hasPermission,
    isLoading: authLoading,
    redirectIfNeeded
  };
};

// 公共布局权限包装组件
interface LayoutGuardProps {
  /** 页面访问需要的权限 */
  permission?: string | string[];
  /** 页面访问需要的角色 */
  role?: string | string[];
  /** 页面内容 */
  children: React.ReactNode;
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
}

export const LayoutGuard: React.FC<LayoutGuardProps> = ({
  permission,
  role,
  children,
  title,
  description
}) => {
  const { hasPermission, isLoading, redirectIfNeeded } = usePermissionGuard(permission, role);

  // 如果权限不足，执行重定向
  useEffect(() => {
    if (!isLoading && !hasPermission) {
      redirectIfNeeded();
    }
  }, [hasPermission, isLoading, redirectIfNeeded]);

  // 权限检查中显示加载状态
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // 权限已授予，渲染页面内容
  if (hasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        {children}
      </div>
    );
  }

  // 权限不足，不渲染内容，等待重定向
  return null;
};

// 导出默认路由守卫
export default RouteGuard;
