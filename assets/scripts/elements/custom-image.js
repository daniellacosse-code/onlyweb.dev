import { html } from "~/libraries/html/main.js";
import { CustomElement } from "~/assets/scripts/framework/custom-element.js";

export class CustomImage extends CustomElement {
  static tag = "custom-image";
  static attributes = {
    src: String
  };

  render({ src = "#" }) {
    return html`<img src="${src}" />`;
  }
}

customElements.define(CustomImage.tag, CustomImage);
