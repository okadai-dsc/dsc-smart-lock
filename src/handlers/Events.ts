import { BotEvent } from '../models/BotEvent';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, '../events');

  readdirSync(eventsDir).forEach((file) => {
    if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event: BotEvent = require(`${eventsDir}/${file}`).default;
    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args));
    console.log(`🌠 Successfully loaded event: ${event.name}`);
  });
};
