import Fastify from "fastify";
import dotenv from "dotenv";
import interactionsRoutes from "./interactions/interactions.routes.js";

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: "info",
    // Ensure sensitive fields are never logged
    redact: ["headers.authorization", "body.token"],
  },
});

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Routes
fastify.register(interactionsRoutes);

// Start
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
