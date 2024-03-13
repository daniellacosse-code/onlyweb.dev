// @ts-check

import { html } from "./response.js";
import * as constants from "../constants.js";
import Inliner from "./inliner.js";
import Shared from "/framework/shared/module.js";

/**
 * @typedef {import("/framework/shared/user-agent/model.js").PlatformRequirements} PlatformRequirements
 * @typedef {import("./model.js").PageRequest} PageRequest
 * @typedef {import("./model.js").Inliner} Inliner
 * @typedef {import("./model.js").PageResponse} PageResponse
 * @typedef {import("./model.js").PageHandler} PageHandler
 */

/**
 * Registers a custom page in the global customPages map.
 * @name register
 * @param {string} route The route of the page
 * @param {object} pageOptions The options for the page
 * @param {PlatformRequirements} pageOptions.requirements The platform requirements for the page
 * @param {(request: PageRequest, inliner: Inliner) => Response | void} pageOptions.handleRequest The request handler for the page
 * @param {(request: Request) => Response | void} pageOptions.handleServiceWorkerRequest The service worker request handler for the page
 * @example Backend.Page.Register("/test", {
 *  requirements: {
 *    engine: { Chrome: 91 },
 *    renderer: { Blink: 91 }
 *  },
 *  handleRequest: (request) => Backend.Page.Response.html`<!DOCTYPE html>
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
 * handleServiceWorkerRequest: (request) => Backend.Page.Response.js`
 *  self.addEventListener("install", (event) => {
 *    event.waitUntil(
 *      caches.open("test").then((cache) => {
 *        return cache.addAll(["/test"]);
 *      })
 *    );
 *  });`
 * });
 * @returns {void} Nothing is returned: the page is registered in the global customPages map
 */
export default (
  route,
  {
    requirements = { renderer: {}, engine: {} },
    handleRequest = () => {},
    handleServiceWorkerRequest = () => {}
  }
) => {
  /** @type {typeof globalThis & { customPages?: Map<string, PageHandler> }} */
  const typedGlobalThis = globalThis;

  typedGlobalThis.customPages ??= new Map();

  if (typedGlobalThis.customPages.has(route))
    Shared.Log({
      message: `[framework/backend/register] Page "${route}" already registered.`,
      level: "warn"
    });

  typedGlobalThis.customPages.set(
    route,
    async (/** @type {PageRequest} */ request) => {
      Object.defineProperty(request, "url", {
        writable: true,
        value: new URL(request.url)
      });

      request.language =
        request.url.searchParams.get("lang") ??
        request.headers.get("accept-language")?.split(",")[0] ??
        "en-US";

      Shared.Log({
        message: `[framework/backend/register] Begun handling request @ "${route}".`,
        detail: request
      });

      if (request.url.searchParams.has("service")) {
        try {
          Shared.Log({
            message: `[framework/backend/register] Constructing service worker response @ "${route}".`
          });
          const serviceWorkerResponse = await handleServiceWorkerRequest(
            request
          );

          if (!serviceWorkerResponse) {
            Shared.Log({
              message: `[framework/backend/register] No service worker found @ "${route}".`,
              level: "warn"
            });
            return new Response("Not Found", { status: 404 });
          }

          Shared.Log({
            message: `[framework/backend/register] Serving service worker @ "${route}".`,
            detail: serviceWorkerResponse
          });

          return serviceWorkerResponse;
        } catch (error) {
          Shared.LogError(error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      Shared.Log({
        message: `[framework/backend/register] Detected page request @ "${route}".`,
        detail: request
      });

      /** @type {PageResponse} */
      const response = await handleRequest(request, await Inliner(request));

      if (response.mimetype !== "text/html") {
        Shared.Log({
          message: `Serving non-HTML response @ "${route}".`,
          detail: response
        });
        return response;
      }

      try {
        Shared.Log({
          message: `[framework/backend/register] Constructing HTML page @ "${route}".`,
          detail: response
        });

        const pageResponse = html`
          <!DOCTYPE html>
          <html lang="${request.language}">
            ${response}
            <script type="module">
              import Frontend from "/framework/frontend/module.js";
              import Shared from "/framework/shared/module.js";

              (function () {
                // check browser requirements
                if (
                  !(
                    navigator.userAgent &&
                    Shared.UserAgent.check(
                      Shared.UserAgent.parse(navigator.userAgent),
                      // TODO(#170): support inlining objects so that we can merge in page-specific requirements
                      Frontend.requirements.userAgent
                    )
                  )
                ) {
                  alert(
                    "Your browser is not currently supported: certain things may not work as expected. Please consider updating your browser to the latest version."
                  );
                }

                // launch devtools
                if (globalThis.location.href.match(/localhost/)) {
                  const reloadSocket = new WebSocket(
                    "ws://localhost:${constants.DENO_LIVERELOAD_PORT}"
                  );

                  reloadSocket.onopen = () =>
                    console.log("LiveReload connected~");
                  reloadSocket.onmessage = ({ data }) =>
                    data === "reload" && location.reload();
                }

                // register service worker
                if ("serviceWorker" in navigator) {
                  try {
                    navigator.serviceWorker.register("${route}?service", {
                      scope: "${route}"
                    });
                  } catch (error) {
                    // nevermind
                  }
                }
              })();
            </script>
          </html>
        `;

        Shared.Log({
          message: `[framework/backend/register] Serving HTML page @ "${route}".`,
          detail: pageResponse
        });

        // TODO(#177) TypeError: Return value from serve handler must be a response or a promise resolving to a response
        return pageResponse;
      } catch (error) {
        Shared.LogError(error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
  );

  Shared.Log({
    message: `[framework/backend/register] Registered page @ "${route}".`
  });
};
