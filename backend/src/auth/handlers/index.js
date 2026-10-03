import createLoginHandler from "./login.handler.js";
import createMeHandler from "./me.handler.js";

export default function createHandlers({ services }) {
  const login = createLoginHandler({ loginService: services.loginService });
  const me = createMeHandler();

  return { login, me };
}
