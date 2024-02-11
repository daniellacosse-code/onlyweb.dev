import { html, DefineElement } from "../../framework/frontend/index.js";

// TODO(#106): actually optimize images and rename to "vercel-image"
DefineElement({
  attributes: { src: String, alt: String },
  tag: "custom-image",
  render({ src = "#", alt = "custom image" }) {
    return html`<picture>
      <img src="${src}" alt="${alt}" />
    </picture>`;
  }
});
