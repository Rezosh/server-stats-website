import { db } from "~/utils/db.server";
import CryptoJS from "crypto-js";
import {
  buildOAuth2Payload,
  decryptToken,
  encryptToken,
} from "~/utils/helperFunctons";
import {
  CreateUserParams,
  DiscordOAuth2CredentialsResponse,
  DiscordPartialGuild,
  DiscordPermissions,
  DiscordUser,
  EncryptedTokens,
  OAuth2ExchangeRequestParams,
  OAuth2RefreshTokenExchangeRequestParams,
} from "../../utils/types";
import { User } from "@prisma/client";

type DiscordGuild = {
  mutualGuilds: DiscordPartialGuild[];
  userGuilds: DiscordPartialGuild[];
};

/**
 *
 * @param data discord oauth2 exchange params
 * @returns discord oauth2 credentials response
 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example} for discord oauth2 exchange params
 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-response} for discord oauth2 credentials response
 */
export async function exchangeAccessCodeForCredentials(
  data: OAuth2ExchangeRequestParams
): Promise<DiscordOAuth2CredentialsResponse> {
  const payload = buildOAuth2Payload(data);
  const response = await fetch(`${process.env.DISCORD_API}/oauth2/token`, {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const json = await response.json();
  return json;
}

/**
 * @param accessToken discord access token
 * @returns discord user
 */
export async function getDiscordUserDetails(
  accessToken: string
): Promise<DiscordUser> {
  const response = await fetch(`${process.env.DISCORD_API}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  return json;
}

/**
 * @param accessToken discord access token
 * @returns discord partial guilds that the user is in
 */
export async function getDiscordUserGuilds(
  accessToken: string
): Promise<DiscordPartialGuild[]> {
  const response = await fetch(`${process.env.DISCORD_API}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  return json;
}

/**
 * @returns An array of partial guild objects that the bot is a member of
 */
export async function getBotGuilds(): Promise<DiscordPartialGuild[]> {
  const response = await fetch(`${process.env.DISCORD_API}/users/@me/guilds`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });

  const json = await response.json();

  return json;
}

/**
 * Checks if the user is in the guild and has the premium role
 * @param discordId user's discord id
 * @returns boolean if user is a premium user
 */
export async function getPremiumStatus(discordId: string): Promise<boolean> {
  const response = await fetch(
    `${process.env.DISCORD_API}/guilds/${process.env.DISCORD_SUPPORT_GUILD_ID}/members/${discordId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  const member = await response.json();

  return member.roles.includes(process.env.DISCORD_PREMIUM_ROLE_ID);
}

/**
 * Get shared guilds between the user and the bot
 * @param accessToken discord access token
 * @returns Two arrays of PartialGuilds shared between the user and the bot
 */
export async function getMutualGuilds(
  accessToken: string
): Promise<DiscordGuild> {
  // decrypt access token
  const decryptedToken = decryptToken(accessToken).toString(CryptoJS.enc.Utf8);
  // get user guilds
  const userGuilds = await getDiscordUserGuilds(decryptedToken);
  // get bot guilds
  const botGuilds = await getBotGuilds();
  // get user guilds where user has MANAGE_GUILD permission
  const userAdminGuilds = userGuilds.filter(
    (guild: DiscordPartialGuild) =>
      (parseInt(guild.permissions) & DiscordPermissions.MANAGE_GUILD) ===
      DiscordPermissions.MANAGE_GUILD
  );

  // get guilds shared between user and bot
  const mutualGuilds = userAdminGuilds.filter(
    (userGuild: DiscordPartialGuild) =>
      botGuilds.some(
        (botGuild: DiscordPartialGuild) => botGuild.id === userGuild.id
      )
  );

  // get guilds where user has perms to invite bot
  const userAdminGuildsButBotNotIn = userAdminGuilds.filter(
    (userGuild: DiscordPartialGuild) =>
      !botGuilds.some(
        (botGuild: DiscordPartialGuild) => botGuild.id === userGuild.id
      )
  );

  return { mutualGuilds, userGuilds: userAdminGuildsButBotNotIn };
}

/**
 * Creates a new user in the database, or updates an existing user
 * @param params params to create user
 * @returns User object
 */
export async function createUser(params: CreateUserParams): Promise<User> {
  const userDb = await db.user.findUnique({
    where: {
      discordId: params.discordId,
    },
  });
  const isPremium = await getPremiumStatus(params.discordId);
  params.premium = isPremium;
  if (userDb) {
    const updatedUser = await updateUser(params);
    return updatedUser;
  }
  const newUser = await db.user.create({
    data: params,
  });
  return newUser;
}

/**
 * Updates an existing user in the database
 * @param params params to update user
 * @returns User object
 */
export async function updateUser(params: CreateUserParams): Promise<User> {
  const updatedUser = await db.user.update({
    where: {
      discordId: params.discordId,
    },
    data: {
      username: params.username,
      discriminator: params.discriminator,
      avatar: params.avatar,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      tag: params.tag,
      premium: params.premium,
    },
  });
  return updatedUser;
}
export async function exchangeRefreshTokenForAccessToken(
  data: OAuth2RefreshTokenExchangeRequestParams
): Promise<DiscordOAuth2CredentialsResponse> {
  const payload = buildOAuth2Payload(data);
  const response = await fetch(`${process.env.DISCORD_API}/oauth2/token`, {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const json = await response.json();
  return json;
}

/**
 * Encrypts the user's tokens
 * @param accessToken discord access token
 * @param refreshToken discord refresh token
 * @returns Encrypted access token and refresh token
 */
export function encryptTokens(
  accessToken: string,
  refreshToken: string
): EncryptedTokens {
  return {
    accessToken: encryptToken(accessToken).toString(),
    refreshToken: encryptToken(refreshToken).toString(),
  };
}
