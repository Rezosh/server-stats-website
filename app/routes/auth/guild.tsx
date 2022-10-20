import { json, LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const guild = url.searchParams.get("guild_id");

  if (!guild) {
    return json({ error: "Invalid guild ID" }, { status: 400 });
  }

  return redirect(`/guilds/${guild}`);
};
