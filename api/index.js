// Assumes:
// => proper semi-colons
// => all content-based whitespace is outsourced or done in CSS
function goodEnoughHTMLMinifier(text) {
  return (
    text
      // remove single-line JS comments
      // (can't do this after newlines are removed)
      .replaceAll(/\/\/.*/g, "")

      // replace runs of whitespace with one space,
      // including newlines
      .replaceAll(/\s+/g, " ")

      // replace multiline comments
      // (now single line thanks to the above)
      .replaceAll(/<\!--.*-->|\/\*.*\*\//g, "")

    // there are more spaces you could remove
    // but it might fuck up weird copy -
    // it's "good enough" for me!
  );
}

export default async (request) => {
  const url = new URL(request.url);

  // url.port = 3000;
  url.pathname = url.pathname.replace(/\/api\/?/, "/");

  if (url.pathname === "/" || !url.pathname) {
    url.pathname = "/app/routes/index";
  }

  // TODO(#117): I'm not using this how it's meant to be used, we need to re-eval the file extension
  url.pathname += ".js";

  if (url.pathname.startsWith("/app/assets")) {
    return fetch(url);
  }

  if (url.pathname.startsWith("/app/routes")) {
    try {
      const { default: route } = await import(`../source/${url.pathname}`);

      return route(request);
    } catch (_) {
      // continue...
    }
  }

  try {
    const fileResponse = await fetch(url);
    const fileContents = await fileResponse.text();
    const fileType = fileResponse.headers.get("content-type");
    const responseBody = goodEnoughHTMLMinifier(fileContents);

    return new Response(responseBody, {
      headers: { "content-type": fileType }
    });
  } catch (_) {
    // continue...
  }

  return new Response("Not found.", {
    status: 404,
    ok: false
  });
};
