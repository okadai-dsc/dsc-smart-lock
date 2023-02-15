import { MessageActionRow, MessageComponentInteraction } from 'discord.js';

type MessageComponentExecuteOptions = {
  interaction: MessageComponentInteraction;
};

export interface MessageComponent {
  id: string;
  view: (options) => Promise<MessageActionRow>;
  execute: (options: MessageActionComponentExecuteOptions) => void;
}
