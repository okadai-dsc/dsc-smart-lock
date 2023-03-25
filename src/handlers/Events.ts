import { Logger } from '@/libs/Logger';
import { Event } from '@/models/Event';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

// イベントを読み込む関数
export default async (client: Client) => {
  // イベントのディレクトリパスを取得
  const eventsDir = join(__dirname, '../events');

  // イベントディレクトリ内のファイルを非同期で読み込む
  await Promise.all(
    readdirSync(eventsDir).map(async (file) => {
      // ファイルがtsかjsでない場合は処理を終了する
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
      // イベントをインポートして変数に格納
      const event: Event = (await import(`${eventsDir}/${file}`)).default;
      // イベントの種類に応じて処理を分岐
      switch (event.type) {
        case 'bot':
          // イベントを一度だけ実行するか、複数回実行するかで処理を分岐
          event.once
            ? client.once(event.name, (...args) => event.execute(...args))
            : client.on(event.name, (...args) => event.execute(...args));
          break;
      }
      // イベントの読み込みをログに出力
      Logger.info(`🌠 Successfully loaded event: ${event.name}`);
    }),
  );
};
