import { Logger } from '@/libs/Logger';
import { MessageActionComponent } from '@/models/MessageActionComponent';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export default async (client: Client) => {
  const components: MessageActionComponent[] = [];
  const componentsDir = join(__dirname, '../components');

  await Promise.all(
    readdirSync(componentsDir).map(async (file) => {
      if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
      const component: MessageActionComponent = (
        await import(`${componentsDir}/${file}`)
      ).default;
      components.push(component);
      client.components.set(component.id, component);
    }),
  );

  Logger.info(
    `🧩 Successfully loaded ${components.length} message component(s)`,
  );
};
