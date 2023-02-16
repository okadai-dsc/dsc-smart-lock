import { SesameAPI } from '@/libs/SesameAPI';
import { DiscordMessages } from '@/messages';
import unlockedSlackMessage from '@/messages/slack/unlocked';
import { SlashCommand } from '@/models/SlashCommand';
import { IncomingWebhook } from '@slack/webhook';
import config from 'config';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  allowDM: true,
  allowedRoleId: config.get<string>('discord.allowedRoleID'),
  data: {
    name: 'unlock',
    description: '🔓 Sesame を解錠する',
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

    await SesameAPI.control(83, userName, 'Discord');
    slackWebhook.send(
      unlockedSlackMessage({ userIcon: userIcon, userName: userName }),
    );
    await interaction.editReply(DiscordMessages.unlocked());
  },
};

export default command;
