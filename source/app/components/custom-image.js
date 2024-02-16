import { html, DefineElement } from "../../framework/frontend/main.js";

DefineElement({
  attributes: { src: String, alt: String },
  tag: "custom-image",
  render({ src = "#", alt = "custom image" }) {
    return html`<img src="${src}" alt="${alt}" />`;
  }
});
