import { Client } from 'discord.js';
import { BotEvent } from '../models/BotEvent';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: (client: Client) => {
    console.log(`💪 Logged in as ${client.user?.tag}`);
  },
};

export default event;
