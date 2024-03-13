import { resolve } from "https://deno.land/std@0.216.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";

export default () =>
  Deno.serve((request) => {
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
