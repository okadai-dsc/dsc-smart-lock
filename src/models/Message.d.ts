import { PickSameProperties } from '@/utils/sameProperties';
import { IncomingWebhookSendArguments } from '@slack/webhook';
import { InteractionReplyOptions, MessageCreateOptions } from 'discord.js';

export type SlackMessage<T = void> = (
  option: T,
) => string | IncomingWebhookSendArguments;

export type DiscordMessage<T = void> = (
  option: T,
) => PickSameProperties<MessageCreateOptions, InteractionReplyOptions>;
