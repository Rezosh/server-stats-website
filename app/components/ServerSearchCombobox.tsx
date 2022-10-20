import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { FuseResult } from "~/utils/types";

export default function ServerSearchCombobox() {
  const [selectedServer, setSelectedServer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedServer) {
      // navigate to the server page
      navigate(`/servers/${selectedServer}`);
    }
  }, [selectedServer]);

  const servers = useFetcher();

  return (
    <div className='relative rounded-md shadow-sm mt-12'>
      <servers.Form method='get' action='/api/servers'>
        <Combobox value={selectedServer} onChange={setSelectedServer}>
          <div>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <MagnifyingGlassIcon
                className='h-5 w-5 text-slate-300'
                aria-hidden='true'
              />
            </div>
            <Combobox.Input
              name='server-query'
              onChange={(event) => servers.submit(event.target.form)}
              autoComplete='off'
              className='bg-slate-800 rounded-md py-2 pl-10 px-4 w-full h-10 text-slate-300'
            />
          </div>
          <Combobox.Options
            className={
              "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base text-slate-300  focus:outline-none sm:text-sm"
            }>
            {servers?.data ? (
              servers.data.length === 0 ? (
                <div className='relative cursor-default select-none py-2 px-4'>
                  Nothing found.
                </div>
              ) : (
                servers.data.map((server: FuseResult) => (
                  <Link to={`/servers/${server.item.SearchHandle}`}>
                    <Combobox.Option
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-slate-700 text-white" : "text-slate-300"
                        }`
                      }
                      key={server.item.SearchHandle}
                      value={server.item.SearchHandle}>
                      {server.item.Name}
                    </Combobox.Option>
                  </Link>
                ))
              )
            ) : null}
          </Combobox.Options>
        </Combobox>
      </servers.Form>
    </div>
  );
}
