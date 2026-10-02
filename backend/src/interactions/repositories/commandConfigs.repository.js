export default function createCommandConfigsRepository(db) {
  return {
    async find(guildId, commandName) {
      if (!guildId || !commandName) return null;
      const row = await db("command_configs")
        .where({ guild_id: guildId, command_name: commandName })
        .first();
      return row || null;
    },
  };
}
