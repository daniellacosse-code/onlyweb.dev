import { html, registerElement } from "@onlyweb/frontend";

registerElement("core-link", {
  buildAttributes: {
    href: String,
  },
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
    <a href="${href as string}" target="_blank"><slot></slot></a>`;
  },
});
