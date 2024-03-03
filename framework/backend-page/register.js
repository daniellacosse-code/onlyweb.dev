import { html } from "./response.js";
import * as constants from "/framework/constants.js";

export default (
  route,
  { handleRequest = () => {}, handleServiceWorkerRequest = () => {} }
) => {
  globalThis.customPages ??= new Map();

  if (globalThis.customPages.has(route))
    return console.warn(`Page "${route}" already registered.`);

  globalThis.customPages.set(route, async (request) => {
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

    try {
      return html`
        <!DOCTYPE html>
        <html lang="${request.language}">
          ${await handleRequest(request)}
          <script type="module">
            import checkRequirements from "/framework/shared/user-agent/check-requirements.js";
            import frontendRequirements from "/framework/frontend/requirements.js";
            import parseUserAgent from "/framework/shared/user-agent/parse.js";

            (function () {
              // check browser requirements
              if (
                !(
                  navigator.userAgent &&
                  checkRequirements(
                    parseUserAgent(navigator.userAgent),
                    frontendRequirements.userAgent
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

              // register service worker
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("${route}?service", {
                  scope: "${route}"
                });
              }

              // TODO: load translations, if any
            })();
          </script>
        </html>
      `;
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  });

  console.debug(`Registered page @ route "${route}".`);
};
