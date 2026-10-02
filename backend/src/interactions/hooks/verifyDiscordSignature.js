import { verifyKey } from "discord-interactions";

// export const TIMESTAMP_TOLERANCE_SECONDS = 300;

export async function verifyDiscordSignature(request, reply) {
  const signature = request.headers["x-signature-ed25519"];
  const timestamp = request.headers["x-signature-timestamp"];
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const rawBody = request.rawBody;

  if (!signature || !timestamp || !rawBody) {
    return reply
      .code(401)
      .send({ error: "Missing required signature headers or body" });
  }

  if (!publicKey) {
    request.log.error(
      "DISCORD_PUBLIC_KEY environment variable is not configured",
    );
    return reply.code(500).send({ error: "Server configuration error" });
  }

  // // Timestamp must be a number within tolerance
  // const timestampSeconds = Number(timestamp);
  // if (Number.isNaN(timestampSeconds)) {
  //   return reply.code(401).send({ error: "Invalid timestamp" });
  // }

  // const nowSeconds = Math.floor(Date.now() / 1000);
  // if (Math.abs(nowSeconds - timestampSeconds) > TIMESTAMP_TOLERANCE_SECONDS) {
  //   return reply.code(401).send({ error: "Stale timestamp" });
  // }

  try {
    const isValid = await verifyKey(rawBody, signature, timestamp, publicKey);

    if (!isValid) {
      return reply.code(401).send({ error: "Invalid request signature" });
    }
  } catch (err) {
    return reply.code(401).send({ error: "Signature verification failed" });
  }
}
