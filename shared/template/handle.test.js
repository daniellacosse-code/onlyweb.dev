import { assertEquals } from "jsr:@std/assert";

import { handle } from "./handle.ts";

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
