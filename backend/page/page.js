import { htmlEscape, htmlMinify, log, templateCreate } from "@onlyweb/shared";

/**
 * A page resource.
 * @namespace Page
 */

/**
 * A request for a page.
 * @typedef PageRequest
 * @memberof Page
 * @extends Request
 * @property {string} language The language of the request.
 * @property {URL} url The URL of the request.
 */

/**
 * A response to a page request.
 * @typedef PageResponse
 * @memberof Page
 * @extends Response
 * @property {string} mimetype The mimetype of the response.
 */

/**
 * A utility for creating a templateable page response with a specific mimetype.
 * @typedef {(templateArray: TemplateStringsArray, ...insertions: any[]) => PageResponse} PageTemplate
 * @memberof Page
 */

/**
 * A handler for a page request.
 * @typedef {(request: PageRequest) => Promise<PageResponse>} PageHandler
 * @memberof Page
 */

/**
 * A context-aware inliner that can inline elements, messages, and metadata into a document.
 * @typedef Inliner
 * @property {(...functionOrFilePath: Array<string | function>) => Response} elements Inlines the given custom element registrations into the HTML document.
 * @property {(message: string) => string} message Retrieves the translated message for a given key.
 * @property {(metadata: InlineHTMLMetadata) => Response} metadata Inlines the given metadata into the HTML document.
 * @property {(...frameworkBundles: Array<string>) => Promise<Response>} frameworkBundles Inlines the given framework bundles into the HTML document.
 */

/**
 * Metadata that can be inlined into an HTML document.
 * @typedef InlineHTMLMetadata
 * @property {string} [description] The description of the page.
 * @property {string} [iconImagePath] The path to the icon image of the page.
 * @property {string} [previewImagePath] The path to the preview image of the page.
 * @property {string} [splashImagePath] The path to the splash image of the page.
 * @property {string} [title] The title of the page.
 * @property {string} canonicalUrl The canonical URL of the page.
 */

/**
 * Registers a custom page in the global customPages map.
 * @param {string} route The route of the page
 * @param {object} options The options for the page
 * @param {string} [options.frameworkBranch] The branch of the framework to use
 * @param {PlatformRequirements} [options.requirements] The platform requirements for the inliner
 * @param {PageHandler} options.handleRequest The request handler for the page
 * @param {PageHandler} [options.handleServiceWorker] The service worker request handler for the page
 * @example
 *
 * ```js
 * Backend.Page.Register("/test", {
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
 * ```
 * @returns {void} Nothing is returned: the page is registered in the global customPages map
 */
export const register = (route, options) => {
  /** @type {typeof globalThis & { customPages?: Map<string, PageHandler> }} */
  const typedGlobalThis = globalThis;

  typedGlobalThis.customPages ??= new Map();

  if (route.startsWith("/framework")) {
    log({
      message:
        `[framework/backend/register] Page "${route}" cannot be registered: it is a framework route.`,
      level: "error",
    });
    return;
  }

  if (typedGlobalThis.customPages.has(route)) {
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

      log({
        message:
          `[framework/backend/register] Begun handling request @ "${route}".`,
        detail: request,
      });

      if (request.url.searchParams.has("sw")) {
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
          LogError(/** @type {Error} */ (error));
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      log({
        message:
          `[framework/backend/register] Detected page request @ "${route}".`,
        detail: request,
      });

      /** @type {PageResponse} */
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

        log({
          message:
            `[framework/backend/register] Serving HTML page @ "${route}".`,
          detail: pageResponse,
        });

        // TODO(#177) TypeError: Return value from serve handler must be a response or a promise resolving to a response
        return pageResponse;
      } catch (error) {
        LogError(/** @type {Error} */ (error));
        return new Response("Internal Server Error", { status: 500 });
      }
    },
  );

  log({
    message: `[framework/backend/register] Registered page @ "${route}".`,
  });
};

/**
 * Creates a context-aware inliner that can inline elements, messages, and metadata into an HTML document.
 * @param {PageRequest} request The request object.
 * @param {object} config The inliner configuration.
 * @param {string} config.messagesFolder The path to the messages folder.
 * @param {string} [config.frameworkBranch] The production branch to load framework bundles from.
 * @returns {Promise<Inliner>} The inliner.
 */
export async function Inliner(
  request,
  {
    messagesFolder,
    frameworkBranch = "main",
  },
) {
  const origin = request.url.origin;

  /** @type {{[messageIn: string]: string}} */
  let messages = {};

  if (messagesFolder) {
    try {
      const filePath = path.join(
        Deno.cwd(),
        messagesFolder,
        `${request.language}.json`,
      );

      log({
        message:
          `[framework/backend/inliner] Loading messages for language "${request.language}"`,
        level: "debug",
        detail: {
          filePath,
        },
      });
      const decoder = new TextDecoder("utf-8");
      const file = await Deno.readFile(filePath);
      const fileContents = decoder.decode(file);

      log({
        message:
          `[framework/backend/inliner] Loaded messages for language "${request.language}"`,
        level: "debug",
        detail: { fileContents },
      });

      messages = JSON.parse(fileContents);
      log({
        message:
          `[framework/backend/inliner] Parsed messages for language "${request.language}"`,
        level: "debug",
        detail: { messages },
      });
    } catch (error) {
      log({
        message:
          `[framework/backend/inliner] Failed to load messages for language "${request.language}"`,
        level: "warn",
        detail: { error: /** @type {Error} */ (error).message },
      });
    }
  }

  return {
    elements(...elementFunctionsOrFilePaths) {
      const result = [];
      log({
        message: `[framework/backend/inliner#elements] inlining elements "${
          elementFunctionsOrFilePaths.join(
            ", ",
          )
        }"`,
        level: "debug",
      });

      for (const functionOrFilePath of elementFunctionsOrFilePaths) {
        let fileContents;

        if (typeof functionOrFilePath === "function") {
          fileContents = `(${functionOrFilePath.toString()})();`;
        } else {
          fileContents = Deno.readTextFileSync(`.${functionOrFilePath}`);
        }

        log({
          message:
            `[framework/backend/inliner#elements] loaded element "${functionOrFilePath}"`,
          level: "debug",
        });

        const sanitizedScript = htmlMinify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);
        result.push(Response.html`<script
          type="module"
          src="data:application/javascript;base64,${
          encodeBase64(
            sanitizedScript,
          )
        }"></script>`);
        log({
          message:
            `[framework/backend/inliner#elements] inlined element "${functionOrFilePath}"`,
          level: "debug",
        });
      }

      log({
        message: `[framework/backend/inliner#elements] completed for "${
          elementFunctionsOrFilePaths.join(
            ", ",
          )
        }"`,
        level: "debug",
      });
      return Response.html`${result}`;
    },

    message(key) {
      const message = messages[key];

      if (!message) {
        log({
          message:
            `[framework/backend/inliner#message] No message found for key "${key}"`,
          detail: { language: request.language },
          level: "warn",
        });

        return key;
      }

      return message;
    },

    metadata({
      title,
      description,
      previewImagePath,
      splashImagePath,
      iconImagePath,
      canonicalUrl = request.url.toString(),
    }) {
      const tags = [
        Response.html`<link rel="canonical" href="${canonicalUrl}" />`,
        Response.html`<meta name="og:url" content="${canonicalUrl}" />`,
      ];
      log({
        message:
          `[framework/backend/inliner#metadata] constructing page metadata.`,
        detail: {
          title,
          description,
          previewImagePath,
          splashImagePath,
          iconImagePath,
          canonicalUrl,
        },
        level: "debug",
      });

      if (title) {
        log({
          message:
            `[framework/backend/inliner#metadata] using title "${title}"`,
          level: "debug",
        });

        tags.push(
          Response.html`<title>${title}</title>
            <meta name="og:title" content="${title}" />`,
        );
      }

      if (description) {
        log({
          message:
            `[framework/backend/inliner#metadata] using description "${description}"`,
          level: "debug",
        });

        tags.push(
          Response.html`<meta name="description" content="${description}" />
            <meta name="og:description" content="${description}" />`,
        );
      }

      if (iconImagePath) {
        log({
          message:
            `[framework/backend/inliner#metadata] using icon image "${iconImagePath}"`,
          level: "debug",
        });

        tags.push(
          Response.html`<link rel="icon" href="${iconImagePath}" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <link rel="apple-touch-icon" href="${iconImagePath}" />`,
          // it's a bit opinionated, but you really only have two options here - black and black-translucent
          // and only the latter allows the web app to be displayed in full screen
          Response.html`<meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />`,
        );
      }

      if (splashImagePath) {
        log({
          message:
            `[framework/backend/inliner#metadata] using splash image "${splashImagePath}"`,
          level: "debug",
        });

        tags.push(
          // TODO iterate over all possible splash images
          Response.html`<link
            rel="apple-touch-startup-image"
            href="${splashImagePath}"
          />`,
        );
      }

      if (previewImagePath) {
        log({
          message:
            `[framework/backend/inliner#metadata] using preview image "${previewImagePath}"`,
          level: "debug",
        });

        tags.push(
          Response.html`<meta name="og:image" content="${previewImagePath}" />`,
        );
      }

      log({
        message:
          `[framework/backend/inliner#metadata] page metadata constructed.`,
        level: "debug",
      });

      return Response.html`${tags}`;
    },

    async frameworkBundles(...bundleNames) {
      log({
        message:
          `[framework/backend/inliner#frameworkBundles] inlining sources "${
            bundleNames.join(
              ", ",
            )
          }"`,
        level: "debug",
      });

      const result = [];

      for (const bundleName of bundleNames) {
        const code = await (
          await fetch(
            `https://raw.githubusercontent.com/daniellacosse-code/onlyweb.dev/refs/heads/${frameworkBranch}/bundles/${
              encodeURIComponent(
                bundleName,
              )
            }.js`,
          )
        ).text();

        result.push(
          Response.html`<script
            type="module"
            src="data:application/javascript;base64,${
            encodeBase64(
              encodeURIComponent(code).replace(
                /%([0-9A-F]{2})/g,
                (_, codepoint) => String.fromCharCode(Number(`0x${codepoint}`)),
              ),
            )
          }"
          ></script>`,
        );

        log({
          message:
            `[framework/backend/inliner#frameworkBundles] inlined bundle "${code}"`,
          level: "debug",
        });
      }

      log({
        message: `[framework/backend/inliner#frameworkBundles] completed for "${
          bundleNames.join(
            ", ",
          )
        }"`,
        level: "debug",
      });

      return Response.html`${result}`;
    },
  };
}

/**
 * A utility for creating a templateable response with a specific mimetype
 * @param {string} [mimetype] The mimetype
 * @returns {PageTemplate} The response templater
 */
const _Response = (mimetype = "text/html") => {
  /**
   * @class MimetypeResponse
   */
  class MimetypeResponse extends Response {
    /**
     * @param {string} body The response body
     * @param {ResponseInit | undefined} init The response initializer
     */
    constructor(body, init = undefined) {
      super(body, init);
      log({
        message:
          `[framework/backend/response] Constructed a response with mimetype "${mimetype}"`,
        detail: { body },
        level: "debug",
      });

      this.#content = body;
      this.#mimetype = mimetype;
      this.headers.set("content-type", `${mimetype}; charset=UTF-8`);
    }

    // NO TOUCHY
    #content = "";
    get content() {
      return this.#content;
    }

    #mimetype = "";
    get mimetype() {
      return this.#mimetype;
    }
  }

  return (template, ...insertions) =>
    new MimetypeResponse(
      templateCreate({
        template,
        insertions,
        handleInsertion: (insertion) => {
          if (insertion instanceof MimetypeResponse) {
            return htmlMinify(insertion.content);
          }

          const subinsertions = Array.isArray(insertion)
            ? insertion.reverse()
            : [insertion];
          const result = [];

          while (subinsertions.length) {
            const subinsertion = subinsertions.pop();

            // handle array
            if (Array.isArray(subinsertion)) {
              subinsertions.unshift(...subinsertion);

              // handle function
            } else if (typeof subinsertion === "function") {
              result.push(subinsertion.toString());

              // handle vanilla object
            } else if (String(subinsertion) === "[object Object]") {
              result.push(JSON.stringify(subinsertion));

              // handle string, number
            } else if (typeof subinsertion === "string") {
              result.push(htmlEscape(String(subinsertion)));
            } else if (typeof subinsertion === "number") {
              result.push(subinsertion);
            }
          }

          return result.join("");
        },
      }),
    );
};

export const html = _Response("text/html");
export const js = _Response("text/javascript");
export const text = _Response("text/plain");
