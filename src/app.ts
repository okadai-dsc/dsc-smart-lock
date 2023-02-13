import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import config from 'config';
import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand } from './models/SlashCommand';

dotenv.config();

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
  require(`${handlersDir}/${handler}`)(client);
});

client.login(config.get('discord.token'));
