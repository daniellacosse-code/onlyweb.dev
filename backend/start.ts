import { resolve } from "jsr:@std/path@1";
import { serveFile } from "jsr:@std/http@1/file-server";
import { ONLY_WEB_SERVER_PORT } from "./constants.ts";
import type { PageRequest } from "./types.ts";

export type StartOptions = {
  /** The port to listen on. */
  port?: number;
}

/**
 * Start the OnlyWeb framework server.
 * @param options The framework server configuration options.
 * @returns Nothing is returned: the server is started.
 */
export const start = (
  { 
    port = Number(Deno.env.get("ONLY_WEB_SERVER_PORT") ?? ONLY_WEB_SERVER_PORT) 
  }: StartOptions = {}
): void => {
  Deno.serve(
    { port, hostname: "localhost" },
    (request: Request): Promise<Response> => {
      const requestURL = new URL(request.url);
      const requestPath = requestURL.pathname.startsWith("/")
        ? requestURL.pathname
        : `/${requestURL.pathname}`;

      for (const route of (globalThis as any).customPages.keys()) {
        if (requestPath === route) {
          const page = (globalThis as any).customPages.get(route);

          if (page) {
            return page(request as PageRequest);
          }
        }
      }

      try {
        return serveFile(request, resolve(Deno.cwd(), `.${requestPath}`));
      } catch {
        return Promise.resolve(new Response("Not Found", { status: 404 }));
      }
    }
  );
}