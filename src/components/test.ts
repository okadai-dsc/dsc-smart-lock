import { MessageActionComponent } from '@/models/MessageActionComponent';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonComponent,
  ButtonStyle,
  ComponentType,
} from 'discord.js';

const component: MessageActionComponent = {
  id: 'test',
  view: async () => {
    return new ActionRowBuilder<ButtonBuilder>({
      components: [
        {
          customId: 'test.button1',
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: 'Button 1',
        } as ButtonComponent,
        {
          customId: 'test.button2',
          type: ComponentType.Button,
          style: ButtonStyle.Danger,
          label: 'Button 2',
        } as ButtonComponent,
      ],
    });
  },
  execute: async (interaction) => {
    switch (interaction.customId) {
      case 'test.button1':
        await interaction.reply(`🟢 Button 1 Clicked!`);
        break;
      case 'test.button2':
        await interaction.reply(`🔴 Button 2 Clicked!`);
        break;
    }
  },
};

export default component;
