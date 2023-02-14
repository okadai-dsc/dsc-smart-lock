import { SesameAPI } from '@/libs/SesameAPI';
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
    await interaction.editReply({
      embeds: [
        {
          author: {
            name: 'Sesame4',
            icon_url: `https://partners.candyhouse.co/static/site-icon-240b37e128d3ba7d70f4ff26607f4156.png`,
          },
          thumbnail: {
            url: 'https://cdn.shopify.com/s/files/1/0016/1870/6495/products/mini_1024x1024_40417b15-aece-47a7-922c-e90b03797010_750x.png',
          },
          title: '🩺 デバイスの状態',
          timestamp: new Date(status.timestamp * 1000).toISOString(),
          fields: [
            {
              name: '📡 接続状況',
              value: status.wm2State ? `オンライン` : `オフライン`,
              inline: true,
            },
            {
              name: '🔋 電池残量',
              value: `${status.batteryPercentage} %`,
              inline: true,
            },
            {
              name: '⚡ 電池電圧',
              value: `${Math.round(status.batteryVoltage * 100) / 100} V`,
              inline: true,
            },
            {
              name: '📐 モーター角度',
              value: `${status.position} °`,
              inline: true,
            },
            {
              name: '🔒 解錠状況',
              value: `${status.CHSesame2Status}`,
              inline: true,
            },
          ],
        },
      ],
    });
  },
};

export default command;
