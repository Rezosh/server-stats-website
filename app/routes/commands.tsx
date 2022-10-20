import { MetaFunction } from "@remix-run/node";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import SubText from "~/components/SubText";

const commands = [
  { name: "/xbox", description: "Shows the searched servers information" },
  {
    name: "/playstation",
    description: "Shows the searched servers information",
  },
  {
    name: "/rates",
    description: "Shows the official server rates",
  },
  { name: "/graph", description: "Shows the server's population graph" },
  { name: "/arkstats", description: "Shows stats about ark servers" },
  { name: "/bp", description: "Displays the highest roll of a blueprint" },
  {
    name: "/buy",
    description: "Shows the hexagon cost of items from the genesis store",
  },
  {
    name: "/craft",
    description: "Displays crafting recipes for the searched item",
  },
  { name: "/invite", description: "Shows the invite link for the bot" },
  {
    name: "/raise",
    description: "Shows the times left to raise the specified dino",
  },
  {
    name: "/notifs add",
    description: "Create a new notification",
  },
  {
    name: "/notifs remove",
    description: "Remove a notification",
  },
  {
    name: "/notifs list",
    description: "List all your notifications",
  },
  { name: "/stats", description: "Displays the bot's stats" },
  {
    name: "/tekgen",
    description: "Shows the time remaining on a tek generator",
  },
  {
    name: "/watch create",
    description: "Create a new server watcher",
  },
  {
    name: "/watch remove",
    description: "Remove a watcher",
  },
];

export default function Commands() {
  // copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // commands in alphabetical order
  const sortedCommands = commands.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return (
    <Container>
      <Heading>Commands</Heading>
      <SubText>A list of all commands available for the bot.</SubText>
      <div className='-mx-4 mt-8 overflow-hidden shadow ring-1 ring-slate-50 ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
        <table className='min-w-full divide-y divide-slate-600'>
          <thead className='bg-slate-800'>
            <tr>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-50'>
                Name
              </th>
              <th
                scope='col'
                className='px-3 py-3.5 text-left text-sm font-semibold text-slate-50'>
                Description
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-600 bg-slate-800'>
            {sortedCommands.map((command) => (
              <tr key={command.name}>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300'>
                  <span
                    className='bg-gray-900 p-1 rounded-md font-mono hover:cursor-pointer'
                    onClick={() => copyToClipboard(command.name)}>
                    {command.name}
                  </span>
                </td>
                <td className=' px-3 py-4 text-sm text-slate-400 '>
                  {command.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export const meta: MetaFunction = () => ({
  title: "Commands",
  description: "List of all the commands available for Ark Server Stats",
});
