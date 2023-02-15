import { MessageActionRow, MessageComponentInteraction } from 'discord.js';

export type MessageActionComponentExecute = (
  interaction: MessageComponentInteraction,
) => Promise<void>;

export interface MessageActionComponent {
  id: string;
  view: (options: any) => Promise<MessageActionRow>;
  execute: MessageActionComponentExecute;
}
