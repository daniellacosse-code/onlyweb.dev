// @ts-check

import { resolve } from "https://deno.land/std@0.216.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";

import "./pages/index.js";

/**
 * @param {string} path
 * @returns {Promise<Uint8Array>} the file contents at the path
 *                                relative to the app/index.js file
 */
export const readRootFilepath = (path) =>
  Deno.readFile(resolve(Deno.cwd(), path));

Deno.serve(async (request) => {
  const requestURL = new URL(request.url);
  let requestPath = requestURL.pathname.startsWith("/")
    ? requestURL.pathname
    : `/${requestURL.pathname}`;

  if (requestPath.endsWith("/")) requestPath += "index.js";
  if (requestPath === "/index.js") requestPath = "/pages/index.js";

  switch (requestPath.split("/").at(1)) {
    case "favicon.ico":
      return serveFile(
        request,
        resolve(Deno.cwd(), "./assets/images/logo.png")
      );
    case "app":
    case "framework":
      return serveFile(request, resolve(Deno.cwd(), `.${requestPath}`));
    case "pages":
      return (await import(`.${requestPath}`)).default(request);
    default: {
      return new Response("Not Found", { status: 404 });
    }
  }
});
