import { Logger } from '@/libs/Logger';
import { Task } from '@/models/Task';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import cron from 'node-cron';
import { join } from 'path';

// ディレクトリからタスクを読み込み、実行する関数
export default async (client: Client) => {
  const tasksDir = join(__dirname, '../tasks'); // タスクのディレクトリパス

  // タスク実行時にエラーが発生した場合の処理
  const onTaskError = (e: unknown, task: Task) => {
    const err = e as Error;
    if (err.message && err.stack) {
      Logger.error(
        `An error has occurred in Task '${task.name}': ${err.message}`,
      );
      Logger.trace(err.stack);
    } else {
      Logger.error(`An unknown error has occurred in Task '${task.name}'`);
    }
  };

  // 各タスクを非同期で実行
  await Promise.all(
    readdirSync(tasksDir).map(async (file) => {
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return; // 拡張子が.tsまたは.js以外の場合は処理をスキップ
      const task: Task = (await import(`${tasksDir}/${file}`)).default; // タスクをインポート
      switch (task.type) {
        case 'init': // 初期化タスクの場合
          try {
            await task.execute(); // タスクを実行
            Logger.info(`✅ Successfully execute task: ${task.name}`); // 成功メッセージを出力
          } catch (e) {
            onTaskError(e, task); // エラーが発生した場合はonTaskError関数を実行
          }
          break;
        case 'interval': // インターバルタスクの場合
          setInterval(async () => {
            try {
              await task.execute(client); // タスクを実行
            } catch (e) {
              onTaskError(e, task); // エラーが発生した場合はonTaskError関数を実行
            }
          }, task.interval);
          await task.execute(client); // タスクを実行
          Logger.info(`🕛 Successfully scheduled task: ${task.name}`); // 成功メッセージを出力
          break;
        case 'scheduled': // スケジュールタスクの場合
          cron.schedule(task.cronExpression, async () => {
            try {
              await task.execute(client); // タスクを実行
            } catch (e) {
              onTaskError(e, task); // エラーが発生した場合はonTaskError関数を実行
            }
          });
          Logger.info(`🕛 Successfully scheduled task: ${task.name}`); // 成功メッセージを出力
          break;
      }
    }),
  );
};
