import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import SubText from "~/components/SubText";
import { db } from "~/utils/db.server";
import { classNames } from "~/utils/helperFunctons";
import {
  DiscordPartialGuild,
  GrindList,
  GrindListItem,
  ServerWatcher,
} from "~/utils/types";

function getImageFilename(itemName: string): string {
  const IMG_BASE = "/assets/images/80px-";
  const cleanName = itemName
    .replace("/", "")
    .replace("Rockwell_Recipes:_", "")
    .replace("Genesis:", "Genesis")
    .replace(/\s/g, "_");

  return `https://www.arkresourcecalculator.com${IMG_BASE}${cleanName}.png`;
}

type LoaderData = {
  guild: DiscordPartialGuild;
  grindList: GrindList;
  serverWatcher: ServerWatcher[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const guildId = params.guildId;
  invariant(guildId, "Invalid guild ID");

  const guild = await fetch(process.env.DISCORD_API + `/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
  const guildJson = await guild.json();

  const grindList = await db.lists.findUnique({
    where: {
      guild: guildId,
    },
  });

  const serverWatcher = await db.serverWatcher.findMany({
    where: {
      guildId,
    },
  });

  // create a new object with the server watcher data
  const serverWatcherData = serverWatcher.map(async (server) => {
    const channel = await fetch(
      process.env.DISCORD_API + `/channels/${server.channelId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const user = await fetch(
      process.env.DISCORD_API + `/users/${server.userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const userJson = await user.json();
    const userName = `${userJson.username}#${userJson.discriminator}`;

    const channelJson = await channel.json();
    return {
      id: server.id,
      name: server.name,
      cluster: server.cluster,
      lastPlayerCount: server.lastPlayerCount,
      guildId: server.guildId,
      channelId: server.channelId,
      channelName: channelJson.name,
      messageId: server.messageId,
      userName,
      webhookId: server.webhookId,
      webhookToken: server.webhookToken,
    };
  });

  const watchersJson = await Promise.all(serverWatcherData);

  return json({ guild: guildJson, grindList, serverWatcher: watchersJson });
};

export default function Guild() {
  const { guild, grindList, serverWatcher }: LoaderData = useLoaderData();

  return (
    <Container>
      <Heading>{guild.name}</Heading>
      <SubText>
        Manage your guild's settings and view your server's statistics.
      </SubText>
      {grindList ? <GrindList /> : null}
      {serverWatcher.length > 0 ? <WatchList /> : null}
    </Container>
  );
}

function GrindList() {
  const { grindList } = useLoaderData();
  return (
    <div className='mt-10'>
      <div className='flex items-baseline justify-between'>
        <h2 className='text-xl text text-slate-200'>
          {`Grind List (${grindList?.listName})`}
        </h2>
        <span className='text-slate-500'>{grindList.list.length} items</span>
      </div>
      {grindList.list.length > 0 ? (
        <ul className='mt-4 grid grid-cols-1 lg:grid-cols-2  grid-flow-row gap-3'>
          {grindList?.list.map((item: GrindListItem) => (
            <li key={item.id}>
              <div className='text-slate-300 py-2 bg-slate-800/75 rounded-md flex justify-between px-4'>
                <div className='flex items-center space-x-4'>
                  <img
                    src={getImageFilename(item.itemName)}
                    alt={item.itemName}
                    className='w-10 h-10 rounded-full'
                  />
                  <div className='flex flex-col'>
                    <span className='text-slate-50'>{item.itemName}</span>
                    <span
                      className={classNames(
                        item.completed ? "linethrough" : "",
                        "text-slate-400 text-sm"
                      )}>
                      {item.completedCount}/{item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-slate-400 text-center mt-10'>
          No items in this list.
          <br />
          Add some items with{" "}
          <span className='bg-slate-800 py-1 px-2 rounded-md font-mono text-sm mx-1'>
            /grindlist manage add
          </span>{" "}
          to get started!
        </p>
      )}
    </div>
  );
}

function WatchList() {
  const { serverWatcher, guild } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <div className='mt-10'>
      <h2 className='text-xl text text-slate-200'>Watched Servers</h2>
      <ul className='mt-4 grid grid-cols-1 lg:grid-cols-2  grid-flow-row gap-3'>
        {serverWatcher.map((watcher) => (
          <li key={watcher.id}>
            <div className='text-slate-300 py-2 bg-slate-800/75 rounded-md px-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg'>{watcher.name}</h3>
                <fetcher.Form method='delete' action={`/guilds/${guild.id}`}>
                  <input type='hidden' name='watcher-id' value={watcher.id} />
                  <button
                    type='submit'
                    className='inline-flex rounded-md p-1.5 text-red-400 hover:bg-red-100/30 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:ring-offset-2 focus:ring-offset-red-50/20'>
                    <span className='sr-only'>Dismiss</span>
                    <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                </fetcher.Form>
              </div>
              <div className='mt-3 flex items-baseline justify-start flex-col'>
                <div>
                  <p className='text-slate-300'>
                    Channel:{" "}
                    <span className='text-slate-400 text-sm'>
                      #{watcher.channelName}
                    </span>
                  </p>
                </div>

                <div>
                  <p className='text-slate-300'>
                    Created By:{" "}
                    <span className='text-slate-400 text-sm'>
                      {watcher.userName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const watcherToDelete = form.get("watcher-id");

  if (typeof watcherToDelete !== "string" || !watcherToDelete) {
    return json({ error: "Invalid watcher ID" }, { status: 400 });
  }

  try {
    await db.serverWatcher.delete({
      where: {
        id: watcherToDelete,
      },
    });
    return json({ message: "Watcher deleted", status: 200 });
  } catch (e) {
    return json({ error: e }, { status: 500 });
  }
};

export const meta: MetaFunction = () => ({
  title: "Guild Settings",
  description:
    "Manage your guild's settings and view your server's statistics.",
});
