import { htmlEscape } from "../shared/html/escape.js";
import { htmlMinify } from "../shared/html/minify.js";

class HTMLResponse extends Response {
  constructor(htmlBody, init) {
    super(htmlBody, init);
    this._html = html;

    this.headers.set("content-type", "text/html; charset=UTF-8");
  }

  // NO TOUCHY
  get html() {
    return this._html;
  }
}

export const html = (template, ...insertions) =>
  new HTMLResponse(
    // htmlMinify(
    insertions.reduce((result, insertion, index) => {
      const templateFragment = template.at(index);
      insertion =
        insertion instanceof HTMLResponse
          ? insertion.html
          : htmlEscape(insertion);

      return result + templateFragment + insertion;
    }, "") + template.at(-1)
    // )
  );

export const file = (content, type) =>
  new Response(content, {
    headers: {
      "content-type": type
    }
  });

// TODO: escape insertions
export const js = (content) =>
  file(htmlMinify(content), "application/javascript");
