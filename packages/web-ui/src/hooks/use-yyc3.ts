// ============================================================
// YYC³ · @yyc3/web-ui useYYC3（Phase 5 · S3 迁入）
// 源：personal 副本 YYC3-UI-用户界面/web-ui/src/hooks/use-yyc3.ts
// ============================================================
import { useYYC3Context } from '../provider';

export function useYYC3() {
  const { hub, initialized, error } = useYYC3Context();

  return {
    hub,
    initialized,
    error,
    isReady: initialized && !error && hub !== null,
  };
}
