import fs from "fs";
import { PLUGIN_DEV_MODE } from "$lib/variables.js";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
  if (!PLUGIN_DEV_MODE) {
    return;
  }

  const { pluginId, fileName } = params;

  const data = fs.readFileSync(`plugins/${pluginId}/${fileName}`, {
    encoding: "utf8",
    flag: "r",
  });

  return new Response(data, {
    headers: { "content-type": "application/javascript" },
  });
}
