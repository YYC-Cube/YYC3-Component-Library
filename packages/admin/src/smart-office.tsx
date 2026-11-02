/**
 * @file 智能办公组件
 * @description 提供智能办公功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React from 'react';

const SmartOffice: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">智能办公中心</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-md p-4 text-center">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-medium text-gray-900">日程管理</h3>
        </div>
        <div className="border border-gray-200 rounded-md p-4 text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-medium text-gray-900">文档中心</h3>
        </div>
        <div className="border border-gray-200 rounded-md p-4 text-center">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-medium text-gray-900">会议管理</h3>
        </div>
      </div>
    </div>
  );
};

export default SmartOffice;
