import { channelReply } from "../../common/discord/responses.js";

export const statusCommand = {
  name: "status",

  execute() {
    return {
      outcome: "normal",
      reply: channelReply("Bot status: operational."),
    };
  },
};

export default statusCommand;
