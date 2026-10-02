import { InteractionType, InteractionResponseType } from "discord-interactions";

export default async function discordInteractionsService({ type }) {
  if (type === InteractionType.PING) {
    return { type: InteractionResponseType.PONG };
  }
}
