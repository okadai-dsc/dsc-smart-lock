import { DiscordMessage } from '@/models/Message';

const message: DiscordMessage = () => {
  return {
    embeds: [
      {
        title: '✅ 解錠しました',
        timestamp: new Date(Date.now()).toISOString(),
      },
    ],
  };
};

export default message;
