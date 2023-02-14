import { Logger } from '@/libs/Logger';
import { BotEvent } from '@/models/Event';
import { Client } from 'discord.js';

const event: BotEvent = {
  type: 'bot',
  name: 'ready',
  once: true,
  execute: (client: Client) => {
    Logger.info(`💪 Logged in as ${client.user?.tag}`);
  },
};

export default event;
