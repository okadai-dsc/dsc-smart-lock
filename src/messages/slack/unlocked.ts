import { SlackMessage } from '@/models/Message';

export const unlocked: SlackMessage<{ userIcon: string; userName: string }> = (
  props,
) => {
  return {
    attachments: [
      {
        color: '#39f778',
        title: '🔓 Unlock',
        text: 'コマンドで解錠しました',
        footer_icon: props.userIcon,
        footer: `by ${props.userName}`,
        ts: String(Date.now() / 1000),
      },
    ],
  };
};
