// @ts-check
import { log, logError, type PlatformRequirements } from "@onlyweb/shared";
import { createPage } from "./create.ts";
import { resourceRegistry } from "../registry.ts";
import { text } from "../response/template.ts";
import type { OWFResource } from "../types.ts";

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
  render: OWFResource;

  /**
   * The service worker request handler for the page
   */
  renderServiceWorker?: OWFResource;
};

export type RegisterPageOptions =
  | RegisterPageConfiguration
  | OWFResource;

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
 *  render: (request) => Response.html`<!DOCTYPE html>
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
 * renderServiceWorker: (request) => Response.js`
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

  const pageResource: OWFResource = async (request) => {
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
            message: `[backend/register] No service worker found @ "${route}".`,
            level: "warn",
          });

          return text(404)`Not Found`;
        }

        log({
          message: `[backend/register] Serving service worker @ "${route}".`,
          detail: serviceWorker,
        });

        return serviceWorker;
      } catch (error) {
        logError(error as Error);

        return text(500)`Internal Server Error`;
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

      return text(500)`Internal Server Error`;
    }
  };

  resourceRegistry.register(route, pageResource);

  log({
    message: `[backend/register] Registered page @ "${route}".`,
  });
};
