import dotenv from "dotenv";
import { commands } from "../src/commands/definitions.js";

dotenv.config();

const applicationId = process.env.DISCORD_APPLICATION_ID;
const botToken = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

const missingVars = [];
if (!applicationId) missingVars.push("DISCORD_APPLICATION_ID");
if (!botToken) missingVars.push("DISCORD_TOKEN");
if (!guildId) missingVars.push("DISCORD_GUILD_ID");

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingVars.join(", ")}`,
  );
  process.exit(1);
}

const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`;

async function registerGuildCommands() {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      console.error(
        `Failed to register commands: HTTP ${response.status} - ${errorData.message || "Unknown error"}`,
      );
      process.exit(1);
    }

    const data = await response.json();
    console.log(`Successfully registered ${data.length} commands to guild:`);
    for (const cmd of data) {
      console.log(`  - /${cmd.name}`);
    }
  } catch (error) {
    console.error("Error registering commands:", error.message);
    process.exit(1);
  }
}

registerGuildCommands();
