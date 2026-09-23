export interface UseRafReturn {
  schedule: () => void; // 同一帧多次调用仅执行一次
  cancel: () => void; // 取消待执行的回调
}
