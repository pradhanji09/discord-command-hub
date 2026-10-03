export default function createMeHandler() {
  return async function meHandler(request, reply) {
    const { id, email } = request.user;
    return reply.code(200).send({ id, email });
  };
}
