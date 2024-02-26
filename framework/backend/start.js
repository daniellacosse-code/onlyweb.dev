import { resolve } from "https://deno.land/std@0.216.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";

export default () =>
  Deno.serve((request) => {
    const requestURL = new URL(request.url);
    let requestPath = requestURL.pathname.startsWith("/")
      ? requestURL.pathname
      : `/${requestURL.pathname}`;

    // browsers automatically request this no matter what
    if (requestPath === "/favicon.ico")
      requestPath = "/assets/images/logo/white.png";

    for (const route of globalThis.customPages.keys()) {
      if (requestPath.startsWith(route)) {
        return globalThis.customPages.get(page).handleRequest(request);
      }
    }

    try {
      return serveFile(request, resolve(Deno.cwd(), `.${requestPath}`));
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  });
