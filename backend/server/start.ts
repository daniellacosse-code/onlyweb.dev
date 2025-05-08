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
  /**
   * The hostname or IP address for the main application server to listen on.
   * Defaults to the value of the `OWF_APPLICATION_HOST` environment variable, or `"::1"` if not set.
   */
  host?: string;
  /**
   * The port number for the main application server to listen on.
   * Defaults to the value of the `OWF_APPLICATION_PORT` environment variable, or `3210` if not set.
   */
  port?: number;
  /** Optional configuration for the development watch server. */
  watch?: {
    /** The hostname or IP address for the development watch server to listen on. Defaults to `OWF_WATCH_HOST` or `"127.0.0.1"`. */
    host?: string;
    /** The port number for the development watch server. Defaults to `OWF_WATCH_PORT` or `43210`. */
    port: number;
  };
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
    watch,
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

  if (watch || resolveEnvironment("OWF_WATCH")) {
    Deno.serve({
      hostname: watch?.host ?? resolveEnvironment("OWF_WATCH_HOST"),
      port: watch?.port ?? Number(resolveEnvironment("OWF_WATCH_PORT")),
    }, (request: Request) =>
      new Response(
        new ReadableStream(),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Access-Control-Allow-Origin":
              new URL(request.headers.get("Origin") ?? "").origin,
          },
        },
      ));
  }
};
