import Shared from "/framework/shared/module.js";

Deno.bench(function benchHandleSmallTemplate() {
  Shared.handleTemplate({
    template: ["Hello, ", "!"],
    insertions: ["world"],
    handleInsertion: (insertion) => insertion
  });
});

Deno.bench(function benchHandleLargeTemplate() {
  Shared.handleTemplate({
    template: Array(1000).fill("Hello, "),
    insertions: Array(1000).fill("world"),
    handleInsertion: (insertion) => insertion
  });
});

Deno.bench(function escapeSmallString() {
  Shared.HTML.escape("<script>alert('Hello, world!');</script>");
});

Deno.bench(function escapeLargeString() {
  Shared.HTML.escape("<script>alert('Hello, world!');</script>".repeat(1000));
});

Deno.bench(function minifySmallString() {
  Shared.HTML.minify("<div>  <p>Hello, world!</p>  </div>");
});

Deno.bench(function minifyLargeString() {
  Shared.HTML.minify("<div>  <p>Hello, world!</p>  </div>".repeat(1000));
});

Deno.bench(function parseUserAgent() {
  Shared.UserAgent.parse(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
});
