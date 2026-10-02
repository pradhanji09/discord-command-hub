import discordInteractionsService from "../services/discordInteractions.js";

export default async function discordInteractionsHandler(request, reply) {
  const {
    body: { type },
  } = request;

  const response = await discordInteractionsService({ type });
  return reply.code(200).send(response);
}
