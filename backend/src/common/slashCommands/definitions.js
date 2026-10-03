export const commands = [
  {
    name: "report",
    description: "Report an issue to the team",
    options: [
      {
        name: "text",
        description: "What do you want to report?",
        type: 3, // STRING
        required: true,
        max_length: 1000,
      },
    ],
  },
  {
    name: "status",
    description: "Check the bot status",
  },
];
