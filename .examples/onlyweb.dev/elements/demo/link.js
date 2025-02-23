import { CoreText } from "../core/text.js";
import { CoreLink } from "../core/link.js";

export class DemoLink extends $Frontend.Element {
  attributes = {
    src: String,
    title: String,
  };

  elements = {
    CoreText,
    CoreLink,
  };

  render({ attributes: { src, title } }) {
    return html`
      <style>
        core-link {
          --core-link-color: var(--color-neutral);
        }

        core-link:hover core-text {
          --core-text-color-subtitle: var(--color-primary);

          cursor: ne-resize;
        }
      </style>
      <core-link href="${src}">
        <core-text type="subtitle">${title}</core-text>
      </core-link>
      <br />
      <slot></slot>
    `;
  }
}
