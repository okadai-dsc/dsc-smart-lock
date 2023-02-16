import { MessageComponentInteraction } from 'discord.js';

export type MessageActionComponentExecute = (
  interaction: MessageComponentInteraction,
) => Promise<void>;

export interface MessageActionComponent {
  id: string;
  view: (...args) => Promise<ActionRowBuilder>;
  execute: MessageActionComponentExecute;
}
