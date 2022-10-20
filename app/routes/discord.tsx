import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect(process.env.DISCORD_SUPPORT_SERVER_URL);
};
