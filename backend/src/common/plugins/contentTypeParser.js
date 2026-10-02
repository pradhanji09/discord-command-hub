import fp from "fastify-plugin";

async function contentTypeParser(fastify) {
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (request, body, done) => {
      // Attach the unparsed string to the request object for signature verification
      request.rawBody = body;

      // Parse the body and return it
      try {
        const json = JSON.parse(body);
        done(null, json);
      } catch (err) {
        err.statusCode = 400;
        done(err, undefined);
      }
    },
  );
}

export default fp(contentTypeParser, { name: "contentTypeParser" });
