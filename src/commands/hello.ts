import { SlashCommand } from '@/models/SlashCommand';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'hello',
    description: '👋😀 挨拶を返す',
  },
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply(`👋 Hi ${interaction.user}!`);
  },
};

export default command;
