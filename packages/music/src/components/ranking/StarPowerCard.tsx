import React, { useState } from 'react';
import { RankingItem } from '../../services/starPowerService.js';
// @ts-ignore 忽略找不到模块声明文件的错误
// @ts-ignore 忽略找不到模块声明文件的错误

interface StarPowerCardProps {
  rankingItem: RankingItem;
}

const StarPowerCard: React.FC<StarPowerCardProps> = ({ rankingItem }) => {
  const [hovered, setHovered] = useState(false);
  
  // 获取排名样式
  const getRankStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#000'
    };
    
    const rank = rankingItem.rank || 0;
    if (rank === 1) {
      return { ...baseStyle, backgroundColor: '#ffd700' }; // 金色
    } else if (rank === 2) {
      return { ...baseStyle, backgroundColor: '#c0c0c0' }; // 银色
    } else if (rank === 3) {
      return { ...baseStyle, backgroundColor: '#cd7f32' }; // 铜色
    }
    return { ...baseStyle, backgroundColor: '#666', color: '#fff', width: '30px', height: '30px', fontSize: '14px' };
  };
  
  // 获取趋势指示器
  const getTrendIndicator = () => {
    // 使用change属性来判断趋势
    if (rankingItem.change && typeof rankingItem.change === 'number') {
      if (rankingItem.change > 0) {
        return (
          <span style={{ color: '#4caf50', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ↑ 上升 {rankingItem.change}
          </span>
        );
      } else if (rankingItem.change < 0) {
        return (
          <span style={{ color: '#f44336', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ↓ 下降 {Math.abs(rankingItem.change)}
          </span>
        );
      }
    }
    return (
      <span style={{ color: '#9e9e9e', display: 'flex', alignItems: 'center', gap: '4px' }}>
        → 稳定
      </span>
    );
  };
  
  // 处理卡片点击事件
  const handleCardClick = () => {
    try {
      // 这里可以添加导航逻辑或其他操作
      console.log('Card clicked:', rankingItem.id || 'unknown');
    } catch (error) {
      console.error('Error handling card click:', error);
    }
  };
  
  // 添加内联样式
  const styles: {
    card: React.CSSProperties;
    cardHovered: React.CSSProperties;
    header: React.CSSProperties;
    rankContainer: React.CSSProperties;
    title: React.CSSProperties;
    creator: React.CSSProperties;
    avatar: React.CSSProperties;
    creatorName: React.CSSProperties;
    footer: React.CSSProperties;
    starPower: React.CSSProperties;
    trend: React.CSSProperties;
    category: React.CSSProperties;
  } = {
    card: {
      backgroundColor: '#1a1a2e',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      height: '100%',
      display: 'flex' as const,
      flexDirection: 'column' as const
    },
    cardHovered: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(255, 152, 0, 0.2)',
      borderColor: '#ff9800'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px'
    },
    rankContainer: {
      marginRight: '15px'
    },
    title: {
      flex: 1,
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ffffff',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    creator: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      color: '#cccccc'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '10px',
      fontSize: '14px',
      color: '#fff'
    },
    creatorName: {
      fontSize: '14px',
      color: '#cccccc'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto'
    },
    starPower: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#ff9800',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    trend: {
      fontSize: '14px'
    },
    category: {
      backgroundColor: '#2c3e50',
      color: '#ffffff',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      marginTop: '10px',
      display: 'inline-block'
    }
  };
  

  
  return (
    <div 
      style={{ ...styles.card, ...(hovered && styles.cardHovered) }}
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.header}>
        <div style={styles.rankContainer}>
          <div style={getRankStyle()}>{rankingItem.rank}</div>
        </div>
        <h3 style={styles.title} title="">
        {'未知内容'}
        </h3>
      </div>
      
      <div style={styles.creator}>
        <div style={styles.avatar}>
          {rankingItem.username?.charAt(0) || '?'}
        </div>
        <span style={styles.creatorName}>
          {rankingItem.username || '匿名'}
        </span>
      </div>
      
      <div style={styles.footer}>
        <div style={styles.starPower}>
          <span>★</span>
          <span>{(rankingItem.starPower || 0).toLocaleString()}</span>
        </div>
        <div style={styles.trend}>
          {getTrendIndicator()}
        </div>
      </div>
      
      {/* 分类信息暂时隐藏，因为RankingItem类型中没有category属性 */}
    </div>
  );
};

export default StarPowerCard;