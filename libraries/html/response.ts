export default class HTMLResponse extends Response {
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
