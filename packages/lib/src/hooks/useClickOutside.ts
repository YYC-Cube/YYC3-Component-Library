// ============================================================
// YYC³ · @yyc3/lib useClickOutside（源：UI-8 yyc3-reusable-components/packages/hooks）
// 检测点击是否在元素外部；支持多 ref 与自定义启停
// ============================================================
import { useEffect, useRef, type RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside(
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: Handler,
  active: boolean = true,
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!active) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      // 语义修复（B2a，2026-11-04）：源实现 contains 判定与命名相反（点内才触发）；
      // 修正为「target 不被任何 ref 包含 → 视为外部点击」，与 Hook 名称/通用语义一致
      const isOutside = refs.every((r) => {
        const el = r.current;
        return !el || !el.contains((event.target as Node) || null);
      });
      if (isOutside) {
        savedHandler.current(event);
      }
    };
    document.addEventListener('mousedown', listener as EventListener);
    document.addEventListener('touchstart', listener as EventListener);
    return () => {
      document.removeEventListener('mousedown', listener as EventListener);
      document.removeEventListener('touchstart', listener as EventListener);
    };
  }, [ref, active]);
}
