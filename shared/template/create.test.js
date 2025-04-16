import { assertEquals } from "jsr:@std/assert";

import { templateCreate } from "./create.ts";

Deno.test("template - handle", () => {
  assertEquals(
    templateCreate({
      template: ["Hello, ", "!"],
      insertions: ["world"],
      handleInsertion: (insertion) => insertion,
    }),
    "Hello, world!",
  );
});
