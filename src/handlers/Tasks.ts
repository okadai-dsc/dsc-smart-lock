import { Logger } from '@/libs/Logger';
import { Task } from '@/models/Task';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import cron from 'node-cron';
import { join } from 'path';

export default async (client: Client) => {
  const tasksDir = join(__dirname, '../tasks');

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

  await Promise.all(
    readdirSync(tasksDir).map(async (file) => {
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
      const task: Task = (await import(`${tasksDir}/${file}`)).default;
      switch (task.type) {
        case 'init':
          try {
            await task.execute();
            Logger.info(`✅ Successfully execute task: ${task.name}`);
          } catch (e) {
            onTaskError(e, task);
          }
          break;
        case 'interval':
          setInterval(async () => {
            try {
              await task.execute(client);
            } catch (e) {
              onTaskError(e, task);
            }
          }, task.interval);
          await task.execute(client);
          Logger.info(`🕛 Successfully scheduled task: ${task.name}`);
          break;
        case 'scheduled':
          cron.schedule(task.cronExpression, async () => {
            try {
              await task.execute(client);
            } catch (e) {
              onTaskError(e, task);
            }
          });
          Logger.info(`🕛 Successfully scheduled task: ${task.name}`);
          break;
      }
    }),
  );
};
