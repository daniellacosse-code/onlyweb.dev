import * as pages from "./pages/index.js";

Deno.serve((request) => {
  const [rootSegment, ...pathSegments] =
    new URL(request.url).pathname?.split("/") ?? [];

  switch (rootSegment) {
    case "assets":
    case "components":
      return fetch(new URL(request.url.pathname, import.meta.url).href);
    case "pages":
    default: {
      let pageHandler = pages;
      for (const pathSegment of pathSegments)
        pageHandler = pageHandler?.[pathSegment];

      pageHandler = pageHandler?.default;
      if (pageHandler) return pageHandler(request);
    }
  }

  return Response.error(404, "Not Found");
});
