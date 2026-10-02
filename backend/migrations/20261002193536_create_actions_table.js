/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("actions", (table) => {
    table.bigIncrements("id").primary();
    table
      .text("interaction_id")
      .notNullable()
      .references("interaction_id")
      .inTable("interactions")
      .onDelete("CASCADE");
    table.text("type").notNullable().checkIn(["reply", "mirror"]);
    table
      .text("status")
      .notNullable()
      .defaultTo("pending")
      .checkIn(["pending", "success", "failed"]);
    table.integer("attempt_count").notNullable().defaultTo(0);
    table.text("last_error").nullable();
    table.timestamp("next_retry_at", { useTz: true }).nullable();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    // Indexes
    table.index(
      ["status", "next_retry_at"],
      "actions_status_next_retry_at_index",
    );
    table.index(["interaction_id"], "actions_interaction_id_index");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("actions");
}
