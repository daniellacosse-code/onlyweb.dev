import { assertEquals } from "jsr:@std/assert";
import { registerPage } from "../page/register.ts";

Deno.test("registerPage", async () => {
  await registerPage("/", {
    render: () => new Response(),
    renderServiceWorker: () => new Response(),
  });

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
  assertEquals(
    Boolean(globalThis.customPages.get("/")(new Request("localhost:8000"))),
    true,
  );
  assertEquals(
    Boolean(
      globalThis.customPages.get("/")(new Request("localhost:8000/?service")),
    ),
    true,
  );
});

Deno.test("registerPage with function", async () => {
  await registerPage("/", () => new Response());

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
  assertEquals(
    Boolean(globalThis.customPages.get("/")(new Request("localhost:8000"))),
    true,
  );
  assertEquals(
    Boolean(
      globalThis.customPages.get("/")(new Request("localhost:8000/?service")),
    ),
    true,
  );
});
