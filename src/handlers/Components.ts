import { Logger } from '@/libs/Logger';
import { MessageActionComponent } from '@/models/MessageActionComponent';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

// メッセージアクションコンポーネントを読み込む関数
export default async (client: Client) => {
  const components: MessageActionComponent[] = [];
  const componentsDir = join(__dirname, '../components');

  // コンポーネントディレクトリ内のファイルを非同期で読み込む
  await Promise.all(
    readdirSync(componentsDir).map(async (file) => {
      // 拡張子がtsまたはjsでない場合はスキップ
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
      // ファイルからコンポーネントをインポートし、配列に格納する
      const component: MessageActionComponent = (
        await import(`${componentsDir}/${file}`)
      ).default;
      components.push(component);
      // クライアントのコンポーネントマップに追加する
      client.components.set(component.id, component);
    }),
  );

  // 読み込んだコンポーネントの数をログ出力する
  Logger.info(
    `🧩 Successfully loaded ${components.length} message component(s)`,
  );
};
