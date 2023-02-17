import { SlackMessage } from '@/models/Message';

export const locked: SlackMessage<{ userIcon: string; userName: string }> = (
  props,
) => {
  return {
    attachments: [
      {
        color: '#fa3c2a',
        title: '🔒 Lock',
        text: 'コマンドで施錠しました',
        footer_icon: props.userIcon,
        footer: `by ${props.userName}`,
        ts: String(Date.now() / 1000),
      },
    ],
  };
};
