import { Logger } from '@/libs/Logger';
import { SesameAPI } from '@/libs/SesameAPI';
import { ActionCommand } from '@/models/Sesame';
import { SlashCommand } from '@/models/SlashCommand';
import axios from 'axios';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'unlock',
    description: '🔓 Sesame を解錠する',
  },
  execute: async (interaction: CommandInteraction) => {
    try {
      await SesameAPI.control(83);
      await interaction.reply({
        embeds: [
          {
            title: '✅ 解錠しました',
            timestamp: new Date(Date.now()).toISOString(),
          },
        ],
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        Logger.error(e.message);
        Logger.trace(`${e.stack}`);
      }
      await interaction.reply({
        embeds: [{ title: '❌ エラーの発生' }],
      });
    }
  },
};

export default command;
