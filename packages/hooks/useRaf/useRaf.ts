import { onBeforeUnmount } from "vue";

/**
 * 基于requestAnimationFrame API的节流执行器
 *
 */
export function useRaf(fn: () => void) {
  let rafId: number | null = null;

  const schedule = (): void => {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      rafId = null;

      fn();
    });
  };

  const cancel = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  onBeforeUnmount(cancel);

  return { schedule, cancel };
}
