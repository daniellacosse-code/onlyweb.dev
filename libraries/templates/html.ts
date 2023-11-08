import escape from "/libraries/transformers/escape.ts";

class HTMLResponse extends Response {
  private readonly _html: string;

  constructor(htmlBody: string, init?: ResponseInit) {
    super(htmlBody, init);
    this._html = htmlBody
    this.headers.set("content-type", "text/html; charset=UTF-8");
  }

  // NO TOUCHY
  get html() {
    return this._html;
  }
}

export default (template: TemplateStringsArray, ...insertions: (HTMLResponse | string | number)[]) =>
  new HTMLResponse(
    insertions.reduce<string>((result, insertion, index) => {
      const templateFragment = template.at(index);

      insertion = insertion instanceof HTMLResponse
        ? insertion.html
        : escape(insertion);

      return result + templateFragment + insertion;
    }, "") + template.at(-1)
  );
