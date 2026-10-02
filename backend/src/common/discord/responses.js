import { InteractionResponseType } from "discord-interactions";

/**
 * Creates a public response visible in the channel.
 */
export function channelReply(content) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
      allowed_mentions: { parse: [] },
    },
  };
}
