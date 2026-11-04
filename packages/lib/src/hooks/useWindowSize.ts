// ============================================================
// YYC³ · @yyc3/lib useWindowSize（源：UI-8 yyc3-reusable-components/packages/hooks）
// 窗口尺寸 Hook：实时监听、SSR 安全
// ============================================================
import { useState, useEffect } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    /* istanbul ignore next -- SSR 守卫：jsdom 环境结构性不可达 */
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function useWindowWidth(): number {
  return useWindowSize().width;
}

export function useWindowHeight(): number {
  return useWindowSize().height;
}
