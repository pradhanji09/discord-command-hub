export async function authenticate(request, reply) {
  await request.jwtVerify();
}
