import { resolve } from "https://deno.land/std@0.216.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";

import Backend from "/framework/backend/module.js";

Backend.Page.Register("/favicon.ico", {
  handleRequest: (request) => {
    return serveFile(
      request,
      resolve(Deno.cwd(), "./app/assets/images/logo/maskable.png")
    );
  }
});
