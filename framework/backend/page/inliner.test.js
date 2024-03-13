import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import Inliner from "/framework/backend/page/inliner.js";

Deno.test("Inliner", async () => {
  const inliner = await Inliner({
    url: new URL("https://example.com"),
    language: "en"
  });

  // assertEquals(
  //   await inliner.elements("/app/assets/scripts/test.js"),
  //   `<script async type="module" src="data:application/javascript;base64,aW1wb3J0ICJodG1sIg=="></script>`
  // );

  assertEquals(await inliner.message("test"), "test");
  assertEquals(
    (
      await inliner.metadata({
        title: "Test",
        description: "Test",
        previewImagePath: "/app/assets/images/preview.png",
        splashImagePath: "/app/assets/images/splash.png",
        iconImagePath: "/app/assets/images/icon.png"
      })
    ).content,
    '<link rel="canonical" href="https://example.com/" /><meta name="og:url" content="https://example.com/" /><title>Test</title> <meta name="og:title" content="Test" /><meta name="description" content="Test" /> <meta name="og:description" content="Test" /><link rel="icon" href="/app/assets/images/icon.png" /> <meta name="apple-mobile-web-app-capable" content="yes" /> <link rel="apple-touch-icon" href="/app/assets/images/icon.png" /><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /><link rel="apple-touch-startup-image" href="/app/assets/images/splash.png" /><meta name="og:image" content="/app/assets/images/preview.png" />'
  );
});
