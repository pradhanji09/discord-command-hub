import { channelReply } from "../../common/discord/responses.js";
import reportCommand from "../commands/report.command.js";
import statusCommand from "../commands/status.command.js";

const commands = {
  report: reportCommand,
  status: statusCommand,
};

export function extractCommandInput(payload = {}) {
  const interactionId = payload.id || null;
  const guildId = payload.guild_id || null;
  const userId = payload.member?.user?.id || payload.user?.id || null;
  const username =
    payload.member?.user?.username || payload.user?.username || null;
  const commandName = payload.data?.name || "";

  const options = Array.isArray(payload.data?.options)
    ? payload.data.options
    : [];
  const textOption = options.find((opt) => opt.name === "text");
  const text =
    textOption?.value != null
      ? String(textOption.value).trim().slice(0, 1000)
      : null;

  return {
    interactionId,
    guildId,
    userId,
    username,
    commandName,
    text,
  };
}

export function buildActions({ hasGuildConfig, log, guildId }) {
  const actions = [{ type: "reply", status: "success" }];

  if (hasGuildConfig) {
    actions.push({ type: "mirror", status: "pending" });
  } else if (guildId) {
    if (log?.warn) {
      log.warn(
        { guild_id: guildId },
        "No guild config found; skipping mirror action",
      );
    } else {
      console.warn(`[WARN] No guild config found for guild_id: ${guildId}`);
    }
  }

  return actions;
}

export default function createHandleSlashCommand({ repos, log } = {}) {
  const interactionsRepo = repos?.interactions;
  const guildConfigsRepo = repos?.guildConfigs;
  const commandConfigsRepo = repos?.commandConfigs;

  return async function handleSlashCommand(interaction) {
    try {
      const input = extractCommandInput(interaction);
      const { interactionId, guildId, userId, username, commandName, text } =
        input;

      if (!interactionId) {
        return channelReply("Unknown command.");
      }

      const command = commands[commandName];
      if (!command) {
        return channelReply("Unknown command.");
      }

      // Check command enabled state
      const commandConfig =
        commandConfigsRepo && guildId && commandName
          ? await commandConfigsRepo.find(guildId, commandName)
          : null;

      if (commandConfig && commandConfig.enabled === false) {
        return channelReply("This command is disabled in this server.");
      }

      // Execute command-specific business logic
      const { outcome, reply } = command.execute({ text, commandConfig });

      // Look up guild configuration for mirror action
      const guildConfig =
        guildConfigsRepo && guildId
          ? await guildConfigsRepo.findByGuildId(guildId)
          : null;

      const actions = buildActions({
        hasGuildConfig: Boolean(guildConfig),
        log,
        guildId,
      });

      if (interactionsRepo) {
        const recordResult = await interactionsRepo.recordInteraction({
          interaction: {
            interaction_id: interactionId,
            guild_id: guildId,
            user_id: userId,
            username,
            command_name: commandName,
            input_text: text,
            rule_outcome: outcome,
          },
          actions,
        });

        const logMsg = recordResult?.duplicate
          ? "Duplicate interaction received; skipped second insert"
          : "Slash command interaction recorded";

        log?.info?.(
          {
            interaction_id: interactionId,
            guild_id: guildId,
            command_name: commandName,
            outcome,
          },
          logMsg,
        );
      }

      return reply;
    } catch (err) {
      log?.error?.(
        { err: err.message },
        "Unexpected error handling slash command",
      );

      return channelReply(
        "An unexpected error occurred while processing your command.",
      );
    }
  };
}
