import { InteractionResponseType } from "discord-interactions";
export async function handlePing() {
  return { type: InteractionResponseType.PONG };
}
