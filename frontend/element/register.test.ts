/// <reference lib="deno.ns" />
/// <reference lib="dom" />

import { assertEquals } from "jsr:@std/assert";
import { registerElement } from "./register.ts";

Deno.test("registerElement", async () => {
  await registerElement("my-element", { render: () => new HTMLCollection() });

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);
  assertEquals(
    globalThis.customElements.get("my-element") instanceof HTMLElement,
    true,
  );
});

Deno.test("registerElement with function", async () => {
  await registerElement("my-element", () => new HTMLCollection());

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);
  assertEquals(
    globalThis.customElements.get("my-element") instanceof HTMLElement,
    true,
  );
});

Deno.test("registerElement#addEventListener", async () => {
  await registerElement("my-element", { render: () => new HTMLCollection() });

  const element = globalThis.customElements.get("my-element");

  if (element) {
    const instance = new element();
    assertEquals(
      instance.addEventListener("click", () => {}),
      undefined,
    );
  } else {
    throw new Error("Element not found");
  }
});
