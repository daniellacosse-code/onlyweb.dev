import {
  type ConvertConstructorShapeToPrimitiveShape as $,
  html,
  registerElement,
} from "@onlyweb/frontend";

const attributes = {
  src: String,
  title: String,
};

registerElement<$<typeof attributes>>("demo-link", {
  attributes,
  render({ src, title }) {
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
      <slot></slot>`;
  },
});
