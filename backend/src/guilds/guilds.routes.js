import { authenticate } from "../auth/hooks/authenticate.js";
import createGuildsRepository from "./repositories/guilds.repository.js";
import createGuildsService from "./services/guilds.service.js";
import createGuildsHandlers from "./handlers/guilds.handler.js";
import { upsertGuildSchema, getGuildSchema } from "./schema/guilds.js";

export default async function guildsRoutes(fastify) {
  const repository = createGuildsRepository(fastify.db);
  const service = createGuildsService({ guildsRepository: repository });
  const handlers = createGuildsHandlers({ service });

  fastify.route({
    method: "GET",
    url: "/",
    preHandler: [authenticate],
    handler: handlers.list,
  });

  fastify.route({
    method: "GET",
    url: "/:guildId",
    preHandler: [authenticate],
    schema: getGuildSchema,
    handler: handlers.getOne,
  });

  fastify.route({
    method: "PUT",
    url: "/:guildId",
    preHandler: [authenticate],
    schema: upsertGuildSchema,
    handler: handlers.upsert,
  });
}
