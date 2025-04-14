import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import { handle } from "./template.js";

Deno.test("template - handle", () => {
  assertEquals(
    handle({
      template: ["Hello, ", "!"],
      insertions: ["world"],
      handleInsertion: (insertion) => insertion,
    }),
    "Hello, world!",
  );
});
