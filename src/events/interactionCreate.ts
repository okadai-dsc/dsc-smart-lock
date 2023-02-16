import { Logger } from '@/libs/Logger';
import cannotUseDMMessage from '@/messages/discord/cannotUseDM';
import errorMessage from '@/messages/discord/error';
import needRoleMessage from '@/messages/discord/needRole';
import { BotEvent } from '@/models/Event';
import isGuildMemberRoleManager from '@/utils/isGuildMemberRoleManager';
import { Interaction } from 'discord.js';

const event: BotEvent = {
  type: 'bot',
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      if (interaction.inGuild()) {
        // ロールによる使用制限
        if (command.allowedRoleId) {
          const roles = interaction.member.roles;
          if (
            isGuildMemberRoleManager(roles)
              ? !roles.cache.some((role) => role.id === command.allowedRoleId)
              : !(roles as string[]).some(
                  (role) => role === command.allowedRoleId,
                )
          ) {
            await interaction.reply({
              ...needRoleMessage({
                id: command.allowedRoleId,
              }),
              ephemeral: true,
            });
            return;
          }
        }
      } else {
        // DMでの実行が使用制限
        if (!command.allowDM) {
          await interaction.reply(cannotUseDMMessage());
          return;
        }
      }
      try {
        await command.execute(interaction);
      } catch (e) {
        // エラーの発生
        if ((e as Error).message) {
          if (interaction.replied) {
            await interaction.editReply(
              errorMessage({ detail: (e as Error).message }),
            );
          } else {
            await interaction.reply(
              errorMessage({ detail: (e as Error).message }),
            );
          }
          Logger.error(`Failed to execute command: ${command.data.name}`);
          Logger.trace(String(e));
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }
    } else if (interaction.isMessageComponent()) {
      const component = interaction.client.components.get(
        interaction.customId.split('.')[0],
      );
      if (!component) return;
      try {
        await component.execute(interaction);
      } catch (e) {
        Logger.error(`Failed to execute component: ${component.id}`);
        Logger.trace(String(e));
      }
    }
  },
};

export default event;
