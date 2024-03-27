// @ts-check

import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import Response from "/framework/backend/page/response.js";
import Shared from "/framework/shared/module.js";

/**
 * @typedef {import("./model.js").PageRequest} PageRequest
 * @typedef {import("./model.js").Inliner} Inliner
 */

/**
 * Creates a context-aware inliner that can inline elements, messages, and metadata into an HTML document.
 * @param {PageRequest} request The request object.
 * @param {string} [messagesFolder] The path to the messages folder.
 * @returns {Promise<Inliner>} The inliner.
 */
export default async function Inliner(request, messagesFolder) {
  const origin = request.url.origin;

  /** @type {{[messageIn: string]: string}} */
  let messages;

  try {
    Shared.Log({
      message: `[framework/backend/inliner] Fetching messages for language "${request.language}"`,
      level: "debug",
      detail: { url: `${origin}${messagesFolder}/${request.language}.json` }
    });
    messages = await (
      await fetch(`${origin}${messagesFolder}/${request.language}.json`)
    ).json();
    Shared.Log({
      message: `[framework/backend/inliner] Fetched messages for language "${request.language}"`,
      level: "debug"
    });
  } catch (error) {
    Shared.Log({
      message: `[framework/backend/inliner] Failed to fetch messages for language "${request.language}"`,
      level: "debug",
      detail: { error }
    });
    messages = {};
  }

  return {
    elements(...filePaths) {
      const result = [];
      Shared.Log({
        message: `[framework/backend/inliner#elements] inlining elements "${filePaths.join(
          ", "
        )}"`,
        level: "debug"
      });

      for (const filePath of filePaths) {
        const fileContents = Deno.readTextFileSync(`.${filePath}`);
        Shared.Log({
          message: `[framework/backend/inliner#elements] loaded element "${filePath}"`,
          level: "debug"
        });

        const sanitizedScript = Shared.HTML.minify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);
        result.push(Response.html`<script
          async
          type="module"
          src="data:application/javascript;base64,${encode(sanitizedScript)}"
        ></script>`);
        Shared.Log({
          message: `[framework/backend/inliner#elements] inlined element "${filePath}"`,
          level: "debug"
        });
      }

      Shared.Log({
        message: `[framework/backend/inliner#elements] completed for "${filePaths.join(
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
    }
  };
}
