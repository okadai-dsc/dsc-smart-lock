import { Logger } from '@/libs/Logger';
import { SesameAPI } from '@/libs/SesameAPI';
import cannotUseDMMessage from '@/messages/discord/cannotUseDM';
import errorMessage from '@/messages/discord/error';
import lockedDiscordMessage from '@/messages/discord/locked';
import needRoleMessage from '@/messages/discord/needRole';
import unlockedDiscordMessage from '@/messages/discord/unlocked';
import lockedSlackMessage from '@/messages/slack/locked';
import unlockedSlackMessage from '@/messages/slack/unlocked';
import { MessageActionComponent } from '@/models/MessageActionComponent';
import isGuildMemberRoleManager from '@/utils/isGuildMemberRoleManager';
import { IncomingWebhook } from '@slack/webhook';
import config from 'config';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonComponent,
  ButtonStyle,
  ComponentType,
} from 'discord.js';

const component: MessageActionComponent = {
  id: 'keycontrol',
  view: async () => {
    return new ActionRowBuilder<ButtonBuilder>({
      components: [
        {
          customId: 'keycontrol.lock',
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: 'Lock',
        } as ButtonComponent,
        {
          customId: 'keycontrol.unlock',
          type: ComponentType.Button,
          style: ButtonStyle.Danger,
          label: 'Unlock',
        } as ButtonComponent,
      ],
    });
  },
  execute: async (interaction) => {
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
      switch (interaction.customId) {
        case 'keycontrol.lock':
          await SesameAPI.control(82, userName, 'Discord');
          slackWebhook.send(
            lockedSlackMessage({
              userIcon: userIcon,
              userName: userName,
            }),
          );
          await interaction.editReply(lockedDiscordMessage());
          break;
        case 'keycontrol.unlock':
          await SesameAPI.control(83, userName, 'Discord');
          slackWebhook.send(
            unlockedSlackMessage({
              userIcon: userIcon,
              userName: userName,
            }),
          );
          await interaction.editReply(unlockedDiscordMessage());
          break;
      }
    } catch (e) {
      if ((e as Error).message) {
        Logger.error((e as Error).message);
        Logger.trace(`${(e as Error).stack}`);
        await interaction.editReply(
          errorMessage({ detail: (e as Error).message }),
        );
      }
    }
  },
};

export default component;
