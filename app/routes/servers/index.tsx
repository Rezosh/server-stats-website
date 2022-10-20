import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import { FuseResult, Server } from "~/utils/types";
import Fuse from "fuse.js";

export const loader: LoaderFunction = async ({ request }) => {
  const servers = await fetch(process.env.ARK_WEB_API);
  const serversJson = await servers.json();
  let filteredServers = serversJson.filter((server: Server) => {
    return server.ClusterId === "NewXboxPVP";
  });

  const url = new URL(request.url);
  const params = url.searchParams.get("page");
  const userInput = url.searchParams.get("server-query");

  if (userInput) {
    const fuse = new Fuse(filteredServers, {
      keys: ["Name"],
    });
    // search for the user input and keep highest score
    filteredServers = fuse.search(userInput);
    // remove item key from fuse search results
    filteredServers = filteredServers.map((server: FuseResult) => server.item);
  }

  // pagination
  const page = params ? parseInt(params) : 1;
  const perPage = 12;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const paginatedServers = filteredServers.slice(start, end);
  const pages = Math.ceil(filteredServers.length / perPage);

  return json({ servers: paginatedServers, pages });
};

export default function Servers() {
  const { servers, pages } = useLoaderData();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams, { replace: true });
  }, [page]);

  const handleClick = () => {
    setPage(page + 1);
  };

  const handlePreviousClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // disable next button if on last page of pages
  const isNextDisabled = page === pages;
  const isPreviousDisabled = page === 1;

  return (
    <Container>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <Heading>Servers</Heading>
          <p className='mt-2 text-sm text-slate-300'>
            A list of all ark servers including their status, players, and more.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <Form method='get' action='/servers?index'>
            <input
              type='text'
              autoComplete='off'
              name='server-query'
              placeholder='Search for a server...'
              className='bg-slate-800 rounded-md py-2  px-4 w-full h-10 text-slate-300'
            />
          </Form>
        </div>
      </div>
      <div className='-mx-4 mt-8 overflow-hidden shadow ring-1 ring-slate-50 ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
        <table className='min-w-full divide-y divide-slate-600'>
          <thead className='bg-slate-800'>
            <tr>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-50 sm:pl-6'>
                Name
              </th>
              <th
                scope='col'
                className='px-3 py-3.5 text-left text-sm font-semibold text-slate-50'>
                Players
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-50 lg:table-cell'>
                Map
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-50 sm:table-cell'>
                Cluster
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                <span className='sr-only'>View</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-600 bg-slate-800'>
            {servers.map((server: Server) => (
              <tr key={server.SearchHandle}>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300 sm:pl-6'>
                  {server.Name}
                </td>
                <td className='whitespace-nowrap px-3 py-4 text-sm text-slate-300'>
                  {server.NumPlayers}/{server.MaxPlayers}
                </td>
                <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-slate-300 lg:table-cell'>
                  {server.MapName}
                </td>
                <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-slate-300 sm:table-cell'>
                  {server.ClusterId}
                </td>
                <td className='whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                  <Link
                    to={server.SearchHandle}
                    className='text-blue-500 hover:text-blue-300'>
                    View<span className='sr-only'>, {server.Name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex items-center justify-center space-x-3 '>
        <button
          className='bg-blue-700 text-blue-50 hover:bg-blue-500 px-8 py-2 rounded-md self-end mt-4 disabled:opacity-50'
          onClick={handlePreviousClick}
          disabled={isPreviousDisabled}>
          Previous
        </button>
        <button
          className='bg-blue-700 text-blue-50 hover:bg-blue-500 px-8 py-2 rounded-md self-end mt-4 disabled:opacity-50'
          onClick={handleClick}
          disabled={isNextDisabled}>
          Next
        </button>
      </div>
    </Container>
  );
}

export const meta = {
  title: "Servers",
};
