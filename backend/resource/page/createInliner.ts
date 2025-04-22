import { encodeBase64 } from "jsr:@std/encoding@1.0.9";
import * as path from "jsr:@std/path@1.0.8";
import { transpile } from "jsr:@deno/emit@0.46.0";

import { log, minifyHtml } from "@onlyweb/shared";

import { html } from "../response/template.ts";
import type { OWFResponse } from "../response/types.ts";
import type { OWFRequest } from "../request/types.ts";

/**
 * A context-aware inliner that can inline elements, messages, and metadata into a document.
 */
export interface Inliner {
  /** Inlines the given custom element registrations into the HTML document. */
  elements: (...filePath: Array<string>) => Promise<OWFResponse>;
  /** Retrieves the translated message for a given key. */
  message: (message: string) => string;
  /** Inlines the given metadata into the HTML document. */
  metadata: (metadata: InlineHTMLMetadata) => OWFResponse;
}

/**
 * Metadata that can be inlined into an HTML document.
 */
export interface InlineHTMLMetadata {
  /** The description of the page. */
  description?: string;
  /** The path to the icon image of the page. */
  iconImagePath?: string;
  /** The path to the preview image of the page. */
  previewImagePath?: string;
  /** The path to the splash image of the page. */
  splashImagePath?: string;
  /** The title of the page. */
  title?: string;
  /** The canonical URL of the page. */
  canonicalUrl?: string;
}

/**
 * The inliner configuration.
 */
export type InlinerOptions = {
  /**
   * The path to the messages folder
   */
  messagesFolder?: string;
};

/**
 * Creates a context-aware inliner that can inline elements, messages, and metadata into an HTML document.
 * @param request The request object.
 * @param options The inliner configuration options.
 * @returns The inliner.
 */
export async function createInliner(
  request: OWFRequest,
  {
    messagesFolder,
  }: InlinerOptions,
): Promise<Inliner> {
  let messages: { [messageIn: string]: string } = {};

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
        detail: { error: (error as Error).message },
      });
    }
  }

  return {
    async elements(...elementFilePaths) {
      const result = [];
      log({
        message: `[framework/backend/inliner#elements] inlining elements "${
          elementFilePaths.join(
            ", ",
          )
        }"`,
        level: "debug",
      });

      for (const filePath of elementFilePaths) {
        const rootFileUrl = "file://" + path.join(Deno.cwd(), filePath);

        let fileContents;

        if (filePath.endsWith(".ts")) {
          fileContents = (await transpile(rootFileUrl, {
            importMap: {
              imports: {
                "@onlyweb/frontend":
                  "https://esm.sh/jsr/@onlyweb/frontend@0.0.0-alpha.15",
                "@onlyweb/shared":
                  "https://esm.sh/jsr/@onlyweb/shared@0.0.0-alpha.12",
              },
            },
            compilerOptions: {
              sourceMap: false,
              inlineSourceMap: false,
            },
          })).get(rootFileUrl);

          if (!fileContents) {
            throw new Error(
              `[framework/backend/inliner#elements] Failed to transpile element file "${filePath}"`,
            );
          }
        } else {
          fileContents = await Deno.readTextFile(`.${filePath}`);
        }

        log({
          message:
            `[framework/backend/inliner#elements] loaded element file "${filePath}"`,
          level: "debug",
        });

        result.push(html`<script
          type="module"
          src="data:application/javascript;base64,${
          encodeBase64(
            minifyHtml(fileContents),
          )
        }"></script>`);
        log({
          message:
            `[framework/backend/inliner#elements] inlined element "${filePath}"`,
          level: "debug",
        });
      }

      log({
        message: `[framework/backend/inliner#elements] completed for "${
          elementFilePaths.join(
            ", ",
          )
        }"`,
        level: "debug",
      });

      return html`${result}`;
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
        html`<link rel="canonical" href="${canonicalUrl}" />`,
        html`<meta name="og:url" content="${canonicalUrl}" />`,
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
          html`<title>${title}</title>
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
          html`<meta name="description" content="${description}" />
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
          html`<link rel="icon" href="${iconImagePath}" />
            <meta name="mobile-web-app-capable" content="yes" />
            <link rel="apple-touch-icon" href="${iconImagePath}" />`,
          // it's a bit opinionated, but you really only have two options here - black and black-translucent
          // and only the latter allows the web app to be displayed in full screen
          html`<meta
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
          html`<link
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
          html`<meta name="og:image" content="${previewImagePath}" />`,
        );
      }

      log({
        message:
          `[framework/backend/inliner#metadata] page metadata constructed.`,
        level: "debug",
      });

      return html`${tags}`;
    },
  };
}
