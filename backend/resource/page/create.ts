import type { PlatformRequirements } from "@onlyweb/shared";
import { html } from "../response/template.ts";
import { resolveEnvironment } from "../../environment/resolve.ts";
import type { OWFRequest } from "../request/types.ts";
import type { OWFResponse } from "../response/types.ts";

/**
 * Constructs a complete HTML page response by wrapping the provided content
 * with standard HTML structure, an import map, browser compatibility checks,
 * LiveReload script (for development), and service worker registration script.
 *
 * @param {string} route - The base route for the page, used for service worker registration scope.
 * @param {OWFRequest} request - The incoming request object, used to determine language and CDN URL.
 * @param {OWFResponse} response - The core content response (expected to be HTML) to be embedded in the page.
 * @param {PlatformRequirements} requirements - Specific browser/renderer requirements for this page, merged with framework defaults.
 * @returns {OWFResponse} An OWFResponse containing the full HTML document string.
 *
 * @example
 * ```js
 * // Assuming 'pageContent' is an OWFResponse with HTML content
 * const fullPage = createPage("/my-page", request, pageContent, { engine: { Chrome: 90 } });
 * // fullPage now contains the complete HTML structure including checks, scripts, and pageContent.
 * ```
 */
export const createPage = (
  route: string,
  request: OWFRequest,
  response: OWFResponse,
  requirements: PlatformRequirements,
): OWFResponse => {
  /**
   * @internal
   * Generates an inline script to check if the user's browser meets the combined
   * requirements of the page and the OnlyWeb framework. Shows an alert if not met.
   */
  const browserRequirementCheck = html`
    <script type="module">
      import { userAgent } from "@onlyweb/frontend";
      import { checkAgent, parseAgent, mergeRequirements, log } from "@onlyweb/shared";

      // Merge page-specific requirements with framework defaults
      const mergedRequirements = mergeRequirements(${requirements}, userAgent);
      const parsedAgent = parseAgent(navigator.userAgent);

      log({
        message: "Required browser version",
        detail: mergedRequirements
      });

      log({
        message: "Current browser version",
        detail: parsedAgent
      });

      // Perform the check and alert if necessary
      if (!checkAgent(parsedAgent, mergedRequirements)) {
        alert(
          "Your browser is not currently supported: certain things may not work as expected. Please consider updating your browser to the latest version."
        );
      }
    </script>`;

  /**
   * @internal
   * Generates an inline script for LiveReload using Server-Sent Events.
   * Connects to an SSE endpoint and reloads the page upon receiving a 'reload' event.
   */
  const watchServer = html`
    <script type="module">
      import { log } from "@onlyweb/shared";

      const watchSource = new EventSource("http://${resolveEnvironment('OWF_WATCH_HOST')}:${resolveEnvironment('OWF_WATCH_PORT')}");

      watchSource.addEventListener("reload", () => {
        watchSource.close();
        globalThis.location.reload();
      });
    </script>`;

  /**
   * @internal
   * Generates an inline script that reloads the page when the language changes.
   */
  const languageReload = html`
    <script type="module">
      globalThis.addEventListener("languagechanged", globalThis.location.reload);
    </script>`;

  /**
   * @internal
   * Generates an inline script to register a service worker for the current route
   * if the browser supports service workers.
   */
  const serviceWorker = html`
    <script type="module">
      import { log } from "@onlyweb/shared";

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("${route}?sw", {
            scope: "${route}" // Register SW for this specific route
          })
          .then(registration => {
            log({ message: "Service worker registered successfully.", detail: { scope: registration.scope }, level: "info" });
          })
          .catch(error => {
            log({ message: "Service worker failed to register.", detail: error, level: "error" });
          });
      } else {
        log({ message: "Service workers are not supported in this browser.", level: "warn" });
      }
    </script>
  `;

  // Resolve the CDN URL from environment variables or defaults
  const cdnUrl = resolveEnvironment("OWF_SOURCE_CDN");

  // Construct the final HTML page using the html template tag
  return html(response.nativeResponse.status)`
    <!DOCTYPE html>
    <html lang="${request.language}">
      <!-- Import map to resolve framework modules from CDN -->
      <script type="importmap">
        {
          "imports": {
            "@onlyweb/frontend": "${cdnUrl}/@onlyweb/frontend",
            "@onlyweb/shared": "${cdnUrl}/@onlyweb/shared"
          }
        }
      </script>
      <!-- Inject helper scripts -->
      ${browserRequirementCheck}
      ${resolveEnvironment("OWF_WATCH").toLowerCase() === 'true' ? watchServer : ""}
      ${languageReload}
      ${serviceWorker}
      <!-- Embed the main page content -->
      ${response}
    </html>
  `;
};
