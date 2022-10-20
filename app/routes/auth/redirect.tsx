import { json, LoaderFunction } from "@remix-run/node";
import {
  createUser,
  encryptTokens,
  exchangeAccessCodeForCredentials,
  getDiscordUserDetails,
} from "~/services/auth/discord";
import { buildUser } from "~/utils/helperFunctons";
import { createUserSession } from "../../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const credentials = await exchangeAccessCodeForCredentials({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    const { access_token, refresh_token } = credentials;
    const user = await getDiscordUserDetails(access_token);
    const tokens = encryptTokens(access_token, refresh_token);
    await createUser(buildUser(user, tokens));
    return createUserSession(user.id, "/");
  }

  return json({ status: 401 });
};
