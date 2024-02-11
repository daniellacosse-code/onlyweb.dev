import { escape } from "../shared/html/escape.js";
import { handleTemplate } from "../shared/handle-template.js";

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

function goodEnoughHTMLminifier(text) {
  return (
    text
      // remove single-line comments
      .replaceAll(/\/\/.*/g, "")
      // replace runs of whitespace with one space. Assumes:
      // => proper semi-colons
      // => all content-based whitespace is outsourced
      .replaceAll(/\s+/g, " ")
  );
}

export const html = (template, ...insertions) =>
  new HTMLResponse(
    handleTemplate({
      template,
      insertions,
      handleInsertion: (insertion) =>
        insertion instanceof HTMLResponse
          ? goodEnoughHTMLminifier(insertion.html)
          : escape(insertion)
    })
  );
