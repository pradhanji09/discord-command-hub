import bcrypt from "bcryptjs";

export default function createLoginService({ adminsRepository, jwt }) {
  return async function login({ email, password }) {
    const normalisedEmail = email.trim().toLowerCase();

    const admin = await adminsRepository.findByEmail(normalisedEmail);

    if (!admin) return null;

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return null;

    const payload = { id: admin.id, email: admin.email };
    const token = jwt.sign(payload);

    return {
      token,
      admin: { id: admin.id, email: admin.email },
    };
  };
}
