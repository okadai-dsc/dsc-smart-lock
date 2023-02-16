import { DiscordMessage } from '@/models/Message';

const message: DiscordMessage<{ detail: string }> = (props) => {
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

export default message;
