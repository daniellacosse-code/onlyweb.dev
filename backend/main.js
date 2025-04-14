import { resolve } from "jsr:@std/path@1";
import { serveFile } from "jsr:@std/http@1/file-server";

const resolveConfiguration = (configName) =>
  Deno.env.get(configName) ?? constants[configName];

/**
 * Start the OnlyWeb framework server.
 * @param {number} [port] The port to listen on.
 * @returns {void} Nothing is returned: the server is started.
 */
export const start = (
  { port = resolveConfiguration("OWF_SERVER_PORT") } = {},
) =>
  Deno.serve({ hostname: "localhost", port }, (request) => {
    const requestURL = new URL(request.url);
    const requestPath = requestURL.pathname.startsWith("/")
      ? requestURL.pathname
      : `/${requestURL.pathname}`;

    for (const route of globalThis.customPages.keys()) {
      if (requestPath === route) {
        return globalThis.customPages.get(route)(request);
      }
    }

    try {
      return serveFile(request, resolve(Deno.cwd(), `.${requestPath}`));
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  });
