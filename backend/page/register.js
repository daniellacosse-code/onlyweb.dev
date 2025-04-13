// @ts-check
import * as Shared from "../../shared/main.js";
import PageResponse from "./response.js";
import Inliner from "./inliner.js";

// TODO: move livereload to repo-agnotic code
const LIVERELOAD_PORT = 35729;

/**
 * @typedef {import("../../shared/user-agent/model.js").PlatformRequirements} PlatformRequirements
 * @typedef {import("./model.js").Inliner} Inliner
 * @typedef {import("./model.js").PageHandler} PageHandler
 * @typedef {import("./model.js").PageRequest} PageRequest
 * @typedef {import("./model.js").PageResponse} PageResponse
 */

/**
 * Registers a custom page in the global customPages map.
 * @param {string} route The route of the page
 * @param {object} options The options for the page
 * @param {string} [options.frameworkBranch] The branch of the framework to use
 * @param {PlatformRequirements} [options.requirements] The platform requirements for the inliner
 * @param {PageHandler} options.handleRequest The request handler for the page
 * @param {PageHandler} [options.handleServiceWorker] The service worker request handler for the page
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
 * handleServiceWorker: (request) => Backend.Page.Response.js`
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
export default (route, options) => {
  /** @type {typeof globalThis & { customPages?: Map<string, PageHandler> }} */
  const typedGlobalThis = globalThis;

  typedGlobalThis.customPages ??= new Map();

  if (route.startsWith("/framework")) {
    Shared.Log({
      message:
        `[framework/backend/register] Page "${route}" cannot be registered: it is a framework route.`,
      level: "error",
    });
    return;
  }

  if (typedGlobalThis.customPages.has(route)) {
    Shared.Log({
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

  typedGlobalThis.customPages.set(
    route,
    async (/** @type {PageRequest} */ request) => {
      Object.defineProperty(request, "url", {
        writable: true,
        value: new URL(request.url),
      });

      request.language = request.url.searchParams.get("lang") ??
        request.headers.get("accept-language")?.split(",")[0] ??
        "en-US";

      Shared.Log({
        message:
          `[framework/backend/register] Begun handling request @ "${route}".`,
        detail: request,
      });

      if (request.url.searchParams.has("sw")) {
        try {
          Shared.Log({
            message:
              `[framework/backend/register] Constructing service worker response @ "${route}".`,
          });
          const serviceWorker = await handleServiceWorker(request);

          if (!serviceWorker) {
            Shared.Log({
              message:
                `[framework/backend/register] No service worker found @ "${route}".`,
              level: "warn",
            });
            return new Response("Not Found", { status: 404 });
          }

          Shared.Log({
            message:
              `[framework/backend/register] Serving service worker @ "${route}".`,
            detail: serviceWorker,
          });

          return serviceWorker;
        } catch (error) {
          Shared.LogError(/** @type {Error} */ (error));
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      Shared.Log({
        message:
          `[framework/backend/register] Detected page request @ "${route}".`,
        detail: request,
      });

      /** @type {PageResponse} */
      const response = await handleRequest(request);

      if (response.mimetype !== "text/html") {
        Shared.Log({
          message: `Serving non-HTML response @ "${route}".`,
          detail: response,
        });
        return response;
      }

      try {
        Shared.Log({
          message:
            `[framework/backend/register] Constructing HTML page @ "${route}".`,
          detail: response,
        });

        const inliner = await Inliner(request, {
          messagesFolder: "",
          frameworkBranch: options.frameworkBranch,
        });
        const pageResponse = PageResponse.html`
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

        Shared.Log({
          message:
            `[framework/backend/register] Serving HTML page @ "${route}".`,
          detail: pageResponse,
        });

        // TODO(#177) TypeError: Return value from serve handler must be a response or a promise resolving to a response
        return pageResponse;
      } catch (error) {
        Shared.LogError(/** @type {Error} */ (error));
        return new Response("Internal Server Error", { status: 500 });
      }
    },
  );

  Shared.Log({
    message: `[framework/backend/register] Registered page @ "${route}".`,
  });
};
