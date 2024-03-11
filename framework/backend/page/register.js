// @ts-check

import { html } from "./response.js";
import * as constants from "../constants.js";
import Inliner from "./inliner.js";

/**
 * Registers a custom page in the global customPages map.
 * @name register
 * @param {string} route The route of the page
 * @param {object} pageOptions The options for the page
 * @param {import("/framework/shared/user-agent/model.js").PlatformRequirements} pageOptions.requirements The platform requirements for the page
 * @param {(request: import("./model.js").PageRequest, inliner: import("./model.js").Inliner) => Response | void} pageOptions.handleRequest The request handler for the page
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
  /** @type {typeof globalThis & { customPages?: Map<string, import("./model.js").PageHandler> }} */
  const typedGlobalThis = globalThis;

  typedGlobalThis.customPages ??= new Map();

  if (typedGlobalThis.customPages.has(route))
    return console.warn(`Page "${route}" already registered.`);

  typedGlobalThis.customPages.set(
    route,
    async (/** @type import("./model.js").PageRequest */ request) => {
      Object.defineProperty(request, "url", {
        writable: true,
        value: new URL(request.url)
      });

      request.language =
        request.url.searchParams.get("lang") ??
        request.headers.get("accept-language")?.split(",")[0] ??
        "en-US";

      if (request.url.searchParams.has("service")) {
        try {
          const serviceWorker = handleServiceWorkerRequest(request);

          if (!serviceWorker) return new Response("Not Found", { status: 404 });

          return serviceWorker;
        } catch (error) {
          console.error(error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      /** @type {import("./model.js").PageResponse} */
      const response = await handleRequest(request, await Inliner(request));

      if (response.mimetype !== "text/html") return response;

      try {
        return html`
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
                      Shared.UserAgent.merge(
                        Frontend.Requirements.userAgent,
                        JSON.parse("${JSON.stringify(requirements)}").userAgent
                      )
                    )
                  )
                ) {
                  alert(
                    "Your browser is not supported. Certain things may not work as expected. Please update your browser to the latest version."
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

                // check browser requirements
                if (
                  !(
                    navigator.userAgent &&
                    Shared.UserAgent.check(
                      Shared.UserAgent.parse(navigator.userAgent),
                      Shared.UserAgent.merge(
                        Frontend.requirements.userAgent,
                        JSON.parse("${JSON.stringify(requirements)}").userAgent
                      )
                    )
                  )
                ) {
                  alert(
                    "Your browser is not supported. Certain things may not work as expected. Please update your browser to the latest version."
                  );
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
      } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
  );

  console.debug(`Registered page @ route "${route}".`);
};
