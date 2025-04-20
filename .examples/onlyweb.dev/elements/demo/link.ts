import { html, registerElement } from "@onlyweb/frontend";

registerElement("demo-link", {
  buildAttributes: {
    src: String,
    title: String,
  },
  handleBuild({ src, title }) {
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
      <core-link href="${src as string}">
        <core-text type="subtitle">${title as string}</core-text>
      </core-link>
      <br />
      <slot></slot>`;
  },
});
