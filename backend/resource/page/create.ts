import type { PlatformRequirements } from "@onlyweb/shared";
import { html } from "../response/template.ts";
import { resolveEnvironment } from "../../environment/resolve.ts";
import type { OWFRequest } from "../request/types.ts";
import type { OWFResponse } from "../response/types.ts";

// TODO: move livereload to repo-agnotic code
const LIVERELOAD_PORT = 35729;

export const createPage = (
  route: string,
  request: OWFRequest,
  response: OWFResponse,
  requirements: PlatformRequirements,
) => {
  const browserRequirementCheck = html`
    <script type="module">
      import { systemRequirements } from "@onlyweb/frontend";
      import { checkAgent, parseAgent, mergeRequirements } from "@onlyweb/shared";

      if (
        checkAgent(
          parseAgent(navigator?.userAgent),
          mergeRequirements(${requirements}, systemRequirements)
        )
      ) {
        alert(
          "Your browser is not currently supported: certain things may not work as expected. Please consider updating your browser to the latest version."
        );
      }
    </script>`;

  const livereload = html`
    <script type="module">
      import { log } from "@onlyweb/shared";

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
          log({ message: "LiveReload failed to connect." });
        }
      }
    </script>`;

  const serviceWorker = html`
    <script type="module">
      import { log } from "@onlyweb/shared";

      if ("serviceWorker" in navigator) {
        try {
          navigator.serviceWorker.register("${route}?sw", {
            scope: "${route}"
          });
        } catch (error) {
          // nevermind
          log({ message: "Service worker failed to register." });
        }
      }
    </script>
  `;

  const cdnUrl = resolveEnvironment("OWF_SOURCE_CDN");

  return html`
    <!DOCTYPE html>
    <html lang="${request.language}">
      <script type="importmap">
        {
          "imports": {
            "@onlyweb/frontend": "${cdnUrl}/@onlyweb/frontend",
            "@onlyweb/shared": "${cdnUrl}/@onlyweb/shared"
          }
        }
      </script>
      ${browserRequirementCheck}
      ${livereload}
      ${serviceWorker}

      ${response}
    </html>
  `;
};
