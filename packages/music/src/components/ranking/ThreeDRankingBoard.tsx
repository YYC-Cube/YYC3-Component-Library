import React, { useState, useEffect } from 'react';
import { RankingItem } from '../../services/starPowerService.js';

interface ThreeDRankingBoardProps {
  data: RankingItem[];
  onItemSelect?: (item: RankingItem) => void;
}

const ThreeDRankingBoard: React.FC<ThreeDRankingBoardProps> = ({ data, onItemSelect }) => {
  const [selectedStar, setSelectedStar] = useState<RankingItem | null>(null);
  const [rankingData, setRankingData] = useState<RankingItem[]>(data || []);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  // 使用静态文本替代i18n

  // 更新数据当props变化时
  useEffect(() => {
    setRankingData(data || []);
  }, [data]);

  // 自动旋转动画
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 处理星星点击
  const handleStarClick = (item: RankingItem) => {
    setSelectedStar(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  // 加载中显示文本

  // 无数据显示文本
  const noDataText = '暂无数据';
  // 选中标题文本
  const selectedTitleText = '选中内容';
  // 排名文本
  const rankText = '排名';
  // 标题文本
  const titleText = '标题';
  // 创建者文本
  const creatorText = '创建者';
  // 星力值文本
  const starPowerText = '星力值';
  // 未知内容文本
  const unknownContentText = '未知内容';
  // 匿名文本
  const anonymousText = '匿名';
  // 3D排行榜标题文本
  const title3D = '3D星力排行榜';

  // 添加内联样式
  const styles = {
    threeDRankingBoard: {
      width: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: '#1a1a2e',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '20px',
      textAlign: 'center' as const
    },
    boardContainer: {
      position: 'relative' as const,
      perspective: '1500px'
    },
    threeDContainer: {
      position: 'relative' as const,
      overflow: 'hidden' as const,
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #0f0f1f 0%, #1a1a2e 100%)',
      transition: 'transform 0.3s ease',
      width: '100%',
      height: '600px',
      transform: `scale(${scale})`
    },
    loadingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: 'rgba(10, 10, 26, 0.8)',
      zIndex: 10
    },
    loadingSpinner: {
      color: '#ff9800',
      fontSize: '18px',
      animation: 'pulse 1.5s infinite'
    },
    emptyMessage: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#666',
      fontSize: '18px'
    },
    rankingSpiral: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 0.5s ease',
      transform: `rotateY(${rotation}deg)`
    },
    selectedInfo: {
      position: 'absolute' as const,
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white',
      maxWidth: '300px',
      backdropFilter: 'blur(10px)',
      zIndex: 15
    },
    selectedInfoH3: {
      margin: '0 0 15px 0',
      fontSize: '18px',
      color: '#ff9800'
    },
    infoItem: {
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      marginBottom: '8px',
      fontSize: '14px'
    },
    label: {
      color: '#ccc'
    },
    value: {
      fontWeight: 500,
      color: 'white'
    },
    starPower: {
      color: '#ff9800',
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '4px'
    }
  };

  return (
    <div style={styles.threeDRankingBoard}>
      <div style={styles.card}>
        <div style={styles.cardTitle}>{title3D}</div>
        <div style={styles.boardContainer}>
          <div style={styles.threeDContainer}>
            {/* 加载状态由父组件控制，这里不显示加载中 */}
            
            <div style={styles.rankingSpiral}>
              {rankingData.length === 0 && (
                <div style={styles.emptyMessage}>{noDataText}</div>
              )}
              {rankingData.map((item: RankingItem, index: number) => {
                // 避免越界访问，确保在合理范围内
                if (index >= 20) return null;
                
                const angle = (index / 20) * Math.PI * 2;
                const radius = 150;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                // 根据排名设置大小
                const size = Math.max(20 - index * 0.3, 8);
                
                // 根据排名设置颜色
                let color = '#ffffff';
                if (index === 0) color = '#ffd700'; // 金色
                else if (index === 1) color = '#c0c0c0'; // 银色
                else if (index === 2) color = '#cd7f32'; // 铜色
                
                const starStyle = {
                  position: 'absolute' as const,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex' as const,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  transformStyle: 'preserve-3d' as const,
                  animation: 'float 3s ease-in-out infinite',
                  boxShadow: '0 0 15px rgba(255, 152, 0, 0.6)',
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${rotation}deg)`
                };
                
                return (
                  <div
                    key={item.id}
                    style={starStyle}
                    onClick={() => handleStarClick(item)}
                    onMouseEnter={() => setScale(1.1)}
                    onMouseLeave={() => setScale(1)}
                  >
                    <span style={{ 
                      color: '#000', 
                      fontWeight: 'bold', 
                      fontSize: '12px',
                      textShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
                    }}>
                      {item.rank}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {selectedStar && (
            <div style={styles.selectedInfo}>
              <h3 style={styles.selectedInfoH3}>{selectedTitleText}</h3>
              <div style={styles.infoItem}>
                <span style={styles.label}>{rankText}:</span>
                <span style={styles.value}>{selectedStar.rank}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>{titleText}:</span>
                <span style={styles.value}>{unknownContentText}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>{creatorText}:</span>
                <span style={styles.value}>{selectedStar.username || anonymousText}</span>
              </div>
              <div style={{ ...styles.infoItem, ...styles.starPower }}>
                <span style={styles.label}>{starPowerText}:</span>
                <span style={styles.value}>★ {selectedStar.starPower.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeDRankingBoard;