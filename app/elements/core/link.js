import Frontend from "/framework/frontend/module.js";

Frontend.Element.Register("core-link", {
  template: {
    attributes: {
      href: String
    },
    handleBuild({ href = "#" }) {
      return Frontend.Element.html`<style>
          a,
          a::selection {
            cursor: ne-resize;
            color: var(--color-foreground);
            text-decoration: underline dotted;
            font-family: system-ui;
          }
  
          a:hover {
            --color-foreground: var(--color-background);
  
            background: var(--color-highlight);
          }
        </style>
        <a href="${href}" target="_blank"><slot></slot></a>`;
    }
  }
});
