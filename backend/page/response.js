// @ts-check
import * as Shared from "../../shared/main.js";

/**
 * A utility for creating a templateable response with a specific mimetype
 * @param {string} [mimetype] The mimetype
 * @returns {import("./model.js").PageTemplate} The response templater
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
      Shared.Log({
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
      Shared.handleTemplate({
        template,
        insertions,
        handleInsertion: (insertion) => {
          if (insertion instanceof MimetypeResponse) {
            return Shared.HTML.minify(insertion.content);
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
              result.push(Shared.HTML.escape(String(subinsertion)));
            } else if (typeof subinsertion === "number") {
              result.push(subinsertion);
            }
          }

          return result.join("");
        },
      }),
    );
};

_Response.html = _Response("text/html");
_Response.js = _Response("text/javascript");
_Response.text = _Response("text/plain");

export default _Response;
