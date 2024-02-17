import { html, DefineElement } from "/framework/frontend/index.js";

// TODO(#118): add keycdn-powered image
DefineElement({
  attributes: { src: String, alt: String },
  tag: "custom-image",
  render({ src = "#", alt = "custom image" }) {
    return html`<picture>
      <img src="${src}" alt="${alt}" />
    </picture>`;
  }
});
