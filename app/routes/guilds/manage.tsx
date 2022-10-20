import { ServerStackIcon } from "@heroicons/react/24/solid";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import { getMutualGuilds } from "~/services/auth/discord";
import { getUser, requireUserId } from "~/utils/session.server";
import { DiscordPartialGuild, links } from "~/utils/types";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const user = await getUser(request);
  if (!user) {
    return json({ error: "User not found" }, { status: 404 });
  }
  const { mutualGuilds, userGuilds } = await getMutualGuilds(user.accessToken);

  return json({ status: 200, mutualGuilds, userGuilds });
};

export default function manageGuilds() {
  const { mutualGuilds, userGuilds } = useLoaderData();
  return (
    <Container>
      <Heading>Manage Guilds</Heading>
      <div className='mt-8'>
        <ul className='grid grid-cols-1 lg:grid-cols-2  grid-flow-row gap-3'>
          {mutualGuilds.map((guild: DiscordPartialGuild) => (
            <li
              key={guild.id}
              className='text-slate-300 bg-slate-800/75 rounded-md'>
              {/* image half of div, name, owner or memeber, button */}
              <div className='flex items-center justify-between px-4 py-4 space-x-4'>
                <div className='flex items-center space-x-4'>
                  {guild.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                      alt={guild.name}
                      className='w-10 h-10 rounded-full'
                    />
                  ) : (
                    <ServerStackIcon className='w-10 h-10 rounded-full' />
                  )}
                  <div className='flex flex-col'>
                    <span className='text-lg font-medium'>{guild.name}</span>
                    <span className='text-sm text-slate-400'>
                      {guild.owner ? "Owner" : "Manage Server"}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/guilds/${guild.id}`}
                  className='px-4 py-2 text-sm font-medium text-slate-50 bg-slate-600 rounded-md hover:bg-slate-700'>
                  Manage
                </Link>
              </div>
            </li>
          ))}
          {userGuilds.map((guild: DiscordPartialGuild) => (
            <li
              key={guild.id}
              className='text-slate-300 bg-slate-800/75 rounded-md'>
              {/* image half of div, name, owner or memeber, button */}
              <div className='flex items-center justify-between px-4 py-4 space-x-4'>
                <div className='flex items-center space-x-4'>
                  {guild.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                      alt={guild.name}
                      className='w-10 h-10 rounded-full'
                    />
                  ) : (
                    <ServerStackIcon className='w-10 h-10' />
                  )}
                  <div className='flex flex-col'>
                    <span className='text-lg font-medium'>{guild.name}</span>
                    <span className='text-sm text-slate-400'>
                      {guild.owner ? "Owner" : "Manage Server"}
                    </span>
                  </div>
                </div>
                <a
                  href={`${links.DISCORD_BOT_URL}&guild_id=${guild.id}`}
                  className='px-4 py-2 text-sm font-medium text-slate-50 bg-blue-600 rounded-md hover:bg-blue-500'>
                  Invite
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

export const meta: MetaFunction = () => ({
  title: "Manage Guilds",
  description: "Invite Ark Server Stats or manage your guilds",
});
