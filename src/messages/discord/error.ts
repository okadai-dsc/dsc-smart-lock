import { DiscordMessage } from '@/models/Message';

const message: DiscordMessage<{ detail: string }> = (props) => {
  return {
    embeds: [
      {
        title: '✅ 施錠しました',
        description: props.detail,
        timestamp: new Date(Date.now()).toISOString(),
      },
    ],
  };
};

export default message;
