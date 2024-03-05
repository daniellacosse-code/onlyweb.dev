import escape from "/framework/shared/html/escape.js";
import minify from "/framework/shared/html/minify.js";
import handleTemplate from "/framework/shared/handle-template.js";

const _Response = (mimetype = "text/html") => {
  class MimetypeResponse extends Response {
    constructor(body, init) {
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
            : escape(insertion)
      })
    );
};

export const html = _Response("text/html");
export const js = _Response("text/javascript");
export const text = _Response("text/plain");

export default _Response;
