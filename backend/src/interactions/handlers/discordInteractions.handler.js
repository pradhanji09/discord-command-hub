export default function createInteractionsHandlers({ service }) {
  return {
    async discordInteractionsHandler(request, reply) {
      const response = await service(request.body);
      return reply.code(200).send(response);
    },
  };
}
