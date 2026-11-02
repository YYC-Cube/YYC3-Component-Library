"use client"

import { motion } from "framer-motion"
import { X, Star, Gift, TrendingUp, Users } from "lucide-react"

type StarPowerInfoProps = {
  onClose: () => void
}

export default function StarPowerInfo({ onClose }: StarPowerInfoProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-deep-space-blue rounded-lg p-6 max-w-2xl w-full m-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            星力系统详情
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Gift className="w-5 h-5 text-purple-400 mr-2" />
              获取星力
            </h3>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>每日签到：+10星力（连续7天额外+50）</li>
              <li>邀请好友：被邀请人注册+50，完成首创作+100</li>
              <li>作品互动：每100播放量+1，每收藏+5（日上限500）</li>
              <li>充值购买：1元=10星力（首充双倍）</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              使用星力
            </h3>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>打榜助推：每100星力提升作品100人气值</li>
              <li>兑换特权：星力商城（专属音色/虚拟服装/推荐位）</li>
              <li>会员升级：VIP等级经验值转化（1000星力=1经验）</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Users className="w-5 h-5 text-green-400 mr-2" />
              VIP特权
            </h3>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>1-3级：每日星力上限+50%，青铜星环标识</li>
              <li>4-6级：作品优先推荐，白银星冕标识</li>
              <li>7-9级：定制AI声库，黄金星翼标识（动态粒子特效）</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
