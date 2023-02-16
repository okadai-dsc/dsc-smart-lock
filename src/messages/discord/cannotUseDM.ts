import { DiscordMessage } from '@/models/Message';

const message: DiscordMessage = () => {
  return {
    embeds: [{ title: '❌ このコマンドはDMでは使用できません。' }],
  };
};

export default message;
