import Backend from "../../../backend/main.js";

import { resolve } from "https://deno.land/std@0.216.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";

Backend.Page.Register("/favicon.ico", (request) =>
  serveFile(
    request,
    resolve(Deno.cwd(), "./assets/images/logo/maskable.png"),
  ));
