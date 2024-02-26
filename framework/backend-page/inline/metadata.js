import { HTMLResponse } from "/framework/backend-page/html.js";

export function metadata({ title, description, previewImage }) {
  let result = "";

  if (title) {
    result += `<title>${title}</title>`;
    result += `<meta name="og:title" content="${title}" />`;
  }

  if (description) {
    result += `<meta name="description" content="${description}" />`;
    result += `<meta name="og:description" content="${description}" />`;
  }

  if (previewImage) {
    result += `<meta name="og:image" content="${previewImage}" />`;
  }

  return new HTMLResponse(result);
}
