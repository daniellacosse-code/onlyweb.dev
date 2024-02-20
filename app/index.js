// @ts-check

// NOTE: deno deploy only uploads the files that are imported in the app/index.js file
import "./pages/index.js";

import { resolve } from "https://deno.land/std@0.216.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";

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
    case "framework": {
      const response = await serveFile(
        request,
        resolve(Deno.cwd(), `.${requestPath}`)
      );

      response.headers.set("service-worker-allowed", "/");

      return response;
    }
    case "pages":
      return (await import(`.${requestPath}`)).default(request);
    default: {
      return new Response("Not Found", { status: 404 });
    }
  }
});
