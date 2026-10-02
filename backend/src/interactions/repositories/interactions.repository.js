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

    async recordInteraction({ interaction, actions = [] }) {
      return db.transaction(async (trx) => {
        // 1. insert into "interactions" with onConflict("interaction_id").ignore()
        const result = await trx("interactions")
          .insert(interaction)
          .onConflict("interaction_id")
          .ignore()
          .returning("interaction_id");

        // 2. if no row was inserted (duplicate), stop and return { duplicate: true }
        if (!result || result.length === 0) {
          return { duplicate: true };
        }

        // 3. otherwise insert the given rows into "actions"
        if (actions && actions.length > 0) {
          const actionRows = actions.map((action) => ({
            ...action,
            interaction_id: interaction.interaction_id,
          }));
          await trx("actions").insert(actionRows);
        }

        return { duplicate: false };
      });
    },
  };
}
