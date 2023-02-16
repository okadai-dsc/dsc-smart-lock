/**
 * 定期実行されるタスク
 */
export interface ScheduledTask<T = void, K = void> {
  type: 'scheduled';
  /** 実行間隔 (秒) */
  interval: number;
  /** 実行される関数 */
  execute: (props: T) => K;
}

/**
 * 任意のタイミングで一度実行されるタスク
 */
export interface OneShotTask<T = void, K = void> {
  type: 'oneShot';
  /** 実行される関数 */
  execute: (props: T) => K;
}

export type Task = ScheduledTask | OneShotTask;
