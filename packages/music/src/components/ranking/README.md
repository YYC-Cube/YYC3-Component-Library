# 星力系统集成指南

本指南提供了如何在M98 Music项目中集成和使用星力系统的详细说明。

## 1. 系统概述

星力系统是M98 Music的核心功能之一，基于威尔逊区间算法实现内容质量评分和用户贡献排行。系统主要包含以下模块：

- 星力值计算算法（威尔逊区间算法）
- 排行榜管理（全局/分类排行榜）
- 3D可视化排行榜
- 用户星力值展示
- 星力值趋势分析

## 2. 核心文件结构

```
frontend/src/
├── components/ranking/      # 排行榜相关组件
│   ├── RankingPage.tsx      # 排行榜主页面
│   ├── ThreeDRankingBoard.tsx # 3D排行榜组件
│   ├── StarPowerCard.tsx    # 星力值卡片组件
│   └── README.md            # 本指南
├── services/                # 服务层
│   └── starPowerService.js  # 星力系统API服务
├── utils/                   # 工具函数
│   └── starPowerAlgorithm.ts # 星力值算法实现
└── store/slices/            # Redux状态管理
    └── rankingSlice.ts      # 排行榜状态管理
```

## 3. 快速集成步骤

### 3.1 在页面中使用排行榜组件

```tsx
import React from 'react';
import RankingPage from '../ranking/RankingPage';

const HomePage = () => {
  return (
    <div>
      <h1>排行榜</h1>
      <RankingPage />
    </div>
  );
};

export default HomePage;
```

### 3.2 使用3D排行榜组件

```tsx
import React from 'react';
import ThreeDRankingBoard from '../ranking/ThreeDRankingBoard';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>3D 星力排行榜</h2>
      <ThreeDRankingBoard />
    </div>
  );
};

export default Dashboard;
```

### 3.3 在用户个人页面展示星力值卡片

```tsx
import React from 'react';
import StarPowerCard from '../ranking/StarPowerCard';

const UserProfile = ({ userId }) => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>用户个人资料</h1>
      </div>
      <div className="user-stats">
        <StarPowerCard 
          userId={userId} 
          size="large" 
          showProgress={true} 
          showTrend={true} 
        />
      </div>
    </div>
  );
};

export default UserProfile;
```

### 3.4 使用Redux状态管理

```tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  fetchGlobalRanking, 
  fetchCategoryRanking, 
  boostContent 
} from '../../store/slices/rankingSlice';

const CustomRanking = () => {
  const dispatch = useDispatch();
  const { globalRanking, loading } = useSelector((state: RootState) => state.ranking);

  useEffect(() => {
    // 获取全局排行榜
    dispatch(fetchGlobalRanking({ limit: 20 }));
    // 获取音乐分类排行榜
    dispatch(fetchCategoryRanking({ category: 'music' }));
  }, [dispatch]);

  const handleBoost = (contentId) => {
    dispatch(boostContent(contentId));
  };

  return (
    <div>
      <h2>自定义排行榜</h2>
      {loading.global ? (
        <p>加载中...</p>
      ) : (
        <ul>
          {globalRanking.map((item) => (
            <li key={item.contentId}>
              {item.rank}. {item.title} - {item.starPower} 星力
              <button onClick={() => handleBoost(item.contentId)}>助推</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomRanking;
```

## 4. API接口说明

星力系统的主要API接口通过`starPowerService.js`提供：

### 4.1 计算本地星力值

```javascript
import starPowerService from '../services/starPowerService';

const interactionData = {
  likes: 100,
  dislikes: 10,
  comments: 20,
  shares: 5,
  plays: 500,
  duration: 24, // 小时
  quality: 90,  // AI质量评分 0-100
};

const starPower = starPowerService.calculateLocalStarPower(interactionData);
console.log('计算的星力值:', starPower);
```

### 4.2 获取排行榜数据

```javascript
// 获取全局排行榜
const globalRanking = await starPowerService.getGlobalRanking({ limit: 50, offset: 0 });

// 获取分类排行榜
const musicRanking = await starPowerService.getCategoryRanking('music', { limit: 20 });
```

### 4.3 获取星力值趋势数据

```javascript
// 获取趋势数据
const trendData = await starPowerService.getStarPowerTrend({
  period: 'week', // day, week, month
  category: 'global'
});
```

## 5. 配置和依赖

### 5.1 前端依赖

- Ant Design 组件库
- Three.js (用于3D排行榜)
- ECharts (用于趋势图表)
- Redux Toolkit (状态管理)

### 5.2 后端配置

确保后端已配置以下API端点：

- `/api/v1/star-power/ranking/global` - 获取全局排行榜
- `/api/v1/star-power/ranking/category/:category` - 获取分类排行榜
- `/api/v1/star-power/user/:userId` - 获取用户星力值
- `/api/v1/star-power/content/:contentId` - 获取内容星力值
- `/api/v1/star-power/interaction` - 更新内容互动
- `/api/v1/star-power/trend` - 获取趋势数据

## 6. 性能优化建议

1. **懒加载组件**：使用React的`React.lazy`和`Suspense`懒加载大型组件如3D排行榜
2. **缓存数据**：对排行榜数据进行缓存，减少API调用
3. **分页加载**：实现分页加载机制，避免一次性加载大量数据
4. **虚拟滚动**：对于长列表使用虚拟滚动技术
5. **WebGL优化**：3D排行榜组件使用适当的LOD（细节层次）技术

## 7. 常见问题

### 7.1 排行榜数据不更新

- 检查后端API是否正常工作
- 确认Redis缓存是否正确配置
- 验证星力值计算逻辑是否正确

### 7.2 3D排行榜性能问题

- 减少显示的星星数量
- 优化Three.js渲染设置
- 使用requestAnimationFrame进行平滑动画

### 7.3 星力值计算不准确

- 检查威尔逊区间算法参数设置
- 验证互动数据是否完整收集
- 确认时间衰减因子计算逻辑

## 8. 扩展建议

1. **添加实时更新**：使用WebSocket实现排行榜实时更新
2. **自定义权重**：允许管理员调整星力值计算的各项权重
3. **多维度排行**：增加更多维度的排行榜（如最具创新性、最佳新人等）
4. **社交分享**：添加排行榜分享功能
5. **成就系统**：结合星力值实现成就解锁机制

---

通过以上步骤，您可以成功将星力系统集成到M98 Music项目中。如需更多帮助，请参考源代码中的详细注释或联系开发团队。

