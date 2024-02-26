import html, { HTMLResponse } from "/framework/backend-page/html.js";

export default ({ title, description, previewImage, url }) => {
  const tags = [];

  if (title) {
    tags.push(
      html`<title>${title}</title>`,
      html`<meta name="og:title" content="${title}" />`
    );
  }

  if (description) {
    tags.push(
      html`<meta name="description" content="${description}" />`,
      html`<meta name="og:description" content="${description}" />`
    );
  }

  if (previewImage) {
    tags.push(html`<meta name="og:image" content="${previewImage}" />`);
  }

  if (url) {
    tags.push(
      html`<link rel="canonical" href="${url}" />`,
      html`<meta name="og:url" content="${url}" />`
    );
  }

  return new HTMLResponse(tags.reduce((result, { html }) => result + html, ""));
};
