
import { escape } from "../shared/html/escape.js";
import { minify } from "../shared/html/minify.js";
import { handleTemplate } from "../shared/handle-template.js";

class HTMLResponse extends Response {
  constructor(htmlBody, init) {
    super(htmlBody, init);
    this.#html = htmlBody;
    this.headers.set("content-type", "text/html; charset=UTF-8");
  }

  // NO TOUCHY
  #html = "";
  get html() {
    return this.#html;
  }
}

export const html = (template, ...insertions) =>
  new HTMLResponse(
    handleTemplate({
      template,
      insertions,
      handleInsertion: (insertion) =>
        insertion instanceof HTMLResponse
          ? minify(insertion.html)
          : escape(insertion)
    })
  );
