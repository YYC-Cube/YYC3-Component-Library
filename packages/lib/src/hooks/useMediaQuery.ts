// ============================================================
// YYC³ · @yyc3/lib useMediaQuery（源：UI-8 yyc3-reusable-components/packages/hooks）
// 媒体查询 Hook：SSR 安全，附常用断点预设
// ============================================================
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    /* istanbul ignore next -- SSR 守卫：jsdom 环境结构性不可达 */
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
}

// 常用断点预设
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const useIsReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
