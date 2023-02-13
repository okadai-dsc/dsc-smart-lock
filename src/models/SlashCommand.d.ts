import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export type CommandExecute = (interaction: CommandInteraction) => void;

export interface SlashCommand {
  data: ApplicationCommandData;
  execute: CommandExecute;
}
