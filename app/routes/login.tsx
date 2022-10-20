import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect(process.env.DISCORD_OAUTH2_URL);
};
