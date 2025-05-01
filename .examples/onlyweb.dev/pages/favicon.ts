import { registerPage, unwrapRequest, wrapResponse } from "@onlyweb/backend";

import { dirname, fromFileUrl, join, resolve } from "jsr:@std/path";
import { serveFile } from "jsr:@std/http/file-server";

const convertToAbsolutePath = (projectRootPath: string) => {
  return join(
    resolve(dirname(fromFileUrl(import.meta.url)), ".."),
    projectRootPath,
  );
};

registerPage(
  "/favicon.ico",
  async (request) => {
    const response = await serveFile(
      unwrapRequest(request),
      convertToAbsolutePath("/assets/images/logo/maskable.png"),
    );

    return wrapResponse(response);
  },
);
