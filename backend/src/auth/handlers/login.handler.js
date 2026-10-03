export default function createLoginHandler({ loginService }) {
  return async function loginHandler(request, reply) {
    const { email, password } = request.body;

    const result = await loginService({ email, password });

    if (!result) {
      return reply.code(401).send({ message: "Invalid email or password" });
    }

    return reply.code(200).send({ token: result.token, admin: result.admin });
  };
}
