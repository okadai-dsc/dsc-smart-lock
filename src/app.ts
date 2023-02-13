import { Logger } from './libs/Logger';
import { SesameAPI } from './libs/SesameAPI';
import { SlashCommand } from './models/SlashCommand';
import config from 'config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';

dotenv.config();

Logger.initialize();

SesameAPI.initialize(
  config.get('sesame.apiKey'),
  config.get('sesame.deviceId'),
  config.get('sesame.secretKey'),
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection<string, SlashCommand>();

const handlersDir = join(__dirname, './handlers');
readdirSync(handlersDir).forEach((handler) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(`${handlersDir}/${handler}`)(client);
});

client.login(config.get('discord.token'));
