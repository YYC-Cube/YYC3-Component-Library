import React from 'react'

const Analytics = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">数据分析</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">播放量统计</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-400">播放量图表</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">今日播放</p>
              <p className="text-lg font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">本周播放</p>
              <p className="text-lg font-bold text-gray-900">8,765</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">总播放量</p>
              <p className="text-lg font-bold text-gray-900">123,456</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">歌曲排行榜</h2>
          <div className="space-y-3">
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold mr-3">1</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">董小姐</h3>
                <p className="text-sm text-gray-500">播放量: 45,678</p>
              </div>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold mr-3">2</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">安和桥</h3>
                <p className="text-sm text-gray-500">播放量: 34,567</p>
              </div>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-3">3</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">斑马斑马</h3>
                <p className="text-sm text-gray-500">播放量: 23,456</p>
              </div>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold mr-3">4</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">莉莉安</h3>
                <p className="text-sm text-gray-500">播放量: 12,345</p>
              </div>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold mr-3">5</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">南山南</h3>
                <p className="text-sm text-gray-500">播放量: 10,987</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">听众分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-2">58%</div>
            <p className="text-gray-600">男性听众</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-2">42%</div>
            <p className="text-gray-600">女性听众</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-2">25-34</div>
            <p className="text-gray-600">主要年龄段</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics