import { HTMLResponse } from "/framework/backend-page/html.js";

export default ({ title, description, previewImage, url }) => {
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

  if (url) {
    result += `<link rel="canonical" href="${url}" />`;
    result += `<meta name="og:url" content="${url}" />`;
  }

  return new HTMLResponse(result);
};
