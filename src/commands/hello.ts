import { SlashCommand } from '../models/SlashCommand';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'hello',
    description: '👋😀hello',
  },
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply(`👋 Hi ${interaction.user}!`);
  },
};

export default command;
