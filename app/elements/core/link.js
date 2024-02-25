import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "core-link",
  attributes: {
    href: String
  },
  handleRender({ href = "#" }) {
    return FrontendElement.html`<style>
                  a,
          a::selection {
            color: var(--color-foreground);
            background: var(--color-background);
            text-decoration: none;
          }

          a:hover {
            color: var(--color-background);
            background: var(--color-highlight);
          }

          a::after {
            content: " ->";
          }
    </style>
    <a href="${href}" target="_blank"><slot></slot></a>`;
  }
});
