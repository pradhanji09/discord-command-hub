export default function createInteractionsRepository(db) {
  return {
    async insertIfNew(row) {
      const result = await db("interactions")
        .insert(row)
        .onConflict("interaction_id")
        .ignore()
        .returning("interaction_id");

      return result.length > 0;
    },
  };
}
