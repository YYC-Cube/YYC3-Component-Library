'use client';

import { createBrowserClient } from '@supabase/ssr';

// 存储单例实例
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

// 创建客户端的函数（单例模式）
export function createClient() {
  // 如果实例已存在，直接返回
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // 创建新实例
  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseInstance;
}

// 导出默认客户端实例
export const supabase = createClient();
