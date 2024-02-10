import { escape } from "../../shared/html/escape.js";

class HTMLResponse extends Response {
  constructor(htmlBody, init) {
    super(htmlBody, init);
    this._html = htmlBody;
    this.headers.set("content-type", "text/html; charset=UTF-8");
  }

  // NO TOUCHY
  get html() {
    return this._html;
  }
}

// TODO: "good enough" minifier
export const html = (template, ...insertions) =>
  new HTMLResponse(
    insertions.reduce((result, insertion, index) => {
      const templateFragment = template.at(index);

      insertion =
        insertion instanceof HTMLResponse ? insertion.html : escape(insertion);

      return result + templateFragment + insertion;
    }, "") + template.at(-1)
  );