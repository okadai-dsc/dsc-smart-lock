import { Logger } from '@/libs/Logger';
import { SesameAPI } from '@/libs/SesameAPI';
import { DiscordMessages, SlackMessages } from '@/messages';
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
      await interaction.reply(DiscordMessages.cannotUseDM());
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
        ...DiscordMessages.needRole({ id: allowedRoleId }),
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
          userIcon = `${member.avatarURL({ extension: 'png' })}`;
        }
      }

      await interaction.deferReply({ ephemeral: true });
      switch (interaction.customId) {
        case 'keycontrol.lock':
          await SesameAPI.control(82, userName, 'Discord');
          slackWebhook.send(
            SlackMessages.locked({
              userIcon: userIcon,
              userName: userName,
            }),
          );
          await interaction.editReply(DiscordMessages.locked());
          break;
        case 'keycontrol.unlock':
          await SesameAPI.control(83, userName, 'Discord');
          slackWebhook.send(
            SlackMessages.unlocked({
              userIcon: userIcon,
              userName: userName,
            }),
          );
          await interaction.editReply(DiscordMessages.unlocked());
          break;
      }
    } catch (e) {
      if ((e as Error).message) {
        Logger.error((e as Error).message);
        Logger.trace(`${(e as Error).stack}`);
        await interaction.editReply(
          DiscordMessages.error({ detail: (e as Error).message }),
        );
      }
    }
  },
};

export default component;
