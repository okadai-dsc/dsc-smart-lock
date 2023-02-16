import { DiscordMessage } from '@/models/Message';

const message: DiscordMessage<{ id: string }> = (props) => {
  return {
    embeds: [
      {
        title: '❌ 権限がありません。',
        description: `次のロールが必要です: <@&${props.id}>`,
      },
    ],
  };
};

export default message;
