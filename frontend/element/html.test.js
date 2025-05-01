import { assertEquals } from "jsr:@std/assert";
import { html } from "./html.ts";

globalThis.document = {
  createElement() {
    return new globalThis.HTMLElement();
  },
};

globalThis.HTMLElement = class HTMLElement {
  constructor() {
    this.outerHTML = "";
    this.children = this;
  }

  set innerHTML(innerHTML) {
    this.outerHTML = innerHTML;
  }
};

globalThis.HTMLCollection = [];

Deno.test("html", () => {
  assertEquals(html`<p>test</p>`.outerHTML, "<p>test</p>");
});
