import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";
import { register } from "./register.ts";

globalThis.customElements = {
  define(tag, element) {
    globalThis.customElements[tag] = element;
  },
  get(tag) {
    return globalThis.customElements[tag];
  },
};

globalThis.HTMLElement = class HTMLElement {
  attachShadow() {
    return {};
  }

  addEventListener() {}
};

globalThis.document = {
  createElement() {
    return new globalThis.HTMLElement();
  },
};

Deno.test("register", async () => {
  await register("my-element", { handleBuild: () => {} });

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);
  assertEquals(
    new globalThis.customElements["my-element"]() instanceof HTMLElement,
    true,
  );
});

Deno.test("function register", async () => {
  await register("my-element", () => {});

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);
  assertEquals(
    new globalThis.customElements["my-element"]() instanceof HTMLElement,
    true,
  );
});

Deno.test("register - addEventListener", async () => {
  await register("my-element", { handleBuild: () => {} });

  const element = new globalThis.customElements["my-element"]();

  assertEquals(
    element.addEventListener("click", () => {}),
    undefined,
  );
});
