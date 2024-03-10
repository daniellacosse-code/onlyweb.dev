// @ts-check

import escape from "/framework/shared/html/escape.js";
import minify from "/framework/shared/html/minify.js";
import handleTemplate from "/framework/shared/handle-template.js";

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
      handleTemplate({
        template,
        insertions,
        handleInsertion: (insertion) =>
          insertion instanceof MimetypeResponse
            ? minify(insertion.content)
            : escape(Array.isArray(insertion) ? insertion.join("") : insertion)
      })
    );
};

export default _Response;

export const html = _Response("text/html");
export const js = _Response("text/javascript");
export const text = _Response("text/plain");
