import bcrypt from "bcryptjs";
const DUMMY_HASH = await bcrypt.hash("__dummy_timing_password__", 12);

export default function createLoginService({ adminsRepository, jwt }) {
  return async function login({ email, password }) {
    const normalisedEmail = email.trim().toLowerCase();

    const admin = await adminsRepository.findByEmail(normalisedEmail);

    const hash = admin ? admin.password_hash : DUMMY_HASH;
    const valid = await bcrypt.compare(password, hash);

    if (!valid || !admin) {
      return null;
    }

    const payload = { id: admin.id, email: admin.email };
    const token = jwt.sign(payload);

    return {
      token,
      admin: { id: admin.id, email: admin.email },
    };
  };
}
