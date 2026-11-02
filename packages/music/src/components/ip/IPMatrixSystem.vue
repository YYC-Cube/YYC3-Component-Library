<template>
  <div class="ip-matrix-system">
    <!-- 头部区域 -->
    <div class="header">
      <h1>IP矩阵系统</h1>
      <div class="header-actions">
        <button class="btn primary" @click="refreshData">
          <i class="icon-refresh"></i> 刷新数据
        </button>
        <button class="btn secondary" @click="showHelpModal = true">
          <i class="icon-help"></i> 帮助
        </button>
      </div>
    </div>

    <!-- 导航标签 -->
    <div class="nav-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 概览标签页 -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <div class="overview-grid">
          <!-- IP档案卡片 -->
          <div class="ip-profile-card card">
            <div class="card-header">
              <h2>IP档案</h2>
              <button class="btn-icon" @click="editIPProfile">
                <i class="icon-edit"></i>
              </button>
            </div>
            <div class="ip-profile-content">
              <img :src="ipProfile?.avatar || 'https://via.placeholder.com/150'" alt="IP头像" class="ip-avatar">
              <div class="ip-info">
                <h3>{{ ipProfile?.name || '未设置' }}</h3>
                <p class="ip-description">{{ ipProfile?.description || '暂无描述' }}</p>
                <div class="ip-meta">
                  <span class="meta-item">{{ getCategoryLabel(ipProfile?.category) }}</span>
                  <span class="meta-item">状态: {{ getStatusLabel(ipProfile?.status) }}</span>
                </div>
              </div>
            </div>
            <div class="ip-metrics">
              <div class="metric-item">
                <span class="metric-label">粉丝数</span>
                <span class="metric-value">{{ formatNumber(ipProfile?.metrics?.followers || 0) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">月活跃听众</span>
                <span class="metric-value">{{ formatNumber(ipProfile?.metrics?.monthlyListeners || 0) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">参与度</span>
                <span class="metric-value">{{ (ipProfile?.metrics?.engagementRate * 100).toFixed(1) }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">收入</span>
                <span class="metric-value">¥{{ formatCurrency(ipProfile?.metrics?.revenue || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- IP评估卡片 -->
          <div class="ip-assessment-card card">
            <div class="card-header">
              <h2>IP潜力评估</h2>
              <button class="btn secondary" @click="runIPAssessment">
                <i class="icon-analyze"></i> 重新评估
              </button>
            </div>
            <div class="assessment-content">
              <div class="total-score">
                <span class="score-number">{{ ipAssessment?.totalScore || 0 }}</span>
                <span class="score-label">总分</span>
              </div>
              <div class="assessment-metrics">
                <div class="assessment-metric">
                  <span class="metric-name">基础分</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (ipAssessment?.baseScore || 0) + '%' }"></div>
                    <span class="progress-text">{{ ipAssessment?.baseScore || 0 }}%</span>
                  </div>
                </div>
                <div class="assessment-metric">
                  <span class="metric-name">内容分</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (ipAssessment?.contentScore || 0) + '%' }"></div>
                    <span class="progress-text">{{ ipAssessment?.contentScore || 0 }}%</span>
                  </div>
                </div>
                <div class="assessment-metric">
                  <span class="metric-name">市场分</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (ipAssessment?.marketScore || 0) + '%' }"></div>
                    <span class="progress-text">{{ ipAssessment?.marketScore || 0 }}%</span>
                  </div>
                </div>
                <div class="assessment-metric">
                  <span class="metric-name">增长分</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (ipAssessment?.growthScore || 0) + '%' }"></div>
                    <span class="progress-text">{{ ipAssessment?.growthScore || 0 }}%</span>
                  </div>
                </div>
              </div>
              <div class="potential-indicator">
                <span class="potential-label">潜力评级:</span>
                <span class="potential-value" :class="['potential-' + (ipAssessment?.potential || 'low')]">
                  {{ getPotentialLabel(ipAssessment?.potential) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 最新成就 -->
        <div class="achievements-card card">
          <div class="card-header">
            <h2>最新成就</h2>
            <button class="btn-link" @click="viewAllAchievements">查看全部</button>
          </div>
          <div class="achievements-grid">
            <div v-for="achievement in recentAchievements" :key="achievement.id" class="achievement-item">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <h4>{{ achievement.title }}</h4>
                <p class="achievement-description">{{ achievement.description }}</p>
                <span class="achievement-date">{{ formatDate(achievement.unlockedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容管理标签页 -->
      <div v-if="activeTab === 'content'" class="tab-content">
        <div class="content-header">
          <h2>内容管理</h2>
          <button class="btn primary" @click="showCreateContentModal = true">
            <i class="icon-plus"></i> 添加内容
          </button>
        </div>
        <div class="content-filters">
          <select v-model="contentFilter.type" class="filter-select">
            <option value="all">全部类型</option>
            <option value="track">单曲</option>
            <option value="album">专辑</option>
            <option value="ep">EP</option>
            <option value="video">视频</option>
            <option value="live">现场</option>
            <option value="merchandise">周边</option>
          </select>
          <select v-model="contentFilter.platform" class="filter-select">
            <option value="all">全部平台</option>
            <option value="netease">网易云音乐</option>
            <option value="tencent">QQ音乐</option>
            <option value="kuwo">酷我音乐</option>
            <option value="kugou">酷狗音乐</option>
            <option value="spotify">Spotify</option>
            <option value="youtube">YouTube</option>
          </select>
          <input type="text" v-model="contentFilter.search" placeholder="搜索内容" class="filter-input">
        </div>
        <div class="content-list">
          <div v-for="content in filteredContent" :key="content.id" class="content-item card">
            <img :src="content.thumbnail || 'https://via.placeholder.com/120x120'" alt="内容封面" class="content-thumbnail">
            <div class="content-info">
              <h3>{{ content.title }}</h3>
              <p class="content-description">{{ content.description || '暂无描述' }}</p>
              <div class="content-meta">
                <span class="meta-item">{{ getContentTypeLabel(content.type) }}</span>
                <span class="meta-item">{{ formatDate(content.releaseDate) }}</span>
              </div>
            </div>
            <div class="content-metrics">
              <div class="metric-item small">
                <span class="metric-label">播放</span>
                <span class="metric-value">{{ formatNumber(content.metrics?.streams || 0) }}</span>
              </div>
              <div class="metric-item small">
                <span class="metric-label">点赞</span>
                <span class="metric-value">{{ formatNumber(content.metrics?.likes || 0) }}</span>
              </div>
              <div class="metric-item small">
                <span class="metric-label">收入</span>
                <span class="metric-value">¥{{ formatCurrency(content.metrics?.revenue || 0) }}</span>
              </div>
            </div>
            <div class="content-actions">
              <button class="btn-icon" @click="viewContentDetails(content.id)">
                <i class="icon-eye"></i>
              </button>
              <button class="btn-icon" @click="editContent(content.id)">
                <i class="icon-edit"></i>
              </button>
              <button class="btn-icon danger" @click="deleteContent(content.id)">
                <i class="icon-trash"></i>
              </button>
            </div>
          </div>
          <div v-if="filteredContent.length === 0" class="empty-state">
            <i class="icon-empty"></i>
            <p>暂无内容</p>
            <button class="btn primary" @click="showCreateContentModal = true">添加内容</button>
          </div>
        </div>
      </div>

      <!-- 数据分析标签页 -->
      <div v-if="activeTab === 'analytics'" class="tab-content">
        <div class="analytics-tabs">
          <button 
            v-for="tab in analyticsTabs" 
            :key="tab.id"
            :class="['analytics-tab', { active: activeAnalyticsTab === tab.id }]"
            @click="activeAnalyticsTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 分析概览 -->
        <div v-if="activeAnalyticsTab === 'overview'" class="analytics-content">
          <div class="analytics-grid">
            <div class="analytics-card card">
              <h3>总体表现</h3>
              <div class="overview-metrics">
                <div class="metric-item">
                  <span class="metric-label">总播放量</span>
                  <span class="metric-value">{{ formatNumber(analyticsData?.overview?.totalStreams || 0) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">总收入</span>
                  <span class="metric-value">¥{{ formatCurrency(analyticsData?.overview?.totalRevenue || 0) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">总粉丝数</span>
                  <span class="metric-value">{{ formatNumber(analyticsData?.overview?.totalFollowers || 0) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">参与率</span>
                  <span class="metric-value">{{ (analyticsData?.overview?.engagementRate * 100).toFixed(1) }}%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">增长率</span>
                  <span class="metric-value">{{ (analyticsData?.overview?.growthRate * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>热门内容</h3>
              <div class="top-content-list">
                <div v-for="content in analyticsData?.overview?.topContent" :key="content.id" class="top-content-item">
                  <img :src="content.thumbnail" alt="内容封面" class="top-content-thumbnail">
                  <div class="top-content-info">
                    <h4>{{ content.title }}</h4>
                    <p class="top-content-metrics">播放量: {{ formatNumber(content.metrics?.streams || 0) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>热门平台</h3>
              <div class="platform-chart">
                <!-- 这里将放置平台分布图表 -->
                <div v-for="platform in analyticsData?.overview?.topPlatforms" :key="platform" class="platform-item">
                  <span class="platform-name">{{ getPlatformName(platform) }}</span>
                  <div class="platform-bar">
                    <div class="platform-progress" :style="{ width: getPlatformPercentage(platform) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI洞察 -->
          <div class="insights-card card">
            <div class="card-header">
              <h3><i class="icon-brain"></i> AI洞察</h3>
              <button class="btn secondary" @click="generateNewInsights">
                <i class="icon-refresh"></i> 重新生成
              </button>
            </div>
            <div class="insights-content">
              <div v-for="insight in aiInsights" :key="insight.id" class="insight-item">
                <div class="insight-icon">{{ insight.icon }}</div>
                <div class="insight-text">
                  <p>{{ insight.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 受众分析 -->
        <div v-if="activeAnalyticsTab === 'audience'" class="analytics-content">
          <div class="analytics-grid">
            <div class="analytics-card card">
              <h3>受众人口统计</h3>
              <div class="demographics-content">
                <div class="demographic-section">
                  <h4>年龄分布</h4>
                  <div class="age-distribution">
                    <div v-for="(percentage, ageRange) in analyticsData?.audience?.demographics?.age" :key="ageRange" class="age-item">
                      <span class="age-label">{{ ageRange }}</span>
                      <div class="age-bar">
                        <div class="age-progress" :style="{ width: percentage + '%' }"></div>
                        <span class="age-percentage">{{ percentage }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="demographic-section">
                  <h4>性别分布</h4>
                  <div class="gender-distribution">
                    <div v-for="(percentage, gender) in analyticsData?.audience?.demographics?.gender" :key="gender" class="gender-item">
                      <span class="gender-label">{{ getGenderLabel(gender) }}</span>
                      <div class="gender-bar">
                        <div class="gender-progress" :style="{ width: percentage + '%' }"></div>
                        <span class="gender-percentage">{{ percentage }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="demographic-section">
                  <h4>地域分布</h4>
                  <div class="location-distribution">
                    <div v-for="(percentage, location) in analyticsData?.audience?.demographics?.location" :key="location" class="location-item">
                      <span class="location-label">{{ location }}</span>
                      <div class="location-bar">
                        <div class="location-progress" :style="{ width: percentage + '%' }"></div>
                        <span class="location-percentage">{{ percentage }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>受众行为</h3>
              <div class="behavior-content">
                <div class="behavior-section">
                  <h4>收听习惯</h4>
                  <div v-for="(value, habit) in analyticsData?.audience?.behavior?.listeningHabits" :key="habit" class="behavior-item">
                    <span class="behavior-label">{{ getListeningHabitLabel(habit) }}</span>
                    <span class="behavior-value">{{ value }}%</span>
                  </div>
                </div>
                <div class="behavior-section">
                  <h4>活跃时段</h4>
                  <div v-for="(value, time) in analyticsData?.audience?.behavior?.engagementTimes" :key="time" class="behavior-item">
                    <span class="behavior-label">{{ time }}</span>
                    <span class="behavior-value">{{ value }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>受众留存</h3>
              <div class="retention-content">
                <div class="retention-metrics">
                  <div class="retention-item">
                    <span class="retention-label">新听众</span>
                    <span class="retention-value">{{ analyticsData?.audience?.retention?.new || 0 }}%</span>
                  </div>
                  <div class="retention-item">
                    <span class="retention-label">回头客</span>
                    <span class="retention-value">{{ analyticsData?.audience?.retention?.returning || 0 }}%</span>
                  </div>
                  <div class="retention-item">
                    <span class="retention-label">流失率</span>
                    <span class="retention-value">{{ analyticsData?.audience?.retention?.churned || 0 }}%</span>
                  </div>
                  <div class="retention-item">
                    <span class="retention-label">留存率</span>
                    <span class="retention-value">{{ analyticsData?.audience?.retention?.retentionRate || 0 }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 收入分析 -->
        <div v-if="activeAnalyticsTab === 'revenue'" class="analytics-content">
          <div class="analytics-grid">
            <div class="analytics-card card">
              <h3>收入总览</h3>
              <div class="revenue-overview">
                <div class="total-revenue">
                  <span class="revenue-label">总收入</span>
                  <span class="revenue-value">¥{{ formatCurrency(analyticsData?.revenue?.total || 0) }}</span>
                </div>
                <div class="revenue-breakdown">
                  <h4>收入来源</h4>
                  <div v-for="source in analyticsData?.revenue?.breakdown" :key="source.source" class="revenue-source">
                    <span class="source-label">{{ getRevenueSourceLabel(source.source) }}</span>
                    <div class="source-bar">
                      <div class="source-progress" :style="{ width: source.percentage + '%' }"></div>
                      <span class="source-percentage">{{ source.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>收入预测</h3>
              <div class="revenue-projections">
                <div v-for="projection in analyticsData?.revenue?.projections" :key="projection.period" class="projection-item">
                  <span class="projection-label">{{ projection.period }}</span>
                  <div class="projection-values">
                    <span class="projected-value">预测: ¥{{ formatCurrency(projection.projected || 0) }}</span>
                    <span v-if="projection.actual" class="actual-value">实际: ¥{{ formatCurrency(projection.actual || 0) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>收入趋势</h3>
              <div class="revenue-trends">
                <!-- 这里将放置收入趋势图表 -->
                <div v-for="trend in analyticsData?.revenue?.trends" :key="trend.date" class="trend-item">
                  <span class="trend-date">{{ trend.date }}</span>
                  <div class="trend-bar">
                    <div class="trend-progress" :style="{ height: getTrendHeight(trend.amount) + '%' }"></div>
                    <span class="trend-value">¥{{ formatCurrency(trend.amount || 0) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 趋势分析 -->
        <div v-if="activeAnalyticsTab === 'trends'" class="analytics-content">
          <div class="analytics-grid">
            <div class="analytics-card card">
              <h3>内容趋势</h3>
              <div class="content-trends">
                <div v-for="trend in analyticsData?.trends?.content" :key="trend.type" class="content-trend-item">
                  <span class="trend-type">{{ getContentTypeLabel(trend.type) }}</span>
                  <div class="trend-metrics">
                    <span class="trend-popularity">热度: {{ trend.popularity }}</span>
                    <span :class="['trend-growth', trend.growth > 0 ? 'positive' : 'negative']">
                      增长: {{ trend.growth > 0 ? '+' : '' }}{{ trend.growth }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>受众趋势</h3>
              <div class="audience-trends">
                <div v-for="trend in analyticsData?.trends?.audience" :key="trend.metric" class="audience-trend-item">
                  <span class="trend-metric">{{ getAudienceMetricLabel(trend.metric) }}</span>
                  <div class="trend-values">
                    <span class="trend-current">当前: {{ trend.value }}</span>
                    <span class="trend-change">变化: {{ trend.change }}</span>
                    <span class="trend-prediction">预测: {{ trend.prediction }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card card">
              <h3>市场趋势</h3>
              <div class="market-trends">
                <div v-for="trend in analyticsData?.trends?.market" :key="trend.genre" class="market-trend-item">
                  <span class="trend-genre">{{ trend.genre }}</span>
                  <div class="market-metrics">
                    <span class="market-share">市场份额: {{ trend.marketShare }}%</span>
                    <span :class="['market-growth', trend.growth > 0 ? 'positive' : 'negative']">
                      增长: {{ trend.growth > 0 ? '+' : '' }}{{ trend.growth }}%
                    </span>
                    <span class="market-competition">竞争: {{ getCompetitionLevel(trend.competition) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- IP孵化标签页 -->
      <div v-if="activeTab === 'incubator'" class="tab-content">
        <div class="incubator-header">
          <h2>IP孵化</h2>
          <button class="btn primary" @click="showApplyIncubatorModal = true">
            <i class="icon-rocket"></i> 申请孵化
          </button>
        </div>
        
        <!-- 孵化状态 -->
        <div v-if="incubatorApplication" class="incubator-status-card card">
          <div class="card-header">
            <h3>孵化申请状态</h3>
          </div>
          <div class="incubator-status-content">
            <div class="status-info">
              <span class="status-label">申请时间:</span>
              <span class="status-value">{{ formatDate(incubatorApplication.submittedAt) }}</span>
            </div>
            <div class="status-info">
              <span class="status-label">状态:</span>
              <span class="status-value" :class="['status-' + incubatorApplication.status]">
                {{ getApplicationStatusLabel(incubatorApplication.status) }}
              </span>
            </div>
            <div v-if="incubatorApplication.score" class="status-info">
              <span class="status-label">评分:</span>
              <span class="status-value">{{ incubatorApplication.score }}/100</span>
            </div>
            <div v-if="incubatorApplication.feedback" class="status-feedback">
              <span class="feedback-label">反馈:</span>
              <p class="feedback-text">{{ incubatorApplication.feedback }}</p>
            </div>
          </div>
        </div>

        <!-- 孵化服务 -->
        <div class="incubator-services-card card">
          <div class="card-header">
            <h3>孵化服务</h3>
          </div>
          <div class="incubator-services-content">
            <div v-for="service in incubatorServices" :key="service.id" class="service-item">
              <div class="service-icon">{{ service.icon }}</div>
              <div class="service-info">
                <h4>{{ service.name }}</h4>
                <p class="service-description">{{ service.description }}</p>
                <div class="service-benefits">
                  <h5>包含服务:</h5>
                  <ul>
                    <li v-for="benefit in service.benefits" :key="benefit.type">{{ benefit.description }}</li>
                  </ul>
                </div>
                <button class="btn secondary" @click="useService(service.id)">
                  使用服务
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- IP定位策略 -->
        <div class="positioning-card card">
          <div class="card-header">
            <h3>IP定位策略</h3>
            <button class="btn secondary" @click="generatePositioningStrategy">
              <i class="icon-brain"></i> 生成策略
            </button>
          </div>
          <div v-if="ipPositioning" class="positioning-content">
            <div class="positioning-section">
              <h4>目标受众</h4>
              <p>{{ ipPositioning.targetAudience }}</p>
            </div>
            <div class="positioning-section">
              <h4>核心价值</h4>
              <p>{{ ipPositioning.uniqueValue }}</p>
            </div>
            <div class="positioning-section">
              <h4>品牌调性</h4>
              <p>{{ ipPositioning.brandVoice }}</p>
            </div>
            <div class="positioning-section">
              <h4>差异化优势</h4>
              <ul>
                <li v-for="(factor, index) in ipPositioning.differentiationFactors" :key="index">{{ factor }}</li>
              </ul>
            </div>
          </div>
          <div v-else class="positioning-empty">
            <p>尚未生成IP定位策略</p>
            <button class="btn primary" @click="generatePositioningStrategy">
              <i class="icon-brain"></i> 生成定位策略
            </button>
          </div>
        </div>

        <!-- IP包装方案 -->
        <div class="packaging-card card">
          <div class="card-header">
            <h3>IP包装方案</h3>
            <button class="btn secondary" @click="generatePackagingPlan">
              <i class="icon-package"></i> 生成方案
            </button>
          </div>
          <div v-if="ipPackaging" class="packaging-content">
            <div class="packaging-section">
              <h4>视觉包装</h4>
              <p>{{ ipPackaging.visual }}</p>
            </div>
            <div class="packaging-section">
              <h4>内容包装</h4>
              <p>{{ ipPackaging.content }}</p>
            </div>
            <div class="packaging-section">
              <h4>社交媒体包装</h4>
              <p>{{ ipPackaging.social }}</p>
            </div>
            <div class="packaging-section">
              <h4>法律保护</h4>
              <p>{{ ipPackaging.legal }}</p>
            </div>
          </div>
          <div v-else class="packaging-empty">
            <p>尚未生成IP包装方案</p>
            <button class="btn primary" @click="generatePackagingPlan">
              <i class="icon-package"></i> 生成包装方案
            </button>
          </div>
        </div>

        <!-- 推广计划 -->
        <div class="promotion-card card">
          <div class="card-header">
            <h3>推广计划</h3>
            <button class="btn secondary" @click="generatePromotionPlan">
              <i class="icon-bullhorn"></i> 生成计划
            </button>
          </div>
          <div v-if="promotionPlan" class="promotion-content">
            <div class="promotion-section">
              <h4>目标</h4>
              <p>{{ promotionPlan.objectives }}</p>
            </div>
            <div class="promotion-section">
              <h4>目标受众</h4>
              <p>{{ promotionPlan.targetAudience }}</p>
            </div>
            <div class="promotion-section">
              <h4>推广渠道</h4>
              <p>{{ promotionPlan.channels }}</p>
            </div>
            <div class="promotion-section">
              <h4>时间线</h4>
              <p>{{ promotionPlan.timeline }}</p>
            </div>
            <div class="promotion-section">
              <h4>预算</h4>
              <p>{{ promotionPlan.budget }}</p>
            </div>
          </div>
          <div v-else class="promotion-empty">
            <p>尚未生成推广计划</p>
            <button class="btn primary" @click="generatePromotionPlan">
              <i class="icon-bullhorn"></i> 生成推广计划
            </button>
          </div>
        </div>
      </div>

      <!-- 分发渠道标签页 -->
      <div v-if="activeTab === 'distribution'" class="tab-content">
        <div class="distribution-header">
          <h2>分发渠道</h2>
          <button class="btn primary" @click="showAddChannelModal = true">
            <i class="icon-plus"></i> 添加渠道
          </button>
        </div>
        <div class="distribution-list">
          <div v-for="channel in distributionChannels" :key="channel.id" class="channel-item card">
            <div class="channel-info">
              <h3>{{ channel.name }}</h3>
              <p class="channel-description">{{ channel.description || '暂无描述' }}</p>
              <div class="channel-meta">
                <span class="meta-item">{{ getChannelTypeLabel(channel.type) }}</span>
                <span class="meta-item">覆盖: {{ formatNumber(channel.reach) }}</span>
                <span class="meta-item" :class="['status-' + (channel.performance?.uploads > 0 ? 'active' : 'inactive')]">
                  {{ channel.performance?.uploads > 0 ? '已连接' : '未连接' }}
                </span>
              </div>
            </div>
            <div class="channel-performance">
              <div class="performance-metrics">
                <div class="metric-item small">
                  <span class="metric-label">上传内容</span>
                  <span class="metric-value">{{ channel.performance?.uploads || 0 }}</span>
                </div>
                <div class="metric-item small">
                  <span class="metric-label">播放量</span>
                  <span class="metric-value">{{ formatNumber(channel.performance?.streams || 0) }}</span>
                </div>
                <div class="metric-item small">
                  <span class="metric-label">收入</span>
                  <span class="metric-value">¥{{ formatCurrency(channel.performance?.revenue || 0) }}</span>
                </div>
              </div>
            </div>
            <div class="channel-actions">
              <button class="btn-icon" @click="viewChannelDetails(channel.id)">
                <i class="icon-eye"></i>
              </button>
              <button class="btn-icon" @click="editChannel(channel.id)">
                <i class="icon-edit"></i>
              </button>
              <button class="btn-icon" @click="connectChannel(channel.id)">
                <i class="icon-plug"></i>
              </button>
              <button class="btn-icon danger" @click="disconnectChannel(channel.id)">
                <i class="icon-unplug"></i>
              </button>
            </div>
          </div>
          <div v-if="distributionChannels.length === 0" class="empty-state">
            <i class="icon-empty"></i>
            <p>暂无分发渠道</p>
            <button class="btn primary" @click="showAddChannelModal = true">添加渠道</button>
          </div>
        </div>
      </div>

      <!-- 合作管理标签页 -->
      <div v-if="activeTab === 'collaboration'" class="tab-content">
        <div class="collaboration-header">
          <h2>合作管理</h2>
          <button class="btn primary" @click="showCreateCollaborationModal = true">
            <i class="icon-handshake"></i> 发起合作
          </button>
        </div>

        <!-- 进行中的合作 -->
        <div class="active-collaborations-card card">
          <div class="card-header">
            <h3>进行中的合作</h3>
          </div>
          <div class="collaborations-list">
            <div v-for="collab in activeCollaborations" :key="collab.id" class="collaboration-item">
              <img :src="collab.partner?.avatar || 'https://via.placeholder.com/80'" alt="合作方头像" class="partner-avatar">
              <div class="collaboration-info">
                <h4>{{ collab.project }}</h4>
                <p class="collaboration-description">{{ collab.description || '暂无描述' }}</p>
                <div class="collaboration-meta">
                  <span class="meta-item">{{ getCollaborationTypeLabel(collab.type) }}</span>
                  <span class="meta-item">角色: {{ collab.role }}</span>
                  <span class="meta-item" :class="['status-' + collab.status]">
                    {{ getCollaborationStatusLabel(collab.status) }}
                  </span>
                </div>
              </div>
              <div class="collaboration-terms">
                <div class="term-item">
                  <span class="term-label">分成比例</span>
                  <span class="term-value">{{ collab.terms?.revenueShare }}%</span>
                </div>
                <div class="term-item">
                  <span class="term-label">合作期限</span>
                  <span class="term-value">{{ formatDate(collab.startDate) }} - {{ collab.endDate ? formatDate(collab.endDate) : '至今' }}</span>
                </div>
              </div>
              <div class="collaboration-actions">
                <button class="btn-icon" @click="viewCollaborationDetails(collab.id)">
                  <i class="icon-eye"></i>
                </button>
                <button class="btn-icon" @click="editCollaboration(collab.id)">
                  <i class="icon-edit"></i>
                </button>
                <button v-if="collab.status === 'active'" class="btn-icon danger" @click="endCollaboration(collab.id)">
                  <i class="icon-end"></i>
                </button>
              </div>
            </div>
            <div v-if="activeCollaborations.length === 0" class="empty-state">
              <p>暂无进行中的合作</p>
              <button class="btn primary" @click="showCreateCollaborationModal = true">发起合作</button>
            </div>
          </div>
        </div>

        <!-- 历史合作 -->
        <div class="history-collaborations-card card">
          <div class="card-header">
            <h3>历史合作</h3>
            <button class="btn-link" @click="viewAllHistoryCollaborations">查看全部</button>
          </div>
          <div class="collaborations-list">
            <div v-for="collab in historyCollaborations.slice(0, 5)" :key="collab.id" class="collaboration-item">
              <img :src="collab.partner?.avatar || 'https://via.placeholder.com/80'" alt="合作方头像" class="partner-avatar">
              <div class="collaboration-info">
                <h4>{{ collab.project }}</h4>
                <p class="collaboration-description">{{ collab.description || '暂无描述' }}</p>
                <div class="collaboration-meta">
                  <span class="meta-item">{{ getCollaborationTypeLabel(collab.type) }}</span>
                  <span class="meta-item">角色: {{ collab.role }}</span>
                  <span class="meta-item status-completed">已完成</span>
                </div>
              </div>
              <div class="collaboration-actions">
                <button class="btn-icon" @click="viewCollaborationDetails(collab.id)">
                  <i class="icon-eye"></i>
                </button>
              </div>
            </div>
            <div v-if="historyCollaborations.length === 0" class="empty-state">
              <p>暂无历史合作</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框 -->
    <!-- 编辑IP档案模态框 -->
    <div v-if="showEditIPProfileModal" class="modal-overlay" @click.self="showEditIPProfileModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>编辑IP档案</h2>
          <button class="close-button" @click="showEditIPProfileModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>IP名称</label>
            <input type="text" v-model="editIPProfileForm.name" class="form-input">
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editIPProfileForm.description" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="editIPProfileForm.category" class="form-select">
              <option value="music">音乐</option>
              <option value="artist">艺术家</option>
              <option value="band">乐队</option>
              <option value="producer">制作人</option>
              <option value="songwriter">词曲作者</option>
              <option value="dj">DJ</option>
              <option value="label">厂牌</option>
              <option value="podcast">播客</option>
              <option value="radio">电台</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="editIPProfileForm.status" class="form-select">
              <option value="draft">草稿</option>
              <option value="active">活跃</option>
              <option value="paused">暂停</option>
              <option value="archived">归档</option>
              <option value="suspended">暂停</option>
            </select>
          </div>
          <div class="form-group">
            <label>标签</label>
            <input type="text" v-model="editIPProfileForm.tagsInput" placeholder="用逗号分隔" class="form-input">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showEditIPProfileModal = false">取消</button>
          <button class="btn primary" @click="saveIPProfile">保存</button>
        </div>
      </div>
    </div>

    <!-- 帮助模态框 -->
    <div v-if="showHelpModal" class="modal-overlay" @click.self="showHelpModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>IP矩阵系统帮助</h2>
          <button class="close-button" @click="showHelpModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="help-content">
            <p>IP矩阵系统是帮助音乐创作者管理和发展个人/团队IP的综合平台。</p>
            <h4>主要功能:</h4>
            <ul>
              <li><strong>概览:</strong> 查看IP的基本信息、表现数据和潜力评估</li>
              <li><strong>内容管理:</strong> 管理和发布音乐、视频等各类内容</li>
              <li><strong>数据分析:</strong> 深入了解IP表现、受众特征和收入情况</li>
              <li><strong>IP孵化:</strong> 获取IP定位、包装和推广策略，申请专业孵化服务</li>
              <li><strong>分发渠道:</strong> 管理内容分发到各大音乐平台</li>
              <li><strong>合作管理:</strong> 发起、管理和跟踪商业合作</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn primary" @click="showHelpModal = false">了解了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { 
  IPProfile, 
  IPMetrics, 
  IPContent, 
  IPCategory, 
  IPStatus, 
  IPAnalytics, 
  IPIncubatorApplication, 
  IPAssessment, 
  Collaboration, 
  DistributionChannel, 
  IPPositioning, 
  IPPackaging, 
  PromotionPlan
} from '../../types/ipMatrix';
import { IPIncubatorService } from '../../services/IPIncubatorService';
import { IPAnalyticsService } from '../../services/IPAnalyticsService';

// 服务实例
const incubatorService = new IPIncubatorService();
const analyticsService = new IPAnalyticsService();

// 状态管理
const activeTab = ref<'overview' | 'content' | 'analytics' | 'incubator' | 'distribution' | 'collaboration'>('overview');
const activeAnalyticsTab = ref<'overview' | 'audience' | 'revenue' | 'trends'>('overview');

// IP相关数据
const ipProfile = ref<IPProfile | null>(null);
const ipAssessment = ref<IPAssessment | null>(null);
const analyticsData = ref<IPAnalytics | null>(null);
const ipPositioning = ref<IPPositioning | null>(null);
const ipPackaging = ref<IPPackaging | null>(null);
const promotionPlan = ref<PromotionPlan | null>(null);

// 内容相关数据
const contentList = ref<IPContent[]>([]);
const contentFilter = ref({
  type: 'all',
  platform: 'all',
  search: ''
});

// 分发渠道相关数据
const distributionChannels = ref<DistributionChannel[]>([]);

// 合作相关数据
const activeCollaborations = ref<Collaboration[]>([]);
const historyCollaborations = ref<Collaboration[]>([]);

// 孵化器相关数据
const incubatorApplication = ref<IPIncubatorApplication | null>(null);
const incubatorServices = ref<any[]>([]);

// 成就相关数据
const recentAchievements = ref<any[]>([]);

// AI洞察
const aiInsights = ref<any[]>([]);

// 模态框状态
const showEditIPProfileModal = ref(false);
const showCreateContentModal = ref(false);
const showAddChannelModal = ref(false);
const showCreateCollaborationModal = ref(false);
const showApplyIncubatorModal = ref(false);
const showHelpModal = ref(false);

// 编辑表单数据
const editIPProfileForm = ref({
  name: '',
  description: '',
  category: '',
  status: '',
  tagsInput: ''
});

// 标签定义
const tabs = [
  { id: 'overview', label: '概览', icon: 'icon-dashboard' },
  { id: 'content', label: '内容管理', icon: 'icon-music' },
  { id: 'analytics', label: '数据分析', icon: 'icon-bar-chart' },
  { id: 'incubator', label: 'IP孵化', icon: 'icon-rocket' },
  { id: 'distribution', label: '分发渠道', icon: 'icon-distribute' },
  { id: 'collaboration', label: '合作管理', icon: 'icon-handshake' }
];

const analyticsTabs = [
  { id: 'overview', label: '分析概览' },
  { id: 'audience', label: '受众分析' },
  { id: 'revenue', label: '收入分析' },
  { id: 'trends', label: '趋势分析' }
];

// 计算属性 - 过滤后的内容列表
const filteredContent = computed(() => {
  return contentList.value.filter(content => {
    const typeMatch = contentFilter.value.type === 'all' || content.type === contentFilter.value.type;
    const platformMatch = contentFilter.value.platform === 'all' || content.platforms.some(p => p.name === contentFilter.value.platform);
    const searchMatch = contentFilter.value.search === '' || 
      content.title.toLowerCase().includes(contentFilter.value.search.toLowerCase()) ||
      content.description?.toLowerCase().includes(contentFilter.value.search.toLowerCase());
    return typeMatch && platformMatch && searchMatch;
  });
});

// 生命周期钩子
onMounted(() => {
  loadAllData();
});

// 加载所有数据
const loadAllData = async () => {
  try {
    await Promise.all([
      loadIPProfile(),
      loadIPAssessment(),
      loadAnalyticsData(),
      loadContentList(),
      loadDistributionChannels(),
      loadCollaborations(),
      loadIncubatorData(),
      loadRecentAchievements(),
      loadAIInsights()
    ]);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
};

// 刷新数据
const refreshData = async () => {
  try {
    await loadAllData();
    // 这里可以添加一个成功提示
  } catch (error) {
    console.error('Failed to refresh data:', error);
    // 这里可以添加一个错误提示
  }
};

// 加载IP档案
const loadIPProfile = async () => {
  try {
    const profile = await incubatorService.getIPProfile();
    ipProfile.value = profile;
  } catch (error) {
    console.error('Failed to load IP profile:', error);
    // 提供模拟数据
    ipProfile.value = getMockIPProfile();
  }
};

// 加载IP评估
const loadIPAssessment = async () => {
  try {
    const assessment = await incubatorService.getIPAssessment();
    ipAssessment.value = assessment;
  } catch (error) {
    console.error('Failed to load IP assessment:', error);
    // 提供模拟数据
    ipAssessment.value = getMockIPAssessment();
  }
};

// 加载分析数据
const loadAnalyticsData = async () => {
  try {
    const analytics = await analyticsService.getIPAnalytics();
    analyticsData.value = analytics;
  } catch (error) {
    console.error('Failed to load analytics data:', error);
    // 提供模拟数据
    analyticsData.value = getMockIPAnalytics();
  }
};

// 加载内容列表
const loadContentList = async () => {
  try {
    const contents = await incubatorService.getIPContent();
    contentList.value = contents;
  } catch (error) {
    console.error('Failed to load content list:', error);
    // 提供模拟数据
    contentList.value = getMockContentList();
  }
};

// 加载分发渠道
const loadDistributionChannels = async () => {
  try {
    const channels = await incubatorService.getDistributionChannels();
    distributionChannels.value = channels;
  } catch (error) {
    console.error('Failed to load distribution channels:', error);
    // 提供模拟数据
    distributionChannels.value = getMockDistributionChannels();
  }
};

// 加载合作数据
const loadCollaborations = async () => {
  try {
    const collaborations = await incubatorService.getCollaborations();
    activeCollaborations.value = collaborations.filter(c => c.status === 'active' || c.status === 'pending');
    historyCollaborations.value = collaborations.filter(c => c.status === 'completed');
  } catch (error) {
    console.error('Failed to load collaborations:', error);
    // 提供模拟数据
    const mockCollaborations = getMockCollaborations();
    activeCollaborations.value = mockCollaborations.filter(c => c.status === 'active' || c.status === 'pending');
    historyCollaborations.value = mockCollaborations.filter(c => c.status === 'completed');
  }
};

// 加载孵化器数据
const loadIncubatorData = async () => {
  try {
    const application = await incubatorService.getIncubatorApplication();
    incubatorApplication.value = application;
    
    const services = await incubatorService.getIncubatorServices();
    incubatorServices.value = services;
  } catch (error) {
    console.error('Failed to load incubator data:', error);
    // 提供模拟数据
    incubatorApplication.value = getMockIncubatorApplication();
    incubatorServices.value = getMockIncubatorServices();
  }
};

// 加载最近成就
const loadRecentAchievements = async () => {
  try {
    const achievements = await incubatorService.getRecentAchievements();
    recentAchievements.value = achievements;
  } catch (error) {
    console.error('Failed to load achievements:', error);
    // 提供模拟数据
    recentAchievements.value = getMockAchievements();
  }
};

// 加载AI洞察
const loadAIInsights = async () => {
  try {
    const insights = await analyticsService.getAIInsights();
    aiInsights.value = insights;
  } catch (error) {
    console.error('Failed to load AI insights:', error);
    // 提供模拟数据
    aiInsights.value = getMockAIInsights();
  }
};

// 编辑IP档案
const editIPProfile = () => {
  if (ipProfile.value) {
    editIPProfileForm.value = {
      name: ipProfile.value.name,
      description: ipProfile.value.description || '',
      category: ipProfile.value.category,
      status: ipProfile.value.status,
      tagsInput: ipProfile.value.tags.join(', ')
    };
    showEditIPProfileModal.value = true;
  }
};

// 保存IP档案
const saveIPProfile = async () => {
  try {
    if (ipProfile.value) {
      const updatedProfile = {
        ...ipProfile.value,
        name: editIPProfileForm.value.name,
        description: editIPProfileForm.value.description,
        category: editIPProfileForm.value.category as IPCategory,
        status: editIPProfileForm.value.status as IPStatus,
        tags: editIPProfileForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString()
      };
      
      await incubatorService.updateIPProfile(updatedProfile);
      ipProfile.value = updatedProfile;
      showEditIPProfileModal.value = false;
      // 这里可以添加一个成功提示
    }
  } catch (error) {
    console.error('Failed to save IP profile:', error);
    // 这里可以添加一个错误提示
  }
};

// 运行IP评估
const runIPAssessment = async () => {
  try {
    const newAssessment = await incubatorService.evaluateIPPotential();
    ipAssessment.value = newAssessment;
    // 这里可以添加一个成功提示
  } catch (error) {
    console.error('Failed to run IP assessment:', error);
    // 这里可以添加一个错误提示
  }
};

// 生成定位策略
const generatePositioningStrategy = async () => {
  try {
    const positioning = await incubatorService.generateIPPositioning();
    ipPositioning.value = positioning;
    // 这里可以添加一个成功提示
  } catch (error) {
    console.error('Failed to generate positioning strategy:', error);
    // 这里可以添加一个错误提示
  }
};

// 生成包装方案
const generatePackagingPlan = async () => {
  try {
    const packaging = await incubatorService.generateIPPackaging();
    ipPackaging.value = packaging;
    // 这里可以添加一个成功提示
  } catch (error) {
    console.error('Failed to generate packaging plan:', error);
    // 这里可以添加一个错误提示
  }
};

// 生成推广计划
const generatePromotionPlan = async () => {
  try {
    const promotion = await incubatorService.generatePromotionPlan();
    promotionPlan.value = promotion;
    // 这里可以添加一个成功提示
  } catch (error) {
    console.error('Failed to generate promotion plan:', error);
    // 这里可以添加一个错误提示
  }
};

// 生成新的AI洞察
const generateNewInsights = async () => {
  try {
    const insights = await analyticsService.generateAIInsights();
    aiInsights.value = insights;
    // 这里可以添加一个成功提示
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
    // 这里可以添加一个错误提示
  }
};

// 查看全部成就
const viewAllAchievements = () => {
  // 这里可以实现查看全部成就的逻辑
  console.log('View all achievements');
};

// 查看内容详情
const viewContentDetails = (contentId: string) => {
  // 这里可以实现查看内容详情的逻辑
  console.log('View content details:', contentId);
};

// 编辑内容
const editContent = (contentId: string) => {
  // 这里可以实现编辑内容的逻辑
  console.log('Edit content:', contentId);
};

// 删除内容
const deleteContent = (contentId: string) => {
  // 这里可以实现删除内容的逻辑
  console.log('Delete content:', contentId);
};

// 查看渠道详情
const viewChannelDetails = (channelId: string) => {
  // 这里可以实现查看渠道详情的逻辑
  console.log('View channel details:', channelId);
};

// 编辑渠道
const editChannel = (channelId: string) => {
  // 这里可以实现编辑渠道的逻辑
  console.log('Edit channel:', channelId);
};

// 连接渠道
const connectChannel = (channelId: string) => {
  // 这里可以实现连接渠道的逻辑
  console.log('Connect channel:', channelId);
};

// 断开渠道
const disconnectChannel = (channelId: string) => {
  // 这里可以实现断开渠道的逻辑
  console.log('Disconnect channel:', channelId);
};

// 查看合作详情
const viewCollaborationDetails = (collabId: string) => {
  // 这里可以实现查看合作详情的逻辑
  console.log('View collaboration details:', collabId);
};

// 编辑合作
const editCollaboration = (collabId: string) => {
  // 这里可以实现编辑合作的逻辑
  console.log('Edit collaboration:', collabId);
};

// 结束合作
const endCollaboration = (collabId: string) => {
  // 这里可以实现结束合作的逻辑
  console.log('End collaboration:', collabId);
};

// 查看全部历史合作
const viewAllHistoryCollaborations = () => {
  // 这里可以实现查看全部历史合作的逻辑
  console.log('View all history collaborations');
};

// 使用孵化服务
const useService = (serviceId: string) => {
  // 这里可以实现使用孵化服务的逻辑
  console.log('Use service:', serviceId);
};

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// 格式化货币
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 获取分类标签
const getCategoryLabel = (category?: string): string => {
  const categoryMap: Record<string, string> = {
    'music': '音乐',
    'artist': '艺术家',
    'band': '乐队',
    'producer': '制作人',
    'songwriter': '词曲作者',
    'dj': 'DJ',
    'label': '厂牌',
    'podcast': '播客',
    'radio': '电台',
    'other': '其他'
  };
  return categoryMap[category || 'other'] || '其他';
};

// 获取状态标签
const getStatusLabel = (status?: string): string => {
  const statusMap: Record<string, string> = {
    'draft': '草稿',
    'active': '活跃',
    'paused': '暂停',
    'archived': '归档',
    'suspended': '停用'
  };
  return statusMap[status || 'draft'] || '草稿';
};

// 获取潜力标签
const getPotentialLabel = (potential?: string): string => {
  const potentialMap: Record<string, string> = {
    'high': '高潜力',
    'medium': '中等潜力',
    'low': '低潜力'
  };
  return potentialMap[potential || 'low'] || '低潜力';
};

// 获取内容类型标签
const getContentTypeLabel = (type?: string): string => {
  const typeMap: Record<string, string> = {
    'track': '单曲',
    'album': '专辑',
    'ep': 'EP',
    'single': '单曲',
    'video': '视频',
    'live': '现场',
    'merchandise': '周边',
    'nft': 'NFT'
  };
  return typeMap[type || 'track'] || '单曲';
};

// 获取平台名称
const getPlatformName = (platform: string): string => {
  const platformMap: Record<string, string> = {
    'netease': '网易云音乐',
    'tencent': 'QQ音乐',
    'kuwo': '酷我音乐',
    'kugou': '酷狗音乐',
    'spotify': 'Spotify',
    'youtube': 'YouTube'
  };
  return platformMap[platform] || platform;
};

// 获取平台百分比
const getPlatformPercentage = (platform: string): number => {
  // 这里可以根据实际数据返回百分比
  return Math.floor(Math.random() * 100);
};

// 获取性别标签
const getGenderLabel = (gender: string): string => {
  const genderMap: Record<string, string> = {
    'male': '男性',
    'female': '女性',
    'other': '其他'
  };
  return genderMap[gender] || gender;
};

// 获取收听习惯标签
const getListeningHabitLabel = (habit: string): string => {
  const habitMap: Record<string, string> = {
    'daily': '每日收听',
    'weekly': '每周收听',
    'monthly': '每月收听',
    'rarely': '很少收听'
  };
  return habitMap[habit] || habit;
};

// 获取收入来源标签
const getRevenueSourceLabel = (source: string): string => {
  const sourceMap: Record<string, string> = {
    'streams': '流媒体',
    'downloads': '下载',
    'sync': '同步授权',
    'merch': '周边',
    'live': '现场演出',
    'other': '其他'
  };
  return sourceMap[source] || source;
};

// 获取趋势高度
const getTrendHeight = (amount: number): number => {
  // 这里可以根据实际数据返回高度百分比
  return Math.min(100, Math.max(10, amount / 10000));
};

// 获取受众指标标签
const getAudienceMetricLabel = (metric: string): string => {
  const metricMap: Record<string, string> = {
    'followers': '粉丝数',
    'engagement': '参与度',
    'retention': '留存率'
  };
  return metricMap[metric] || metric;
};

// 获取竞争级别
const getCompetitionLevel = (level: number): string => {
  if (level < 30) return '低';
  if (level < 70) return '中等';
  return '高';
};

// 获取申请状态标签
const getApplicationStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'reviewing': '审核中',
    'approved': '已批准',
    'rejected':