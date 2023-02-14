import { Logger } from '@/libs/Logger';
import { Event } from '@/models/Event';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export default async (client: Client) => {
  const eventsDir = join(__dirname, '../events');

  await Promise.all(
    readdirSync(eventsDir).map(async (file) => {
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
      const event: Event = (await import(`${eventsDir}/${file}`)).default;
      switch (event.type) {
        case 'bot':
          event.once
            ? client.once(event.name, (...args) => event.execute(...args))
            : client.on(event.name, (...args) => event.execute(...args));
          break;
      }
      Logger.info(`🌠 Successfully loaded event: ${event.name}`);
    }),
  );
};
