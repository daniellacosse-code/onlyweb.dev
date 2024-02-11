import { html, DefineElement } from "../../framework/main.js";

DefineElement({
  attributes: { src: String, alt: String },
  tag: "vercel-image",
  render({ src = "#", alt = "vercel image" }) {
    return html`<picture>
      <img src="${src}" alt="${alt}" />
    </picture>`;
  }
});
