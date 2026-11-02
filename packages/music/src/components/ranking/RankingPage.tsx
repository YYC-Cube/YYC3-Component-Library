import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RankingItem } from '../../services/starPowerService.js';
import ThreeDRankingBoard from './ThreeDRankingBoard';
import StarPowerCard from './StarPowerCard';
import { fetchGlobalRanking, fetchCategoryRanking, fetchStarPowerTrends } from '../../store/slices/rankingSlice';
import { RootState } from '../../store';

const RankingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'category'>('global');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('week');
  
  const dispatch = useDispatch<any>();
  
  // 从Redux store获取数据
  const { globalRanking, trends, loading } = useSelector(
    (state: RootState) => state.ranking
  );
  
  // 确定当前显示的排行榜数据
  const currentRanking = globalRanking;
  
  // 模拟分类数据
  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'music', name: '音乐' },
    { id: 'video', name: '视频' },
    { id: 'article', name: '文章' }
  ];
  
  // 加载数据
  useEffect(() => {
    // 获取排行榜数据
    if (activeTab === 'global') {
      try {
        dispatch(fetchGlobalRanking({ limit: 50 }));
      } catch (error) {
        console.error('获取全球排行失败:', error);
      }
    } else {
      try {
        dispatch(fetchCategoryRanking({ category: selectedCategory, limit: 50 }));
      } catch (error) {
        console.error('获取分类排行失败:', error);
      }
    }
    
    // 获取趋势数据
    try {
      // 注意：根据错误信息，参数名应为period
      const periodMap: { [key: string]: 'week' | 'month' | 'year' } = {
        'day': 'week',
        'week': 'month',
        'month': 'year'
      };
      // 获取趋势数据
      dispatch(fetchStarPowerTrends({ 
        period: periodMap[dateRange] || 'week' 
      }));
    } catch (error) {
      console.error('获取趋势数据失败:', error);
    }
  }, [activeTab, selectedCategory, dateRange, dispatch]);
  
  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // 渲染2D排行榜
  const render2DRanking = () => {
    const rankingList = Array.isArray(currentRanking) ? currentRanking : [];
    const loadingText = '加载中...';
    const noDataText = '暂无数据';
    
    if (loading) {
      return <div className="loading-state">{loadingText}</div>;
    }
    
    if (rankingList.length === 0) {
      return <div className="no-data">{noDataText}</div>;
    }
    
    return (
      <div className="ranking-list">
        {rankingList.map((item: RankingItem) => (
          <StarPowerCard 
            key={item.id} 
            rankingItem={item}
          />
        ))}
      </div>
    );
  };
  
  // 渲染趋势图表（简化版）
  const renderTrendsChart = () => {
    const trendData = Array.isArray(trends) ? trends : [];
    const loadingText = '加载中...';
    const noDataText = '暂无数据';
    
    if (loading) {
      return <div className="loading-state">{loadingText}</div>;
    }
    
    if (trendData.length === 0) {
      return <div className="no-data">{noDataText}</div>;
    }
    
    return (
      <div className="trends-chart">
        <div className="chart-container">
          {trendData.slice(0, 10).map((_, index: number) => (
            <div 
              key={index} 
              className="chart-bar"
              style={{
                height: `${Math.min(50 + Math.random() * 50, 100)}%`,
                backgroundColor: `rgba(255, 152, 0, ${0.5 + Math.random() * 0.5})`
              }}
              title={`数据点 ${index + 1}`}
            />
          ))}
        </div>
        <div className="chart-labels">
          {trendData.slice(0, 10).map((_, index: number) => (
            <div key={index} className="chart-label">
              {`点${index + 1}`}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // 添加内联样式
  const styles = {
    rankingPage: {
      minHeight: '100vh',
      backgroundColor: '#0a0a1a',
      color: '#ffffff',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    h1: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
      background: 'linear-gradient(45deg, #ff9800, #ff5722)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '16px',
      color: '#ccc',
      marginBottom: '20px'
    },
    controls: {
      display: 'flex' as const,
      flexWrap: 'wrap' as const,
      gap: '15px',
      marginBottom: '30px',
      justifyContent: 'center' as const
    },
    button: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: '2px solid #ff9800',
      backgroundColor: 'transparent',
      color: '#ff9800',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      fontWeight: '500'
    },
    activeButton: {
      backgroundColor: '#ff9800',
      color: '#0a0a1a'
    },
    categorySelector: {
      display: 'flex' as const,
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap' as const,
      justifyContent: 'center' as const
    },
    categoryButton: {
      padding: '6px 14px',
      borderRadius: '16px',
      border: '1px solid #555',
      backgroundColor: 'transparent',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '13px'
    },
    activeCategory: {
      borderColor: '#ff9800',
      color: '#ff9800'
    },
    dateRangeSelector: {
      display: 'flex' as const,
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'center' as const
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    rankingSection: {
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#ffffff'
    },
    trendsSection: {
      backgroundColor: '#1a1a2e',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '40px'
    },
    loadingState: {
      textAlign: 'center' as const,
      padding: '40px',
      color: '#ff9800',
      fontSize: '18px'
    },
    noData: {
      textAlign: 'center' as const,
      padding: '40px',
      color: '#666',
      fontSize: '18px'
    },
    rankingList: {
      display: 'grid' as const,
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    trendsChart: {
      height: '300px',
      display: 'flex' as const,
      flexDirection: 'column' as const
    },
    chartContainer: {
      flex: 1,
      display: 'flex' as const,
      alignItems: 'flex-end' as const,
      justifyContent: 'space-between' as const,
      gap: '10px',
      marginBottom: '10px',
      padding: '0 10px'
    },
    chartBar: {
      flex: 1,
      minWidth: '20px',
      transition: 'height 0.5s ease',
      borderRadius: '4px 4px 0 0'
    },
    chartLabels: {
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      gap: '10px',
      padding: '0 10px'
    },
    chartLabel: {
      flex: 1,
      textAlign: 'center' as const,
      fontSize: '12px',
      color: '#999'
    }
  };
  
  return (
    <div style={styles.rankingPage}>
      <div style={styles.header}>
        <h1 style={styles.h1}>星力排行榜</h1>
        <p style={styles.subtitle}>查看M98 Music中最受欢迎的内容</p>
      </div>
      
      <div style={styles.controls}>
        <button
          style={{ ...styles.button, ...(activeTab === 'global' && styles.activeButton) }}
          onClick={() => setActiveTab('global')}
        >
          全球排行
        </button>
        <button
          style={{ ...styles.button, ...(activeTab === 'category' && styles.activeButton) }}
          onClick={() => setActiveTab('category')}
        >
          分类排行
        </button>
        <button
          style={{ ...styles.button, ...(viewMode === '2d' && styles.activeButton) }}
          onClick={() => setViewMode('2d')}
        >
          2D视图
        </button>
        <button
          style={{ ...styles.button, ...(viewMode === '3d' && styles.activeButton) }}
          onClick={() => setViewMode('3d')}
        >
          3D视图
        </button>
      </div>
      
      {activeTab === 'category' && (
        <div style={styles.categorySelector}>
          {categories.map(category => (
            <button
              key={category.id}
              style={{ 
                ...styles.categoryButton, 
                ...(selectedCategory === category.id && styles.activeCategory) 
              }}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
      
      <div style={styles.dateRangeSelector}>
        <button
          style={{ 
            ...styles.categoryButton, 
            ...(dateRange === 'day' && styles.activeCategory) 
          }}
          onClick={() => setDateRange('day')}
        >
          日榜
        </button>
        <button
          style={{ 
            ...styles.categoryButton, 
            ...(dateRange === 'week' && styles.activeCategory) 
          }}
          onClick={() => setDateRange('week')}
        >
          周榜
        </button>
        <button
          style={{ 
            ...styles.categoryButton, 
            ...(dateRange === 'month' && styles.activeCategory) 
          }}
          onClick={() => setDateRange('month')}
        >
          月榜
        </button>
      </div>
      
      <div style={styles.mainContent}>
        <section style={styles.rankingSection}>
          {viewMode === '3d' ? (
            <ThreeDRankingBoard 
              data={currentRanking} 
            />
          ) : (
            render2DRanking()
          )}
        </section>
        
        <section style={styles.trendsSection}>
          <h2 style={styles.sectionTitle}>星力趋势</h2>
          {renderTrendsChart()}
        </section>
      </div>
    </div>
  );
};

export default RankingPage;