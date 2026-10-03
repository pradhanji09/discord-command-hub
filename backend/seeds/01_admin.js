import bcrypt from "bcryptjs";

export async function seed(knex) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error(
      "Seed aborted: ADMIN_EMAIL environment variable is not set.",
    );
  }

  if (!password) {
    throw new Error(
      "Seed aborted: ADMIN_PASSWORD environment variable is not set.",
    );
  }

  if (password.length < 12) {
    throw new Error(
      "Seed aborted: ADMIN_PASSWORD must be at least 12 characters long.",
    );
  }

  const password_hash = await bcrypt.hash(password, 12);

  await knex("admins")
    .insert({
      email: email.trim().toLowerCase(),
      password_hash,
    })
    .onConflict("email")
    .merge();
}
