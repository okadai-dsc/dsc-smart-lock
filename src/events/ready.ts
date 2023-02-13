import { Logger } from '../libs/Logger';
import { BotEvent } from '../models/BotEvent';
import { Client } from 'discord.js';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: (client: Client) => {
    Logger.info(`💪 Logged in as ${client.user?.tag}`);
  },
};

export default event;
