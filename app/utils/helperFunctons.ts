import {
  CreateUserParams,
  DiscordUser,
  EncryptedTokens,
  OAuth2ExchangeRequestParams,
  OAuth2RefreshTokenExchangeRequestParams,
} from "./types";
import CryptoJS from "crypto-js";

export function classNames<T>(...classes: Array<T | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export function buildOAuth2Payload(
  data: OAuth2ExchangeRequestParams | OAuth2RefreshTokenExchangeRequestParams
) {
  return new URLSearchParams(data).toString();
}

export const encryptToken = (token: string) => {
  return CryptoJS.AES.encrypt(token, process.env.ENCRYPT_SECRET);
};

export const decryptToken = (encrypted: string) => {
  return CryptoJS.AES.decrypt(encrypted, process.env.ENCRYPT_SECRET);
};

export const buildUser = (
  user: DiscordUser,
  credentials: EncryptedTokens
): CreateUserParams => ({
  discordId: user.id,
  username: user.username,
  discriminator: user.discriminator,
  avatar: user.avatar,
  tag: `${user.username}#${user.discriminator}`,
  accessToken: credentials.accessToken,
  refreshToken: credentials.refreshToken,
});
