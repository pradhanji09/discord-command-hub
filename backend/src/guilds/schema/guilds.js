export const upsertGuildSchema = {
  params: {
    type: "object",
    required: ["guildId"],
    properties: {
      guildId: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: ["channel_id", "mirror_type"],
    additionalProperties: false,
    properties: {
      channel_id: { type: "string" },
      mirror_type: { type: "string", enum: ["slack", "discord"] },
      mirror_webhook_url: { type: "string" },
    },
  },
};

export const getGuildSchema = {
  params: {
    type: "object",
    required: ["guildId"],
    properties: {
      guildId: { type: "string" },
    },
  },
};
