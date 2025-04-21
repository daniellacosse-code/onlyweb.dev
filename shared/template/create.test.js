import { assertEquals } from "jsr:@std/assert";

import { createTemplate } from "./create.ts";

Deno.test("createTemplate", () => {
  assertEquals(
    createTemplate({
      template: ["Hello, ", "!"],
      insertions: ["world"],
      handleInsertion: (insertion) => insertion,
    }),
    "Hello, world!",
  );
});
