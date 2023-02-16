import { DiscordMessage } from '@/models/Message';

export const needRole: DiscordMessage<{ id: string }> = (props) => {
  return {
    embeds: [
      {
        title: '❌ 権限がありません。',
        description: `次のロールが必要です: <@&${props.id}>`,
      },
    ],
  };
};
