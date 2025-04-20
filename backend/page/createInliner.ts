import { encodeBase64 } from "jsr:@std/encoding@1.0.9";
import * as path from "jsr:@std/path@1.0.8";
import { transpile } from "jsr:@deno/emit";

import { minifyHtml, log } from "@onlyweb/shared";

import * as Response from "./response.ts";
import type { PageRequest, Inliner } from "../types.ts";

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
  request: PageRequest,
  {
    messagesFolder
  }: InlinerOptions,
): Promise<Inliner> {
  const origin = request.parsedUrl.origin;

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
        message: `[framework/backend/inliner#elements] inlining elements "${elementFilePaths.join(
          ", ",
        )
          }"`,
        level: "debug",
      });

      for (const filePath of elementFilePaths) {
        let fileContents;

        fileContents = Deno.readTextFileSync(`.${filePath}`);

        log({
          message:
            `[framework/backend/inliner#elements] loaded element "${filePath}"`,
          level: "debug",
        });

        if (filePath.endsWith(".ts")) {
          fileContents = (await transpile(fileContents, {})).get(filePath);

          if (!fileContents) {
            throw new Error(
              `[framework/backend/inliner#elements] Failed to transpile element "${filePath}"`,
            );
          }
        }

        const sanitizedScript = minifyHtml(fileContents);
        result.push(Response.html`<script
          type="module"
          src="data:application/javascript;base64,${encodeBase64(
          sanitizedScript,
        )
          }"></script>`);
        log({
          message:
            `[framework/backend/inliner#elements] inlined element "${filePath}"`,
          level: "debug",
        });
      }

      log({
        message: `[framework/backend/inliner#elements] completed for "${elementFilePaths.join(
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
      canonicalUrl = request.parsedUrl.toString(),
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
  };
}
