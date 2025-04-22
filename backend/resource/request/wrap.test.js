import { assertEquals, assertExists } from "jsr:@std/assert";
import { wrapRequest } from "./wrap.ts";

Deno.test("wrapRequest creates a basic OWFRequest object", () => {
  const url = "http://localhost:8000/users/123?sort=asc";
  const nativeRequest = new Request(url, {
    method: "GET",
    headers: { "X-Test-Header": "value" },
  });

  const owfRequest = wrapRequest(nativeRequest);

  assertExists(owfRequest, "OWFRequest object should be created");
  assertEquals(
    owfRequest.nativeRequest,
    nativeRequest,
    "Should contain the original native Request",
  );
  assertEquals(
    owfRequest.url.pathname,
    "/users/123",
    "Should parse the pathname correctly",
  );
});
