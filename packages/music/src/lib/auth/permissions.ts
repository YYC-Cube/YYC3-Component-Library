// 权限类型
export enum Permission {
  // 基础权限
  VIEW_CONTENT = "view_content",
  CREATE_CONTENT = "create_content",
  EDIT_OWN_CONTENT = "edit_own_content",
  DELETE_OWN_CONTENT = "delete_own_content",

  // 高级权限
  EDIT_ANY_CONTENT = "edit_any_content",
  DELETE_ANY_CONTENT = "delete_any_content",
  MANAGE_USERS = "manage_users",
  MANAGE_SETTINGS = "manage_settings",

  // 特殊权限
  ACCESS_ANALYTICS = "access_analytics",
  BROADCAST_CITY = "broadcast_city",
  CREATE_PREMIUM_CONTENT = "create_premium_content",
}

// 角色类型
export enum Role {
  GUEST = "guest",
  USER = "user",
  CREATOR = "creator",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

// 角色权限映射
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.GUEST]: [Permission.VIEW_CONTENT],
  [Role.USER]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.DELETE_OWN_CONTENT,
  ],
  [Role.CREATOR]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.DELETE_OWN_CONTENT,
    Permission.CREATE_PREMIUM_CONTENT,
    Permission.BROADCAST_CITY,
  ],
  [Role.MODERATOR]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.DELETE_OWN_CONTENT,
    Permission.EDIT_ANY_CONTENT,
    Permission.DELETE_ANY_CONTENT,
    Permission.ACCESS_ANALYTICS,
  ],
  [Role.ADMIN]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.DELETE_OWN_CONTENT,
    Permission.EDIT_ANY_CONTENT,
    Permission.DELETE_ANY_CONTENT,
    Permission.MANAGE_USERS,
    Permission.MANAGE_SETTINGS,
    Permission.ACCESS_ANALYTICS,
    Permission.BROADCAST_CITY,
    Permission.CREATE_PREMIUM_CONTENT,
  ],
}

// 用户类型
export interface User {
  id: string
  name: string
  email: string
  role: Role
  customPermissions?: Permission[] // 自定义权限
}

// 检查用户是否有特定权限
export function hasPermission(user: User, permission: Permission): boolean {
  // 如果用户没有角色，则视为访客
  const role = user?.role || Role.GUEST

  // 检查角色权限
  const roleHasPermission = rolePermissions[role].includes(permission)

  // 检查自定义权限
  const customHasPermission = user?.customPermissions?.includes(permission) || false

  return roleHasPermission || customHasPermission
}

// 检查用户是否有多个权限中的任意一个
export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission))
}

// 检查用户是否有所有指定的权限
export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(user, permission))
}
