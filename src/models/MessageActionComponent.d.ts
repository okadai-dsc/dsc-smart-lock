import { MessageActionRow, MessageComponentInteraction } from 'discord.js';

type MessageActionComponentExecuteOptions = {
  interaction: MessageComponentInteraction;
};

export interface MessageActionComponent {
  id: string;
  view: (options: any) => Promise<MessageActionRow>;
  execute: (options: MessageActionComponentExecuteOptions) => void;
}
