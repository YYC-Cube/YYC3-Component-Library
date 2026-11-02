'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function WorkflowList() {
  // 状态用于存储数据和加载状态
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 当组件加载时获取数据
  useEffect(() => {
    async function fetchWorkflows() {
      // 显示加载状态
      setLoading(true);
      
      // 从Supabase获取数据
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 处理错误
      if (error) {
        console.error('获取工作流失败:', error);
      } else {
        // 更新状态
        setWorkflows(data || []);
      }
      
      // 隐藏加载状态
      setLoading(false);
    }

    // 调用函数
    fetchWorkflows();
  }, []);

  // 渲染UI
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">我的工作流</h1>
      
      {/* 加载状态 */}
      {loading ? (
        <p>加载中...</p>
      ) : (
        // 数据列表
        <ul className="space-y-2">
          {workflows.length === 0 ? (
            <p>没有找到工作流</p>
          ) : (
            workflows.map(workflow => (
              <li key={workflow.id} className="p-3 border rounded">
                {workflow.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
