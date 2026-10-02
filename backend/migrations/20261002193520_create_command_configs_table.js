/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("command_configs", (table) => {
    table.bigIncrements("id").primary();
    table
      .text("guild_id")
      .notNullable()
      .references("guild_id")
      .inTable("guild_configs")
      .onDelete("CASCADE");
    table.text("command_name").notNullable();
    table.boolean("enabled").notNullable().defaultTo(true);
    table.jsonb("config").notNullable().defaultTo("{}");
    table.unique(["guild_id", "command_name"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("command_configs");
}
