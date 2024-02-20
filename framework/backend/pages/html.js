import { escape } from "/framework/shared/html/escape.js";
import { minify } from "/framework/shared/html/minify.js";
import { handleTemplate } from "/framework/shared/handle-template.js";

class HTMLResponse extends Response {
  static CACHE_MAXAGE = 3600;

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
