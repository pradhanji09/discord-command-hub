import contentTypeParser from "../common/plugins/contentTypeParser.js";
import handlers from "./handlers/index.js";
import { verifyDiscordSignature } from "./hooks/verifyDiscordSignature.js";

export default async function interactionsRoutes(fastify) {
  fastify.register(contentTypeParser);

  fastify.route({
    method: "POST",
    url: "/interactions",
    preHandler: [verifyDiscordSignature],
    handler: handlers.discordInteractionsHandler,
  });
}
