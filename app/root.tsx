import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  json,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import hero from "../images/hero.svg";
import Navbar from "./components/Navbar";

import styles from "./tailwind.css";
import { getUser } from "./utils/session.server";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Ark Server Stats",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json(user);
};

export default function App() {
  const user = useLoaderData();
  return (
    <html lang='en' className='h-full'>
      <head>
        <Meta />
        <Links />
      </head>
      <body
        className='bg-slate-900 h-full'
        style={{ backgroundImage: `url(${hero})` }}>
        <Navbar user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
