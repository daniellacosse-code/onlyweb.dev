import FrontendElement from "/framework/frontend-element/entry.js";

FrontendElement.Register("core-link", {
  attributes: {
    href: String
  },
  handleTemplateUpdate({ href = "#" }) {
    return FrontendElement.html`<style>
        a,
        a::selection {
          cursor: ne-resize;
          color: var(--color-foreground);
          text-decoration: underline dotted;
        }

        a:hover {
          --color-foreground: var(--color-background);

          background: var(--color-highlight);
        }
      </style>
      <a href="${href}" target="_blank"><slot></slot></a>`;
  }
});
