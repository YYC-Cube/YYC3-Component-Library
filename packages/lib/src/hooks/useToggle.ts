// ============================================================
// YYC³ · @yyc3/lib useToggle（源：UI-8 yyc3-reusable-components/packages/hooks）
// ============================================================
import { useCallback, useState } from 'react';

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse }] as const;
}
