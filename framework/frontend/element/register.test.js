import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";
import register from "/framework/frontend/element/register.js";

globalThis.customElements = {
  define(tag, element) {
    globalThis.customElements[tag] = element;
  },
  get(tag) {
    return globalThis.customElements[tag];
  }
};

globalThis.HTMLElement = class HTMLElement {};

Deno.test("register", async () => {
  await register("my-element", {});

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);
});
