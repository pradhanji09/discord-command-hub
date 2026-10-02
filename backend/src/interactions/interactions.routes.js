import contentTypeParser from "../common/plugins/contentTypeParser.js";
import { verifyDiscordSignature } from "./hooks/verifyDiscordSignature.js";
import createInteractionsRepository from "./repositories/interactions.repository.js";
import createInteractionsService from "./services/discordInteractions.service.js";
import createInteractionsHandlers from "./handlers/discordInteractions.handler.js";

export default async function interactionsRoutes(fastify) {
  fastify.register(contentTypeParser);

  const repo = createInteractionsRepository(fastify.db);
  const service = createInteractionsService({ repo });
  const handlers = createInteractionsHandlers({ service });

  fastify.route({
    method: "POST",
    url: "/interactions",
    preHandler: [verifyDiscordSignature],
    handler: handlers.discordInteractionsHandler,
  });
}
