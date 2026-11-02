/**
 * @file 用户资料组件
 * @description 显示用户头像和基本信息
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
        <span>管理员</span>
      </div>
    </div>
  );
};

export default UserProfile;
