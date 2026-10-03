import createLoginService from "./login.service.js";

export default function createServices({ repositories, jwt }) {
  const loginService = createLoginService({
    adminsRepository: repositories,
    jwt,
  });

  return { loginService };
}
