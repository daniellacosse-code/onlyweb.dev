/// <reference lib="deno.ns" />

/// <reference lib="dom" />

import { assertEquals } from "jsr:@std/assert";

(globalThis as any).customElements = {
  define(tag: string, element: any) {
    (globalThis as any).customElements[tag] = element;
  },

  get(tag: string) {
    return (globalThis as any).customElements[tag];
  },
};

(globalThis as any).HTMLElement = class HTMLElement {
  attachShadow() {
    return {};
  }

  addEventListener() {}
};

(globalThis as any).document = {
  createElement() {
    return new globalThis.HTMLElement();
  },
};

Deno.test("registerElement", async () => {
  const { registerElement } = await import("./register.ts");

  await registerElement("my-element", { render: () => new HTMLCollection() });

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);

  const element = globalThis.customElements.get("my-element");

  let instance;

  if (element) {
    instance = new element();
  } else {
    throw new Error("Element not found");
  }

  assertEquals(
    instance instanceof HTMLElement,
    true,
  );
});

Deno.test("registerElement with function", async () => {
  const { registerElement } = await import("./register.ts");

  await registerElement("my-element", () => new HTMLCollection());

  assertEquals(Boolean(globalThis.customElements.get("my-element")), true);

  const element = globalThis.customElements.get("my-element");

  let instance;

  if (element) {
    instance = new element();
  } else {
    throw new Error("Element not found");
  }

  assertEquals(
    instance instanceof HTMLElement,
    true,
  );
});

Deno.test("registerElement#addEventListener", async () => {
  const { registerElement } = await import("./register.ts");

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
