import { Logger } from '@/libs/Logger';
import { SlashCommand } from '@/models/SlashCommand';
import config from 'config';
import { Client, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

// ディレクトリからコマンドを読み込み、DiscordのREST APIを使用してアプリケーションに登録する関数
export default async (client: Client) => {
  const commands: SlashCommand[] = [];
  const commandsDir = join(__dirname, '../commands');

  // コマンドディレクトリ内のファイルを取得し、コマンドを読み込むPromiseを作成する
  await Promise.all(
    readdirSync(commandsDir).map(async (file) => {
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
      const command: SlashCommand = (await import(`${commandsDir}/${file}`))
        .default;
      commands.push(command);
      client.commands.set(command.data.name, command);
    }),
  );

  // DiscordのREST APIを使用してアプリケーションにコマンドを登録する
  const rest = new REST({ version: '10' }).setToken(
    config.get('discord.token'),
  );

  rest
    .put(Routes.applicationCommands(config.get('discord.applicationID')), {
      body: commands.map((command) => command.data),
    })
    .then((data: unknown) => {
      if (Array.isArray(data)) {
        Logger.info(`🔥 Successfully loaded ${data.length} slash command(s)`);
      }
    })
    .catch((e) => {
      Logger.error(e);
    });
};
