import { SlashCommand } from '@/models/SlashCommand';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'ping',
    description: '🏓 pong',
  },
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('🏓 pong!');
  },
};

export default command;
