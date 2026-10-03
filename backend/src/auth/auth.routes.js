import loginBodySchema from "./schema/login.js";
import createHandlers from "./handlers/index.js";
import { authenticate } from "./hooks/authenticate.js";
import createAdminsRepository from "./repositories/admins.repository.js";
import createServices from "./services/index.js";

export default async function authRoutes(fastify) {
  const repositories = createAdminsRepository(fastify.db);
  const services = createServices({ repositories, jwt: fastify.jwt });
  const handlers = createHandlers({ services });

  fastify.route({
    method: "POST",
    url: "/login",
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
      },
    },
    schema: {
      body: loginBodySchema,
    },
    handler: handlers.login,
  });

  fastify.route({
    method: "GET",
    url: "/me",
    preHandler: [authenticate],
    handler: handlers.me,
  });
}
