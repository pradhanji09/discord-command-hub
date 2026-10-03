const loginBodySchema = {
  type: "object",
  required: ["email", "password"],
  additionalProperties: false,
  properties: {
    email: { type: "string", maxLength: 254 },
    password: { type: "string", maxLength: 128 },
  },
};

export default loginBodySchema;
