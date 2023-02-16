import { Logger } from '@/libs/Logger';
import { BotEvent } from '@/models/Event';
import { Interaction } from 'discord.js';

const event: BotEvent = {
  type: 'bot',
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }
    } else if (interaction.isMessageComponent()) {
      const component = interaction.client.components.get(
        interaction.customId.split('.')[0],
      );
      if (!component) return;
      try {
        await component.execute(interaction);
      } catch (e) {
        Logger.error(`Faild to execute component: ${component.id}`);
        Logger.trace(String(e));
      }
    }
  },
};

export default event;
