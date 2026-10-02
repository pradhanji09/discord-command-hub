import fp from "fastify-plugin";
import knex from "knex";
import config from "../../../knexfile.js";

export default fp(async (fastify) => {
  const db = knex(config);
  await db.raw("select 1");

  fastify.log.info("Database connection established... %j");

  fastify.decorate("db", db);
  fastify.decorate("knex", db);

  fastify.addHook("onClose", async (instance) => {
    instance.log.info("Closing database connection...");
    await db.destroy();
  });
});
