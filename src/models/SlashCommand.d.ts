import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export type CommandExecute = (interaction: CommandInteraction) => Promise<void>;

export interface SlashCommand {
  data: ApplicationCommandData;
  execute: CommandExecute;
}
