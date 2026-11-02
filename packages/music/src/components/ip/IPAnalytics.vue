<template>
  <div class="ip-analytics">
    <!-- 分析概览 -->
    <div class="analytics-overview">
      <div class="overview-header">
        <h2>IP分析概览</h2>
        <div class="date-range-selector">
          <DateRangePicker v-model="dateRange" @change="updateAnalytics" />
        </div>
      </div>
      
      <div class="overview-metrics">
        <MetricCard
          v-for="metric in overviewMetrics"
          :key="metric.key"
          :title="metric.title"
          :value="metric.value"
          :change="metric.change"
          :icon="metric.icon"
          :color="metric.color"
        />
      </div>
    </div>

    <!-- 内容分析 -->
    <div class="content-analytics">
      <h3>内容表现</h3>
      <div class="analytics-tabs">
        <div 
          v-for="tab in contentTabs" 
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
      
      <div class="tab-content">
        <!-- 表现排行 -->
        <div v-if="activeTab === 'performance'" class="performance-section">
          <ContentPerformanceTable :data="contentPerformance" />
        </div>
        
        <!-- 平台对比 -->
        <div v-if="activeTab === 'platforms'" class="platforms-section">
          <PlatformComparisonChart :data="platformComparison" />
        </div>
        
        <!-- 趋势分析 -->
        <div v-if="activeTab === 'trends'" class="trends-section">
          <ContentTrendsChart :data="contentTrends" />
        </div>
      </div>
    </div>

    <!-- 受众分析 -->
    <div class="audience-analytics">
      <h3>受众洞察</h3>
      <div class="audience-grid">
        <div class="audience-card">
          <h4>年龄分布</h4>
          <AgeDistributionChart :data="audienceData.age" />
        </div>
        
        <div class="audience-card">
          <h4>性别分布</h4>
          <GenderDistributionChart :data="audienceData.gender" />
        </div>
        
        <div class="audience-card">
          <h4>地域分布</h4>
          <LocationDistributionChart :data="audienceData.location" />
        </div>
        
        <div class="audience-card">
          <h4>活跃时间</h4>
          <ActivityHeatmap :data="audienceData.activity" />
        </div>
      </div>
    </div>

    <!-- 收入分析 -->
    <div class="revenue-analytics">
      <h3>收入分析</h3>
      <div class="revenue-overview">
        <div class="revenue-total">
          <h4>总收入</h4>
          <div class="total-amount">{{ formatCurrency(revenueData.total) }}</div>
          <div class="growth-indicator" :class="revenueData.growth > 0 ? 'positive' : 'negative'">
            {{ revenueData.growth > 0 ? '+' : '' }}{{ revenueData.growth }}%
          </div>
        </div>
        
        <div class="revenue-breakdown">
          <h4>收入构成</h4>
          <RevenueBreakdownChart :data="revenueData.breakdown" />
        </div>
      </div>
      
      <div class="revenue-projections">
        <h4>收入预测</h4>
        <RevenueProjectionChart :data="revenueData.projections" />
      </div>
    </div>

    <!-- AI洞察 -->
    <div class="ai-insights">
      <h3>AI洞察与建议</h3>
      <div class="insights-grid">
        <InsightCard
          v-for="insight in aiInsights"
          :key="insight.id"
          :insight="insight"
          @apply="applyInsight"
        />
      </div>
    </div>

    <!-- 导出报告 -->
    <div class="export-section">
      <CosmicButton variant="primary" @click="exportReport" :loading="isExporting">
        <i class="fas fa-download"></i>
        导出分析报告
      </CosmicButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { IPAnalytics, ContentPerformance, RevenueBreakdown } from '@/types/ipMatrix';
import { ipAnalyticsService } from '@/services/IPAnalyticsService';
import { ipIncubatorService } from '@/services/IPIncubatorService';
import MetricCard from '@/components/analytics/MetricCard.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';
import ContentPerformanceTable from '@/components/analytics/ContentPerformanceTable.vue';
import PlatformComparisonChart from '@/components/analytics/PlatformComparisonChart.vue';
import ContentTrendsChart from '@/components/analytics/ContentTrendsChart.vue';
import AgeDistributionChart from '@/components/analytics/AgeDistributionChart.vue';
import GenderDistributionChart from '@/components/analytics/GenderDistributionChart.vue';
import LocationDistributionChart from '@/components/analytics/LocationDistributionChart.vue';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap.vue';
import RevenueBreakdownChart from '@/components/analytics/RevenueBreakdownChart.vue';
import RevenueProjectionChart from '@/components/analytics/RevenueProjectionChart.vue';
import InsightCard from '@/components/analytics/InsightCard.vue';
import CosmicButton from '@/components/ui/CosmicButton.vue';

interface Props {
  ipId: string;
}

const props = defineProps<Props>();

const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
});

const activeTab = ref('performance');
const isExporting = ref(false);

const analyticsData = ref<IPAnalytics | null>(null);
const aiInsights = ref<any[]>([]);

const overviewMetrics = computed(() => {
  if (!analyticsData.value) return [];
  
  const overview = analyticsData.value.overview;
  return [
    {
      key: 'streams',
      title: '总播放量',
      value: formatNumber(overview.totalStreams),
      change: overview.growthRate,
      icon: 'fas fa-play',
      color: '#4CAF50'
    },
    {
      key: 'revenue',
      title: '总收入',
      value: formatCurrency(overview.totalRevenue),
      change: calculateRevenueGrowth(),
      icon: 'fas fa-dollar-sign',
      color: '#FF9800'
    },
    {
      key: 'followers',
      title: '粉丝数',
      value: formatNumber(overview.totalFollowers),
      change: overview.growthRate,
      icon: 'fas fa-users',
      color: '#2196F3'
    },
    {
      key: 'engagement',
      title: '参与度',
      value: `${(overview.engagementRate * 100).toFixed(1)}%`,
      change: overview.growthRate,
      icon: 'fas fa-heart',
      color: '#E91E63'
    }
  ];
});

const contentPerformance = computed(() => {
  return analyticsData.value?.content.performance || [];
});

const platformComparison = computed(() => {
  return analyticsData.value?.content.comparison || [];
});

const contentTrends = computed(() => {
  return analyticsData.value?.trends.content || [];
});

const audienceData = computed(() => {
  return analyticsData.value?.audience || {
    age: {},
    gender: {},
    location: {},
    activity: {}
  };
});

const revenueData = computed(() => {
  if (!analyticsData.value) return {
    total: 0,
    growth: 0,
    breakdown: [],
    projections: []
  };
  
  return {
    total: analyticsData.value.revenue.total,
    growth: calculateRevenueGrowth(),
    breakdown: analyticsData.value.revenue.breakdown,
    projections: analyticsData.value.revenue.projections
  };
});

const contentTabs = [
  { key: 'performance', label: '表现排行' },
  { key: 'platforms', label: '平台对比' },
  { key: 'trends', label: '趋势分析' }
];

onMounted(async () => {
  await loadAnalytics();
  await generateAIInsights();
});

const loadAnalytics = async () => {
  try {
    analyticsData.value = await ipAnalyticsService.getIPAnalytics(
      props.ipId,
      dateRange.value
    );
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
};

const generateAIInsights = async () => {
  try {
    const insights = await ipIncubatorService.generateAIInsights(props.ipId);
    aiInsights.value = insights;
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
  }
};

const updateAnalytics = async () => {
  await loadAnalytics();
  await generateAIInsights();
};

const exportReport = async () => {
  isExporting.value = true;
  try {
    const reportData = {
      ipId: props.ipId,
      dateRange: dateRange.value,
      analytics: analyticsData.value,
      insights: aiInsights.value,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-analytics-${props.ipId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export report:', error);
  } finally {
    isExporting.value = false;
  }
};

const applyInsight = async (insight: any) => {
  try {
    await ipAnalyticsService.applyInsight(props.ipId, insight.id);
    // 刷新数据
    await loadAnalytics();
  } catch (error) {
    console.error('Failed to apply insight:', error);
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const calculateRevenueGrowth = (): number => {
  if (!analyticsData.value) return 0;
  
  const current = analyticsData.value.revenue.total;
  const previous = analyticsData.value.revenue.breakdown
    .reduce((sum, item) => sum + (item.growth < 0 ? item.amount : 0), 0);
  
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
};
</script>

<style lang="scss" scoped>
.ip-analytics {
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;

  h2, h3, h4 {
    margin: 0 0 20px;
    color: white;
  }

  .analytics-overview {
    margin-bottom: 40px;

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .overview-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
  }

  .content-analytics {
    margin-bottom: 40px;

    .analytics-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .tab-item {
        padding: 10px 20px;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 2px solid transparent;

        &:hover {
          color: white;
        }

        &.active {
          color: white;
          border-bottom-color: #667eea;
        }
      }
    }
  }

  .audience-analytics {
    margin-bottom: 40px;

    .audience-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;

      .audience-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
      }
    }
  }

  .revenue-analytics {
    margin-bottom: 40px;

    .revenue-overview {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
      margin-bottom: 30px;

      .revenue-total {
        text-align: center;

        .total-amount {
          font-size: 2.5em;
          font-weight: bold;
          margin: 10px 0;
          background: var(--mheart-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .growth-indicator {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.9em;

          &.positive {
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
          }

          &.negative {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
          }
        }
      }
    }
  }

  .ai-insights {
    margin-bottom: 30px;

    .insights-grid {
      display: grid;
      gap: 20px;
    }
  }

  .export-section {
    text-align: center;
  }
}
</style>