const { Magic } = require("@magic-sdk/admin");

// Construct with an API key:
export const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);
