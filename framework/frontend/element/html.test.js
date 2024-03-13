import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";
import html from "/framework/frontend/element/html.js";

globalThis.document = {
  createElement() {
    return new globalThis.HTMLElement();
  }
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

Deno.test("register", () => {
  assertEquals(html`<p>test</p>`.outerHTML, "<p>test</p>");
});
