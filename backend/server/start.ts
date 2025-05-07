import { join } from "jsr:@std/path@1";
import { resolveEnvironment } from "../environment/resolve.ts";
import { resourceRegistry } from "../resource/registry.ts";
import { serveFile } from "jsr:@std/http@1/file-server";
import { text } from "../resource/response/template.ts";
import { unwrapResponse } from "../resource/response/wrap.ts";
import { wrapRequest } from "../resource/request/wrap.ts";

/**
 * The options for starting the OnlyWeb framework server.
 */
export type StartOptions = {
  host?: string;
  /** The port to listen on. */
  port?: number;
  watch?: {
    host?: string;
    port: number;
  }
};

/**
 * Start the OnlyWeb framework server.
 * @param options The framework server configuration options.
 * @returns Nothing is returned: the server is started.
 */
export const start = (
  {
    host: hostname = resolveEnvironment("OWF_APPLICATION_HOST"),
    port = Number(resolveEnvironment("OWF_APPLICATION_PORT")),
    watch
  }: StartOptions = {},
): void => {
  Deno.serve(
    { port, hostname },
    async (request: Request): Promise<Response> => {
      const requestURL = new URL(request.url);
      const requestPath = requestURL.pathname.startsWith("/")
        ? requestURL.pathname
        : `/${requestURL.pathname}`;

      const resource = resourceRegistry.get(requestPath);

      if (resource) {
        const response = await resource(wrapRequest(request));

        return Promise.resolve(unwrapResponse(response));
      }

      try {
        return serveFile(
          request,
          join(Deno.cwd(), resolveEnvironment("OWF_ROOT_DIR"), requestPath),
        );
      } catch {
        return Promise.resolve(unwrapResponse(text(404)`Not Found`));
      }
    },
  );

  if (!watch && !Boolean(resolveEnvironment("OWF_WATCH"))) {
    return;
  }

  Deno.serve({
    hostname: watch?.host ?? resolveEnvironment("OWF_WATCH_HOST"),
    port: watch?.port ?? Number(resolveEnvironment("OWF_WATCH_PORT"))
  },  (request) => {
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("event: reload\ndata: reload\n\n"));
        }
      })
    )
  });
};
