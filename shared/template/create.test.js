import { assertEquals } from "jsr:@std/assert";

import { createTemplate } from "./create.ts";

Deno.test("template - handle", () => {
  assertEquals(
    createTemplate({
      template: ["Hello, ", "!"],
      insertions: ["world"],
      handleInsertion: (insertion) => insertion,
    }),
    "Hello, world!",
  );
});
