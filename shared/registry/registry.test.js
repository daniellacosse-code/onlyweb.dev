import { assertEquals } from "jsr:@std/assert";

import { Registry } from "./registry.ts";

Deno.test("registry", () => {
  const registry = new Registry();
  registry.register("foo", "bar");

  // can't override.
  registry.register("foo", "baz");

  assertEquals(
    registry.has("foo"),
    true,
  );

  assertEquals(
    registry.get("foo"),
    "bar",
  );
});
