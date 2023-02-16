import test from '@/components/test';
import { SlashCommand } from '@/models/SlashCommand';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'componenttest',
    description: '🧩テスト用コンポーネント',
  },
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply({
      content: '🧩 Component Test',
      components: [await test.view()],
    });
  },
};

export default command;
