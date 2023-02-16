import { Client } from 'discord.js';

/**
 * ハンドラによってロードされた時に一度だけ実行されるタスク
 */
export interface InitTask {
  name: string;
  type: 'init';
  /** 実行される関数 */
  execute: () => Promise<void>;
}

/**
 * IntervalBaseに定期実行されるタスク
 */
export interface IntervalTask {
  name: string;
  type: 'interval';
  /** 実行間隔 (ms) */
  interval: number;
  /** 実行される関数 */
  execute: (client: Client) => Promise<void>;
}

/**
 * TimeBaseに定期実行されるタスク
 */
export interface ScheduledTask {
  name: string;
  type: 'scheduled';
  /** cron書式の実行間隔 */
  cronExpression: string;
  /** 実行される関数 */
  execute: (client: Client) => Promise<void>;
}

/**
 * 任意のタイミングで一度実行されるタスク
 */
export interface ManualTask<T = void, K = void> {
  name: string;
  type: 'manual';
  /** 実行される関数 */
  execute: (props: T) => Promise<K>;
}

export type Task = InitTask | IntervalTask | ScheduledTask | ManualTask;
