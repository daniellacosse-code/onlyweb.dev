import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import handleTemplate from "/framework/shared/handle-template.js";

Deno.test("handleTemplate", () => {
  assertEquals(
    handleTemplate({
      template: ["Hello, ", "!"],
      insertions: ["world"],
      handleInsertion: (insertion) => insertion
    }),
    "Hello, world!"
  );
});
