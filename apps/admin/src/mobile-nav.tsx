/**
 * @file 移动端导航组件
 * @description 适配移动端的导航菜单
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React from 'react';
import useMobile from '@/hooks/use-mobile';

const MobileNav: React.FC = () => {
  const isMobile = useMobile();
  
  if (!isMobile) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
      <nav className="flex justify-around py-2">
        {[
          { icon: '📊', label: '看板' },
          { icon: '👥', label: '学生' },
          { icon: '🎯', label: '目标' },
          { icon: '📝', label: '日志' },
        ].map((item, index) => (
          <a key={index} href="#" className="flex flex-col items-center text-gray-600">
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;
