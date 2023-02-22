import keycontrol from '@/components/keycontrol';
import { SesameAPI } from '@/libs/SesameAPI';
import { DiscordMessages } from '@/messages';
import { IntervalTask } from '@/models/Task';
import config from 'config';
import { ChannelType, MessageType } from 'discord.js';

/**
 * Sesameのステータスを確認するタスク
 */
const fetchSesameStatus: IntervalTask = {
  type: 'interval',
  name: 'fetchSesameStatus',
  interval: 5 * 60 * 1000,
  execute: async (client) => {
    // ステータス投稿チャンネルを取得
    const channelId = config.get<string>('discord.statusChannelID');
    await client.channels.fetch(channelId, { force: true });
    const channel = client.channels.cache.get(channelId);

    if (channel && channel.type == ChannelType.GuildText) {
      // ステータスの取得
      const status = await SesameAPI.getStatus();

      // チャンネルからメッセージを取得し、新しい順にソート
      const messages = await channel.messages.fetch({ limit: 50 });
      messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);

      // Bot が送信したメッセージを取得
      const message = messages.find(
        (msg) =>
          msg.author.id == client.user?.id && msg.type != MessageType.Reply,
      );
      // ステータスパネルを更新, または新規送信
      if (message) {
        message.edit({
          ...DiscordMessages.deviceStatus(status),
          components: [await keycontrol.view()],
        });
      } else {
        channel.send({
          ...DiscordMessages.deviceStatus(status),
          components: [await keycontrol.view()],
        });
      }
    }
  },
};

export default fetchSesameStatus;
