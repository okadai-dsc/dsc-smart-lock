import { DiscordMessage } from '@/models/Message';

export const error: DiscordMessage<{ detail: string }> = (props) => {
  return {
    embeds: [
      {
        title: '❌ エラーが発生しました',
        description: props.detail,
        timestamp: new Date(Date.now()).toISOString(),
      },
    ],
  };
};
