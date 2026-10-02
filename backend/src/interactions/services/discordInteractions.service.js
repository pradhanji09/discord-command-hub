import { InteractionType } from "discord-interactions";
import { handlePing } from "./handlePing.js";
import createHandleSlashCommand from "./handleSlashCommand.js";

export default function createInteractionsService({ repos, log } = {}) {
  const handleSlashCommand = createHandleSlashCommand({
    repos,
    log,
  });

  return async function discordInteractionsService(interaction = {}) {
    const { type } = interaction;

    switch (type) {
      case InteractionType.PING:
        return handlePing(interaction);
      case InteractionType.APPLICATION_COMMAND:
        return handleSlashCommand(interaction);
      default:
        return undefined;
    }
  };
}
