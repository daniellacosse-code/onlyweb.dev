import { html } from "~/libraries/html/main.js";
import { CustomElement } from "~/assets/scripts/framework/custom-element.js";

CustomElement({
  attributes: { src: String },
  tag: "custom-image",
  render({ src = "#" }) {
    return html`<img src="${src}" />`;
  }
});
