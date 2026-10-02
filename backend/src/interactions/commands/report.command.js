import { channelReply } from "../../common/discord/responses.js";

export const reportCommand = {
  name: "report",

  execute({ text, commandConfig }) {
    const rawKeywords = commandConfig?.config?.keywords;
    const keywords =
      Array.isArray(rawKeywords) && rawKeywords.length > 0
        ? rawKeywords
        : ["urgent"];

    const lowerText = (text || "").toLowerCase();
    const isFlagged = keywords.some(
      (kw) =>
        typeof kw === "string" &&
        kw.trim() !== "" &&
        lowerText.includes(kw.toLowerCase()),
    );

    const outcome = isFlagged ? "flagged" : "normal";

    const content =
      outcome === "flagged"
        ? "Your report has been flagged as urgent and submitted to the team."
        : "Your report has been submitted to the team.";

    return {
      outcome,
      reply: channelReply(content),
    };
  },
};

export default reportCommand;
