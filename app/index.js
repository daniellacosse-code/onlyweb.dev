// @ts-check

import * as response from "../framework/backend/response.js";

/**
 * @param {string} path
 * @returns {Promise<Uint8Array>} the file contents at the path
 *                                relative to the app/index.js file
 */
export const readRelativeFilepath = (path) =>
  Deno.readFile(new URL(path, import.meta.url));

Deno.serve(async (request) => {
  const requestURL = new URL(request.url);
  let requestPath = requestURL.pathname.startsWith("/")
    ? requestURL.pathname
    : `/${requestURL.pathname}`;

  if (requestPath.endsWith("/")) requestPath += "index.js";
  if (requestPath === "/index.js") requestPath = "/pages/index.js";

  switch (requestPath.split("/").at(1)) {
    case "favicon.ico":
      return response.file(
        await readRelativeFilepath("./assets/images/logo.png")
      );
    case "assets":
      return response.file(await readRelativeFilepath(`.${requestPath}`));
    case "elements":
      return response.js(
        new TextDecoder().decode(await readRelativeFilepath(`.${requestPath}`))
      );
    case "framework":
      return response.js(
        new TextDecoder().decode(await readRelativeFilepath(`..${requestPath}`))
      );
    case "pages":
      return (await import(`.${requestPath}`)).default(request);
    default: {
      return new Response("Not Found", { status: 404 });
    }
  }
});
