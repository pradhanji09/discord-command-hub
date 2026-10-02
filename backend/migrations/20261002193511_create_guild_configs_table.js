/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("guild_configs", (table) => {
    table.text("guild_id").primary();
    table.text("channel_id").notNullable();
    table.text("mirror_type").notNullable().checkIn(["slack", "discord"]);
    // mirror_webhook_url is a secret. Server-side only, never returned by an API or logged.
    table.text("mirror_webhook_url").notNullable();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("guild_configs");
}
