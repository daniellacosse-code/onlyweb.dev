import { type ConvertConstructorShapeToPrimitiveShape as $, html, registerElement } from "@onlyweb/frontend";

const buildAttributes = {
  href: String,
};

registerElement<$<typeof buildAttributes>>("core-link", {
  buildAttributes,
  handleBuild({ href = "#" }) {
    return html`<style>
      a {
        display: inline-block;
      }

      a,
      a::selection {
        cursor: ne-resize;
        color: var(--core-link-color);
        text-decoration: underline dotted;
        font-family: system-ui;
      }

      a:hover {
        color: var(--core-link-hover-color);
        background: var(--color-highlight);
      }
    </style>
    <a href="${href}" target="_blank"><slot></slot></a>`;
  },
});
