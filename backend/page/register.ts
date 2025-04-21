// @ts-check
import { log, logError, type PlatformRequirements } from "@onlyweb/shared";
import type { OWFRequest } from "../request.ts";
import { makeOWFResponse, type OWFResponse } from "../response.ts";
import { createPage } from "./page.ts";

/**
 * The configuration for page registration.
 */
export type RegisterPageConfiguration = {
  /**
   * The platform requirements for the inliner.
   */
  requirements?: PlatformRequirements;

  /**
   * The request handler for the page.
   */
  render: (request: OWFRequest) => Promise<OWFResponse>;

  /**
   * The service worker request handler for the page
   */
  renderServiceWorker?: (request: OWFRequest) => Promise<OWFResponse>;
};

export type RegisterPageOptions =
  | RegisterPageConfiguration
  | ((request: OWFRequest) => Promise<OWFResponse>);

/**
 * Registers a custom page in the global customPages map.
 * @param route The route of the page
 * @param options The options for the page
 * @example
 *
 * ```js
 * registerPage("/test", {
 *  requirements: {
 *    engine: { Chrome: 91 },
 *    renderer: { Blink: 91 }
 *  },
 *  handleRequest: (request) => Response.html`<!DOCTYPE html>
 *      <html lang="${request.language}">
 *        <head>
 *          <meta charset="UTF-8">
 *          <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *          <title>Test</title>
 *        </head>
 *        <body>
 *          <h1>Hello, world!</h1>
 *        </body>
 *     </html>`,
 * handleServiceWorker: (request) => Response.js`
 *  self.addEventListener("install", (event) => {
 *    event.waitUntil(
 *      caches.open("test").then((cache) => {
 *        return cache.addAll(["/test"]);
 *      })
 *    );
 *  });`
 * });
 * ```
 * @returns Nothing is returned: the page is registered in the global customPages map
 */
export const registerPage = (
  route: string,
  options: RegisterPageOptions,
): void => {
  (globalThis as any).customPages ??= new Map();

  if ((globalThis as any).customPages.has(route)) {
    log({
      message: `[backend/register] Page "${route}" already registered.`,
      level: "warn",
    });
  }

  if (typeof options === "function") {
    options = {
      render: options,
    };
  }

  const {
    requirements = {},
    render: handleRequest,
    renderServiceWorker: handleServiceWorker = () => {},
  } = options;

  (globalThis as any).customPages.set(
    route,
    async (request: OWFRequest): Promise<OWFResponse> => {
      request.language = request.url.searchParams.get("lang") ??
        request.nativeRequest.headers.get("accept-language")?.split(",")[0] ??
        "en-US";

      log({
        message: `[backend/register] Begun handling request @ "${route}".`,
        detail: request,
      });

      if (request.url.searchParams.has("sw")) {
        try {
          log({
            message:
              `[backend/register] Constructing service worker response @ "${route}".`,
          });
          const serviceWorker = await handleServiceWorker(request);

          if (!serviceWorker) {
            log({
              message:
                `[backend/register] No service worker found @ "${route}".`,
              level: "warn",
            });

            return makeOWFResponse(new Response("Not Found", { status: 404 }));
          }

          log({
            message: `[backend/register] Serving service worker @ "${route}".`,
            detail: serviceWorker,
          });

          return serviceWorker;
        } catch (error) {
          logError(error as Error);

          return makeOWFResponse(
            new Response("Internal Server Error", { status: 500 }),
          );
        }
      }

      log({
        message: `[backend/register] Detected page request @ "${route}".`,
        detail: request,
      });

      const response = await handleRequest(request);

      if (response.mimetype !== "text/html") {
        log({
          message: `Serving non-HTML response @ "${route}".`,
          detail: response,
        });
        return response;
      }

      try {
        log({
          message: `[backend/register] Constructing HTML page @ "${route}".`,
          detail: response,
        });

        const pageResponse = createPage(
          route,
          request,
          response,
          requirements,
        );

        log({
          message: `[backend/register] Serving HTML page @ "${route}".`,
          detail: pageResponse,
        });

        return pageResponse;
      } catch (error) {
        logError(error as Error);

        return makeOWFResponse(
          new Response("Internal Server Error", { status: 500 }),
        );
      }
    },
  );

  log({
    message: `[backend/register] Registered page @ "${route}".`,
  });
};
