import { SlashCommand } from '../models/SlashCommand';
import config from 'config';
import { Client, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

module.exports = (client: Client) => {
  const commands: SlashCommand[] = [];
  const commandsDir = join(__dirname, '../commands');

  readdirSync(commandsDir).forEach((file) => {
    if (!(file.endsWith('.ts') || file.endsWith('.js'))) return;
    const command: SlashCommand = require(`${commandsDir}/${file}`).default;
    commands.push(command);
    client.commands.set(command.data.name, command);
  });

  const rest = new REST({ version: '10' }).setToken(
    config.get('discord.token'),
  );

  rest
    .put(Routes.applicationCommands(config.get('discord.applicationID')), {
      body: commands.map((command) => command.data),
    })
    .then((data: any) => {
      console.log(`🔥 Successfully loaded ${data.length} slash command(s)`);
    })
    .catch((e) => {
      console.log(e);
    });
};
