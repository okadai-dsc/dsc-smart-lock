import { SesameAPI } from '@/libs/SesameAPI';
import { DiscordMessages, SlackMessages } from '@/messages';
import { SlashCommand } from '@/models/SlashCommand';
import { IncomingWebhook } from '@slack/webhook';
import config from 'config';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  allowDM: false,
  allowedRoleId: config.get<string>('discord.allowedRoleID'),
  data: {
    name: 'lock',
    description: '🔒 Sesame を施錠する',
  },
  execute: async (interaction: CommandInteraction) => {
    const slackWebhook = new IncomingWebhook(config.get('slack.webhook'));
    let userName = interaction.user.username;
    let userIcon = `${interaction.user.avatarURL({ extension: 'png' })}`;

    await interaction.deferReply();

    if (interaction.member) {
      const member = await interaction.guild?.members.fetch(
        interaction.user.id,
      );
      if (member?.nickname) {
        userName = member.nickname;
      }
      if (member?.avatarURL()) {
        userIcon = `${member.avatarURL({ extension: 'png' })}`;
      }
    }

    await SesameAPI.control(82, userName, 'Discord');
    slackWebhook.send(
      SlackMessages.locked({ userIcon: userIcon, userName: userName }),
    );
    await interaction.editReply(DiscordMessages.locked());
  },
};

export default command;
