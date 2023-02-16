import { SesameAPI } from '@/libs/SesameAPI';
import { DiscordMessages } from '@/messages';
import { SlashCommand } from '@/models/SlashCommand';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  allowDM: true,
  data: {
    name: 'status',
    description: '🩺 セサミデバイスの状態を取得する',
  },
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const status = await SesameAPI.getStatus();
    await interaction.editReply(DiscordMessages.deviceStatus(status));
  },
};

export default command;
