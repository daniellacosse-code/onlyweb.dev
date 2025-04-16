import { createTemplate, escapeHtml, minifyHtml, log } from "@onlyweb/shared";
import type { PageTemplate } from "../types.ts";

/**
 * A utility for creating a templateable response with a specific mimetype
 * @param mimetype The mimetype
 * @returns The response templater
 */
const _Response = (mimetype = "text/html"): PageTemplate => {
  class MimetypeResponse extends Response {
    constructor(body: string, init?: ResponseInit) {
      super(body, init);
      log({
        message: `[framework/backend/response] Constructed a response with mimetype "${mimetype}"`,
        detail: { body },
        level: "debug"
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

  return (template: TemplateStringsArray, ...insertions: any[]) =>
    new MimetypeResponse(
      createTemplate({
        template,
        insertions,
        handleInsertion: (insertion) => {
          if (insertion instanceof MimetypeResponse) {
            return minifyHtml(insertion.content);
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
              result.push(escapeHtml(String(subinsertion)));
            } else if (typeof subinsertion === "number") {
              result.push(subinsertion);
            }
          }

          return result.join("");
        }
      })
    );
};

/** Template literal for generating an html response. */
export const html = _Response("text/html");

/** Template literal for fenerating a javascript response. */
export const js = _Response("text/javascript");
