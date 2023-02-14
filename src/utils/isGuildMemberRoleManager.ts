import { GuildMemberManager } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGuildMemberRoleManager = (item: any): item is GuildMemberManager => {
  return !!(item as GuildMemberManager)?.cache;
};

export default isGuildMemberRoleManager;
