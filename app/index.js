Deno.serve(async (request) => {
  const [rootSegment, ...pathSegments] =
    new URL(request.url).pathname?.split("/") ?? [];

  switch (rootSegment) {
    case "assets":
    case "components":
      return fetch(new URL(request.url.pathname, import.meta.url).href);
    case "pages":
    default: {
      try {
        const page = await import("./pages/" + pathSegments.join("/")).default;

        return page(request);
      } catch (_) {
        return Response.error(404, "Not Found");
      }
    }
  }
});
