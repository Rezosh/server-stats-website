export interface OAuth2ExchangeRequestParams {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: string;
  redirect_uri: string;
}

export interface DiscordPartialGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  owner_id: string;
  permissions: string;
  roles: DiscordRole[];
  features: string[];
}

export interface DiscordRole {
  id: string;
  icon: string;
  unicode_emoji: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags: DiscordRoleTags;
}

export interface DiscordRoleTags {
  bot_id: string;
  integration_id: string;
  premium_subscriber: null;
}

export enum DiscordPermissions {
  ADMINISTRATOR = 0x8,
  CREATE_INSTANT_INVITE = 0x1,
  KICK_MEMBERS = 0x2,
  BAN_MEMBERS = 0x4,
  MANAGE_CHANNELS = 0x10,
  MANAGE_GUILD = 0x20,
  ADD_REACTIONS = 0x40,
  VIEW_AUDIT_LOG = 0x80,
  PRIORITY_SPEAKER = 0x100,
  STREAM = 0x200,
  VIEW_CHANNEL = 0x400,
  SEND_MESSAGES = 0x800,
  SEND_TTS_MESSAGES = 0x1000,
  MANAGE_MESSAGES = 0x2000,
  EMBED_LINKS = 0x4000,
  ATTACH_FILES = 0x8000,
  READ_MESSAGE_HISTORY = 0x10000,
  MENTION_EVERYONE = 0x20000,
  USE_EXTERNAL_EMOJIS = 0x40000,
  VIEW_GUILD_INSIGHTS = 0x80000,
  CONNECT = 0x100000,
  SPEAK = 0x200000,
  MUTE_MEMBERS = 0x400000,
  DEAFEN_MEMBERS = 0x800000,
  MOVE_MEMBERS = 0x1000000,
  USE_VAD = 0x2000000,
  CHANGE_NICKNAME = 0x4000000,
  MANAGE_NICKNAMES = 0x8000000,
  MANAGE_ROLES = 0x10000000,
  MANAGE_WEBHOOKS = 0x20000000,
  MANAGE_EMOJIS_AND_STICKERS = 0x40000000,
  USE_APPLICATION_COMMANDS = 0x80000000,
  REQUEST_TO_SPEAK = 0x100000000,
  MANAGE_THREADS = 0x400000000,
  CREATE_PUBLIC_THREADS = 0x800000000,
  CREATE_PRIVATE_THREADS = 0x1000000000,
  USE_EXTERNAL_STICKERS = 0x2000000000,
  SEND_MESSAGES_IN_THREADS = 0x4000000000,
  USE_EMBEDDED_ACTIVITIES = 0x8000000000,
  MODERATE_MEMBERS = 0x10000000000,
}

export enum ArkMapNames {
  ScorchedEarth_P = "Scorched Earth",
  Ragnarok = "Ragnarok",
  TheIsland = "Island",
  Aberration_P = "Aberration",
  Extinction = "Extinction",
  Valguero_P = "Valguero",
  Genesis = "Genesis",
  Gen2 = "Genesis 2",
  CrystalIsles = "Crystal Isles",
  TheCenter = "Center",
  Fjordur = "Fjordur",
  LostIsland = "Lost Island",
}

export enum links {
  DISCORD_OAUTH2_URL = "https://discord.com/api/oauth2/authorize?client_id=587020870233489437&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds",
  DISCORD_BOT_URL = "https://discord.com/api/oauth2/authorize?client_id=587020870233489437&permissions=139855211600&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fguild&response_type=code&scope=bot%20applications.commands&disable_guild_select=true",
  DISCORD_REDIRECT_URI = "http://localhost:3000/auth/redirect",
}

export interface OAuth2RefreshTokenExchangeRequestParams {
  client_id: string;
  client_secret: string;
  grant_type: string;
  refresh_token: string;
}

export interface DiscordOAuth2CredentialsResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  email?: string;
  verified?: boolean;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: number | null;
  locale: string;
  tag: string;
  mfa_enabled: boolean;
  premium_type: number;
}

export interface CreateUserParams {
  discordId: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar: string;
  premium: boolean;
}

export interface EncryptedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Server {
  IP: string;
  Name: string;
  MaxPlayers: number;
  NumPlayers: number;
  Port: number;
  ClusterId: string;
  MapName: string;
  DayTime: string;
  SearchHandle: string;
}

export interface Notification {
  id: string;
  server: string;
  number: number;
  trigger: string;
  user: string;
}

export type FuseResult = {
  item: Server;
};

export type GrindList = {
  id: string;
  completedRole: string;
  guild: string;
  list: GrindListItem[];
  listName: string;
  logChannel: string;
  user: string;
};

export type GrindListItem = {
  id: string;
  completed: boolean;
  completedCount: number;
  itemName: string;
  quantity: number;
};

export type ServerWatcher = {
  id: string;
  name: string;
  cluster: string;
  lastPlayerCount: number;
  guildId: string;
  channelId: string;
  channelName: string;
  userName: string;
  messageId: string;
  userId: string;
  webhookId: string;
  webhookToken: string;
};
