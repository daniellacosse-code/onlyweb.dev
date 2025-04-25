import { registerPage, unwrapRequest, wrapResponse } from "@onlyweb/backend";

import { resolve } from "jsr:@std/path";
import { serveFile } from "jsr:@std/http/file-server";

registerPage(
  "/favicon.ico",
  async (request) => {
    const response = await serveFile(
      unwrapRequest(request),
      resolve(Deno.cwd(), "./assets/images/logo/maskable.png"),
    );

    return wrapResponse(response);
  },
);
