export default function createGuildsHandlers({ service }) {
  return {
    async list(request, reply) {
      const result = await service.list();
      return reply.code(200).send(result);
    },

    async getOne(request, reply) {
      const { guildId } = request.params;
      const result = await service.getByGuildId(guildId);

      if (!result) {
        return reply.code(404).send({ message: "Guild not found" });
      }

      return reply.code(200).send(result);
    },

    async upsert(request, reply) {
      const { guildId } = request.params;
      const { channel_id, mirror_type, mirror_webhook_url } = request.body;

      const result = await service.upsert({
        guildId,
        channel_id,
        mirror_type,
        mirror_webhook_url,
      });

      if (result.error) {
        return reply.code(400).send({ message: result.error });
      }

      return reply.code(200).send(result.data);
    },
  };
}
