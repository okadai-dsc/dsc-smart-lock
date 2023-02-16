import { Logger } from '@/libs/Logger';
import { SesameAPI } from '@/libs/SesameAPI';
import cannotUseDMMessage from '@/messages/discord/cannotUseDM';
import errorMessage from '@/messages/discord/error';
import lockedDiscordMessage from '@/messages/discord/locked';
import needRoleMessage from '@/messages/discord/needRole';
import lockedSlackMessage from '@/messages/slack/locked';
import { SlashCommand } from '@/models/SlashCommand';
import isGuildMemberRoleManager from '@/utils/isGuildMemberRoleManager';
import { IncomingWebhook } from '@slack/webhook';
import config from 'config';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'lock',
    description: '🔒 Sesame を施錠する',
  },
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.member) {
      await interaction.reply(cannotUseDMMessage());
      return;
    }
    const roles = interaction.member.roles;
    const allowedRoleId = config.get<string>('discord.allowedRoleID');
    if (
      isGuildMemberRoleManager(roles)
        ? !roles.cache.some((role) => role.id === allowedRoleId)
        : !(roles as string[]).some((role) => role === allowedRoleId)
    ) {
      await interaction.reply({
        ...needRoleMessage({ id: allowedRoleId }),
        ephemeral: true,
      });
      return;
    }
    try {
      const slackWebhook = new IncomingWebhook(config.get('slack.webhook'));
      let userName = interaction.user.username;
      let userIcon = `${interaction.user.avatarURL({
        extension: 'png',
      })}`;

      if (interaction.member) {
        const member = await interaction.guild?.members.fetch(
          interaction.user.id,
        );
        if (member?.nickname) {
          userName = member.nickname;
        }
        if (member?.avatarURL()) {
          userIcon = `member.avatarURL({ extension: 'png' })`;
        }
      }

      await interaction.deferReply();

      await SesameAPI.control(82, userName, 'Discord');
      slackWebhook.send(
        lockedSlackMessage({ userIcon: userIcon, userName: userName }),
      );
      await interaction.editReply(lockedDiscordMessage());
    } catch (e) {
      if ((e as Error).message) {
        Logger.error((e as Error).message);
        Logger.trace(`${(e as Error).stack}`);
        await interaction.reply(errorMessage({ detail: (e as Error).message }));
      }
    }
  },
};

export default command;
