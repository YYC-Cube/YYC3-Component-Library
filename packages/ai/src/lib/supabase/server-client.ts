'use server';

import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// 创建带有用户上下文的服务端客户端
export function createClient() {
  const cookieStore = cookies();
  
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          return cookieStore.get(name)?.value;
        },
        set: (name, value, options) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 在服务器操作中无法设置cookie时会抛出错误
          }
        },
        remove: (name, options) => {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // 在服务器操作中无法删除cookie时会抛出错误
          }
        },
      },
    }
  );
}

// 创建服务端管理员客户端（使用服务角色密钥）
export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('缺少 Supabase 服务端环境变量。请确保设置了 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。');
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// 导出默认的管理员客户端
export const supabaseAdmin = createAdminClient();
