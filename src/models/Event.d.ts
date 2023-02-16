import { Client } from 'discord.js';

export interface BotEvent {
  type: 'bot';
  name: string;
  once?: boolean | false;
  execute: (...args) => Promise<void>;
}

export interface GeneralEvent {
  type: 'general';
  name: string;
  execute: (client: Client) => Promise<void>;
}

export type Event = BotEvent | GeneralEvent;
