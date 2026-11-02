import React from 'react'

const Home = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">欢迎来到M98音乐</h1>
      <p className="text-xl text-gray-600 mb-8">董小姐个人音乐中心</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* 这里可以添加音乐专辑或歌曲卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-xl">专辑封面</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">热门专辑</h3>
          <p className="text-gray-600">董小姐的最新专辑</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-xl">专辑封面</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">经典回顾</h3>
          <p className="text-gray-600">董小姐的经典作品</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-xl">专辑封面</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">现场演出</h3>
          <p className="text-gray-600">董小姐的现场表演</p>
        </div>
      </div>
    </div>
  )
}

export default Home