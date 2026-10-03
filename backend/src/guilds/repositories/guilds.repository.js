export default function createGuildsRepository(db) {
  return {
    async findAll() {
      return db("guild_configs").select("*").orderBy("created_at", "desc");
    },

    async findByGuildId(guildId) {
      const row = await db("guild_configs")
        .where({ guild_id: guildId })
        .first();
      return row || null;
    },

    async upsert({ guild_id, channel_id, mirror_type, mirror_webhook_url }) {
      const existing = await db("guild_configs").where({ guild_id }).first();

      if (existing) {
        const updateData = { channel_id, mirror_type };
        if (mirror_webhook_url)
          updateData.mirror_webhook_url = mirror_webhook_url;

        const [row] = await db("guild_configs")
          .where({ guild_id })
          .update(updateData)
          .returning("*");
        return row;
      }

      const [row] = await db("guild_configs")
        .insert({ guild_id, channel_id, mirror_type, mirror_webhook_url })
        .returning("*");
      return row;
    },
  };
}
