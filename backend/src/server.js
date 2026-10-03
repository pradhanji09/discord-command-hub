import Fastify from "fastify";
import dotenv from "dotenv";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import interactionsRoutes from "./interactions/interactions.routes.js";
import authRoutes from "./auth/auth.routes.js";
import guildsRoutes from "./guilds/guilds.routes.js";
import db from "./common/plugins/db.js";

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: "info",
    // Prevent sensitive data from reaching the log stream.
    // "body" is serialised as a whole but individual sub-keys are redacted.
    redact: ["headers.authorization", "body.token", "body.password"],
  },
});

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Plugins
fastify.register(db);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
});
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
});
fastify.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// Routes
fastify.register(interactionsRoutes);
fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(guildsRoutes, { prefix: "/api/guilds" });

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
