import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export type CommandExecute = (interaction: CommandInteraction) => Promise<void>;

export interface SlashCommand {
  /** DMでの使用を許可するか */
  allowDM: boolean;
  /** 使用が許可されるロールID */
  allowedRoleId?: string;
  data: ApplicationCommandData;
  execute: CommandExecute;
}
