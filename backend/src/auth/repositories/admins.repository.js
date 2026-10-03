export default function createAdminsRepository(db) {
  return {
    async findByEmail(email) {
      const row = await db("admins").where({ email }).first();
      return row || null;
    },
  };
}
