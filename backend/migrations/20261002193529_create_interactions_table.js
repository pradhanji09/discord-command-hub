/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("interactions", (table) => {
    table.text("interaction_id").primary(); // Dedup key
    table.text("guild_id");
    table.text("user_id");
    table.text("username");
    table.text("command_name").notNullable();
    table.text("input_text");
    table.text("rule_outcome");
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    // Index on created_at (descending) for the dashboard log
    table.index(
      [knex.raw("created_at DESC")],
      "interactions_created_at_desc_index",
    );
    // No foreign key to guild_configs, so an insert never fails for an unconnected server
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("interactions");
}
