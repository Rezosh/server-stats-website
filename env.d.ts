declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ARK_WEB_API: string;
      MONGO_DB_URI: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_SUPPORT_GUILD_ID: string;
      DISCORD_PREMIUM_ROLE_ID: string;
      DISCORD_API: string;
      DISCORD_OAUTH2_URL: string;
      DISCORD_REDIRECT_URI: string;
      DISCORD_SUPPORT_SERVER_URL: string;
      DISCORD_BOT_TOKEN: string;
      SESSION_SECRET: string;
      ENCRYPT_SECRET: string;
    }
  }
}
export {};
