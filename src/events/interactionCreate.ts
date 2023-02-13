import { BotEvent } from '@/models/BotEvent';
import { Interaction } from 'discord.js';

const event: BotEvent = {
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
      try {
        if (!command.autocomplete) return;
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  },
};

export default event;
