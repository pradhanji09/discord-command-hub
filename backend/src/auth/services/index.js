import createLoginService from "./login.service.js";

export default function createAuthServices({ repositories, jwt }) {
  const loginService = createLoginService({
    adminsRepository: repositories,
    jwt,
  });

  return { loginService };
}
