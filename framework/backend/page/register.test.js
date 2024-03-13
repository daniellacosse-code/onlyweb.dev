import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";
import register from "/framework/backend/page/register.js";

Deno.test("register", async () => {
  await register("/", () => "test");

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
});
