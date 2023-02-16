import { MessageActionComponent } from './MessageActionComponent';
import { SlashCommand } from './SlashCommand';
import { Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, SlashCommand>;
    components: Collection<string, MessageActionComponent>;
  }
}
