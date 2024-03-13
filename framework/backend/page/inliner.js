// @ts-check

import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import { html } from "/framework/backend/page/response.js";
import Shared from "/framework/shared/module.js";

/**
 * @typedef {import("./model.js").PageRequest} PageRequest
 * @typedef {import("./model.js").Inliner} Inliner
 */

/**
 * Creates a context-aware inliner that can inline elements, messages, and metadata into an HTML document.
 * @param {PageRequest} request The request object.
 * @returns {Promise<Inliner>} The inliner.
 */
export default async function Inliner(request) {
  const origin = request.url.origin;

  /** @type {{[messageIn: string]: string}} */
  let messages;

  try {
    messages = await (
      await fetch(`${origin}/app/assets/messages/${request.language}.json`)
    ).json();
  } catch (_) {
    messages = {};
  }

  return {
    elements(...filePaths) {
      const result = [];

      for (const filePath of filePaths) {
        const fileContents = Deno.readTextFileSync(`.${filePath}`);
        const sanitizedScript = Shared.HTML.minify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);

        result.push(html`<script
          async
          type="module"
          src="data:application/javascript;base64,${encode(sanitizedScript)}"
        ></script>`);
      }

      return html`${result}`;
    },

    message(key) {
      return messages[key] ?? key;
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
        html`<link rel="canonical" href="${canonicalUrl}" />`,
        html`<meta name="og:url" content="${canonicalUrl}" />`
      ];

      if (title) {
        tags.push(
          html`<title>${title}</title>
            <meta name="og:title" content="${title}" />`
        );
      }

      if (description) {
        tags.push(
          html`<meta name="description" content="${description}" />
            <meta name="og:description" content="${description}" />`
        );
      }

      if (iconImagePath) {
        tags.push(
          html`<link rel="icon" href="${iconImagePath}" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <link rel="apple-touch-icon" href="${iconImagePath}" />`,

          // it's a bit opinionated, but you really only have two options here - black and black-translucent
          // and only the latter allows the web app to be displayed in full screen
          html`<meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />`
        );
      }

      if (splashImagePath) {
        tags.push(
          // TODO iterate over all possible splash images
          html`<link
            rel="apple-touch-startup-image"
            href="${splashImagePath}"
          />`
        );
      }

      if (previewImagePath) {
        tags.push(html`<meta name="og:image" content="${previewImagePath}" />`);
      }

      return html`${tags}`;
    }
  };
}
