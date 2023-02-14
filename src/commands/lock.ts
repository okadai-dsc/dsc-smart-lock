import { Logger } from '@/libs/Logger';
import { SesameAPI } from '@/libs/SesameAPI';
import { SlashCommand } from '@/models/SlashCommand';
import axios from 'axios';
import { CommandInteraction, Embed } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'lock',
    description: '🔒 Sesame を施錠する',
  },
  execute: async (interaction: CommandInteraction) => {
    try {
      await SesameAPI.control(82);
      await interaction.reply({
        embeds: [
          {
            title: '✅ 施錠しました',
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
