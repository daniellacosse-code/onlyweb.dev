import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";
import register from "/framework/backend/page/register.js";

Deno.test("register", async () => {
  await register("/", {
    handleRequest: () => new Response(),
    handleServiceWorker: () => new Response()
  });

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
  assertEquals(
    Boolean(globalThis.customPages.get("/")(new Request("localhost:8000"))),
    true
  );
  assertEquals(
    Boolean(
      globalThis.customPages.get("/")(new Request("localhost:8000/?service"))
    ),
    true
  );
});

Deno.test("function register", async () => {
  await register("/", () => new Response());

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
  assertEquals(
    Boolean(globalThis.customPages.get("/")(new Request("localhost:8000"))),
    true
  );
  assertEquals(
    Boolean(
      globalThis.customPages.get("/")(new Request("localhost:8000/?service"))
    ),
    true
  );
});
