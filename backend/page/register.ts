// @ts-check
import { log, logError, type PlatformRequirements } from "@onlyweb/shared";
import { html } from "./response.ts";
import { Inliner } from "./inliner.ts";
import type { PageHandler, PageRequest, PageResponse } from "../types.ts";

// TODO: move livereload to repo-agnotic code
const LIVERELOAD_PORT = 35729;

/**
 * The options for page registration.
 */
export type RegisterPageOptions = {
  /**
   * The branch of the framework to use.
   */
  frameworkBranch?: string;

  /**
   * The platform requirements for the inliner.
   */
  requirements?: PlatformRequirements;

  /**
   * The request handler for the page.
   */
  handleRequest: PageHandler;

  /**
   * The service worker request handler for the page
   */
  handleServiceWorker?: PageHandler;
};



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
export const registerPage = (route: string, options: RegisterPageOptions ): void => {
  (globalThis as any).customPages ??= new Map();

  if (route.startsWith("/framework")) {
    log({
      message:
        `[framework/backend/register] Page "${route}" cannot be registered: it is a framework route.`,
      level: "error",
    });
    return;
  }

  if ((globalThis as any).customPages.has(route)) {
    log({
      message:
        `[framework/backend/register] Page "${route}" already registered.`,
      level: "warn",
    });
  }

  if (typeof options === "function") {
    options = {
      handleRequest: options,
    };
  }

  const {
    requirements = {},
    handleRequest,
    handleServiceWorker = () => {},
  } = options;

  (globalThis as any).customPages.set(
    route,
    async (request: PageRequest): Promise<Response | PageResponse> => {
      Object.defineProperty(request, "url", {
        writable: true,
        value: new URL(request.parsedUrl),
      });

      request.language = request.parsedUrl.searchParams.get("lang") ??
        request.headers.get("accept-language")?.split(",")[0] ??
        "en-US";

      log({
        message:
          `[framework/backend/register] Begun handling request @ "${route}".`,
        detail: request,
      });

      if (request.parsedUrl.searchParams.has("sw")) {
        try {
          log({
            message:
              `[framework/backend/register] Constructing service worker response @ "${route}".`,
          });
          const serviceWorker = await handleServiceWorker(request);

          if (!serviceWorker) {
            log({
              message:
                `[framework/backend/register] No service worker found @ "${route}".`,
              level: "warn",
            });
            return new Response("Not Found", { status: 404 });
          }

          log({
            message:
              `[framework/backend/register] Serving service worker @ "${route}".`,
            detail: serviceWorker,
          });

          return serviceWorker;
        } catch (error) {
          logError(error as Error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      log({
        message:
          `[framework/backend/register] Detected page request @ "${route}".`,
        detail: request,
      });

      const response: PageResponse = await handleRequest(request) as PageResponse;

      if (response.mimetype !== "text/html") {
        log({
          message: `Serving non-HTML response @ "${route}".`,
          detail: response,
        });
        return response;
      }

      try {
        log({
          message:
            `[framework/backend/register] Constructing HTML page @ "${route}".`,
          detail: response,
        });

        const inliner = await Inliner(request, {
          messagesFolder: "",
          frameworkBranch: options.frameworkBranch,
        });
        const pageResponse = html`
          <!DOCTYPE html>
          <html lang="${request.language}">
            ${await inliner.frameworkBundles("$Shared", "$Frontend")}
            ${response}
            <script type="module">
              (function () {
                // check browser requirements
                if (
                  !(
                    navigator.userAgent &&
                    $Shared.UserAgent.check(
                      $Shared.UserAgent.parse(navigator.userAgent),
                      $Shared.UserAgent.merge(
                        ${requirements},
                        $Frontend.requirements.userAgent
                      )                        
                    )
                  )
                ) {
                  alert(
                    "Your browser is not currently supported: certain things may not work as expected. Please consider updating your browser to the latest version."
                  );
                }

                // launch devtools
                if (globalThis.location.href.match(/localhost/)) {
                  try {
                    const reloadSocket = new WebSocket(
                      "ws://localhost:${LIVERELOAD_PORT}"
                    );

                    reloadSocket.onopen = () =>
                      console.log("LiveReload connected~");
                    reloadSocket.onmessage = ({ data }) =>
                      data === "reload" && location.reload();
                  } catch (error) {
                    // nevermind
                    console.log("LiveReload failed to connect.");
                  }
                }

                // register service worker
                if ("serviceWorker" in navigator) {
                  try {
                    navigator.serviceWorker.register("${route}?sw", {
                      scope: "${route}"
                    });
                  } catch (error) {
                    // nevermind
                    console.log("Service worker failed to register.");
                  }
                }
              })();
            </script>
          </html>
        `;

        log({
          message:
            `[framework/backend/register] Serving HTML page @ "${route}".`,
          detail: pageResponse,
        });

        // TODO(#177) TypeError: Return value from serve handler must be a response or a promise resolving to a response
        return pageResponse;
      } catch (error) {
        logError(error as Error);
        return new Response("Internal Server Error", { status: 500 });
      }
    },
  );

  log({
    message: `[framework/backend/register] Registered page @ "${route}".`,
  });
};