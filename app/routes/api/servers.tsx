import { json, LoaderFunction } from "@remix-run/node";
import Fuse from "fuse.js";
import { Server } from "~/utils/types";

const options = {
  includeScore: true,
  keys: ["Name"],
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const userInput = url.searchParams.get("server-query") || "";
  const res = await fetch(process.env.ARK_WEB_API);
  const servers = await res.json();
  const filteredClusters = servers.filter(
    (server: Server) => server.ClusterId === "NewXboxPVP"
  );

  const fuse = new Fuse(filteredClusters, options);

  const result = fuse.search(userInput, { limit: 10 });

  return json(result);
};
