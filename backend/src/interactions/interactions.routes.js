import contentTypeParser from "../common/plugins/contentTypeParser.js";
import { verifyDiscordSignature } from "./hooks/verifyDiscordSignature.js";
import createInteractionsRepository from "./repositories/interactions.repository.js";
import createGuildConfigsRepository from "./repositories/guildConfigs.repository.js";
import createCommandConfigsRepository from "./repositories/commandConfigs.repository.js";
import createInteractionsService from "./services/discordInteractions.service.js";
import createInteractionsHandlers from "./handlers/discordInteractions.handler.js";

export default async function interactionsRoutes(fastify) {
  fastify.register(contentTypeParser);

  const repos = {
    interactions: createInteractionsRepository(fastify.db),
    guildConfigs: createGuildConfigsRepository(fastify.db),
    commandConfigs: createCommandConfigsRepository(fastify.db),
  };

  const service = createInteractionsService({
    repos,
    log: fastify.log,
  });

  const handlers = createInteractionsHandlers({ service });

  fastify.route({
    method: "POST",
    url: "/interactions",
    preHandler: [verifyDiscordSignature],
    handler: handlers.discordInteractionsHandler,
  });
}
