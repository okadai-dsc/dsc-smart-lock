import { DiscordMessage } from '@/models/Message';

export const locked: DiscordMessage = () => {
  return {
    embeds: [
      {
        title: '✅ 施錠しました',
        timestamp: new Date(Date.now()).toISOString(),
      },
    ],
  };
};
