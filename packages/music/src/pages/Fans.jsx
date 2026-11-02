import React from 'react'

const Fans = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">粉丝互动</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">粉丝统计</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">总粉丝数</span>
                <span className="font-medium">10,245</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">活跃粉丝</span>
                <span className="font-medium">4,321</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">新增粉丝(周)</span>
                <span className="font-medium">567</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">粉丝分布</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">北京</span>
              <span className="font-medium">2,345</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">上海</span>
              <span className="font-medium">1,876</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">广州</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">深圳</span>
              <span className="font-medium">987</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">其他城市</span>
              <span className="font-medium">3,803</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">最新留言</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-500 text-sm">A</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">爱音乐的小明</h3>
                <p className="text-xs text-gray-500">2小时前</p>
              </div>
            </div>
            <p className="text-gray-700">董小姐的歌真好听，每次听都有不一样的感受。</p>
          </div>
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-500 text-sm">B</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">音乐爱好者</h3>
                <p className="text-xs text-gray-500">昨天</p>
              </div>
            </div>
            <p className="text-gray-700">什么时候出新专辑啊？非常期待！</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-500 text-sm">C</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">忠实粉丝</h3>
                <p className="text-xs text-gray-500">3天前</p>
              </div>
            </div>
            <p className="text-gray-700">演唱会太棒了，希望能再来一次！</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fans