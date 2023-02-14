import { Logger } from '@/libs/Logger';
import { SesameAPI } from '@/libs/SesameAPI';
import { SlashCommand } from '@/models/SlashCommand';
import isGuildMemberRoleManager from '@/utils/isGuildMemberRoleManager';
import { IncomingWebhook } from '@slack/webhook';
import axios from 'axios';
import config from 'config';
import { CommandInteraction } from 'discord.js';

const command: SlashCommand = {
  data: {
    name: 'unlock',
    description: '🔓 Sesame を解錠する',
  },
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.member) {
      await interaction.reply({
        embeds: [{ title: '❌ このコマンドはDMでは使用できません。' }],
      });
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
        embeds: [
          {
            title: '❌ 権限がありません。',
            description: `次のロールが必要です: <@&${allowedRoleId}>`,
          },
        ],
        ephemeral: true,
      });
      return;
    }
    try {
      const slackWebhook = new IncomingWebhook(config.get('slack.webhook'));
      let userName = interaction.user.username;
      let userIcon = `${interaction.user.avatarURL({ extension: 'png' })}`;

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

      await SesameAPI.control(83);
      slackWebhook.send({
        attachments: [
          {
            color: '#39f778',
            title: '🔓 UnLock',
            text: 'コマンドで解錠しました',
            footer_icon: userIcon,
            footer: `by ${userName}`,
            ts: String(Date.now() / 1000),
          },
        ],
      });
      await interaction.editReply({
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
