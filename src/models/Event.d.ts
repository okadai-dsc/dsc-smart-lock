export interface BotEvent {
  type: 'bot';
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

export interface GeneralEvent {
  type: 'general';
  name: string;
  execute: (...args) => void;
}

export type Event = BotEvent | GeneralEvent;
