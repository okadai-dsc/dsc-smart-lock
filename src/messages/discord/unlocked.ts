import { DiscordMessage } from '@/models/Message';

export const unlocked: DiscordMessage = () => {
  return {
    embeds: [
      {
        title: '✅ 解錠しました',
        timestamp: new Date(Date.now()).toISOString(),
      },
    ],
  };
};
