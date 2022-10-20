import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import SubText from "~/components/SubText";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import { Notification } from "~/utils/types";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUserId(request);

  const userNotifs = await db.notifs.findMany({
    where: {
      user,
    },
  });

  return json(userNotifs);
};

export default function Notifs() {
  const userNotifs = useLoaderData();

  return (
    <Container>
      <Heading>Notifications</Heading>
      <SubText>View and manage all your notifications.</SubText>
      {userNotifs.length === 0 ? (
        <div className='mt-20 text-center'>
          <h2 className='text-xl md:text-2xl text-slate-300'>
            You have no notifications.
          </h2>
          <p className='text-slate-300'>
            Go to{" "}
            <Link to='/servers' className='text-blue-500 underline'>
              servers
            </Link>{" "}
            and set one.
          </p>
        </div>
      ) : (
        <Table />
      )}
    </Container>
  );
}

const Table = () => {
  const userNotifs = useLoaderData();
  const fetcher = useFetcher();

  return (
    <div className='-mx-4 mt-8 overflow-hidden shadow ring-1 ring-slate-50 ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
      <table className='min-w-full divide-y divide-slate-600'>
        <thead className='bg-slate-800'>
          <tr>
            <th
              scope='col'
              className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-50 sm:pl-6'>
              Server
            </th>
            <th
              scope='col'
              className='hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-50 sm:table-cell'>
              Trigger
            </th>
            <th
              scope='col'
              className='hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-50 lg:table-cell'>
              Number
            </th>
            <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
              <span className='sr-only'>View</span>
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-600 bg-slate-800'>
          {userNotifs.map((notification: Notification) => (
            <tr key={notification.id}>
              <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300 sm:pl-6'>
                {notification.server}
              </td>
              <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-slate-400 sm:table-cell'>
                {notification.trigger}
              </td>
              <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-slate-400 lg:table-cell'>
                {notification.number}
              </td>
              <td className='whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-red-500'>
                <fetcher.Form action='/notifs' method='delete'>
                  <input type='hidden' name='id' value={notification.id} />
                  <button type='submit'>
                    Remove
                    <span className='sr-only'>, {notification.server}</span>
                  </button>
                </fetcher.Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  const form = await request.formData();
  const id = form.get("id");

  if (typeof id !== "string" || !id) {
    return json({ error: "Invalid notif ID" }, { status: 400 });
  }

  await db.notifs.delete({
    where: {
      id: id,
    },
  });

  return json({ status: 200 });
};

export const meta: MetaFunction = () => ({
  title: "Notifications",
  description: "View and manage all your notifications.",
  charSet: "utf-8",
});
