// @ts-check

import { bundle } from "https://deno.land/x/emit@0.40.0/mod.ts";
import { encodeBase64 } from "https://deno.land/std@v0.224.0/encoding/base64.ts";
import * as path from "https://deno.land/std@0.221.0/path/mod.ts";

import Response from "./response.js";
import Shared from "../../shared/bundle.js";

/**
 * @typedef {import("./model.js").PageRequest} PageRequest
 * @typedef {import("./model.js").Inliner} Inliner
 */

/**
 * Creates a context-aware inliner that can inline elements, messages, and metadata into an HTML document.
 * @param {PageRequest} request The request object.
 * @param {object} config The inliner configuration.
 * @param {string} config.messagesFolder The path to the messages folder.
 * @param {string} [config.frameworkBranch] The production branch to load framework bundles from.
 * @returns {Promise<Inliner>} The inliner.
 */
export default async function Inliner(
  request,
  { 
    messagesFolder,
    frameworkBranch = "main"
  }
) {
  const origin = request.url.origin;

  /** @type {{[messageIn: string]: string}} */
  let messages = {};

  if (messagesFolder) {
    try {
      const filePath = path.join(
        Deno.cwd(),
        messagesFolder,
        `${request.language}.json`
      );

      Shared.Log({
        message: `[framework/backend/inliner] Loading messages for language "${request.language}"`,
        level: "debug",
        detail: {
          filePath
        }
      });
      const decoder = new TextDecoder("utf-8");
      const file = await Deno.readFile(filePath);
      const fileContents = decoder.decode(file);

      Shared.Log({
        message: `[framework/backend/inliner] Loaded messages for language "${request.language}"`,
        level: "debug",
        detail: { fileContents }
      });

      messages = JSON.parse(fileContents);
      Shared.Log({
        message: `[framework/backend/inliner] Parsed messages for language "${request.language}"`,
        level: "debug",
        detail: { messages }
      });
    } catch (error) {
      Shared.Log({
        message: `[framework/backend/inliner] Failed to load messages for language "${request.language}"`,
        level: "warn",
        detail: { error: /** @type {Error} */ (error).message }
      });
    }
  }

  return {
    elements(...elementFunctionsOrFilePaths) {
      const result = [];
      Shared.Log({
        message: `[framework/backend/inliner#elements] inlining elements "${elementFunctionsOrFilePaths.join(
          ", "
        )}"`,
        level: "debug"
      });

      for (const functionOrFilePath of elementFunctionsOrFilePaths) {
        let fileContents;

        if (typeof functionOrFilePath === "function") {
          fileContents = `(${functionOrFilePath.toString()})();`;
        } else {
          fileContents = Deno.readTextFileSync(`.${functionOrFilePath}`);
        }

        Shared.Log({
          message: `[framework/backend/inliner#elements] loaded element "${functionOrFilePath}"`,
          level: "debug"
        });

        const sanitizedScript = Shared.HTML.minify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);
        result.push(Response.html`<script
          type="module"
          src="data:application/javascript;base64,${encodeBase64(
            sanitizedScript
          )}"></script>`);
        Shared.Log({
          message: `[framework/backend/inliner#elements] inlined element "${functionOrFilePath}"`,
          level: "debug"
        });
      }

      Shared.Log({
        message: `[framework/backend/inliner#elements] completed for "${elementFunctionsOrFilePaths.join(
          ", "
        )}"`,
        level: "debug"
      });
      return Response.html`${result}`;
    },

    message(key) {
      const message = messages[key];

      if (!message) {
        Shared.Log({
          message: `[framework/backend/inliner#message] No message found for key "${key}"`,
          detail: { language: request.language },
          level: "warn"
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
      canonicalUrl = request.url.toString()
    }) {
      const tags = [
        Response.html`<link rel="canonical" href="${canonicalUrl}" />`,
        Response.html`<meta name="og:url" content="${canonicalUrl}" />`
      ];
      Shared.Log({
        message: `[framework/backend/inliner#metadata] constructing page metadata.`,
        detail: {
          title,
          description,
          previewImagePath,
          splashImagePath,
          iconImagePath,
          canonicalUrl
        },
        level: "debug"
      });

      if (title) {
        Shared.Log({
          message: `[framework/backend/inliner#metadata] using title "${title}"`,
          level: "debug"
        });

        tags.push(
          Response.html`<title>${title}</title>
            <meta name="og:title" content="${title}" />`
        );
      }

      if (description) {
        Shared.Log({
          message: `[framework/backend/inliner#metadata] using description "${description}"`,
          level: "debug"
        });

        tags.push(
          Response.html`<meta name="description" content="${description}" />
            <meta name="og:description" content="${description}" />`
        );
      }

      if (iconImagePath) {
        Shared.Log({
          message: `[framework/backend/inliner#metadata] using icon image "${iconImagePath}"`,
          level: "debug"
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
          />`
        );
      }

      if (splashImagePath) {
        Shared.Log({
          message: `[framework/backend/inliner#metadata] using splash image "${splashImagePath}"`,
          level: "debug"
        });

        tags.push(
          // TODO iterate over all possible splash images
          Response.html`<link
            rel="apple-touch-startup-image"
            href="${splashImagePath}"
          />`
        );
      }

      if (previewImagePath) {
        Shared.Log({
          message: `[framework/backend/inliner#metadata] using preview image "${previewImagePath}"`,
          level: "debug"
        });

        tags.push(
          Response.html`<meta name="og:image" content="${previewImagePath}" />`
        );
      }

      Shared.Log({
        message: `[framework/backend/inliner#metadata] page metadata constructed.`,
        level: "debug"
      });

      return Response.html`${tags}`;
    },

    async frameworkBundles(...bundleNames) {
      Shared.Log({
        message: `[framework/backend/inliner#frameworkBundles] inlining sources "${bundleNames.join(
          ", "
        )}"`,
        level: "debug"
      });

      const result = [];

      for (const bundleName of bundleNames) {
        let code;
        try {
          code = $Shared.HTML.minify(
            (
              await bundle(
                path.join(
                  Deno.cwd(),
                  `framework/${bundleName
                    .slice(1)
                    .toLocaleLowerCase()}/bundle.js`
                )
              )
            ).code
          );
        } catch (e) {
          code = await (
            await fetch(
              `https://raw.githubusercontent.com/daniellacosse-code/onlyweb.dev/refs/heads/${frameworkBranch}/bundles/${encodeURIComponent(
                bundleName
              )}.js`
            )
          ).text();
        }

        result.push(
          Response.html`<script
            type="module"
            src="data:application/javascript;base64,${encodeBase64(
              encodeURIComponent(code).replace(
                /%([0-9A-F]{2})/g,
                (_, codepoint) => String.fromCharCode(Number(`0x${codepoint}`))
              )
            )}"
          ></script>`
        );

        Shared.Log({
          message: `[framework/backend/inliner#frameworkBundles] inlined bundle "${code}"`,
          level: "debug"
        });
      }

      Shared.Log({
        message: `[framework/backend/inliner#frameworkBundles] completed for "${bundleNames.join(
          ", "
        )}"`,
        level: "debug"
      });

      return Response.html`${result}`;
    }
  };
}
