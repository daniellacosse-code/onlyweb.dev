import { registerPage } from "@onlyweb/backend";

import { resolve } from "jsr:@std/path";
import { serveFile } from "jsr:@std/http/file-server";

registerPage("/favicon.ico", (request) =>
  serveFile(
    request,
    resolve(Deno.cwd(), "./assets/images/logo/maskable.png"),
  ));
