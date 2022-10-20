import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import invariant from "tiny-invariant";
import ErrorAlert from "~/components/Alert/Error";
import SuccessAlert from "~/components/Alert/Success";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import { getUserId } from "~/utils/session.server";
import { db } from "../../utils/db.server";
import { ArkMapNames, Server } from "../../utils/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ServerInfoStat = {
  title: string;
  data: string | number;
};

export const loader: LoaderFunction = async ({ params }) => {
  // Validate params to ensure we get a string
  invariant(params.serverId, "Expected server Id");

  // Fetch and filter servers to return the one we need
  const res = await fetch(process.env.ARK_WEB_API);
  const servers = await res.json();
  const server = servers.filter(
    (s: Server) => s.SearchHandle === params.serverId
  );

  // If we don't have a server, return a 404
  if (!server.length) {
    return json({ error: "Server not found" }, { status: 404 });
  }

  // Get graph data from database
  const data = await db.playerHistory.findUnique({
    where: {
      name: server[0].Name,
    },
  });
  const playerCount = [];
  const times = [];

  for (const cursor of data?.player_history!) {
    playerCount.push(cursor.players);
    const humanizedTime = moment(cursor.cached_at).fromNow();
    times.push(humanizedTime);
  }

  const chartData = {
    labels: times.slice(-99),
    datasets: [
      {
        label: "Players",
        data: playerCount.slice(-99),
        pointBackgroundColor: "#60a5fa",
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        fill: false,
      },
    ],
  };

  const serverStats = [
    {
      title: "Players",
      data: `${server[0].NumPlayers}/${server[0].MaxPlayers}`,
    },
    {
      title: "Map",
      data: ArkMapNames[server[0].MapName as keyof object],
    },
    {
      title: "Days",
      data: server[0].DayTime,
    },
  ];

  return { chartData, filteredServer: server, times, serverStats };
};

export default function ServerId() {
  const { filteredServer } = useLoaderData();
  const navigate = useNavigate();
  return (
    <Container>
      <div className='flex justify-start'>
        <button className='flex-1 mr-4 md:mr-0' onClick={() => navigate(-1)}>
          <span>
            <ArrowLeftIcon className='h-7 w-7 text-slate-50' />
          </span>
        </button>
        <div className='flex-auto flex items-center'>
          <div
            className='bg-green-400 h-3 w-3 rounded-full mr-4 hidden md:block'
            aria-hidden>
            <div className='bg-green-500 h-3 w-3 rounded-full animate-ping'></div>
          </div>
          <Heading>{filteredServer[0].Name}</Heading>
        </div>
      </div>
      <div className='grid sm:grid-rows-2 grid-cols-3 gap-3 mt-4 w-full'>
        <ServerStatistics />
        <PopulationGraph />
        <NotificationForm />
      </div>
    </Container>
  );
}

function ServerStatistics() {
  const { serverStats } = useLoaderData();
  return (
    <dl className='grid grid-cols-1 gap-3 sm:grid-cols-3 col-span-3 sm:row-span-2 row-span-1'>
      {serverStats.map((stat: ServerInfoStat) => (
        <div
          key={stat.title}
          className='overflow-hidden rounded-lg bg-slate-800/75 px-4 py-5 sm:p-6'>
          <dt className='truncate text-sm font-medium text-slate-500'>
            {stat.title}
          </dt>
          <dd className='mt-1 text-3xl font-semibold tracking-tight text-slate-300'>
            {stat.data}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function PopulationGraph() {
  const { chartData, times } = useLoaderData();

  const chartOptions = {
    tension: 0.1,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: "#1e293b",
        },
      },
      x: {
        grid: {
          color: "#1e293b",
        },
      },
    },
  };

  return (
    <div className='col-span-3 row-span-1 md:row-span-2 bg-slate-800/75 tracking-tight rounded-lg px-4 py-5 sm:p-6'>
      <div className='mb-5'>
        <h2 className='text-slate-300 text-lg'>Server Population History</h2>
      </div>
      <Line data={chartData} options={chartOptions} height={100} />
      <p className='text-slate-500 text-sm'>Last updated: {times.slice(-1)}</p>
    </div>
  );
}

function NotificationForm() {
  const fetcher = useFetcher();
  const { filteredServer } = useLoaderData();
  const serverName = filteredServer[0].Name;
  const params = useParams();
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className='bg-slate-800/75 tracking-tight rounded-lg px-4 py-5 sm:p-6 col-span-3'>
      <h2 className='text-slate-300 text-lg '>Add a Notification</h2>
      <p className='text-slate-500 text-sm'>
        Get notified when the server triggers a condition you set.
      </p>
      <div className='mt-2'>
        {fetcher.type === "done" ? (
          fetcher.data.ok ? (
            <SuccessAlert>{fetcher.data.message}</SuccessAlert>
          ) : fetcher.data.error ? (
            <ErrorAlert>{fetcher.data.error}</ErrorAlert>
          ) : null
        ) : null}
      </div>
      <fetcher.Form
        method='post'
        action={`/servers/${params.serverId}`}
        ref={ref}
        onSubmit={(event) => {
          const form = event.currentTarget;
          requestAnimationFrame(() => {
            form.reset();
          });
        }}>
        <div className='flex flex-col'>
          <NotificationFormDropdown />
          <input
            type='text'
            name='server'
            value={serverName}
            className='hidden'
            readOnly
          />
          <input
            type='number'
            name='player-numbers'
            placeholder='Number of Players'
            min='0'
            max='70'
            className='mt-2 bg-slate-900 text-slate-300  w-full rounded-lg py-2 pl-3 pr-10 text-left'
          />
          <button
            type='submit'
            disabled={fetcher.state === "submitting"}
            className='bg-blue-700 text-blue-50 hover:bg-blue-500 px-8 py-2 rounded-md self-end mt-4 disabled:opacity-50'>
            Save
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}

function NotificationFormDropdown() {
  const notifOption = [
    {
      name: "Above",
      value: "above",
    },
    {
      name: "Below",
      value: "below",
    },
  ];
  const [selectedValue, setSelectedValue] = useState(notifOption[0]);
  return (
    <Listbox value={selectedValue} onChange={setSelectedValue} name='trigger'>
      <Listbox.Button className='relative mt-4 bg-slate-900 text-slate-300  w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left'>
        {selectedValue.name}
        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 '>
          <ChevronDownIcon
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <Listbox.Options className='absolute bg-slate-900 text-slate-300  mt-1 max-h-60 max-w-5xl w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {notifOption.map((option) => (
            <Listbox.Option
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? "bg-slate-700" : "bg-slate-900 "
                }`
              }
              value={option}>
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}>
                    {option.name}
                  </span>
                  {selected ? (
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500'>
                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const form = await request.formData();
  const trigger = form.get("trigger[value]");
  const number = form.get("player-numbers");
  const server = form.get("server");

  // validate strings
  if (
    typeof trigger !== "string" ||
    typeof number !== "string" ||
    typeof server !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  // check if user is logged in, if not return 401
  if (!userId) {
    return json(
      { error: "You must be logged in to preform this action." },
      { status: 401 }
    );
  }

  // create a new notification
  await db.notifs.create({
    data: {
      user: userId,
      server: server,
      trigger: trigger,
      number: parseInt(number),
    },
  });

  return json({
    message: `Notification for ${server} has been successfully set.`,
    ok: true,
  });
};

export function ErrorBoundary({ error }: { error: Error }) {
  // send email to dev
  useEffect(() => {
    fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: "Error on the website",
        message: error.message,
      }),
    });
  }, [error]);
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
