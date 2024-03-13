// @ts-check

import Shared from "/framework/shared/module.js";

/**
 * A utility for creating a templateable response with a specific mimetype
 * @param {string} mimetype The mimetype
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

  return (template, ...insertions) =>
    new MimetypeResponse(
      Shared.handleTemplate({
        template,
        insertions,
        handleInsertion: (insertion) =>
          insertion instanceof MimetypeResponse
            ? Shared.HTML.minify(insertion.content)
            : Shared.HTML.escape(
                Array.isArray(insertion)
                  ? insertion.join("")
                  : String(insertion)
              )
      })
    );
};

export default _Response;

export const html = _Response("text/html");
export const js = _Response("text/javascript");
export const text = _Response("text/plain");
