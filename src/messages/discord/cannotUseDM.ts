import { DiscordMessage } from '@/models/Message';

export const cannotUseDM: DiscordMessage = () => {
  return {
    embeds: [{ title: '❌ このコマンドはDMでは使用できません。' }],
  };
};
