// 导出所有Supabase相关功能的中央文件

// 从browser-client.ts导出浏览器客户端
export * from './browser-client';

// 从server-client.ts导出服务器客户端
export { createClient as createServerClient, supabaseAdmin } from './server-client';

// 添加使用说明注释
/**
 * Supabase客户端使用指南:
 *
 * 1. 在客户端组件中:
 *    import { supabase } from '@/lib/supabase'
 *
 * 2. 在服务器端组件或Server Action中:
 *    import { createServerClient } from '@/lib/supabase'
 *    const supabase = createServerClient()
 *
 * 3. 在需要管理员权限的服务器端操作中:
 *    import { supabaseAdmin } from '@/lib/supabase'
 *
 * 注意: 避免在同一个组件中同时使用浏览器客户端和服务器客户端
 */
