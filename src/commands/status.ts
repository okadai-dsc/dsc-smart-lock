import { SesameAPI } from '@/libs/SesameAPI';
import statusMessage from '@/messages/discord/deviceStatus';
import { SlashCommand } from '@/models/SlashCommand';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'status',
    description: '🩺 セサミデバイスの状態を取得する',
  },
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const status = await SesameAPI.getStatus();
    await interaction.editReply(statusMessage(status));
  },
};

export default command;
