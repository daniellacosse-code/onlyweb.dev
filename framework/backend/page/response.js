import escape from "/framework/shared/html/escape.js";
import minify from "/framework/shared/html/minify.js";
import handleTemplate from "/framework/shared/handle-template.js";

const _Response = (mimetype = "text/html") => {
  class MimetypeResponse extends Response {
    constructor(body, init) {
      super(body, init);
      this.#content = body;
      this.headers.set("content-type", `${mimetype}; charset=UTF-8`);
    }

    // NO TOUCHY
    #content = "";
    get html() {
      return this.#content;
    }
  }

  return (template, ...insertions) =>
    new MimetypeResponse(
      handleTemplate({
        template,
        insertions,
        handleInsertion: (insertion) =>
          insertion instanceof MimetypeResponse
            ? minify(insertion.html)
            : escape(insertion)
      })
    );
};

export const html = _Response("text/html");
export const js = _Response("text/javascript");

export default _Response;
