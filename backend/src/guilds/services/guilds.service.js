const ALLOWED_WEBHOOK_HOSTS = [
  "discord.com",
  "discordapp.com",
  "hooks.slack.com",
];

function isAllowedWebhookUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_WEBHOOK_HOSTS.some(
      (host) =>
        parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

function toPublicShape(row) {
  return {
    guild_id: row.guild_id,
    channel_id: row.channel_id,
    mirror_type: row.mirror_type,
    has_mirror_webhook: Boolean(row.mirror_webhook_url),
    created_at: row.created_at,
  };
}

export default function createGuildsService({ guildsRepository }) {
  return {
    async list() {
      const rows = await guildsRepository.findAll();
      return { items: rows.map(toPublicShape) };
    },

    async getByGuildId(guildId) {
      const row = await guildsRepository.findByGuildId(guildId);
      return row ? toPublicShape(row) : null;
    },

    async upsert({ guildId, channel_id, mirror_type, mirror_webhook_url }) {
      const existing = await guildsRepository.findByGuildId(guildId);
      const isCreate = !existing;

      if (isCreate && !mirror_webhook_url) {
        return { error: "mirror_webhook_url is required on first create" };
      }

      if (mirror_webhook_url && !isAllowedWebhookUrl(mirror_webhook_url)) {
        return {
          error:
            "mirror_webhook_url must be HTTPS on an allowed Slack or Discord webhook host",
        };
      }

      const row = await guildsRepository.upsert({
        guild_id: guildId,
        channel_id,
        mirror_type,
        mirror_webhook_url: mirror_webhook_url || undefined,
      });

      return { data: toPublicShape(row) };
    },
  };
}
