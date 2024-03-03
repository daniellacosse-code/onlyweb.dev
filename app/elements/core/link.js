import FrontendElement from "/framework/frontend-element/module.js";

FrontendElement.Register("core-link", {
  templateAttributes: {
    href: String
  },
  handleTemplateBuild({ href = "#" }) {
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
