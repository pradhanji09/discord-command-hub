export default function createGuildConfigsRepository(db) {
  return {
    async findByGuildId(guildId) {
      if (!guildId) return null;
      const row = await db("guild_configs")
        .where({ guild_id: guildId })
        .first();
      return row || null;
    },
  };
}
